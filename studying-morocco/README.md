# Studying in Morocco · الدراسة في المغرب

A bilingual (Arabic / English) study-abroad platform for **KNO Academy**: university placement in Morocco, accommodation, airport pickup and transport, academic support, degree-recognition guidance for Gulf students and family relocation — with a full back-office to manage everything.

> This folder is a self-contained app. It does not share code, dependencies or a database with PMPeco, and can be moved to its own repository at any time (`git subtree split --prefix studying-morocco`).

---

## What's inside

### Public website (`/ar`, `/en`)

| Area | Highlights |
| --- | --- |
| **Home** | Built from page-builder blocks: hero with programme finder, live key figures, “Why Morocco” bento grid, audience cards, services, universities, cost comparison chart, cities, 6-step journey, FAQ, guides, call to action. |
| **Universities** `/universities` | Filter by city, type and teaching language; detail pages with fees, admission channels and windows, scholarships, a **“Gulf students” recognition note**, programmes, “last verified” date and `CollegeOrUniversity` structured data. |
| **Programmes** `/programs` | Filter by level, field, city, language, free tuition; detail pages with requirements, careers, fees and `EducationalOccupationalProgram` structured data. |
| **Cities** `/cities` | Illustrated city cards (or real photos once uploaded), monthly cost breakdown, universities in the city. |
| **Services & packages** `/services` | 12 services (core, family, add-ons) and 3 packages with prices. |
| **Scholarships** `/scholarships` | AMCI, Al Akhawayn, UM6P, UIR, UEMF, Al-Qarawiyyin, UM6SS. |
| **Cost calculator** `/cost-calculator` | City × housing × institution × lifestyle × years, in 13 currencies (OMR, AED, SAR, QAR, KWD, BHD, JOD, IQD, XOF, EUR, GBP, USD, MAD), compared with the UK, USA, France and Germany. |
| **Audience landing pages** | `/gulf-students`, `/levant-iraq-students`, `/families-uk-europe`, `/african-students`. |
| **Guides** `/blog` | Bilingual articles (admissions 2026-27, Gulf pre-approval, costs, language of study). |
| **Conversion** | 4-step application wizard `/apply` (deep-links from any university, programme, service or package), free consultation booking `/consultation`, contact `/contact`, **application tracking** `/track` (reference + email), newsletter, WhatsApp button and a sticky mobile action bar. |
| **Search & FAQ** | Site-wide search `/search`; FAQ by category with `FAQPage` structured data. |

Design: KNO brand tokens (editable), Moroccan zellige patterns, horseshoe-arch frames and hand-drawn city illustrations; Noto Kufi Arabic + IBM Plex Sans Arabic for Arabic, Fraunces + Plus Jakarta Sans for English; full RTL; WCAG-minded contrast, focus states, reduced-motion support; responsive from 360 px.

SEO: per-page titles/descriptions (editable), canonical + `hreflang` (ar, en, x-default), bilingual `sitemap.xml`, `robots.txt`, Open Graph image, Organization / WebSite / Breadcrumb / Article / FAQ structured data, 301/302 redirects manager.

### Back-office (`/admin`)

