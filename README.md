# La Muse PWA Starter (Next.js + Supabase)

Mobile-first PWA so customers can "Add to Home Screen" and view **Promotions / Events / My Profile**.

## 1) Quick Start
```bash
pnpm i   # or npm i / yarn
cp .env.example .env.local  # fill Supabase keys
pnpm dev
```

Deploy easily on **Vercel**. Ensure environment variables are set on Vercel.

## 2) Supabase Setup
1. Create a new Supabase project.
2. In SQL Editor, run `scripts/sql/schema.sql`.
3. Get your Project URL and anon key; put into `.env.local`.
4. Enable Email auth (magic link OTP).

## 3) PWA
- `public/manifest.json` with La Muse colors & icons.
- `next-pwa` auto-registers a service worker in production build.

## 4) Where to edit
- UI pages: `app/` (Home, /promotions, /events, /profile, /admin)
- Brand color: `tailwind.config.js` (brand)
- WhatsApp CTA: change the number in Home & pages

## 5) Next Steps
- Hook Promotions & Events to Supabase tables.
- Protect `/admin` via middleware with a stored role.
- Add BM/中文 i18n (next-intl) if needed.
- Add push/WhatsApp notifications via 3rd party.
