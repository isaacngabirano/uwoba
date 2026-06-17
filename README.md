# RHEA BEAUTY SHOP — Setup Guide

## Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **State**: Zustand (cart + admin auth)
- **Notifications**: CallMeBot WhatsApp
- **Payments**: Marz (add when ready)
- **Fonts**: Cormorant Garamond (display) + Space Mono (UI)

---

## Step 1 — Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New project
2. Name it `rhea-beauty`, choose a strong password, pick a region close to Uganda (e.g. EU West)
3. Once created, go to **SQL Editor** → paste the entire contents of `supabase-schema.sql` → Run
4. Go to **Settings → API** and copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep this secret!)

---

## Step 2 — Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=1234
ADMIN_SECRET=rhea_admin_secret_jwt_key_2024
```

---

## Step 3 — CallMeBot WhatsApp (Free Notifications)

1. On your WhatsApp, send a message to **+34 644 60 96 99**:
   ```
   I allow callmebot to send me messages
   ```
2. You'll receive an API key in reply
3. Add to `.env.local`:
   ```env
   CALLMEBOT_API_KEY=your_key_here
   ADMIN_WHATSAPP_NUMBER=256XXXXXXXXX   # Your number with country code, no +
   ```

---

## Step 4 — Run the App

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)
- Username: `admin`
- Password: `1234`

---

## Step 5 — Marz Payment Gateway

Share your Marz API docs and I'll integrate:
- MTN Mobile Money
- Airtel Money  
- Card payments

---

## Project Structure

```
rhea-beauty/
├── app/
│   ├── (store)/              # Customer-facing storefront
│   │   ├── page.tsx          # Homepage with product grid
│   │   ├── HomeClient.tsx    # Category filter + products
│   │   ├── products/[id]/    # Product detail page
│   │   ├── checkout/         # Checkout form
│   │   └── order-confirmation/
│   ├── admin/                # Admin panel (/admin)
│   │   ├── page.tsx          # Login
│   │   ├── dashboard/        # Stats + analytics
│   │   ├── products/         # Product CRUD
│   │   ├── orders/           # Order management
│   │   └── users/            # Customer list
│   └── api/                  # API routes
│       ├── orders/           # Create + list orders
│       ├── products/         # Product CRUD
│       └── admin/            # Auth + analytics + customers
├── components/
│   └── store/
│       ├── Navbar.tsx        # Top navigation
│       ├── CartDrawer.tsx    # Slide-in cart
│       ├── ProductCard.tsx   # Product tile
│       └── ProductGrid.tsx   # Grid layout
├── store/
│   ├── cart.ts               # Zustand cart state
│   └── admin.ts              # Admin auth state
├── lib/
│   ├── supabase.ts           # Supabase clients
│   └── utils.ts              # Helpers + constants
├── types/index.ts            # TypeScript types
└── supabase-schema.sql       # Run this in Supabase SQL Editor
```

---

## Adding Product Images

Currently products show a placeholder with the product code. To add images:

**Option A — URL**: In the admin panel, edit a product and paste an image URL (e.g. from Google Drive, Cloudinary, or any CDN).

**Option B — Supabase Storage** (recommended):
1. In Supabase dashboard → Storage → Create bucket `product-images` (public)
2. Upload images there
3. Copy the public URL and paste into the product image field in admin

---

## Deployment (Vercel — Free)

```bash
npm install -g vercel
vercel
```

Add all environment variables in Vercel dashboard → Settings → Environment Variables.

---

## What's Pending
- [ ] Marz payment integration (need API docs)
- [ ] Product image upload directly in admin (currently URL only)
- [ ] Order email confirmation (optional)
