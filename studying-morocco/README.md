# Studying in Morocco · الدراسة في المغرب

A bilingual (Arabic / English) study-abroad platform for **KNO Academy**: university placement in Morocco, accommodation, airport pickup and transport, academic support, degree-recognition guidance for Gulf students and family relocation — with a full back-office to manage everything.

> A standalone project: its own repository, database, media storage and Vercel project. It shares nothing with any other KNO Academy app.

---

## What's inside

### Public website (`/ar`, `/en`)

| Area | Highlights |
| --- | --- |
| **Home** | Built from page-builder blocks: hero with programme finder, live key figures, “Why Morocco” bento grid, audience cards, services, universities, cost comparison chart, cities, 6-step journey, FAQ, guides, call to action. |
| **Universities** `/universities` | Filter by city, type and teaching language; detail pages with fees, admission channels and windows, scholarships, a **“Gulf students” recognition note**, programmes, “last verified” date and `CollegeOrUniversity` structured data. |
| **Programmes** `/programs` | Filter by level, field, city, language, free tuition; detail pages with requirements, careers, fees and `EducationalOccupationalProgram` structured data. |
| **Cities** `/cities` | City cards (with photos once uploaded), monthly cost breakdown, universities in the city. |
| **Services & packages** `/services` | 12 services (core, family, add-ons) and 3 packages. Prices are entered in the admin; until then they show “On request”. |
| **Scholarships** `/scholarships` | AMCI, Al Akhawayn, UM6P, UIR, UEMF, Al-Qarawiyyin, UM6SS. |
| **Cost calculator** `/cost-calculator` | City × housing × institution × lifestyle × years, in 13 currencies (OMR, AED, SAR, QAR, KWD, BHD, JOD, IQD, XOF, EUR, GBP, USD, MAD), compared with the UK, USA, France and Germany. |
| **Audience landing pages** | `/gulf-students`, `/levant-iraq-students`, `/families-uk-europe`, `/african-students`. |
| **Guides** `/blog` | Bilingual articles (admissions 2026-27, Gulf pre-approval, costs, language of study). |
| **Conversion** | 4-step application wizard `/apply` (deep-links from any university, programme, service or package), free consultation booking `/consultation`, contact `/contact`, **application tracking** `/track` (reference + email), newsletter, WhatsApp button and a sticky mobile action bar. |
| **Search & FAQ** | Site-wide search `/search`; FAQ by category with `FAQPage` structured data. |

Design follows the **KNO Academy Web Branding & UI Governance Guidelines** (see *Brand system* below): deep purple and golden amber, Noto Kufi Arabic and Acumin Variable Concept, the locked responsive type scale, breakpoints and 8px spacing; full RTL; WCAG-minded contrast and focus states; responsive from 360 px.

SEO: per-page titles/descriptions (editable), canonical + `hreflang` (ar, en, x-default), bilingual `sitemap.xml`, `robots.txt`, Open Graph image, Organization / WebSite / Breadcrumb / Article / FAQ structured data, 301/302 redirects manager.

### Back-office (`/admin`)

