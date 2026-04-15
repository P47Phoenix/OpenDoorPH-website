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
