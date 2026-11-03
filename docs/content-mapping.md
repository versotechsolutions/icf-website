# ICF website: client content mapping

This document shows which client-supplied source document provides the content for each page of the Phase 1 frontend, and where that content lives in the code.

**Source package:** `Requirement- icf.docx` and `website content.zip`. The ZIP contains `ICF -lOGO.png`, `ICF Admin Dashboard.docx` and a nested `website content/` folder with the organisation-site and event-site documents.

**Conventions:**
- **Verbatim** means the client text is used as written, with only light typographic clean-up: sentence-case headings, removal of `<h>`/`<p>` markup notes, and fixed obvious typos such as "Galary" → "Gallery".
- **Site copy** means short connective text written for the interface: page intros, button labels, empty states. It contains no new facts.
- **Sample** means development data, which is always labelled in the UI.

All client copy is centralised in `src/data/`, so it can later be replaced by CMS/API content without touching components.

## Organisation-wide

| Item | Source document | Used in |
|---|---|---|
| Organisation name and profile | Requirement- icf.docx | `src/data/site.ts` |
| Support email `support@internationalconferenceforum.com` | Requirement- icf.docx; event-site Contact Us page.docx; Registration Page.docx | Utility bar, footer, contact block, contact page |
| General enquiries email `icfofficial5@gmail.com` | Requirement- icf.docx ("Official Email IDs") | Footer, contact page |
| Phone `+91 8220586724` | Requirement- icf.docx | Utility bar, footer, contact block, contact page |
| Location "Chennai" | Requirement- icf.docx ("Address: chennai") | Utility bar, footer, contact page |
| Domain `internationalconferenceforum.com` | Requirement- icf.docx | Footer, contact block |
| Colours (navy, white, gold), favicon = logo icon | Requirement- icf.docx | `src/styles/index.css`, `public/favicon-32.png` |
| Logo | `ICF -lOGO.png` (also embedded in Requirement- icf.docx) | Header lockup (emblem crop), footer, admin, favicon (globe crop) |
| Tagline "Connect, share, advance" and hero line "Bringing researchers, professionals and innovators together for a better tomorrow"; four pillars (Global networking, Knowledge sharing, Collaboration opportunities, Impactful research) | Banner artwork embedded in Organization Home page Details.docx | Home hero, pillars strip |
| Conference photograph (speaker at podium, world map) | Image embedded in Event Details page.docx | Home hero, conference details banner, OG image |

## Public pages

