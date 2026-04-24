# Continua

Between-session therapy support for patients and their clinicians — bridging the 167 hours between appointments with grounding tools, AI-assisted journaling, and RTM billing infrastructure.

## Setup

```bash
npm install
```

Add your Anthropic API key to `.env.local`:

```
ANTHROPIC_API_KEY=your_key_here
```

```bash
npm run dev
```

## Deploy to Vercel

1. Link this repository in the Vercel dashboard
2. Add `ANTHROPIC_API_KEY` as an environment variable under Project Settings → Environment Variables
3. Deploy — Vercel reads `vercel.json` for the variable reference automatically

## Navigation

| Route | Description |
|-------|-------------|
| `/patient` | Patient portal — grounding tools, journaling, session memory, and modality-specific tools |
| `/clinician` | Clinician dashboard — patient overview, journal review, RTM logging, and billing export |
| `/calculator` | RTM revenue calculator — estimate billing impact of adding Remote Therapeutic Monitoring |
| `/about` | Product overview — clinical foundation, features, and contact |

## Demo patients

| Patient | Modality | Notes |
|---------|----------|-------|
| Sarah Chen | EMDR | Phase 3–4, SUDS baseline 7, driving trauma |
| James Okafor | CBT | Performance anxiety, imposter syndrome |
| Elena Vasquez | DBT | Emotional dysregulation, BPD features |
| Michael Torres | Grief | Loss of spouse, dual process model |
| Aisha Patel | EMDR | Phase 2, resource installation, childhood trauma |
| Tyler Brooks | CBT (Adolescent) | Social anxiety, perfectionism, age 16 |

## Environment

- Next.js 16 (App Router)
- Tailwind CSS v4
- Framer Motion
- Anthropic SDK (`/api/reflect` route uses `claude-opus-4-6`)
