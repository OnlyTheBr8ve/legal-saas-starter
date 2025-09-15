
# ClauseCraft — Legal SaaS Starter

Generate, edit, and (later) e‑sign SME‑friendly documents with an AI copilot. This is an MVP scaffold using Next.js + Tailwind, optional Supabase, Stripe, and OpenAI.

## Features (MVP)
- Landing page + dashboard
- Editor with AI generate endpoint (`/api/generate`)
- Sample templates in `/templates`
- Stripe webhook placeholder
- Supabase client placeholder
- Strong "not legal advice" disclaimers

## Quickstart (No-Code Deployment)
1. **Create accounts** (all free to start):
   - GitHub — version control
   - Vercel — hosting for Next.js
   - OpenAI — API key for generation
   - (Optional) Supabase — auth, DB, storage
   - (Optional) Stripe — subscriptions

2. **Upload this project to GitHub**
   - Create a new repo named `legal-saas-starter`
   - Click **Add file → Upload files** and upload all files from this folder
   - Commit to `main`

3. **Deploy on Vercel**
   - Import the GitHub repo and select **Next.js**
   - Add environment variables (see `.env.example`)
   - Deploy. Open your site and go to `/dashboard`.

4. **Test AI generation**
   - Paste a template, enter variables JSON, and click **Generate with AI**.

## Environment Variables
Copy `.env.example` to `.env` (locally) and configure in Vercel Project → Settings → Environment Variables.

```
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

> You can deploy without Supabase/Stripe initially. Only `OPENAI_API_KEY` is required for the MVP.

## Optional: Supabase (Auth + DB)
- Create a new Supabase project.
- In **Project Settings → API**, copy the project URL and anon public key.
- Paste into your Vercel env vars as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Run the SQL in `supabase.sql` to create basic tables when you're ready to persist docs.

## Optional: Stripe (Subscriptions)
- Create products: **Pro Monthly** and **Pro Annual**.
- Copy **Publishable** and **Secret** keys to env vars.
- Add a webhook endpoint pointing to `/api/stripe/webhook` and copy the webhook secret.
- Extend webhook handler to update user entitlements in the DB (TODO).

## Safety & Disclaimers
- Always display a **Not legal advice** disclaimer.
- Do not imply jurisdiction-specific compliance unless implemented and reviewed.
- Provide clear privacy policy and terms before launch.

## Dev
```
npm i
npm run dev
```

## Roadmap
- Auth + user dashboard (Supabase)
- Document storage and versioning
- Template variables UI
- Lightweight e‑sign (hash, IP, timestamp; upgrade later)
- Pricing & checkout (Stripe)
- SEO landing pages for template niches
