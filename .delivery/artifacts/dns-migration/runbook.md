# Migration Runbook: DNS from GoDaddy to AWS Route 53

**Church:** Open Door Full Gospel Church, Pleasant Hill, Missouri
**Pastor:** Dennis Gulley
**Domains:** opendoorph.org, opendoorph.info, opendoorph.net, opendoorph.com
**Authors:** Solomon (Architect) & Joshua (DevOps)
**Date:** 2026-04-07

> Solomon: *"In much wisdom is much grief — but also much correct partitioning. Let us build the house on rock, not on GoDaddy URL forwarding."*
> Joshua: *"As for me and my pipeline, we will serve the LORD. Checklists locked, rollback staged, cutover window briefed. Move out."*

---

## Executive Summary

This runbook migrates authoritative DNS for all four Open Door Full Gospel Church domains from GoDaddy to AWS Route 53, replaces GoDaddy's apex URL forwarding with native Route 53 ALIAS records pointing at the existing CloudFront distribution (`d9ogdv0q26dkm.cloudfront.net`), preserves all existing email routing (Google Workspace on `.org`, GoDaddy Secure Email on `.net` and `.com`), preserves the `google-site-verification` TXT record, and unblocks ACM DNS-validated SSL certificate provisioning (issue #30). Expected total elapsed time including the pre-migration low-TTL window is 48-72 hours; active hands-on-keyboard time is approximately 2-3 hours. Expected user-visible downtime is **zero to under 60 seconds per domain** if executed correctly. Risk level: **MEDIUM** (email is the primary risk vector; website is low risk because CloudFront is already serving `www`).

---

## Prerequisites

Before starting ANY phase, confirm you have all of the following:

- [ ] **AWS account access** with IAM permissions for Route 53 (full), CloudFront (update distribution), and ACM (request/validate certificates) in `us-east-1` (ACM for CloudFront MUST be in `us-east-1`, even though the rest of the stack lives in `us-east-2`).
- [ ] **GoDaddy account access** (username + password + 2FA) for all 4 domains. Confirm you can log in and see the "DNS" and "Nameservers" sections for each domain before scheduling the cutover.
- [ ] **Google Workspace admin access** for opendoorph.org (in case MX verification is needed post-cutover).
- [ ] **CloudFront distribution ID** — the user-facing hostname is `d9ogdv0q26dkm.cloudfront.net`. Retrieve the distribution ID via:
  ```
  aws cloudfront list-distributions \
    --query "DistributionList.Items[?DomainName=='d9ogdv0q26dkm.cloudfront.net'].Id" \
    --output text
  ```
  Record the ID (format: `E` followed by 13 alphanumeric characters) in your runbook copy before Phase 1.
- [ ] **Terraform** >= 1.5.0 installed locally, and state backend access confirmed (`terraform init` succeeds in `Terraform/` directory).
- [ ] **dig** installed locally (`dig -v`) for validation.
- [ ] **A rollback decision-maker on call** — one person designated to call "abort" if Phase 4 validation fails.
- [ ] **Announcement sent** to Pastor Dennis Gulley and church staff noting the maintenance window.

---

## Phase 0: Pre-Migration Audit (MANUAL — user task, ~15 min active + 48 hour TTL wait)

> Solomon: *"The prudent sees danger and hides himself; the simple go on and suffer for it. Lower your TTLs before you need them."*

### 0.1 — Screenshot GoDaddy DNS state (belt and suspenders backup)

For EACH of the 4 domains, in the GoDaddy UI:
1. Log in to https://dcc.godaddy.com/
2. Navigate: **My Products** → find the domain → click **DNS**
3. Take a full-page screenshot of the DNS records table. Save as `godaddy-backup-<domain>-YYYYMMDD.png`.
4. Navigate: **Settings** → **Forwarding** (if present). Screenshot the forwarding configuration.
5. Navigate: **Nameservers**. Screenshot the current nameservers (should show `ns55.domaincontrol.com` and `ns56.domaincontrol.com`).

Store all 12+ screenshots in a folder named `dns-backup-YYYYMMDD/` and back it up to at least two locations (local + cloud drive).

### 0.2 — Export the current DNS state with dig

From any terminal, run and save the output:

```bash
for d in opendoorph.org opendoorph.info opendoorph.net opendoorph.com; do
  echo "=== $d ==="
  dig +noall +answer $d ANY
  dig +noall +answer $d NS
  dig +noall +answer $d MX
  dig +noall +answer $d TXT
  dig +noall +answer www.$d
done | tee dns-snapshot-$(date +%Y%m%d).txt
```

### 0.3 — Verify email is currently working

- Send a test email **TO** each of the four addresses (e.g., `pastor@opendoorph.org`, `info@opendoorph.net`, etc. — whatever real mailboxes exist).
- Send a test email **FROM** each mailbox to an external address (e.g., a personal Gmail).
- Confirm both directions work. Record timestamps.

### 0.4 — Lower TTLs at GoDaddy (CRITICAL — do this 48 hours before cutover)

For each domain at GoDaddy (**My Products** → **DNS**):
- Change TTL on **every MX record** to `600` (10 minutes) — or the lowest GoDaddy allows, which is typically `600`.
- Change TTL on the **apex A records** to `600`.
- Change TTL on the **www CNAME** to `600`.
- Change TTL on **TXT records** (google-site-verification, SPF) to `600`.
- Save each change.

