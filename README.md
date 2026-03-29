# 🎯 PMP Expert Tutor — SaaS Platform

AI-powered PMP exam preparation grounded exclusively in **PMBOK Guide 7th Edition (2021)** and **PMP ECO January 2021**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 + React 19 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| AI Engine | Anthropic Claude API (Sonnet 4) |
| Voice/TTS | ElevenLabs Multilingual v2 |
| Payments | PayPal Subscriptions API |
| Deployment | Vercel |

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo-url>
cd pmp-expert-tutor
npm install
```

### 2. Create accounts

- **Supabase**: [supabase.com](https://supabase.com) — Create a new project
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com) — Get API key
- **ElevenLabs**: [elevenlabs.io](https://elevenlabs.io) — Get API key + choose a voice
- **PayPal Developer**: [developer.paypal.com](https://developer.paypal.com) — Create app + subscription plans

### 3. Set up Supabase database

1. Go to your Supabase project → SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Run it — this creates all tables, triggers, and RLS policies

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`:
- Supabase URL + Anon Key (from project Settings → API)
- Anthropic API key
- ElevenLabs API key + Voice ID
- PayPal Client ID + Secret + Webhook ID

### 5. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Add all environment variables from `.env.local`
5. Deploy — done!

## Project Structure

```
pmp-saas/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Tailwind styles
│   ├── login/page.tsx              # Login (email + Google OAuth)
│   ├── signup/page.tsx             # Signup
│   ├── pricing/page.tsx            # Pricing plans + PayPal
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard sidebar layout
│   │   ├── page.tsx                # Dashboard home
│   │   ├── mindmap/page.tsx        # Mind Map (Phase 2)
│   │   ├── course/page.tsx         # Course (Phase 2)
│   │   ├── practice/page.tsx       # Practice (Phase 2)
│   │   ├── exam/page.tsx           # Mock Exam (Phase 2)
│   │   └── tutor/page.tsx          # AI Tutor (Phase 2)
│   └── api/
│       ├── auth/callback/route.ts  # OAuth callback
│       ├── auth/signout/route.ts   # Sign out
│       ├── ai/tutor/route.ts       # Claude - AI Tutor (rate-limited)
│       ├── ai/notes/route.ts       # Claude - Study Notes (premium)
│       ├── ai/questions/route.ts   # Claude - Questions/Cards/Quiz
│       ├── tts/generate/route.ts   # ElevenLabs - Audio (premium)
│       ├── payments/create-subscription/route.ts  # PayPal checkout
│       └── webhooks/paypal/route.ts # PayPal webhook handler
├── lib/
│   ├── constants.ts                # System prompts, limits, pricing
│   ├── subscription.ts             # Premium check helper
│   └── supabase/
│       ├── client.ts               # Browser Supabase client
│       └── server.ts               # Server Supabase client
├── supabase/
│   └── schema.sql                  # Full database schema
├── middleware.ts                    # Auth protection for /dashboard
└── .env.example                    # Environment variables template
```

## Phases

- **Phase 1** ✅ Foundation: Project setup, auth, DB, API routes, PayPal
- **Phase 2**: Port full PMP Expert Tutor UI (Mind Map, Course, Practice, Exam, Tutor)
- **Phase 3**: Study Studio (Notes, Flashcards, Quiz) + ElevenLabs audio
- **Phase 4**: Paywall middleware, rate limiting, usage tracking
- **Phase 5**: Landing page polish, SEO, analytics
- **Phase 6**: Domain, production deploy, soft launch

## License

Proprietary — Tamkeen Group / AiTutorZ
