# Topic: Project Facts — OpenDoorPH Website

## Church identity
- **Full name**: Open Door Full Gospel Church
- **Location**: Pleasant Hill, Missouri (135 S 1st St, Pleasant Hill, MO 64080)
- **"PH" in repo name**: stands for **Pleasant Hill** — NOT Philippines. Never write copy, labels, or alt-text referencing "Philippines".
- **Domains**: opendoorph.info, .net, .org, .com
- **Facebook**: https://www.facebook.com/profile.php?id=100064858415448

## Pastor / leadership
- Pastor: Dennis Gulley (referenced in HomePage content)
- Founders (1975, per About page): Herbert & Willetta Lowry, William & Mable Burnett. Founding pastor Harvey Bryant. Herbert Lowrey has passed away — do not cite him as an active contact or use his name from the assessor's stale tax-mailing record.

## Property / legal entity
- Deed Holder (legal entity): **Pleasant Hill Interdenom Inc** (DBA Open Door Full Gospel Church). Legal name is corporation-of-record at the county; DBA is the public branding. Do not put the legal entity name on the public website without PO approval.
- Parcel: 02-04-19-104-000-086.000, Class EXEMPT, Pacific RR Addition E2 Lot 1 Blk E.
- Building: Knorpp Opera House, **built 1884** (per Cass County Assessor). Limestone with red cast iron accents. Contributing structure in Pleasant Hill Downtown Historic District (NRHP #04000781, listed 2005).

## Alias theme etiquette (bible theme)
- The human stakeholder is NEVER "Pharaoh." Pharaoh represents obstacles/antagonists (e.g., broken GoDaddy DNS, expired certs, blockers).
- Address the stakeholder as "the elder," "the chief," or simply by their role. Use respect without deity/royalty metaphors that could cause offense.
- Moses (PO) serves the mission on behalf of the people, not a king. He reports up to the stakeholder as a trusted counselor.

## Stack
- React 18 + TypeScript + React Router v6 + Tailwind CSS 3
- Create React App (react-scripts 5)
- Jest + Playwright for testing
- AWS S3 + CloudFront for hosting, GitHub Actions for CI/CD
- Terraform for infrastructure (us-east-2 primary, us-east-1 for ACM when re-introduced)

## Living Word restyle (run-2026-09-16-lw01, merged 76f3a16, 2026-09-17)
- **Direction**: scripture-forward "Living Word"; restyle only — no new features, no new sections, no new analytics hooks. WelcomeBanner was the one permitted removal.
- **Tokens**: 7 flat Tailwind colours — parchment / ink / sage / sage-dark (#4B6350) / brick / brick-dark (#7A3A24) / rule (+ stone). Alpha-opacity utilities (`/NN`) banned; sage-on-parchment large-text only; body is `text-ink`. `church-green` / `church-dark` retired at LW-9.
- **Type**: Lora (serif, the Word) + Inter (sans, UI). Google Fonts via `<link rel=preload as=style onload>` + `<noscript>` fallback (non-blocking, ruling 10). Self-host (ADR-lw-001) only if CLS > 0.05 — currently 0.005, not triggered.
- **Photos**: ONE congregation group photo, elder-supplied (`public/images/congregation.jpg`, 132,288 B, q82, 1424x640, lazy). Placements: Home after "Our Mission"; About at foot of "Our History". No people portraits anywhere else; legacy portrait JPGs deleted.
- **Immutable-asset rule**: CloudFront `query_string=false` → no `?v=` cache-bust. Any replacement of `congregation.jpg` or `share-card.png` ships as a `-v2` rename with meta tags updated (ADR-lw-002/003).
- **Share card**: `public/share-card.png` 1200x630, 48,856 B, TEXT-ONLY (no faces), rendered by `scripts/share-card/render.mjs`; og/twitter meta point at it. `public/headerphoto.jpg` retained (retirement is a follow-up).
- **Service**: Sunday 10:30 AM, duration **120 min** (`events.ts`), calendar block 10:30–12:30; WotW unchanged 90. JSON-LD `closes` still "12:00" → KI-3, fix 2026-10-01 pending elder ratification of 12:30. Hard-coded "10:30 AM" x3 (Footer/About/Home) → follow-up single-source issue.
- **TimeStrip**: new component, sibling of Header in MasterLayout, `role="region" aria-label="Service time"`, sticky z-30 (menu/ATC 40 < consent 50). `living-word-strip.spec.ts` is in `test:e2e:full` only (FI-14 to add to PR gate).
- **Landmarks**: `aria-label="Primary"` (Header nav), `aria-label="Footer"`; HOME_AXE_VIOLATIONS_BASELINE = 0; Lighthouse gates perf ≥ 0.94, a11y 1.00, LCP ≤ 2163 ms, CLS ≤ 0.10.
- **KI-1 (pre-existing, on origin/master)**: `multi-environment-navigation.spec.ts` Root Domain "no broken internal links" 30 s timeout — live-locator `nth(i)` re-resolves after `page.goto`. Test-only fix (collect hrefs first), target 2026-10-01. Not a restyle regression.
- **Host limits**: WebKit cannot launch on the elder's immutable Fedora (missing libicu74/libjpeg-turbo8/libwoff1); battery runs `CI=true` chromium-only; firefox evidence-only.