**NOTE THE DATE AND TIME** you completed this step. You must wait AT LEAST the previous TTL value (commonly 1 hour, sometimes 1 day) before the new low TTL is in effect worldwide. Plan the Phase 3 cutover for **no earlier than 48 hours** after this step.

### 0.5 — Confirm CloudFront distribution ID

```bash
aws cloudfront list-distributions \
  --query "DistributionList.Items[?DomainName=='d9ogdv0q26dkm.cloudfront.net'].{Id:Id,Aliases:Aliases.Items,Status:Status}" \
  --output table
```

Record the `Id`. Confirm `Status` is `Deployed`. Confirm the `Aliases` list currently contains the four apex domains (it does, per `Terraform/main.tf`).

### Phase 0 Validation

- [ ] 12+ screenshots saved and backed up
- [ ] `dns-snapshot-YYYYMMDD.txt` saved
- [ ] Test emails sent and received successfully in both directions for all 4 domains
- [ ] TTLs at GoDaddy lowered to 600 on all critical records for all 4 domains
- [ ] Wait timer started (48 hours minimum)
- [ ] CloudFront distribution ID recorded

### Phase 0 Rollback

No rollback needed — this phase is non-destructive. If you change your mind, raise the TTLs back at GoDaddy.

---

## Phase 1: Create Route 53 Hosted Zones (AUTOMATED — Terraform, ~5 min)

> Joshua: *"One zone per domain. Four zones. Sixteen nameservers. Copy them down like they are the names of the tribes."*

### 1.1 — Add the hosted zones to Terraform

Create a new file `Terraform/route53-zones.tf` with the following content:

```hcl
# =============================================================================
# Route 53 Hosted Zones
# =============================================================================
# One hosted zone per domain. After `terraform apply`, the `name_servers`
# outputs below MUST be copied into GoDaddy's custom nameserver settings
# for each respective domain (Phase 3).
# =============================================================================

locals {
  opendoor_domains = [
    "opendoorph.org",
    "opendoorph.info",
    "opendoorph.net",
    "opendoorph.com",
  ]
}

resource "aws_route53_zone" "opendoorph_org" {
  name    = "opendoorph.org"
  comment = "Open Door Full Gospel Church — Pleasant Hill, MO (primary)"

  tags = {
    Environment = "production"
    Church      = "OpenDoorFullGospel"
    ManagedBy   = "Terraform"
  }
}

resource "aws_route53_zone" "opendoorph_info" {
  name    = "opendoorph.info"
  comment = "Open Door Full Gospel Church — Pleasant Hill, MO"

  tags = {
    Environment = "production"
    Church      = "OpenDoorFullGospel"
    ManagedBy   = "Terraform"
  }
}

resource "aws_route53_zone" "opendoorph_net" {
  name    = "opendoorph.net"
  comment = "Open Door Full Gospel Church — Pleasant Hill, MO"

  tags = {
    Environment = "production"
    Church      = "OpenDoorFullGospel"
    ManagedBy   = "Terraform"
  }
}

resource "aws_route53_zone" "opendoorph_com" {
  name    = "opendoorph.com"
  comment = "Open Door Full Gospel Church — Pleasant Hill, MO"

  tags = {
    Environment = "production"
    Church      = "OpenDoorFullGospel"
    ManagedBy   = "Terraform"
  }
}

# Outputs — copy these into GoDaddy during Phase 3 cutover
output "ns_opendoorph_org" {
  value       = aws_route53_zone.opendoorph_org.name_servers
  description = "Nameservers for opendoorph.org — paste into GoDaddy custom NS"
}

output "ns_opendoorph_info" {
  value       = aws_route53_zone.opendoorph_info.name_servers
  description = "Nameservers for opendoorph.info — paste into GoDaddy custom NS"
}

output "ns_opendoorph_net" {
  value       = aws_route53_zone.opendoorph_net.name_servers
  description = "Nameservers for opendoorph.net — paste into GoDaddy custom NS"
}

output "ns_opendoorph_com" {
  value       = aws_route53_zone.opendoorph_com.name_servers
  description = "Nameservers for opendoorph.com — paste into GoDaddy custom NS"
}
```

### 1.2 — Apply

```bash
cd Terraform/
terraform init -upgrade
terraform plan -out=phase1.tfplan
# REVIEW THE PLAN CAREFULLY — should show exactly 4 aws_route53_zone resources to add, and nothing else
terraform apply phase1.tfplan
```

### 1.3 — Capture the nameservers

```bash
terraform output ns_opendoorph_org
terraform output ns_opendoorph_info
terraform output ns_opendoorph_net
terraform output ns_opendoorph_com
```

Each output is a list of 4 nameservers (e.g., `ns-123.awsdns-15.com`, `ns-456.awsdns-57.net`, `ns-789.awsdns-33.org`, `ns-1012.awsdns-99.co.uk`).

**MANUAL STEP:** Copy all 16 nameservers into a plain text file titled `route53-nameservers-YYYYMMDD.txt` and save in the same secure location as your Phase 0 screenshots. You will paste these into GoDaddy in Phase 3.

### Phase 1 Validation

- [ ] `terraform apply` completed with no errors
- [ ] AWS Console → Route 53 → Hosted zones shows 4 zones, each with 4 NS records and 1 SOA record
- [ ] All 16 nameservers recorded in a safe place

