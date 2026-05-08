# Design Specification: User Profile & Dashboard

## 1. Vision & Strategy
The User Dashboard is the "Personal Hub." It must feel **Welcoming**, **Informative**, and **Elite**. It focuses on the individual's journey within the Going Genius ecosystem, highlighting their status, achievements, and active integrations.

## 2. Visual Layout
### Profile Header
- **Avatar:** Large, circular avatar with a `2px` border-active.
- **Identity Badge:** A technical badge showing their account type (Free, Pro, Genius) with appropriate semantic coloring.
- **Background:** A subtle `auth-bg-glow` tailored to the user's primary "Vibe" or account status.

### Status Cards
- **Usage Metrics:** Summary cards showing active sessions, storage used, or API calls (if applicable).
- **Style:** `glass-card` with simplified content.

## 3. Subscription Management
- **Status Bar:** A horizontal progress bar showing time remaining in the current billing cycle.
- **Quick Actions:** Buttons for "Renew Plan," "Change Payment Method," and "View Invoices."

## 4. Interaction & Personalization
- **Theme Sync:** Seamlessly respecting `next-themes` selection with specific overrides for premium users (e.g., "Midnight Gold" theme).
- **Activity Feed:** A vertical timeline of recent logins, security changes, and subscription events.

## 5. Security Center
- **Two-Factor Status:** High-visibility toggle for 2FA.
- **Session List:** Table of active devices with "Logout Everywhere" as a primary danger-action.

---
*Date: 2026-05-08*
*Status: Production Ready*
