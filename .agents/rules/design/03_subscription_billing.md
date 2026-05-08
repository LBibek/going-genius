# Design Specification: Subscription & Billing

## 1. Vision & Strategy
The billing experience must be **Transparent**, **Incentivizing**, and **Secure**. It should communicate the value of each tier (B2B/B2C) clearly while making the payment process (Khalti/eSewa) feel like a seamless part of the platform rather than a jarring external redirection.

## 2. Visual Architecture
### Pricing Tiers
- **Structure:** Vertical cards with "hero" treatment for the most popular plan.
- **Elevation:** The "Pro/Genius" plan should be slightly larger and have a permanent `var(--primary-glow)` background effect.
- **Checklist:** Standardized `lucide-react` checkmarks in `var(--success)` for features, and cross-marks in `var(--muted)` for excluded features.

### Content Gating
- **Overlay:** A frosted glass overlay (`backdrop-filter: blur(8px)`) over gated content.
- **CTA Modal:** A centered glass-card explaining the requirement for a higher tier, with a direct upgrade button.

## 3. Payment Integration (Local First)
### Provider Selection
- High-quality logos for **Khalti** and **eSewa**.
- Tactile "Pill" selection buttons with active border highlights.

### Receipt & Status
- Post-payment screens must use the "Success" color tokens effectively.
- A technical breakdown of the transaction (Transaction ID, Amount, Expiry) in a `technical` font style (Inter, Mono).

## 4. UX Patterns
- **Tier Switching:** Smooth transitions between monthly/yearly billing using a tactical switch component.
- **Upgrade Path:** Direct "One-Click Upgrade" for logged-in users, pre-filling known data to reduce friction.

---
*Date: 2026-05-08*
*Status: Production Ready*