### Phase 1 Rollback

If something went wrong:
```bash
terraform destroy -target=aws_route53_zone.opendoorph_org \
                  -target=aws_route53_zone.opendoorph_info \
                  -target=aws_route53_zone.opendoorph_net \
                  -target=aws_route53_zone.opendoorph_com
```
This is safe — the zones are not yet authoritative because GoDaddy is still serving DNS. AWS will charge $0.50/zone/month prorated, so even if you linger, cost is trivial.

---

## Phase 2: Populate Route 53 with Records (AUTOMATED — Terraform, ~10 min)

> Solomon: *"Before you switch the shepherd, make sure the new pasture has the same grass. Every MX, every TXT, copied faithfully."*

The records created here are **staged** — they sit inside Route 53 but will not be served to the world until Phase 3 (nameserver cutover). This means you can apply Phase 2 safely at any time, even well in advance of the cutover window.

### 2.1 — Add records file

Create `Terraform/route53-records.tf`:

```hcl
# =============================================================================
# Route 53 Records
# =============================================================================
# These records are staged. They become live when GoDaddy nameservers
# are updated to point at Route 53 (Phase 3).
# =============================================================================

# ---- opendoorph.org (Google Workspace mail) ----

resource "aws_route53_record" "org_apex_alias" {
  zone_id = aws_route53_zone.opendoorph_org.zone_id
  name    = "opendoorph.org"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "org_apex_alias_aaaa" {
  zone_id = aws_route53_zone.opendoorph_org.zone_id
  name    = "opendoorph.org"
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "org_www_alias" {
  zone_id = aws_route53_zone.opendoorph_org.zone_id
  name    = "www.opendoorph.org"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "org_www_alias_aaaa" {
  zone_id = aws_route53_zone.opendoorph_org.zone_id
  name    = "www.opendoorph.org"
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "org_mx" {
  zone_id = aws_route53_zone.opendoorph_org.zone_id
  name    = "opendoorph.org"
  type    = "MX"
  ttl     = 3600
  records = [
    "1 aspmx.l.google.com.",
    "5 alt1.aspmx.l.google.com.",
    "5 alt2.aspmx.l.google.com.",
    "10 aspmx2.googlemail.com.",
    "10 aspmx3.googlemail.com.",
  ]
}

resource "aws_route53_record" "org_txt_google_verify" {
  zone_id = aws_route53_zone.opendoorph_org.zone_id
  name    = "opendoorph.org"
  type    = "TXT"
  ttl     = 3600
  records = [
    "google-site-verification=2jqdO0z8Ucfh08KyLDeE6tDER_Qh4QNzYvRV1j-Y-8w",
    "v=spf1 include:_spf.google.com ~all",
  ]
}

# ---- opendoorph.info (no mail) ----

resource "aws_route53_record" "info_apex_alias" {
  zone_id = aws_route53_zone.opendoorph_info.zone_id
  name    = "opendoorph.info"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "info_apex_alias_aaaa" {
  zone_id = aws_route53_zone.opendoorph_info.zone_id
  name    = "opendoorph.info"
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "info_www_alias" {
  zone_id = aws_route53_zone.opendoorph_info.zone_id
  name    = "www.opendoorph.info"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "info_www_alias_aaaa" {
  zone_id = aws_route53_zone.opendoorph_info.zone_id
  name    = "www.opendoorph.info"
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

# ---- opendoorph.net (GoDaddy Secure Email) ----

resource "aws_route53_record" "net_apex_alias" {
  zone_id = aws_route53_zone.opendoorph_net.zone_id
  name    = "opendoorph.net"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "net_apex_alias_aaaa" {
  zone_id = aws_route53_zone.opendoorph_net.zone_id
  name    = "opendoorph.net"
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "net_www_alias" {
  zone_id = aws_route53_zone.opendoorph_net.zone_id
  name    = "www.opendoorph.net"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "net_www_alias_aaaa" {
  zone_id = aws_route53_zone.opendoorph_net.zone_id
  name    = "www.opendoorph.net"
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "net_mx" {
  zone_id = aws_route53_zone.opendoorph_net.zone_id
  name    = "opendoorph.net"
  type    = "MX"
  ttl     = 3600
  records = [
    "0 smtp.secureserver.net.",
    "10 mailstore1.secureserver.net.",
  ]
}

# ---- opendoorph.com (GoDaddy Secure Email) ----

resource "aws_route53_record" "com_apex_alias" {
  zone_id = aws_route53_zone.opendoorph_com.zone_id
  name    = "opendoorph.com"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "com_apex_alias_aaaa" {
  zone_id = aws_route53_zone.opendoorph_com.zone_id
  name    = "opendoorph.com"
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "com_www_alias" {
  zone_id = aws_route53_zone.opendoorph_com.zone_id
  name    = "www.opendoorph.com"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "com_www_alias_aaaa" {
  zone_id = aws_route53_zone.opendoorph_com.zone_id
  name    = "www.opendoorph.com"
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "com_mx" {
  zone_id = aws_route53_zone.opendoorph_com.zone_id
  name    = "opendoorph.com"
  type    = "MX"
  ttl     = 3600
  records = [
    "0 smtp.secureserver.net.",
    "10 mailstore1.secureserver.net.",
  ]
}
```

### 2.2 — Apply

