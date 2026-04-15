# GA4 Admin UI Configuration Runbook

> *"He read from the book, and gave the sense, so that the people understood the reading."* — Nehemiah 8:8
>
> This runbook reads from the scroll of the Admin UI and gives the sense, so that a future steward of opendoorph.org's analytics may understand the reading without tribal knowledge.

**Property**: Open Door Full Gospel Church — Pleasant Hill, MO
**Site**: `https://www.opendoorph.org/` (and apex `https://opendoorph.org/`)
**Measurement ID**: `G-9VW8X3YKJ6` (public — rendered in client HTML at `OpenDoorWebsiteApp/public/index.html`)
**Pipeline of record (code side)**: `ga4x` — commit `54941a6` ("feat(analytics): comprehensive GA4 implementation with consent mode")
**Runbook story**: `dv2k-devops-followups / GA-001`

---

## Front Matter

| Field | Value |
| --- | --- |
| **Last reviewed** | 2026-04-12 |
| **Next review due (target date)** | **2027-04-12** (minimum annual), OR within 14 days of any ga4x-adjacent code change |
| **Review cadence** | On every ga4x-adjacent change (any edit to `OpenDoorWebsiteApp/src/config/analytics.ts`, `OpenDoorWebsiteApp/src/utils/analytics.ts`, `OpenDoorWebsiteApp/public/index.html`'s GA block, or `ConsentBanner.tsx`); otherwise every 12 months |
| **Author** | Ezra (tech writer, dv2k pipeline) |
| **Scope** | Admin UI configuration ONLY — steps the code cannot express. Code-side instrumentation is owned by ga4x and is not re-documented here; this runbook cross-references it. |
| **DOCS_ONLY** | Yes. This file is markdown; it introduces no `.ts`/`.tsx`/`.js`/`.tf`/workflow changes. |

**"PH" disambiguation**: Throughout this runbook, **PH = Pleasant Hill, Missouri**. It is never "Philippines." The property time zone is `America/Chicago`, not any Asia/Pacific zone. If you ever find yourself about to select a Manila time zone, stop and re-read this sentence.

---

## How to Use This Runbook

- **Every section** begins with the exact **menu path** a new admin will click, then lists the **expected state** and the **action, if any**, required to bring the property into that state.
- **"Screenshot description"** blocks describe what the admin should see; we omit actual images because the Admin UI redesigns break image-heavy runbooks within a year.
- An item is **not done** until it is **tested in production** — i.e., verified in the live GA4 Admin UI for property `G-9VW8X3YKJ6`, not merely read here.
- **TODO items** below include **target dates**. Do not let them drift.
- Cross-references to the code live at relative paths from repo root — e.g., `OpenDoorWebsiteApp/src/config/analytics.ts`.

---

## Prerequisites

Before opening the Admin UI:

1. You have an Admin-level role (or at minimum Editor) on the GA4 property `G-9VW8X3YKJ6`. See Section 7 below for access control; if you lack access, request it from the current Admin.
2. You are signed into the Google account that owns / is granted the property.
3. You have the code side of ga4x checked out locally (this repo on `master`), so you can grep event names when the runbook says "verify against code."
4. You have a browser window on `https://www.opendoorph.org/` open in a separate tab, for DebugView walk-through in Section 8.

Open the Admin UI: `https://analytics.google.com/` → bottom-left **gear icon ("Admin")**.

Screenshot description: the left rail shows **Account** (top) and **Property** (right column once an Account is selected). The Property column is where the majority of this runbook operates. Confirm "Open Door Full Gospel Church" (or equivalent) is the selected property.

---

## 1. Property Setup Verification

**Menu path**: `Admin → Property column → Property details`

### 1.1 Property exists with correct Measurement ID

- **Expected state**: A GA4 property is selected in the Property column whose Measurement ID matches `G-9VW8X3YKJ6`.
- **How to verify Measurement ID**: `Admin → Property → Data Streams → Web → (click the stream row)` → top-right panel shows `MEASUREMENT ID G-9VW8X3YKJ6`. It must match exactly what is hard-coded in `OpenDoorWebsiteApp/src/config/analytics.ts` line 8 and `OpenDoorWebsiteApp/public/index.html` line 66.
- **Action if mismatched**: STOP. Do **not** edit the code to match a new ID without coordinating a code change (that is a ga4x-scoped change, not a runbook-scoped change). Open an issue referencing GA-001 and ga4x.

Screenshot description: the Data Streams detail panel shows a header "Web stream details," a green dot status indicator, and an "MEASUREMENT ID" label with a small copy icon next to the `G-...` value.

### 1.2 Data retention

**Menu path**: `Admin → Property → Data Settings → Data Retention`

- **Expected state**: **"Event data retention: 14 months"**, **"Reset user data on new activity: ON"**.
- **Rationale**: 14 months is the maximum GA4 retention on the free tier and the recommended setting for a low-volume church site where year-over-year comparisons matter (Easter-to-Easter, Christmas-to-Christmas). 2 months (the default) is insufficient.
- **Action if set to 2 months**: Change the dropdown to "14 months" and click **Save**. Confirm the banner "Changes saved" appears.

Screenshot description: a single radio-or-dropdown "Event data retention" with options "2 months" and "14 months," plus a toggle "Reset user data on new activity."

### 1.3 Property time zone

**Menu path**: `Admin → Property → Property details → Reporting time zone`

- **Expected state**: `(GMT-06:00) Central Time - Chicago` (i.e., `America/Chicago`). Pleasant Hill, MO is in Central Time; this zone handles CST/CDT transitions correctly.
- **Action if wrong**: Click **Edit**, pick `(GMT-06:00) Central Time - Chicago`, **Save**. Note: changing the time zone creates a discontinuity in historical data — do not change casually.

Memory lesson, enforced: **never** set this to an Asia/Pacific zone. PH = Pleasant Hill, MO.

### 1.4 Currency

**Menu path**: `Admin → Property → Property details → Currency displayed as`

- **Expected state**: `US Dollar (USD $)`.
- **Rationale**: the site does not currently transact, but any future donation/e-commerce event will emit USD by implicit contract.

### 1.5 Industry category

**Menu path**: `Admin → Property → Property details → Industry category`

- **Expected state**: `Community & Government → Religious Organizations` (or the closest current equivalent — Google has historically renamed this group; accept the label that most clearly maps to "Religious Organizations" or "Faith / Religion").
- **Action if unset or wrong**: Set it. This influences benchmarking reports only; it is not safety-critical, but leaving it blank forfeits the church-vs-church comparison signal.

---

## 2. Data Streams

**Menu path**: `Admin → Property → Data Streams`

### 2.1 Web data stream exists

- **Expected state**: Exactly **one** Web stream, whose **Stream URL** is `https://www.opendoorph.org` (canonical) or `https://opendoorph.org` (apex — either is acceptable; the stream is host-agnostic for measurement purposes). **Stream name** should be human-readable, e.g., `opendoorph.org — Web`.
- **Action if missing**: Click **Add stream → Web**, enter URL `https://www.opendoorph.org`, name `opendoorph.org — Web`, and enable Enhanced Measurement (see 2.2). After creation, the new Measurement ID must equal the one hard-coded in the repo; if a different ID is generated, you have created a second stream in error — delete it and reuse the existing one.
- **Action if duplicate streams exist**: Pick the one whose Measurement ID matches `G-9VW8X3YKJ6` and archive/delete the rest (after confirming none are referenced).

Screenshot description: the Data Streams list shows a single row with a globe icon, the stream URL, the name, and a chevron to open details.

### 2.2 Enhanced Measurement settings

**Menu path**: open the web stream → **Enhanced measurement** card → gear icon

- **Expected state** (toggles):
  - **Page views**: ON — but note the code fires `page_view` manually for SPA navigation (see `RouteTracker.tsx`). Enhanced Measurement's page_view fires on initial history load; the code handles subsequent route changes. This is the intentional ga4x design.
  - **Scrolls**: ON — the code also fires `scroll_depth` via `useScrollDepth.ts` at quartile thresholds. Both signals can coexist; Enhanced Measurement's `scroll` event at 90% is complementary to the code's quartile tracking.
  - **Outbound clicks**: ON — complements the code's `external_link_click`, `social_click`, `reference_click` events.
  - **Site search**: ON (low cost even if the site has no search today; future-proof).
  - **Form interactions**: ON.
  - **Video engagement**: ON (the site does not currently embed video; harmless when unused).
  - **File downloads**: ON.
- **Action**: Ensure all toggles above are ON. Save.

Screenshot description: a vertical list of toggles with explanatory subtext under each; the gear icon leads to a modal with identical toggles plus Advanced Settings.

### 2.3 Stream Measurement ID matches the code

- **Verification command** (run from repo root):

  ```bash
  grep -n "G-9VW8X3YKJ6" OpenDoorWebsiteApp/src/config/analytics.ts OpenDoorWebsiteApp/public/index.html
  ```

- **Expected**: two matches, both showing `G-9VW8X3YKJ6`.
- If Admin UI shows a different Measurement ID: **do not edit the code** unilaterally. This is a cross-cutting change that needs a ga4x-scoped code change plus a release. File an issue referencing GA-001 and ga4x.

---

## 3. Events and Conversions (Key Events)

**Menu path**: `Admin → Property → Events` (to see events flowing) and `Admin → Property → Key events` (formerly "Conversions") to mark key events.

> Note on naming: Google renamed "Conversions" to "Key events" in 2024. This runbook uses "key events" and "conversions" interchangeably; the Admin UI may show either label depending on rollout.

### 3.1 Verify custom events are flowing

**Menu path**: `Admin → Property → Events` (shows events received in the last ~48 hours)

- **Expected state**: The following event names appear in the events list, each with a non-zero count from the last 7 days. These are the events emitted by ga4x (see `OpenDoorWebsiteApp/src/config/analytics.ts` `GA_EVENTS`):

| Event name (exact) | Emitted by (code reference) | Expected cardinality |
| --- | --- | --- |
| `page_view` | `trackPageView` in `OpenDoorWebsiteApp/src/utils/analytics.ts` + Enhanced Measurement | High — every navigation |
| `nav_click` | `trackNavClick` — header/sidebar/footer | Medium — user-driven |
| `cta_click` | `trackCtaClick` — homepage CTAs | Low-medium |
| `directions_click` | `trackDirectionsClick` — LocationPage | Low, high-value |
| `social_click` | `trackSocialClick` — Facebook/social links | Low |
| `reference_click` | `trackReferenceClick` — Scripture page | Medium on `/Scripture` |
| `external_link_click` | `trackExternalLink` | Medium |
| `mobile_menu_toggle` | `trackMobileMenuToggle` | Medium on mobile |
| `scroll_depth` | `useScrollDepth.ts` | Medium |
| `add_to_calendar` | `trackCalendarClick` (FR-10) | Low, high-value |
| `navigation` | `trackNavigation` | Medium |
| `about_view` | `trackAboutView` | Low |
| `location_view` | `trackLocationView` | Low |

- **Action if any expected event is missing after 48 hours of live traffic**: Verify consent banner flow (Section 6). If consent is being denied by most visitors, events will not flow — that is expected behavior, not a defect. If consent is granted and events are still missing, open DebugView (Section 8) with a test session and watch for the specific event. Escalate to ga4x maintainer if the event never fires in DebugView.

### 3.2 Mark key events (conversions)

**Menu path**: `Admin → Property → Key events → New key event`

- **Expected state**: The following three events are marked as key events. These were chosen because they represent the strongest intent signals on a church website:

| Event name | Why it is a key event |
| --- | --- |
| `add_to_calendar` | User intends to attend a service/event — the strongest pre-visit intent signal the site can produce. |
| `directions_click` | User is planning to physically come to 135 S 1st St, Pleasant Hill, MO — highest-value behavior after add-to-calendar. |
| `contact_click` | Reserved for any future "contact us" / "email pastor" element. **TODO**: confirm whether the site currently emits a `contact_click` event. As of ga4x commit `54941a6`, `GA_EVENTS` does NOT define `contact_click`. **Target date for resolution: 2026-05-15.** Either (a) wire up a `contact_click` event in a future ga4x-adjacent code change and then mark it here, or (b) strike it from this list. Do not create a conversion for an event that will never fire. |

- **Action (for `add_to_calendar` and `directions_click`)**: Click **New key event**, type the exact event name (must match the code character-for-character including underscores), **Save**. The event must have fired at least once in the last 48 hours for the Admin UI to accept it; if it has not, trigger it yourself from the live site first.
- **Verification**: the events table now shows a small star/trophy icon (or "Mark as key event" toggle ON) next to each of the above.

Screenshot description: the Key events list is a table with columns `Event name`, `Count`, `Users`, and a toggle `Mark as key event`. Active key events show a filled icon; inactive show an outlined icon.

### 3.3 Cross-check against code (parity gate)

Run from repo root:

```bash
grep -rn "GA_EVENTS\." OpenDoorWebsiteApp/src/
grep -n "^  [A-Z_]*:" OpenDoorWebsiteApp/src/config/analytics.ts
```

- **Expected**: every event name appearing in the Admin UI Events list matches a key in `GA_EVENTS`. Events in `GA_EVENTS` that do not appear in the UI either (a) have not fired yet or (b) are blocked by denied consent — both are acceptable interim states.
- **Forbidden**: an Admin UI event name that does NOT appear anywhere in code. That indicates either a manual Admin UI test event that was not cleaned up, or instrumentation drift. Investigate and remove.

---

## 4. Audience Definitions

**Menu path**: `Admin → Property → Audiences → New audience`

Audiences enable segmentation in reports and power any future remarketing. The following four audiences are recommended for opendoorph.org; create each using the templates/builder.

### 4.1 First-time visitors

- **Builder path**: `New audience → Build from scratch → Add condition → Event → first_visit` (Enhanced Measurement emits `first_visit`).
- **Name**: `First-time visitors`
- **Description**: `Users whose session includes the first_visit event (Enhanced Measurement).`
- **Membership duration**: `30 days` (default).

### 4.2 Returning visitors

- **Builder path**: `New audience → Build from scratch → User properties → sessions > 1` (or equivalent: `Include users matching: ga_session_number > 1`).
- **Name**: `Returning visitors`
- **Description**: `Users with more than one session in the membership window.`
- **Membership duration**: `30 days`.

### 4.3 Mobile users

- **Builder path**: `New audience → Build from scratch → User properties → device_category exactly matches "mobile"`.
- **Name**: `Mobile users`
- **Description**: `Users whose primary device is mobile — the majority of this congregation.`
- **Membership duration**: `30 days`.

### 4.4 Calendar subscribers

- **Builder path**: `New audience → Build from scratch → Add condition → Event → add_to_calendar (at least once)`.
- **Name**: `Calendar subscribers`
- **Description**: `Users who triggered add_to_calendar — strongest pre-visit intent signal.`
- **Membership duration**: `90 days` (longer, because this is an intent signal worth following).

Screenshot description: the audience builder is a left-rail with drag-and-drop condition blocks; each block has an event or user-property selector and a match condition.

- **Action for all four**: Create them if absent, verify spelling against this section, leave defaults otherwise. Audiences populate over the next 24-48 hours.

---

## 5. Reporting Customization

### 5.1 Standard reports to pin (Library → Collections)

**Menu path**: `Reports (left rail) → Library (bottom of left rail)`

- **Expected state**: the Library contains a **Collection** named `Open Door — Weekly` (or similar) published to the left rail for at-a-glance use by leadership. Its contents should include at minimum:
  - **Realtime** (overview) — for "is the site up? is anyone on it now?"
  - **Acquisition → Traffic acquisition** — where visitors come from (organic, direct, Facebook, referral).
  - **Engagement → Pages and screens** — which pages are viewed. Expect `/opendoor` (home), `/opendoor/Home/Location`, `/opendoor/Home/About`, `/opendoor/Home/Scripture` as the top four.
  - **Engagement → Events** — all events, filterable.
  - **Retention** — overview.
- **Action if collection missing**: In Library, **Create new collection → Blank**, name it `Open Door — Weekly`, drag the above report cards into its topics, **Save → Publish**.

Screenshot description: Library shows two sections: "Collections" (top, publishable to left rail) and "Reports" (bottom, individual report templates to drop into collections).

### 5.2 Custom explorations (church-specific KPIs)

**Menu path**: `Explore (left rail) → Blank`

Create and save the following explorations. Each should be shared to the property (not private) so future admins see them.

1. **"Sunday morning traffic"** — Free-form exploration; segment by day-of-week (Sunday) and hour (8am-12pm Central); metric: Active users, Event count for `directions_click`. Answers: *are people looking up directions right before service?*
2. **"Location page funnel"** — Funnel exploration: `page_view` on `/opendoor/Home/Location` → `directions_click`. Answers: *what percent of visitors to the Location page actually click directions?*
3. **"Scripture engagement"** — Free-form: rows = `page_path`, columns = `reference_click` count. Answers: *which scripture pages drive the most reference-link outs?*
4. **"Mobile vs. desktop"** — Free-form: rows = `device_category`, columns = key events. Answers: *does the mobile experience convert as well as desktop?*

- **Action**: Create each exploration, save to the property, name it exactly as above (without quotes). Add a one-line description in each exploration's settings.

### 5.3 Attribution & reporting identity (defaults + rationale)

**Menu path**: `Admin → Property → Attribution settings`

- **Expected state**:
  - **Reporting attribution model**: `Data-driven` (default; best for low-volume sites because Google picks the model automatically).
  - **Acquisition conversion event lookback window**: `30 days` (default).
  - **Other conversion events lookback window**: `90 days` (default).
  - **Rationale**: leave defaults. A church site has insufficient conversion volume to justify model tuning; data-driven with default lookbacks is the safest choice.

**Menu path**: `Admin → Property → Reporting identity`

- **Expected state**: `Blended` (uses user ID → Google signals → device ID → modeling in that order).
- **Rationale**: Google signals will be DISABLED (Section 6); with signals off, Blended effectively degrades to device ID + modeling, which is correct for a consent-first, non-advertising property. Leave as `Blended`.

---

## 6. Privacy and Consent

### 6.1 Google signals

**Menu path**: `Admin → Property → Data Settings → Data Collection`

- **Expected state**: **Google signals data collection: OFF**.
- **Rationale**: Google signals enables cross-device reporting via signed-in Google users *and* surfaces a Google-controlled advertising-adjacent data flow. For a church site that (a) has no advertising, (b) runs Consent Mode v2 with ad_storage denied by default (see `OpenDoorWebsiteApp/public/index.html` lines 72-78), and (c) prefers a minimal-surprise privacy posture, Google signals OFF is the correct default. If leadership ever wants cross-device demographic reports, that is a deliberate policy decision to revisit — do not enable casually.
- **Action if ON**: Toggle OFF. Confirm the warning dialog and save.

### 6.2 IP anonymization

- **Expected state**: **On by default in GA4 — no toggle exists.** GA4 does not collect or log full IP addresses; this is a platform-level behavior, distinct from Universal Analytics's per-property toggle.
- **How to confirm**: `Admin → Property → Data Streams → Web → (stream) → Configure tag settings → Define internal traffic` — there is no "anonymize IP" toggle because anonymization is the default and only mode. No action required beyond confirming the absence of a knob.
- **Documentation reference**: [Google's GA4 IP anonymization statement](https://support.google.com/analytics/answer/2763052) — confirm current wording at next review.

### 6.3 Consent Mode v2 verification

The code side is already implemented in ga4x commit `54941a6`. The Admin UI side is **verification only** — there is no Admin UI toggle to enable Consent Mode v2; it is a client-side API.

- **Client-side defaults** (do NOT change; cross-referenced, not duplicated): see `OpenDoorWebsiteApp/public/index.html` lines 72-78 — `analytics_storage`, `ad_storage`, `ad_personalization`, `ad_user_data` all default to `denied`, with `wait_for_update: 500`.
- **Client-side update**: see `updateConsent()` in `OpenDoorWebsiteApp/src/utils/analytics.ts` — calls `gtag('consent', 'update', { analytics_storage: 'granted' })` only when the user accepts via `ConsentBanner.tsx`.
- **Admin UI verification**: `Admin → Property → Data Settings → Data Collection` — confirm the banner reads that consent mode is "detected" (GA4 shows a green check when it receives `gtag('consent', ...)` calls from the property). If it says "not detected," either no traffic has consented yet (test by opening the site, accepting the banner, and returning here in ~15 minutes) or the client-side implementation has regressed — escalate to ga4x.

Screenshot description: a green check icon next to "Consent Mode" with text like "Consent signals received from this property in the last 7 days."

---

## 7. Access Control

**Menu path**: `Admin → Property → Property access management` (property-level) and `Admin → Account access management` (account-level, affects multiple properties).

### 7.1 Current roster (to verify, then document)

- **Expected state**: A short, known roster of humans. At time of writing the canonical roster has not been enumerated in-repo.
- **TODO**: enumerate the current Admin / Editor / Viewer roster and paste the list into this section (names + email addresses, or at minimum the count by role). **Target date: 2026-05-15.** The live Admin UI is the source of truth; this runbook should be a snapshot that matches it at review time.

### 7.2 Minimum necessary access (policy)

The principle of least privilege applies:

| Role | Who should have it | What they can do |
| --- | --- | --- |
| **Administrator** | Pastor / church tech lead + one backup (2 people total — never 1, never more than 3). | Everything, including access grants and property deletion. |
| **Editor** | The ga4x code maintainer(s) — currently the Website maintainer (Michael Connelly). | Create/edit events, audiences, conversions; no access grants. |
| **Marketer** | Nobody currently — reserved for any future volunteer handling social campaigns. | Edit audiences and conversions only. |
| **Analyst** | Leadership members who want to build explorations without risking configuration. | Create explorations; cannot edit property config. |
| **Viewer** | Anyone in leadership who only reads reports. | Read-only. |

- **Action**: Audit the roster quarterly. Remove any account that has left the ministry or no longer needs access. Never leave stale Admin access on a shared/former email.
- **Access removal path**: `Admin → Property access management → (click the user row) → Remove`.

Screenshot description: the access-management panel is a table: `Email`, `Roles`, `Data restrictions`, with an overflow menu (three dots) per row for Edit / Remove.

---

## 8. End-to-End Verification Checklist (DebugView + Realtime)

This section is the **production verification** required by the standing rule. An item is not done until it is tested in production. For GA-001, this runbook is not done until a human (not the author) runs this checklist against the live property and all checks pass.

### 8.1 DebugView walk-through

**Menu path**: `Admin → Property → DebugView` (or Reports → left rail → DebugView depending on version)

**Setup**:

1. Install the Google Analytics Debugger browser extension (Chrome or Firefox), OR append `?gtm_debug=x` to the URL, OR use `gtag('config', GA_MEASUREMENT_ID, { debug_mode: true })` via DevTools — any one method is sufficient.
2. In a **fresh incognito/private window** (so consent state is clean), open `https://www.opendoorph.org/`.
3. Accept the consent banner on the live site.
4. Return to the Admin UI → DebugView; your device should appear in the left dropdown within 30 seconds.

**Walk the site and confirm each event fires in DebugView within ~5 seconds of the user action**:

| Step | User action on live site | Expected DebugView event |
| --- | --- | --- |
| 1 | Load home page | `page_view` with `page_path: /opendoor`, `page_title: Home — Open Door Full Gospel Church` |
| 2 | Click a header nav link (e.g., "Location") | `nav_click` with `nav_source: header_desktop` (or `header_mobile` depending on viewport); then `page_view` for the new route |
| 3 | On Location page, click "Get Directions" | `directions_click` with `link_text` and `link_url` populated |
| 4 | On Location page, click an Add-to-Calendar element | `add_to_calendar` with `event_name`, `calendar_platform`, `link_location` |
| 5 | Scroll to bottom of a long page | `scroll_depth` at 25/50/75/100 quartiles (not all four every time, but at least one) |
| 6 | Click the Facebook icon in the footer | `social_click` with `platform: facebook`, `link_location: footer` (approx.) |
| 7 | On Scripture page, click a scripture reference external link | `reference_click` followed by `external_link_click` |

- **Pass condition**: every event above appears in DebugView with the expected parameters. No event appears without a corresponding user action (no mystery fires).
- **Fail condition**: any event missing, fires multiple times per single action (regression of the duplicate-page_view bug ga4x fixed), or arrives with malformed parameters. Escalate to ga4x maintainer and link the DebugView session URL in the issue.

Screenshot description: DebugView's timeline is a vertical stream of event badges (circles with event names); clicking each reveals a side panel with all parameters. Recent events are at the top.

### 8.2 Realtime report smoke test

**Menu path**: `Reports → Realtime`

- **Expected state**: within ~30 seconds of navigating to the live site (with consent granted), the Realtime card **"Users in the last 30 minutes"** increments to at least 1 (you) and the **"Event count by Event name"** card shows your events with matching counts.
- **Pass**: you see yourself. If multiple testers, everyone sees themselves.
- **Fail**: zero users for > 2 minutes despite active browsing with consent granted. Troubleshoot in this order:
  1. Confirm consent banner was accepted (DevTools: `localStorage.getItem('analytics-consent')` should return `"granted"`).
  2. Confirm no ad blocker is active in the test browser.
  3. Confirm Measurement ID parity (Section 2.3).
  4. Check Section 6.3 — consent update may not be firing.

### 8.3 Final sign-off

The person executing this checklist **other than the author** signs off by:

1. Adding their name, the date, and the time zone to the table below (edit in a follow-up PR).
2. Listing any deviations observed; if none, write "None."
3. Confirming all of Sections 1-7 show the documented expected state in the live Admin UI.

| Reviewer | Date (YYYY-MM-DD) | Deviations observed |
| --- | --- | --- |
| _pending_ | _pending (target: 2026-04-26)_ | _pending_ |

**Target date for first end-to-end peer walkthrough: 2026-04-26.** If the date slips, update this cell and add a note explaining why.

---

## 9. Maintenance and Drift Prevention

- Every time `OpenDoorWebsiteApp/src/config/analytics.ts` (`GA_EVENTS` or `PAGE_TITLES`) changes, re-run Sections 3.1 and 3.3 and update Section 3 tables in this runbook accordingly, in a docs-only PR.
- Every time `ConsentBanner.tsx` or the consent block in `public/index.html` changes, re-run Section 6.3.
- On the annual review date in the Front Matter, walk the full runbook again and bump `Last reviewed` + `Next review due`.
- If Google renames a menu (e.g., "Conversions" → "Key events" as happened in 2024), update the **menu path** lines in this runbook. Menu path drift is the single most common reason a runbook goes stale; catch it early.

---

## Appendix A — Cross-references (code files owned by ga4x, not this runbook)

| Topic | File (relative to repo root) |
| --- | --- |
| Measurement ID and event constants | `OpenDoorWebsiteApp/src/config/analytics.ts` |
| Event tracking helpers, consent update call | `OpenDoorWebsiteApp/src/utils/analytics.ts` |
| Consent Mode v2 defaults (`analytics_storage: 'denied'`, etc.) | `OpenDoorWebsiteApp/public/index.html` (lines 64-82) |
| Consent banner UI and grant action | `OpenDoorWebsiteApp/src/components/ConsentBanner/ConsentBanner.tsx` |
| SPA route tracking (fires `page_view`) | `OpenDoorWebsiteApp/src/components/tracking/RouteTracker/RouteTracker.tsx` |
| Scroll depth quartile tracking | `OpenDoorWebsiteApp/src/hooks/useScrollDepth.ts` |
| Original ga4x commit | `54941a6` |

## Appendix B — Target-Dated TODO Register

Per standing repo policy: all TODOs carry a target date. If a date slips, edit this table in a follow-up PR and note why.

| ID | Item | Target date | Owner |
| --- | --- | --- | --- |
| TODO-1 | Resolve `contact_click` — either implement the event in code and mark it here, or strike it from the key-events list in Section 3.2. | 2026-05-15 | ga4x maintainer |
| TODO-2 | Enumerate current Admin / Editor / Viewer roster in Section 7.1. | 2026-05-15 | Property Admin |
| TODO-3 | First end-to-end peer walkthrough and sign-off in Section 8.3. | 2026-04-26 | A reviewer other than Ezra |
| TODO-4 | Annual full re-review; bump `Last reviewed` / `Next review due`. | 2027-04-12 | Current property Admin |

---

*He read from the book, and gave the sense, so that the people understood the reading. — Ezra*