| Page / route | Source document(s) | Content used |
|---|---|---|
| **Home** `/` | Organization Home page Details.docx | Menu items; About ICF intro (verbatim) with Read more → About; Browse by topic (10 topics, linking to the listing); Conference by Continent (heading only, with countries from sample data); Peer Review Process (6 steps, verbatim); "Experience Shared by Our Delegates" (labelled placeholder, no content supplied); "Our Associated Partners" (labelled placeholder, no logos supplied) |
| | Organaization site/About ICF.docx | Mission and vision (verbatim) |
| | Call For paper - page.docx | Research-theme counts per topic |
| **About ICF** `/about` | Organaization site/About ICF.docx | Intro, "Our Vision for Excellence" (3 items), mission, vision |
| | event details site/About ICF.docx | Core values (4) and "Why choose ICF?" (5), verbatim |
| **Upcoming conferences** `/conferences`, `/conferences/:country` | Organization Home page Details.docx ("Upcoming Conference page / Listing Event" requirements) | Searchable country dropdown (all countries), popular-country links, filters (country, month, category, keyword), pagination, loading and empty states, responsive layout, SEO-friendly country URLs such as `/conferences/india`. **Results are sample data**, because the database connection is Phase 2. |
| **Browse by topic** `/topics` | Organaization site/Browse by topic.docx; Call For paper - page.docx | 10 subject areas; subtopics per area (verbatim). Each area links to the filtered listing. |
| **Conference details** `/event/:slug` | event details site/About Conf page.docx | ICICGB-26 example description (verbatim, placeholder token removed), conference highlights (6), registration information (3) |
| | Quick Links.docx | Right-hand Quick Links panel (Call for papers, Paper submission, Register now, Tentative programme, Invitation letter, Awards, Download brochure popup form) |
| | Program.docx | Agenda highlights |
| | Tentative venue page.docx | Example venue (Hilton Nagoya), labelled as an example |
| **Call for papers** `/call-for-papers` | event details site/Call For paper - page.docx | All 10 subject areas and 217 research themes (verbatim). Abstract word limit and the "acceptance does not guarantee" note are from Submission Page.docx. |
| **Paper submission** `/paper-submission` | event details site/Submission Page.docx | Abstract guidelines (9), full paper intro and guidelines (7), manuscript structure (11 sections), template buttons, contact block and closing line |
| | Organaization site/Paper Submission page.docx | Instruction "remove the Journal Publication box Form". The page is informational only: no submission form and no Journal Publication field. |
| **Registration** `/registration` | event details site/Registration Page.docx | Intro, registration information, categories and fees table (USD, 6 categories × pre-enrolment/standard, verbatim), "Make payment" button, important notes (3 steps + 3 rules), "Connect with us". The registration form UI is a frontend demonstration. |
| | event details site/Contact Us page.docx | Form fields: name, email, code & phone, participant category, conference |
| **Invitation letter** `/invitation-letter` | Organaization site/Invitation Letter.docx | Intro, requirements, 4 documents, visa application disclaimer (verbatim) |
| **Awards** `/awards` | Organaization site/Awards page.docx; event details site/Award page.docx | Button row → tabs for Best Paper, Best Presentation, Best Student Paper and Certificate of Participation; descriptions and "Award and benefits" (verbatim). No winners are listed. |
| **Conference FAQ** `/faq` | event details site/Conference FAQ.docx | 12 questions and answers (verbatim), contact block |
| **Programme** `/programme` | event details site/Program.docx | Conference agenda intro, key agenda highlights (6), conference schedule intro, indicative day schedule (9 rows, verbatim times; the duplicated table columns in the source are merged) |
| **Tentative venue** `/venue` | event details site/Tentative venue page.docx | Example venue (Hilton Nagoya address, verbatim), clearly labelled as the brief's example. A map placeholder is shown; no map is embedded. |
| **Travel information** `/travel` | event details site/Travel page.docx | Visa and invitation letter guidelines, required documents, "Please be advised", participant responsibility, visa support and communication (verbatim). The source repeats the heading "Fee Exclusions" for the misuse clause; it is shown as "Misuse of the invitation letter". |
| **Video conferencing** `/video-conferencing` | event details site/Video Conferencing.docx (same text in Event Details page.docx) | Introduction, 8 benefits, 8 key features, 7 joining steps, 5 technical requirements, 3 etiquette rules, contact (verbatim) |
| **Gallery** `/gallery` | event details site/galary page.docx | "Gallery will update soon": shown as a designed empty state with ready-made filter tabs and grid. No stock photos are presented as ICF events. |
| **Contact** `/contact` | Organaization site/Contact Us Page.docx | Intro, form fields (Full Name*, Email*, Phone, Country*, Organisation/Institution, Subject*, Enquiry Type* with 6 types, Message*), Submit Enquiry button |
| | Organization Home page Details.docx | Recommended features: Privacy Policy consent checkbox (included). Saving enquiries, admin listing, auto-email and spam protection are Phase 2. |
| | event details site/Contact Us page.docx | Contact information and social media (Facebook, LinkedIn; links pending) |
| **Footer** (all pages) | Organaization site/Footer page.docx | Logo, intro (verbatim), Quick Links, For Participants, Contact Us, Privacy Policy / Terms & Conditions / Disclaimer / Refund & Cancellation Policy. The example `info@yourdomain.com` and `www.yourdomain.com` are **not** used; confirmed details are shown instead. |
| **Policy pages** `/policies/:slug` | Footer page.docx (link names only) | Page shells marked "awaiting client approval". No legal text is invented. |

## Admin panel (frontend UI only)

Scope follows the approved ₹85,000 project scope (8 modules), **not** the full feature list in `ICF Admin Dashboard.docx`.

| Module / route | Source items used from ICF Admin Dashboard.docx |
|---|---|
| Login `/admin/login` | Sidebar mock-up image (branding). UI only; no authentication. |
| Dashboard `/admin` | "Dashboard Overview": total conferences; published/draft/pending; upcoming/completed; registrations; successful payments. Total revenue is omitted because advanced revenue analytics are excluded. |
| Conference management `/admin/conferences`, `/new`, `/:id/edit` | "Conference Management": create, edit, delete; title, date, venue, description; fees and deadlines. "Single Events Upload" fields: category, type, dates, time, timezone, venue, city, state, country, image, tags, status, featured. |
| Registration management `/admin/registrations` | "Registration & Participants": participant details, registration categories, status, export to CSV |
| Payment status `/admin/payments` | "Payment Management": Indian/international, successful/pending/failed, transaction IDs and registration references, verify bank transfers (UI) |
| Email notifications `/admin/emails` | "Emails…": registration confirmations and reminders; email templates |
| Reports `/admin/reports` | "Reports & Import/Export": registration and payment report downloads; conference-wise statistics |
| Conference content `/admin/content` | "Content Update Dashboard" fields; "Website Content Management"; "SEO Dashboard" fields (meta title/description/keywords, OG, Twitter card, canonical, robots); gallery uploads ("Dash Board – need to uploaded file"); venue ("Need to create a dash bord") |
| Admin access `/admin/access` | "Users & Enquiries → Control user permissions and access" |

**Not built (outside the agreed scope):** paper submission review, reviewer assignment and accept/reject workflow; certificate generation; invitation-letter generation; bulk Excel import; advanced revenue analytics; enquiries inbox; country management CRUD.