```bash
cd Terraform/
terraform plan -out=phase2.tfplan
# REVIEW: should show new aws_route53_record resources only. No changes to S3, CloudFront, or IAM.
terraform apply phase2.tfplan
```

### 2.3 — Verify records in Route 53 (but still not authoritative)

```bash
# Query Route 53 directly (bypassing public DNS) using one of the assigned NS
dig @ns-XXX.awsdns-YY.com opendoorph.org A
dig @ns-XXX.awsdns-YY.com opendoorph.org MX
dig @ns-XXX.awsdns-YY.com opendoorph.org TXT
dig @ns-XXX.awsdns-YY.com www.opendoorph.org A
# repeat per domain
```

Replace `ns-XXX.awsdns-YY.com` with one of the nameservers from Phase 1 output. You should see the new staged records.

### Phase 2 Validation

- [ ] `terraform apply` clean (no modifications to CloudFront/S3, only ADDs to Route 53)
- [ ] `dig @<route53-ns>` returns the expected A/AAAA/MX/TXT records for each zone
- [ ] Public DNS (`dig opendoorph.org`) **STILL** returns the old GoDaddy values — this is correct; GoDaddy is still authoritative
- [ ] google-site-verification TXT is present and byte-for-byte identical to the GoDaddy value

### Phase 2 Rollback

```bash
cd Terraform/
terraform destroy -target=aws_route53_record.org_apex_alias   # etc., per resource
# OR, simpler: delete route53-records.tf and re-apply
```

Again, non-destructive to production because the records are not authoritative yet.

---

## Phase 3: Nameserver Cutover (MANUAL at GoDaddy — ~5 min per domain + propagation)

> Joshua: *"This is the Jordan crossing. Four domains, four nameserver swaps, one tight window. On my signal, move."*
> Solomon: *"Do not multi-task here. One domain at a time, all four in under ten minutes. Then wait."*

**WHEN:** At least 48 hours after Phase 0.4 (TTLs lowered). Choose a low-traffic window (Sunday evening after services, or late Monday night).

**WHO:** One person with GoDaddy access, one person watching dig validation in real time. Keep a phone line or chat channel open.

### 3.1 — Final pre-flight

Before touching GoDaddy, confirm:
- [ ] You have the `route53-nameservers-YYYYMMDD.txt` file open
- [ ] You have a terminal with `dig` ready
- [ ] The Terraform state in AWS shows all zones and records exist (`terraform state list | grep route53`)
- [ ] At least one working test mailbox per domain is open in a browser tab

### 3.2 — Per-domain nameserver swap

**Repeat these exact steps for each of the 4 domains, starting with opendoorph.info (lowest-risk — no mail), then .net, .com, and FINALLY .org (highest-risk — Google Workspace mail).**

1. Log into https://dcc.godaddy.com/
2. Click **My Products** (top nav)
3. Scroll/search for the domain (e.g., `opendoorph.info`) and click it to open domain details
4. In the left sidebar or top tabs, click **DNS**
5. Scroll to the **Nameservers** section (may be labeled "Nameservers" or at the top of the DNS page)
6. Click the **Change** button (sometimes shown as a pencil icon or "Change Nameservers")
7. Choose the radio option **"I'll use my own nameservers"** (exact wording may be "Enter my own nameservers (advanced)")
8. You will see 2-4 input fields. **Delete** any existing values (`ns55.domaincontrol.com`, `ns56.domaincontrol.com`).
9. Paste the 4 Route 53 nameservers for THIS domain from your saved file. Paste one per field. Do NOT include the trailing dot (`.`). Example:
   - `ns-123.awsdns-15.com`
   - `ns-456.awsdns-57.net`
   - `ns-789.awsdns-33.org`
   - `ns-1012.awsdns-99.co.uk`
10. Click **Save**.
11. GoDaddy may show a confirmation dialog warning "This will change where your domain points." Click **Continue** / **Yes**.
12. GoDaddy may prompt for 2FA re-verification. Complete it.
13. Confirm the page now shows the 4 Route 53 nameservers.

Immediately after saving for a domain, run in your terminal:

```bash
dig NS opendoorph.info @8.8.8.8 +short
```

Initially you will still see the GoDaddy nameservers (cached). Keep running every 30 seconds. Within 5-60 minutes you should see the Route 53 nameservers appear.

### 3.3 — Order of operations

1. **opendoorph.info** first (no email risk)
2. **opendoorph.net** second
3. **opendoorph.com** third
4. **opendoorph.org** LAST (Google Workspace — highest mail risk; you want everything else verified first)

Do all four within a **15-minute window** to keep the propagation windows overlapping.

### 3.4 — Watch propagation

```bash
for d in opendoorph.info opendoorph.net opendoorph.com opendoorph.org; do
  echo "=== $d ==="
  dig NS $d @8.8.8.8 +short
  dig NS $d @1.1.1.1 +short
done
```

Expected: within 5-60 minutes, both `8.8.8.8` (Google) and `1.1.1.1` (Cloudflare) return `awsdns` nameservers. Theoretical worst case is 48 hours, but with Phase 0.4 TTLs lowered to 600, expect under an hour.

### Phase 3 Validation

- [ ] GoDaddy UI shows Route 53 NS for all 4 domains
- [ ] `dig NS <domain> @8.8.8.8` returns awsdns nameservers for all 4 domains
- [ ] `dig NS <domain> @1.1.1.1` returns awsdns nameservers for all 4 domains
- [ ] No ServFail or NXDOMAIN errors from any resolver

