---
trigger: always_on
glob: "**/*"
description: "Core rules, architecture, and tech stack for the Going Genius project."
---

# Going Genius - Project Rules & Context

## Project Overview
Going Genius is a premium Next.js boilerplate/application featuring a subscription-billing solution for an identity platform. It includes tiered access control for B2B/B2C users, content gating, and payment integrations (Khalti, eSewa).

## Technology Stack
- **Framework:** Next.js 16.2.5 (App Router)
- **React:** React 19.2.4
- **Database & ORM:** PostgreSQL with Prisma (v7.8.0)
- **Backend/Auth:** Supabase, `jose`, `bcryptjs`
- **UI & Styling:** Tailwind CSS, `next-themes` (Dark/Light Mode), Radix UI, `lucide-react`
- **Validation:** Zod
- **Data Visualization & 3D:** `recharts`, React Three Fiber

## Architectural Guidelines
1. **Server Actions First:** Use Server Actions for all database calls (Prisma) to prevent browser-environment crashes and ensure runtime stability. Do not expose Prisma logic in Client Components.
2. **Hydration & UI:** When using UI components (like Radix UI TooltipTrigger), strictly implement `asChild` to prevent invalid nested HTML elements and hydration mismatches.
3. **Theming:** All theme-related styles must support dynamic switching using `next-themes` and global CSS variables. Avoid hardcoded color values to maintain a polished dark/light mode appearance.
4. **Image Handling:** Standardize all image rendering through the central Uploadcare CDN utility. Ensure dynamic URL formatting utilizes the `/preview/` modifier where necessary to bypass 404 fetching errors, and sync logic across profile cards and gallery components.
5. **Robustness:** Implement error boundaries for 3D components and validate environment variables to guarantee production-level stability. Sanitize UI rendering logic (e.g. data calculations) to gracefully handle missing profile data.