- **Dashboard**: visitors, page views, applications, conversion rate, enquiries, WhatsApp clicks and subscribers (7/30/90 days, with change vs the previous period); traffic chart; admissions pipeline; applicants by nationality; latest applications; top pages; traffic sources; devices and site language; **Content & SEO health** (missing translations or meta descriptions); quick actions.
- **Study catalogue**: universities, programmes, cities, fields of study, scholarships.
- **Services & pricing**: services, packages.
- **Content**: page builder (17 block types) with drafts, autosave and version history; guides and categories; FAQs; testimonials; media library (automatic resizing to WebP, focal point).
- **CRM**: applications with status pipeline (status history feeds the student's tracking page), counselor assignment, priority, internal notes, message shown to the student, UTM source; enquiries and consultation bookings; newsletter subscribers.
- **Settings**: site settings (contact, WhatsApp, **brand colours**, announcement bar, key figures, SEO defaults, Google Search Console / Bing codes, GA4 / Meta Pixel IDs), menus, cost-calculator figures and exchange rates, redirects, team.
- **Roles**: *Administrator* (everything), *Content editor* (website content), *Student counselor* (applications and enquiries). Login lockout after 5 failed attempts.
- Admin interface in **Arabic or English** (each user chooses); every text field has Arabic and English versions (locale switcher at the top of each document).

Privacy: built-in analytics are cookieless (salted daily hash, no IP stored). Google Analytics / Meta Pixel load only after visitor consent.

---

## Tech stack

Next.js 16 · React 19 · Payload CMS 3 · PostgreSQL · Tailwind CSS 4 · TypeScript · Node 24 LTS (or Node ≥ 22.23.4)

---

## Run it locally

```bash
cd studying-morocco
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
3. **New Vercel project** — import the repository and set **Root Directory** to `studying-morocco`.
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

- [ ] **Brand** — Admin → Site settings → *Brand*: enter the KNO Academy colour codes; upload the logo (light and dark versions) under *General*. (Default colours are a Moroccan-inspired placeholder palette.)
- [ ] **Contact details** — Site settings → *Contact*: real email, phone, **WhatsApp number** (currently `212600000000`), address, social profiles, and the staff emails that receive new applications.
- [ ] **Prices** — Services & pricing → *Packages*: the three package prices (USD 490 / 1,290 / 2,900) are placeholders; add service prices if you want them shown.
- [ ] **Verify catalogue data** — fees, application windows and programme lists come from the admissions guide (official and secondary sources, verified 13 Oct 2026). Review each university, update the *Information last verified* date, and add or remove programmes.
- [ ] **Exchange rates & benchmarks** — Settings → *Cost calculator* (indicative rates entered 26 Oct 2026).
- [ ] **Legal** — the Privacy policy and Terms pages are drafts; have them reviewed (UK/EU GDPR applies to European visitors).
- [ ] **Photos** — upload real photos for cities, universities and articles (illustrations are used until you do).
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

### دليل مختصر للوحة التحكم

- **التحرير باللغتين**: افتح أي عنصر واستخدم قائمة «اللغة» أعلى الصفحة للتبديل بين العربية والإنجليزية.
- **الصفحات**: المحتوى ← الصفحات. أضف الأقسام أو رتّبها أو احذفها. الصفحة ذات المعرّف `home` هي الصفحة الرئيسية. «حفظ كمسودة» ثم «نشر».
- **الطلبات**: إدارة العلاقات ← الطلبات. غيّر «الحالة» لينعكس التحديث في صفحة تتبع الطالب `/track`.
- **الألوان والشعار**: الإعدادات ← إعدادات الموقع ← الهوية البصرية.
- **تحسين البحث**: لكل صفحة تبويب «SEO» مع معاينة نتيجة جوجل.

---

## Project structure

```
studying-morocco/
├── src/
│   ├── app/(frontend)/[locale]/   # public site (one folder per route), root layout per language
│   ├── app/(frontend)/actions.ts  # form server actions (validated, rate-limited)
│   ├── app/(frontend)/beacon/     # cookieless analytics collector
│   ├── app/(payload)/             # Payload admin + REST API
│   ├── collections/ · globals/    # CMS schema
│   ├── blocks/                    # page-builder block definitions
│   ├── components/                # UI, cards, blocks renderers, forms, art (SVG illustrations)
│   ├── admin/                     # dashboard, charts and logo for the back-office
│   ├── i18n/                      # Arabic and English UI strings
│   ├── lib/                       # queries, SEO, formatting, options, routes
│   ├── migrations/                # database migrations (production)
│   ├── seed/                      # bilingual starter content
│   ├── proxy.ts                   # adds /ar or /en to un-prefixed URLs
│   └── payload.config.ts
├── public/                        # favicon, Open Graph image
└── docker-compose.yml             # local PostgreSQL
```