### Phase 3 Rollback

**If validation in Phase 3 or 4 fails:**
1. Return to GoDaddy → My Products → Domain → DNS → Nameservers → Change
2. Select **"Use GoDaddy nameservers"** (or manually enter `ns55.domaincontrol.com` and `ns56.domaincontrol.com`)
3. Save
4. Repeat for each affected domain
5. Propagation of the rollback: 5-60 minutes (thanks to Phase 0.4 low TTLs)
6. The old GoDaddy DNS records are still stored at GoDaddy — they will resume serving as soon as the nameservers flip back

Rollback decision-maker authority: anyone on the team with GoDaddy access if mail is down for > 10 minutes.

---

## Phase 4: Validation (USER + team, ~30 min)

> Solomon: *"Test the spirits — and the SMTP headers."*

### 4.1 — DNS resolution checks

```bash
for d in opendoorph.org opendoorph.info opendoorph.net opendoorph.com; do
  echo "=== $d ==="
  dig $d A +short           # expect CloudFront IPs (NOT 15.197.x.x or 3.33.x.x)
  dig $d AAAA +short        # expect IPv6 CloudFront
  dig www.$d A +short       # expect CloudFront IPs
  dig $d MX +short          # expect original MX values
  dig $d TXT +short         # expect google-site-verification (org only) + SPF (org only)
  dig $d NS +short          # expect awsdns
done
```

**Expected apex A behavior:** apex now resolves to CloudFront edge IPs (variable, not the old GoDaddy 15.197.x.x / 3.33.x.x).

**CRITICAL CHECKS:**
- [ ] `dig opendoorph.org MX +short` returns the 5 Google Workspace MX records exactly
- [ ] `dig opendoorph.org TXT +short` includes `google-site-verification=2jqdO0z8Ucfh08KyLDeE6tDER_Qh4QNzYvRV1j-Y-8w`
- [ ] `dig opendoorph.net MX +short` returns `0 smtp.secureserver.net.` and `10 mailstore1.secureserver.net.`
- [ ] `dig opendoorph.com MX +short` returns the same GoDaddy Secure Email MX
- [ ] No apex returns the old GoDaddy forwarding IPs `15.197.142.173` or `3.33.152.147`

### 4.2 — Web load tests

```bash
for d in opendoorph.org opendoorph.info opendoorph.net opendoorph.com; do
  echo "=== $d ==="
  curl -sI http://$d/      | head -n 1
  curl -sI http://www.$d/  | head -n 1
done
```

Expected: `HTTP/1.1 200 OK` (or a CloudFront-issued 301 redirect to www — but NOT a GoDaddy `301 Moved Permanently` with `Server: DPS/`).

Also open each URL in an actual browser. Confirm the Open Door Full Gospel Church website loads correctly.

**Note:** HTTPS on apex domains will still fail at this stage because the CloudFront distribution still uses the default certificate (`*.cloudfront.net`). This is expected and fixed in Phase 5. Use HTTP for validation only in Phase 4.

### 4.3 — Email deliverability tests

For EACH domain with mail (`.org`, `.net`, `.com`):
1. Send a test email **from an external account → church mailbox**. Confirm receipt within 5 minutes.
2. Send a test email **from the church mailbox → external account**. Confirm receipt within 5 minutes.
3. Inspect the `Received:` headers of the inbound message and confirm it traversed the correct provider (Google for .org; `secureserver.net` for .net and .com).

### 4.4 — Google Workspace check

- Log in to admin.google.com
- Navigate to **Domains** → `opendoorph.org`
- Confirm the domain is still shown as **Verified** (it should be — the TXT record was preserved).

### Phase 4 Validation Gate

ALL of the following must be checked before proceeding to Phase 5:
- [ ] DNS resolves via Route 53 for all 4 domains globally (8.8.8.8 and 1.1.1.1 agree)
- [ ] Apex domains resolve to CloudFront (not GoDaddy forwarding IPs)
- [ ] www subdomains resolve to CloudFront
- [ ] Google Workspace mail inbound + outbound verified for .org
- [ ] GoDaddy Secure Email inbound + outbound verified for .net and .com
- [ ] Website loads successfully over HTTP for all 4 domains and all www subdomains
- [ ] Google Workspace admin console shows `opendoorph.org` as Verified
- [ ] No error reports from Pastor Gulley or church staff

If ANY check fails: **ROLLBACK per Phase 3 rollback procedure.** Do not proceed.

---

## Phase 5: Provision Valid ACM Certificate (AUTOMATED — Terraform, ~30 min)

> Joshua: *"With DNS under our authority, ACM issues certs with no friction. This is where we flip the switch from 'allow-all' to 'redirect-to-https'."*

**Prerequisite:** Phase 4 fully green, and at least 24 hours of stability have passed (optional but recommended).

### 5.1 — Add an ACM provider alias for us-east-1

ACM certificates for CloudFront **MUST** be issued in `us-east-1`. The existing provider is in `us-east-2`. Add an aliased provider:

Add to `Terraform/main.tf` (or a new file `Terraform/providers-acm.tf`):

```hcl
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
```

### 5.2 — Add the certificate resource

Create `Terraform/acm.tf`:

