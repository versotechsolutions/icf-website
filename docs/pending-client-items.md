# Pending client content and clarifications

The Phase 1 frontend has been built without waiting for the items below. Each one appears in the site as a clearly labelled placeholder or a "pending" note, so nothing has been invented. Please supply or confirm these before launch.

## A. Content still needed

| # | Item | Where it appears | Current state |
|---|---|---|---|
| A1 | **Real conference records**: title, acronym, subject area, dates, city/country, venue, fees and deadlines per conference | Home "Upcoming conferences", listing, details pages, admin | Sample data marked "Sample" |
| A2 | **Delegate testimonials**: quote, name, affiliation, photo and permission to publish | Home "Experience shared by our delegates" | Placeholder slider frame |
| A3 | **Associated partner logos**: artwork and approval to display | Home "Our associated partners" | 5 empty logo slots |
| A4 | **Gallery photographs** from ICF events, with captions | Gallery | "Gallery will be updated soon" state |
| A5 | **Sample abstract template** and **sample full paper template** files (.doc/.docx) | Paper submission, conference details | Disabled buttons, "to be supplied" |
| A6 | **Online submission portal link** (the source says "[Insert Submission Link]") | Paper submission, call for papers | Pending note |
| A7 | **Conference brochure** (PDF), per conference | "Download brochure" popup | Popup form only |
| A8 | **Privacy Policy, Terms & Conditions, Disclaimer, Refund & Cancellation Policy** text | `/policies/*` | Page shells marked "awaiting approval" |
| A9 | **Social media profile URLs** (Facebook, LinkedIn named in the brief) | Contact page | "link pending" labels, not linked |
| A10 | **Full postal address** (only "Chennai" supplied) | Footer, contact | City shown only |
| A11 | **Detailed programme per conference**: actual sessions, speakers, timings | Programme, conference details | Indicative schedule from Program.docx, labelled indicative |
| A12 | **Confirmed venues** per conference and map links | Tentative venue, details | Hilton Nagoya shown as "example from client brief" |
| A13 | **Call for papers introduction** and **submission deadlines** | Call for papers | Short neutral intro; deadlines deferred to the conference pages |
| A14 | **"Publication Information"** content, listed in the footer document | Footer (omitted) | Not linked, because the client asked to remove the Journal Publication box and no content was supplied |
| A15 | **Life Sciences subtopics**: the "Physical and Life Sciences" list contains only physics and chemistry themes | Topics, call for papers | Shown as supplied |

## B. Points to clarify

| # | Question | Assumption made in Phase 1 |
|---|---|---|
| B1 | Which email is primary for each purpose? The brief lists `icfofficial5@gmail.com` (general enquiries) and `support@internationalconferenceforum.com` (customer support). Is a domain address (for example `info@internationalconferenceforum.com`) planned to replace the Gmail address? | Support address used site-wide; Gmail shown only as "General enquiries" |
| B2 | Example addresses in the documents (`info@yourdomain.com`, `support@yourdomain.com`, `www.yourdomain.com`, and `support@igaeglobal.com` in the Registration draft) | **Not used anywhere.** Confirmed ICF details are used instead. |
| B3 | The Contact Us source mentions "latest **IGAE** news" | Rewritten as "latest ICF news" |
| B4 | Is "Publication Enquiry" an enquiry type? It appears in the homepage document but not in the Contact Us page document. | Excluded, following the Contact Us document and the approved brief |
| B5 | "Submit Conference" in the footer: is this for organisers submitting events to the listing? | Links to the contact form with "Partnership / Collaboration" preselected |
| B6 | Are registration fees the same for every conference (USD table supplied once)? | Same table shown site-wide; editable per conference in the admin form |
| B7 | Popular-country list for the listing page | India, Japan, UAE, UK, US, Canada, Singapore, Australia, Malaysia, Thailand, Germany, France (please confirm) |
| B8 | The homepage banner artwork supplied in the homepage document uses an older logo variant (orange figure, sans-serif wordmark) | Not used, to keep the brand consistent; only its tagline and pillar words are reused |
| B9 | Organisation registration is "Not yet registered". Should any legal entity name appear in the footer copyright? | "© International Conference Forum (ICF)" |
| B10 | Reference website igaeglobal.com | It could not be reviewed from the development environment: the site blocks automated access (HTTP 403). The structure follows the client documents, which mirror that site's information architecture. |

## C. Phase 2 items noted in the documents (not started)

- Fetch conferences from the existing database; country management (add/edit/deactivate) and a country ID relation.
- Save contact enquiries, list them at `/admin/enquiries` with New / In Progress / Resolved status, send confirmation emails, spam protection.
- Online payment integration and verification; email delivery; authentication and role enforcement.
- File storage with size and type validation for papers, templates, gallery images (Requirement doc §9).
