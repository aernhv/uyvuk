# Royal Cuts — Premium Barbershop Website

A complete, production-ready barbershop website with bilingual support (Arabic + English), full RTL layout, online booking, and an owner dashboard.

## Stack

- **Framework**: Next.js 14+ (App Router) + TypeScript
- **Styling**: Tailwind CSS — dark/gold premium aesthetic
- **Database**: Prisma + SQLite (swap to PostgreSQL for production)
- **i18n**: next-intl — Arabic/English with automatic RTL/LTR
- **Auth**: NextAuth v5 (beta) — JWT-based owner dashboard

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env` and fill in values:

```bash
cp .env .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="change-this-to-a-random-string-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secure secret for production:
```bash
openssl rand -base64 32
```

### 3. Run database migrations

```bash
npx prisma migrate dev
```

### 4. Seed the database

```bash
npm run seed
```

This creates:
- **Owner account**: `admin@royalcuts.com` / `admin123`
- **5 sample services** (haircut, fade, beard trim, hot towel shave, full package)
- **3 barbers** with weekly schedules (Sat–Thu, Friday off)
- **Sample bookings** for today

### 5. Start development server

```bash
npm run dev
```

Visit:
- **Public site (EN)**: http://localhost:3000/en
- **Public site (AR)**: http://localhost:3000/ar
- **Dashboard login**: http://localhost:3000/en/dashboard/login

---

## Project Structure

```
app/
├── [locale]/                  # Locale-prefixed routes (en/ar)
│   ├── layout.tsx             # Root layout with RTL support
│   ├── page.tsx               # Homepage
│   ├── services/page.tsx      # Services listing
│   ├── barbers/page.tsx       # Barbers listing
│   ├── booking/page.tsx       # Multi-step booking flow
│   ├── gallery/page.tsx       # Photo gallery
│   ├── contact/page.tsx       # Contact + map
│   └── dashboard/             # Owner dashboard (auth-protected)
│       ├── login/page.tsx
│       ├── layout.tsx
│       ├── page.tsx           # Overview + stats
│       ├── bookings/page.tsx  # Bookings management
│       ├── services/page.tsx  # Services CRUD
│       └── barbers/page.tsx   # Barbers CRUD + schedules
├── api/
│   ├── slots/route.ts         # GET available time slots
│   ├── bookings/route.ts      # POST create booking
│   ├── bookings/[id]/route.ts # PATCH status / DELETE
│   ├── auth/[...nextauth]/    # NextAuth handler
│   └── dashboard/             # Protected CRUD APIs
│       ├── services/
│       └── barbers/
├── lib/
│   ├── prisma.ts              # Prisma singleton
│   ├── auth.ts                # NextAuth config
│   ├── booking.ts             # Slot availability logic
│   └── utils.ts               # cn(), formatPrice(), formatDuration()
├── i18n/
│   ├── routing.ts             # next-intl locale config
│   └── request.ts             # next-intl server config
└── globals.css                # Design system + CSS utilities

components/
├── Header.tsx                 # Sticky header with language switcher
├── Footer.tsx                 # Footer with nav + contact
├── home/                      # Homepage sections
├── services/                  # Services page components
├── barbers/                   # Barbers page components
├── booking/                   # Multi-step booking flow
├── gallery/                   # Gallery grid + lightbox
├── contact/                   # Contact section
└── dashboard/                 # Dashboard components (sidebar, tables, managers)

messages/
├── en.json                    # English translations
└── ar.json                    # Arabic translations

prisma/
├── schema.prisma              # Database schema
├── seed.ts                    # Seed script
└── migrations/                # Auto-generated migrations
```

---

## Booking Flow

1. **Select service** — shows duration and price
2. **Select barber** — or choose "Any Available"
3. **Pick date & time** — calendar + slots loaded via `/api/slots`
4. **Enter details** — name, phone, optional email + notes
5. **Confirm** — creates booking, shows success screen

### Slot logic (`app/lib/booking.ts`)

- Reads the barber's `BarberSchedule` for the selected day
- Checks `BlockedDate` (holidays)
- Filters out past slots
- Generates 15-minute interval slots within working hours
- Removes slots that overlap with existing `pending`/`confirmed` bookings
- If "Any Barber" is selected, returns the union of free slots across all active barbers

---

## Dashboard

Login at `/en/dashboard/login` (or `/ar/dashboard/login`).

| Section | Features |
|---|---|
| Overview | Today / week / total booking counts + upcoming list |
| Bookings | Table with status actions (confirm, complete, no-show, cancel) |
| Services | Add / edit / delete services with bilingual name + description |
| Barbers | Add / edit / delete barbers + per-day schedule editor |

---

## i18n / RTL

- All routes are prefixed with `/en/` or `/ar/`
- The root `layout.tsx` sets `dir="rtl"` for Arabic
- Arabic uses **Cairo** font; English uses **Playfair Display** + **Inter**
- Language switcher in the header toggles between `/en/...` and `/ar/...`

---

## Production Deployment

1. Switch `DATABASE_URL` to a PostgreSQL connection string
2. Update `prisma/schema.prisma` datasource provider to `"postgresql"`
3. Run `npx prisma migrate deploy`
4. Set `NEXTAUTH_SECRET` to a strong random value
5. Set `NEXTAUTH_URL` to your production domain
6. Deploy to Vercel, Railway, or any Node.js host

---

## Default Credentials

> **Change these immediately in production.**

| Field | Value |
|---|---|
| Email | admin@royalcuts.com |
| Password | admin123 |