```hcl
# =============================================================================
# ACM Certificate for CloudFront
# =============================================================================
# Covers all 4 apex domains and their www subdomains.
# DNS-validated via Route 53 (works because DNS is now in Route 53).
# =============================================================================

resource "aws_acm_certificate" "opendoor_cert" {
  provider = aws.us_east_1

  domain_name = "opendoorph.org"
  subject_alternative_names = [
    "www.opendoorph.org",
    "opendoorph.info",
    "www.opendoorph.info",
    "opendoorph.net",
    "www.opendoorph.net",
    "opendoorph.com",
    "www.opendoorph.com",
  ]
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Environment = "production"
    Church      = "OpenDoorFullGospel"
    ManagedBy   = "Terraform"
  }
}

# Map each DVO to its correct hosted zone
locals {
  dvo_zone_map = {
    "opendoorph.org"      = aws_route53_zone.opendoorph_org.zone_id
    "www.opendoorph.org"  = aws_route53_zone.opendoorph_org.zone_id
    "opendoorph.info"     = aws_route53_zone.opendoorph_info.zone_id
    "www.opendoorph.info" = aws_route53_zone.opendoorph_info.zone_id
    "opendoorph.net"      = aws_route53_zone.opendoorph_net.zone_id
    "www.opendoorph.net"  = aws_route53_zone.opendoorph_net.zone_id
    "opendoorph.com"      = aws_route53_zone.opendoorph_com.zone_id
    "www.opendoorph.com"  = aws_route53_zone.opendoorph_com.zone_id
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.opendoor_cert.domain_validation_options :
    dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = local.dvo_zone_map[each.key]
  name    = each.value.name
  type    = each.value.type
  ttl     = 60
  records = [each.value.record]

  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "opendoor_cert_validation" {
  provider = aws.us_east_1

  certificate_arn         = aws_acm_certificate.opendoor_cert.arn
  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]
}

output "acm_certificate_arn" {
  value = aws_acm_certificate_validation.opendoor_cert_validation.certificate_arn
}
```

### 5.3 — Update CloudFront to attach the cert, add www aliases, and enforce HTTPS

Edit `Terraform/main.tf`. Replace the `aliases`, `viewer_protocol_policy`, and `viewer_certificate` blocks in `aws_cloudfront_distribution.s3_distribution`:

```hcl
  # was: aliases = ["opendoorph.info", "opendoorph.net", "opendoorph.org", "opendoorph.com"]
  aliases = [
    "opendoorph.org",
    "www.opendoorph.org",
    "opendoorph.info",
    "www.opendoorph.info",
    "opendoorph.net",
    "www.opendoorph.net",
    "opendoorph.com",
    "www.opendoorph.com",
  ]
```

```hcl
  default_cache_behavior {
    # ... unchanged ...
    viewer_protocol_policy = "redirect-to-https"   # was: "allow-all"
    # ... unchanged ...
  }
```

```hcl
  # was:
  # viewer_certificate {
  #   cloudfront_default_certificate = true
  # }
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.opendoor_cert_validation.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
```

### 5.4 — Apply

```bash
cd Terraform/
terraform plan -out=phase5.tfplan
# REVIEW: expect new ACM cert, 8 DNS validation records, 1 cert_validation,
# and in-place update to aws_cloudfront_distribution.s3_distribution
terraform apply phase5.tfplan
```

The CloudFront update typically takes 5-15 minutes to deploy to all edges. Terraform will wait.

### 5.5 — Validation

```bash
for d in opendoorph.org opendoorph.info opendoorph.net opendoorph.com; do
  echo "=== $d ==="
  curl -sI https://$d/      | head -n 1   # expect HTTP/2 200 or 301
  curl -sI https://www.$d/  | head -n 1
  echo | openssl s_client -servername $d -connect $d:443 2>/dev/null | openssl x509 -noout -subject -dates
done
```

- [ ] HTTPS succeeds on all 4 apex domains and 4 www domains
- [ ] Cert subject/SAN covers the domain being requested
- [ ] `http://` redirects to `https://` (because of `redirect-to-https`)
- [ ] Browser shows the green padlock; no certificate warnings

### Phase 5 Rollback

If cert attachment breaks the site:

1. Revert the `viewer_certificate` block in `main.tf` to:
   ```hcl
   viewer_certificate {
     cloudfront_default_certificate = true
   }
   ```