- **Dashboard**: visitors, page views, applications, conversion rate, enquiries, WhatsApp clicks and subscribers (7/30/90 days, with change vs the previous period); traffic chart; admissions pipeline; applicants by nationality; latest applications; top pages; traffic sources; devices and site language; **Content & SEO health** (missing translations or meta descriptions); quick actions.
- **Study catalogue**: universities, programmes, cities, fields of study, scholarships.
- **Services & pricing**: services, packages.
- **Content**: page builder (17 block types) with drafts, autosave and version history; guides and categories; FAQs; testimonials; media library (automatic resizing to WebP, focal point).
- **CRM**: applications with status pipeline (status history feeds the student's tracking page), counselor assignment, priority, internal notes, message shown to the student, UTM source; enquiries and consultation bookings; newsletter subscribers.
- **Settings**: site settings (contact, WhatsApp, logo, Adobe Fonts project for the English font, announcement bar, key figures, SEO defaults, Google Search Console / Bing codes, GA4 / Meta Pixel IDs), menus, cost-calculator figures and exchange rates, redirects, team.
- **Fees are always editable**: package prices, service “from” prices, university and programme tuition, and the cost-calculator figures. Leave a price empty to show “On request”.
- **Roles**: *Administrator* (everything), *Content editor* (website content), *Student counselor* (applications and enquiries). Login lockout after 5 failed attempts.
- Admin interface in **Arabic or English** (each user chooses); every text field has Arabic and English versions (locale switcher at the top of each document).

Privacy: built-in analytics are cookieless (salted daily hash, no IP stored). Google Analytics / Meta Pixel load only after visitor consent.

---

## Brand system

The site implements the KNO Academy *Web Branding & UI Governance Guidelines*. The rules are fixed in code (`src/app/(frontend)/globals.css`) so they cannot drift page by page; changes need written approval from the brand owner.

| | |
| --- | --- |
| Colours | Primary purple `#322057` (H1–H4, hero bands, footer); CTA amber `#F4B740` / hover `#E6A92E` / active `#D9981F` with purple text (primary actions only); text `#3A3A3A`, secondary `#5A5A5A`, lines `#E6E6E6`, backgrounds `#FFFFFF` / `#F8F8FA`. Tailwind's default palette is removed, so no other colour can be used by accident. |
| Fonts | Arabic: Noto Kufi Arabic. English: Acumin Variable Concept via Adobe Fonts (project ID in Site settings). |
| Type scale | Body AR 17/16/16 px, EN 16/15/15 px (desktop/tablet/mobile) with the guideline line heights; H1–H4 and button sizes per breakpoint, as utilities `text-h1`…`text-h4`, `text-body`, `text-small`, `text-btn`. |
| Breakpoints | `md` 768, `lg` 1024, `xl` 1440 only. Cards: 1 per row on mobile, 2 on tablet, 3–4 on desktop. |
| Spacing | 8px base; `py-section`, `p-card` and `gap-grid` scale one step down per breakpoint. |
| Buttons | One style: amber primary, purple-outline secondary; 48px tall on desktop, 44px on tablet/mobile; full width on mobile. |
| Layout | Start-aligned text (left in English, right in Arabic); no centred reading text, no decorative patterns or illustrations behind text. |

The guidelines rule out patterns behind text and cartoon illustrations, so the earlier Moroccan zellige patterns and illustrated city scenes were removed. The Moroccan character now comes from photography and content. Any Moroccan motif would need the brand owner's approval.

---

## Tech stack

Next.js 16 · React 19 · Payload CMS 3 · PostgreSQL · Tailwind CSS 4 · TypeScript · Node 24 LTS (or Node ≥ 22.23.4)

---

## Run it locally

```bash
cp .env.example .env            # then edit the values
docker compose up -d            # local PostgreSQL (or use a Supabase/Neon URL in DATABASE_URL)
npm install
npm run dev                     # http://localhost:3000  ·  admin: http://localhost:3000/admin
npm run seed                    # loads the bilingual starter content
```

Open `/admin` and create the first account — it automatically becomes an administrator. (Or seed one: `SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='…' npm run seed`.)

In development the database schema is synced automatically. When you change collections, create a migration: `npm run migrate:create <name>`.

---

## Deploy to Vercel (recommended)

1. **Database** — create a PostgreSQL database (Supabase or Neon both work). With Supabase use the *Session pooler* connection string.
2. **Media storage** — in Vercel → Storage, create a **Blob** store and copy its `BLOB_READ_WRITE_TOKEN`.
3. **New Vercel project** — import this repository (framework: Next.js, root directory: the repository root).
4. **Build command** — `npm run ci` (runs database migrations, then builds).
5. **Environment variables** — `DATABASE_URL`, `PAYLOAD_SECRET` (`openssl rand -hex 32`), `NEXT_PUBLIC_SITE_URL` (e.g. `https://studyinmorocco.com`), `BLOB_READ_WRITE_TOKEN`, and optionally `SMTP_*` for email notifications. See `.env.example`.
6. **Node version** — Project Settings → Node.js 24.x.
7. Deploy, then load the starter content once from your computer:
   ```bash
   DATABASE_URL="<production url>" PAYLOAD_SECRET="<same secret>" NODE_ENV=production npm run seed
   ```
8. Open `https://<your-domain>/admin`, create the first administrator, then work through the launch checklist below.
9. Add your domain in Vercel, then submit `https://<your-domain>/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

---

## Launch checklist

The starter content is real (from the October 2026 admissions guide) but some values are **placeholders that must be replaced before going live**:

- [ ] **English font** — the guidelines require Acumin Variable Concept (Adobe Fonts). Add it to an Adobe Fonts web project for the site's domain and paste the project ID in Admin → Site settings → *Brand*. Until then English text uses the visitor's system font. Arabic already uses Noto Kufi Arabic.
- [ ] **Contact details** — Site settings → *Contact*: phone and WhatsApp are set to +968 9588 5074; add the public email, office address, social profiles, and the staff emails that receive new applications.
- [ ] **Prices** — Services & pricing → *Packages* and *Services*: enter your fees. Empty prices show “On request”.
- [ ] **Verify catalogue data** — fees, application windows and programme lists come from the admissions guide (official and secondary sources, verified 13 Oct 2026). Review each university, update the *Information last verified* date, and add or remove programmes.
- [ ] **Exchange rates & benchmarks** — Settings → *Cost calculator* (indicative rates entered 26 Oct 2026).
- [ ] **Legal** — the Privacy policy and Terms pages are drafts; have them reviewed (UK/EU GDPR applies to European visitors).
- [ ] **Photos** — upload real photos (neutral or cool tones, lightly desaturated, per the brand guidelines): the home hero (16:9), cities (4:3), university covers (16:9) and articles (4:3). Cards without a photo show text only.
- [ ] **Social sharing image** — `public/og-default.png` is a starter image; upload a designed 1200×630 image (with the English line set in Acumin) in Site settings → *SEO & tracking*.
- [ ] **Testimonials** — publish only genuine testimonials with written consent (one unpublished sample shows the format; delete it).
- [ ] **Email** — set `SMTP_*` variables so the team receives new applications and students get a confirmation email.
- [ ] **Tracking (optional)** — GA4 / Meta Pixel IDs and Search Console verification codes in Site settings → *SEO & tracking*.
- [ ] Create team accounts (Settings → Team) with the right roles.

---

## Managing content (quick guide)

- **Edit in two languages**: open any item and use the *Locale* switcher (top right) to switch between العربية and English. Untranslated fields fall back to Arabic; the dashboard's *Content & SEO health* lists what's missing.
- **Pages**: Content → Pages. Add, reorder or remove sections (blocks). The page with slug `home` is the home page. Use *Save draft* / *Publish*; earlier versions can be restored.
- **SEO**: every page, university, programme, city, service and article has an *SEO* tab with a live Google preview.
- **Moving a URL**: Settings → Redirects (choose 301 for permanent).
- **Applications**: CRM → Applications. Change *Status* to move the student through the pipeline — the student sees the update on `/track`. Use *Message shown on tracking page* for a short note to the student; internal notes stay private.
- **Menus**: Settings → Menus (header with drop-downs, footer columns).
- **Announcement bar**: Site settings → General.
- **Fees**: Services & pricing → Packages (*Price*), Services (*Price from*); Study catalogue → Universities (*Tuition*), Programmes (*Tuition per year*); Settings → Cost calculator. Leave empty for “On request”.

### دليل مختصر للوحة التحكم

- **التحرير باللغتين**: افتح أي عنصر واستخدم قائمة «اللغة» أعلى الصفحة للتبديل بين العربية والإنجليزية.
- **الصفحات**: المحتوى ← الصفحات. أضف الأقسام أو رتّبها أو احذفها. الصفحة ذات المعرّف `home` هي الصفحة الرئيسية. «حفظ كمسودة» ثم «نشر».
- **الطلبات**: إدارة العلاقات ← الطلبات. غيّر «الحالة» لينعكس التحديث في صفحة تتبع الطالب `/track`.
- **الرسوم والأسعار**: الخدمات والأسعار ← الباقات (السعر) والخدمات (السعر ابتداءً من)، والجامعات والبرامج (الرسوم). اترك السعر فارغًا ليظهر «حسب الطلب».
- **الشعار والخط الإنجليزي**: الإعدادات ← إعدادات الموقع ← «عام» و«الهوية البصرية».
- **تحسين البحث**: لكل صفحة تبويب «SEO» مع معاينة نتيجة جوجل.

---

## Project structure

```
.
├── src/
│   ├── app/(frontend)/[locale]/   # public site (one folder per route), root layout per language
│   ├── app/(frontend)/actions.ts  # form server actions (validated, rate-limited)
│   ├── app/(frontend)/beacon/     # cookieless analytics collector
│   ├── app/(payload)/             # Payload admin + REST API
│   ├── collections/ · globals/    # CMS schema
│   ├── blocks/                    # page-builder block definitions
│   ├── components/                # UI, cards, block renderers, forms, layout
│   ├── admin/                     # dashboard, charts and logo for the back-office
│   ├── i18n/                      # Arabic and English UI strings
│   ├── lib/                       # queries, SEO, formatting, options, routes
│   ├── migrations/                # database migrations (production)
│   ├── seed/                      # bilingual starter content
│   ├── proxy.ts                   # adds /ar or /en to un-prefixed URLs
│   └── payload.config.ts
├── public/                        # KNO Academy logo files, favicon, Open Graph image
└── docker-compose.yml             # local PostgreSQL
```
