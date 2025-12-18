# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

La Cité Fleurie is a restaurant/pizzeria/lounge bar website built with Next.js 13 (App Router), TypeScript, Tailwind CSS, and Supabase. The application serves as both a public-facing website and includes an admin panel for managing menus and opening hours.

## Tech Stack

- **Framework**: Next.js 13.5.1 (App Router)
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS 3.3.3 + tailwindcss-animate
- **UI Components**: Radix UI primitives + shadcn/ui
- **Backend**: Supabase (PostgreSQL database + Storage)
- **Alternative Backend**: Firebase (also configured but secondary)
- **Email**: Nodemailer with SMTP
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Common Commands

### Development
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

### Package Management
This project uses npm. The `pnpm-lock.yaml` exists but `package-lock.json` is the source of truth.

## Architecture

### Frontend Structure

**App Router Pattern** (Next.js 13):
- `app/` - Contains all routes and pages
- `app/layout.tsx` - Root layout with Navigation, Footer, and global fonts (Playfair Display + Inter)
- `app/page.tsx` - Homepage with hero carousel and feature sections
- `app/api/` - API routes (only `/api/send-email` for contact form)

**Public Pages**:
- `/` - Homepage
- `/menu` - Public menu page (displays PDFs/images from Supabase)
- `/horaires` - Opening hours page
- `/contact` - Contact form (sends emails via Nodemailer)
- `/mentions-legales` - Legal information

**Admin Pages**:
- `/admin` - Login page (password-only authentication)
- `/admin/menu` - Manage menu items (upload/delete PDFs, images)
- `/admin/horaires` - Manage opening hours

### Authentication System

**Simple session-based admin authentication**:
- Password stored in env var: `NEXT_PUBLIC_ADMIN_PASSWORD`
- Auth functions in `lib/auth.ts` use `sessionStorage` (client-side only)
- `AdminGuard` component protects admin routes
- No JWT, no Supabase Auth - intentionally simple

### Data Layer

**Supabase Integration** (`lib/supabase.ts`):
- Primary database for menu items and opening hours
- Two main tables:
  - `menu_items` - Menu PDFs/images with metadata
  - `opening_hours` - 7 days of the week with times and status
- Storage bucket: `menus` for uploaded files
- Row Level Security (RLS) enabled:
  - Public read access
  - Authenticated write access (though admin uses password, not Supabase auth)

**Firebase** (`lib/firebase.ts`):
- Also configured but appears secondary/backup
- Firestore and Storage initialized

### Component Organization

**Reusable Components** (`components/`):
- `navigation.tsx` - Sticky header with scroll effects
- `footer.tsx` - Site footer
- `admin-guard.tsx` - Protects admin routes
- `admin-nav.tsx` - Admin panel navigation
- `ui/` - shadcn/ui components (44+ components)

**Design System**:
- Primary brand colors: `#d3cbc2` (gold/beige) and `#b8af9f` (darker gold)
- Extensive use of gradients, animations, and hover effects
- Custom scroll animations via `use-scroll-animation` hook
- Toast notifications via Sonner

### API Routes

**`/api/send-email`** (`app/api/send-email/route.ts`):
- Runtime: Node.js (required for Nodemailer)
- Dynamic route (force-dynamic)
- Sends two emails:
  1. Internal notification to `CONTACT_EMAIL`
  2. Confirmation email to customer
- Styled HTML email template
- SMTP via Hostinger (config in `.env`)

### Environment Variables

Required in `.env`:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_ADMIN_PASSWORD
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
CONTACT_EMAIL
```

## Important Patterns

### Path Aliases
- `@/*` maps to root directory (e.g., `@/components`, `@/lib`)

### Client Components
- Most interactive components use `'use client'` directive
- Admin pages are all client-side
- Homepage uses client-side for animations and carousel

### Styling Patterns
- Utility function: `cn()` in `lib/utils.ts` for conditional class merging
- Heavy use of Tailwind's gradient utilities
- Brand colors hardcoded (not in CSS variables)
- Responsive breakpoints: sm, md, lg following Tailwind defaults

### Data Fetching
- Supabase queries use the JavaScript client library
- Admin pages fetch data on mount with `useEffect`
- No React Query or SWR - direct Supabase calls
- Loading states managed with local state

### Image Handling
- Next.js Image component with `unoptimized: true` in config
- Images stored in `/public` and Supabase Storage
- External images from Pexels on homepage

## Development Guidelines

### Adding Admin Features
When adding admin functionality:
1. Wrap the page in `<AdminGuard>`
2. Include `<AdminNav>` for navigation
3. Use existing UI components from `components/ui/`
4. Follow the pattern in `app/admin/menu/page.tsx` or `app/admin/horaires/page.tsx`
5. Use toast notifications for user feedback

### Database Changes
- Migrations in `supabase/migrations/` directory
- Apply via Supabase CLI or dashboard
- Update TypeScript types in `lib/supabase.ts`
- Ensure RLS policies are configured

### Styling New Components
- Use brand colors: `#d3cbc2` and `#b8af9f`
- Include hover effects and transitions (duration-300 or duration-500)
- Add gradient backgrounds for primary actions
- Use shadcn/ui components as base

### Contact Form / Email Changes
- Email template in `app/api/send-email/route.ts`
- Must use Node.js runtime (not Edge)
- Always verify SMTP connection before sending
- Include both HTML and plain text versions

## Known Configuration

### Build Configuration
- ESLint errors ignored during builds (`eslint.ignoreDuringBuilds: true`)
- Images unoptimized (for deployment flexibility)
- TypeScript strict mode enabled
- Output format: standard (not static export)

### Fonts
- Playfair Display: Display/heading font
- Inter: Body text font
- Both loaded from Google Fonts with `swap` display

### Language
- Site is in French (`lang="fr"` in HTML)
- All UI text, emails, and content in French

## Troubleshooting

### Admin Access Issues
- Check `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env`
- Verify sessionStorage is not disabled in browser
- Admin pages redirect to `/admin` if not authenticated

### Email Sending Failures
- Verify SMTP credentials in `.env`
- Check SMTP connection in route logs
- Ensure `runtime = "nodejs"` in route config
- Test with external SMTP testing tool

### Supabase Connection Issues
- Verify `NEXT_PUBLIC_SUPABASE_URL` and key
- Check RLS policies in Supabase dashboard
- Confirm storage bucket `menus` exists and is public
- Review browser console for CORS errors

### Build Errors
- Run `npm run typecheck` to isolate TypeScript errors
- Check for missing dependencies
- Ensure `.env` variables are available at build time (NEXT_PUBLIC_ prefix for client-side)