2. Revert `viewer_protocol_policy` to `"allow-all"`.
3. Revert `aliases` to the original 4-apex list.
4. `terraform apply`. CloudFront redeploys in ~5-15 minutes.
5. Investigate the cert issue. The ACM cert itself can stay (it's free and harmless).

---

## Phase 6: Post-Migration Cleanup (USER + team, ~20 min)

> Solomon: *"When the new house is proven sound, then — and only then — tear down the scaffolding."*

**Timing:** Wait at least **7 days of stable production** after Phase 5 before performing cleanup. This preserves rollback optionality.

### 6.1 — Remove GoDaddy URL forwarding

For EACH domain at GoDaddy:
1. **My Products** → find domain → click domain
2. Click **Domain Settings** / **Manage Domain**
3. Scroll to **Forwarding** section
4. If any forwarding rule exists (e.g., forwarding to `www.opendoorph.org`), click **Edit** or the trash icon → **Remove**
5. Save

### 6.2 — Remove the HTTPS→HTTP redirect workaround from the site

The site currently contains a script in `public/index.html` that downgrades HTTPS to HTTP (because the old CloudFront default cert didn't match the custom domain). With the ACM cert in place, HTTPS works natively.

1. Open `public/index.html`
2. Locate the HTTPS→HTTP downgrade script (near the top of `<head>`) — it typically looks like `if (location.protocol === "https:") location.href = ...`
3. Delete the script block
4. Commit, deploy via the normal pipeline, verify the site still loads

### 6.3 — (Optional) raise TTLs in Route 53

The Terraform-defined records use `ttl = 3600` (1 hour). You may leave these as-is; ALIAS records don't need long TTLs because Route 53 manages them efficiently. No action required.

### 6.4 — Close GitHub issues

- Close issue **#27** (GoDaddy URL forwarding)
- Close issue **#30** (ACM SSL cert)
- Close issue **#32** (whatever was blocked on DNS)

Add a comment linking to this runbook and the relevant commits.

### 6.5 — Do NOT yet delete GoDaddy DNS records

Leave the historical DNS record values in the GoDaddy zone editor untouched for at least 30 days. Nameservers are custom (Route 53), so those records are inert anyway, but keeping them gives you an instant rollback if a very-long-cached resolver somewhere surprises you.

---

## Phase 7: Rollback Procedure (REFERENCE — summary across phases)

| Phase | Rollback action | Estimated time |
|------:|-----------------|----------------|
| 0 | Raise TTLs back at GoDaddy | 5 min |
| 1 | `terraform destroy -target=aws_route53_zone.*` | 2 min |
| 2 | `terraform destroy -target=aws_route53_record.*` (or delete `route53-records.tf`) | 5 min |
| 3 | In GoDaddy, switch nameservers back to `ns55.domaincontrol.com` / `ns56.domaincontrol.com` per domain. Propagation 5-60 min thanks to low TTLs. | 5 min per domain + propagation |
| 4 | Same as Phase 3 | 5-60 min |
| 5 | Revert `viewer_certificate` in `main.tf` to `cloudfront_default_certificate = true`, revert `viewer_protocol_policy` to `allow-all`, revert `aliases`. `terraform apply`. | 10-20 min |
| 6 | Re-add GoDaddy forwarding rules (from Phase 0 screenshots); re-add HTTPS→HTTP redirect script in `public/index.html` and redeploy | 15-30 min |

**Rollback authority:** The named decision-maker (prearranged) can call rollback at any time during Phases 3-5 without further approval.

---

## Risks & Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|--:|------|:---:|:---:|-----------|
| 1 | Email downtime during cutover (Google Workspace or GoDaddy Secure Email stops delivering) | Low | High | MX records staged in Route 53 in Phase 2, byte-identical to GoDaddy values. Nameserver swap is atomic per domain. Low TTLs (Phase 0.4) mean rollback resolves in minutes. |
| 2 | Incorrectly typed MX records in Terraform | Low | High | MX values in `route53-records.tf` match the documented dig output verbatim. Validate via `dig @<r53-ns>` in Phase 2.3 BEFORE nameserver cutover. Peer review the Terraform diff. |
| 3 | TTLs not actually lowered (Phase 0.4 skipped or too recent) | Medium | Medium | Enforce 48-hour wait gate between Phase 0.4 and Phase 3. Verify TTLs are low via `dig +ttl` before cutover. |
| 4 | google-site-verification TXT missing → Google Workspace de-verifies opendoorph.org | Low | High | TXT record is included in `route53-records.tf` exactly as it appears at GoDaddy. Verified via `dig TXT` in Phase 4.1. Google typically tolerates a brief outage; only sustained absence triggers de-verification. |
| 5 | CloudFront alias conflict ("CNAMEAlreadyExists") when adding www aliases in Phase 5 | Low | Medium | The current CloudFront distribution ALREADY owns all 4 apex aliases. Adding www aliases will succeed unless another AWS account owns them (it doesn't). If conflict occurs, remove the conflicting entry from the other distribution first. |
| 6 | AWS costs creeping up | Certain | Low | 4 hosted zones × $0.50/mo = **$2.00/month**. Plus query charges (~$0.40/million queries) — church traffic is ~thousands of queries/day, so effectively free. ACM certs are free. |
| 7 | ACM validation race condition (cert validation times out) | Low | Low | The Terraform `aws_route53_record.cert_validation` resources are created before `aws_acm_certificate_validation`. Terraform handles ordering. If timeout occurs, re-run `terraform apply`. |
| 8 | CloudFront distribution update fails mid-deploy (partial state) | Low | Medium | CloudFront updates are atomic per-change; failed updates roll back automatically on AWS side. Terraform will report the error; investigate and re-apply. |
| 9 | Pastor Gulley sends a critical email during the cutover window | Medium | Medium | Send an advance notice with the specific 15-minute window. Schedule after evening services. |
| 10 | Phase 6 redirect-script removal ships before cert is actually on CloudFront | Low | High | Phase 6 has a 7-day stability gate AFTER Phase 5. Don't skip. |

---

## Downtime Expectations (what users will actually experience)

- **Phase 0-2:** Zero user impact. Purely preparation and staging.
- **Phase 3 (nameserver cutover):** Users already holding a cached DNS answer from GoDaddy continue to resolve against the OLD GoDaddy records (which still exist at GoDaddy and serve correctly until nameservers flip). Users making a fresh query during the 5-60 minute propagation window may hit Route 53 or GoDaddy depending on which resolver they use. Since both sets of records point at working endpoints (GoDaddy forwarding to CloudFront indirectly, Route 53 ALIAS directly to CloudFront) **and both sets of MX records are identical**, users should see NO functional difference. Websites load. Email delivers. Worst case: one email retry cycle (SMTP will retry for up to 4 days).
- **Phase 4:** Zero user impact (read-only validation).
- **Phase 5 (cert attach + HTTPS enforcement):** Users who previously loaded over HTTP continue to work (301 redirect to HTTPS). Users who previously loaded over HTTPS and got a cert warning now get a valid cert. No downtime. CloudFront edge deploy (~5-15 min) is online the entire time.
- **Phase 6:** Zero user impact.

**Maximum theoretical downtime** per domain: ~60 seconds during the moment of CloudFront distribution update in Phase 5 (and even that is usually seamless).

---

## Success Criteria

All of the following must be true to declare the migration complete:

1. [ ] `dig NS <domain> @8.8.8.8` returns AWS nameservers for all 4 domains
2. [ ] `dig <domain> A +short` returns CloudFront edge IPs (not 15.197.x.x / 3.33.x.x) for all 4 apex domains
3. [ ] `dig www.<domain> A +short` returns CloudFront edge IPs for all 4 www subdomains
4. [ ] `dig opendoorph.org MX +short` returns exactly the 5 Google Workspace MX records
5. [ ] `dig opendoorph.net MX +short` and `dig opendoorph.com MX +short` each return `0 smtp.secureserver.net.` and `10 mailstore1.secureserver.net.`
6. [ ] `dig opendoorph.org TXT +short` includes the exact google-site-verification string
7. [ ] Google Workspace admin console shows `opendoorph.org` as Verified
8. [ ] Inbound + outbound email tested successfully on all 3 mail-enabled domains
9. [ ] `curl -sI https://<domain>/` returns `HTTP/2 200` (or 301 to www) with a VALID ACM cert for all 4 apex domains and 4 www subdomains
10. [ ] Browser loads all 8 hostnames (4 apex + 4 www) over HTTPS with no cert warnings
11. [ ] `http://` requests auto-redirect to `https://` (viewer_protocol_policy = redirect-to-https)
12. [ ] Pastor Gulley confirms no complaints for 72 hours
13. [ ] GoDaddy URL forwarding removed (Phase 6.1)
14. [ ] HTTPS-downgrade script removed from `public/index.html` (Phase 6.2)

---

## Manual Steps Summary (printable checklist)

> Joshua: *"Print this. Laminate it. Follow it in order. Do not improvise on a DNS cutover."*

### T-minus 48+ hours (Phase 0)
- [ ] Screenshot GoDaddy DNS for all 4 domains (12+ screenshots)
- [ ] Save `dns-snapshot-YYYYMMDD.txt` via `dig`
- [ ] Send test emails TO and FROM all 3 mail-enabled domains; confirm working
- [ ] In GoDaddy, lower TTL to 600 on all MX, apex A, www CNAME, and TXT records for all 4 domains
- [ ] Record exact date/time; start 48-hour timer
- [ ] Record CloudFront distribution ID from AWS console
- [ ] Notify Pastor Gulley of maintenance window
- [ ] Designate rollback decision-maker

### T-minus 1 hour (Phase 1 & 2 staging)
- [ ] `terraform apply` for Phase 1 (hosted zones)
- [ ] Copy all 16 Route 53 nameservers into `route53-nameservers-YYYYMMDD.txt`
- [ ] `terraform apply` for Phase 2 (records staged)
- [ ] Verify records via `dig @<r53-ns>`

### Cutover window (Phase 3) — 15 minute window, all 4 domains
- [ ] GoDaddy → opendoorph.info → DNS → Nameservers → Change → custom → paste 4 R53 NS → Save
- [ ] GoDaddy → opendoorph.net → DNS → Nameservers → Change → custom → paste 4 R53 NS → Save
- [ ] GoDaddy → opendoorph.com → DNS → Nameservers → Change → custom → paste 4 R53 NS → Save
- [ ] GoDaddy → opendoorph.org → DNS → Nameservers → Change → custom → paste 4 R53 NS → Save
- [ ] Watch `dig NS <domain> @8.8.8.8` until all 4 show awsdns

### Validation (Phase 4)
- [ ] Run full dig suite from §4.1
- [ ] Run curl suite from §4.2
- [ ] Send + receive test emails for .org, .net, .com
- [ ] Confirm Google Workspace admin shows opendoorph.org Verified
- [ ] All Phase 4 validation gate checks green

### Cert + HTTPS (Phase 5)
- [ ] `terraform apply` for Phase 5 (ACM + CloudFront update)
- [ ] Run HTTPS curl suite from §5.5
- [ ] Open all 8 hostnames in a browser; verify padlock

### Cleanup (Phase 6 — 7 days later)
- [ ] GoDaddy → each domain → Forwarding → Remove
- [ ] Edit `public/index.html`, remove HTTPS→HTTP downgrade script, commit, deploy
- [ ] Close GitHub issues #27, #30, #32
- [ ] Archive runbook artifacts

---

> Solomon: *"The end of the matter is better than its beginning. Record the date of completion and be still."*
> Joshua: *"Mission accomplished. Route 53 has the watch."*

**END OF RUNBOOK**
