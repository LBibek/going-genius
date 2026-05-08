# Design Specification: Authentication & Identity

## 1. Vision & Strategy
The Authentication flow is the most critical "Proof of Quality" for the platform. It must feel **Unbreakable**, **Fast**, and **Premium**. We leverage high-blur glassmorphism and tactile input fields to create a "Vault-like" experience that users trust with their digital identity.

## 2. Component Design
### The Auth Card
- **Dimensions:** Max-width `440px`.
- **Material:** `glass-card` with heavy `20px` backdrop blur.
- **Shadow:** Complex stack—`0 0 0 1px var(--primary-glow)`, `0 32px 80px rgba(0, 0, 0, 0.6)`, and a focal `60px` primary glow.

### Interactive Inputs
- **Base State:** Recessed with `rgba(255, 255, 255, 0.04)` background.
- **Focus State:** `box-shadow: 0 0 0 3px var(--primary-glow)`. Border color shifts to `var(--border-active)`.
- **OTP Fields:** Individual `52px` squares. On focus, the container scales `1.05x` to emphasize active input.

### Social Providers
- Buttons are unified in height (`48px`) with high-contrast social icons.
- Hover states must use a subtle white-transparency overlay (`rgba(255,255,255,0.05)`).

## 3. Layout & Context
- **Background:** Uses the `auth-layout` class with the `auth-bg-grid` and `auth-bg-glow`.
- **Typography:** 
  - Title: Centered, gradient text from `#f1f5f9` to `#94a3b8`.
  - Subtitle: Muted gray, providing context for the current step (Login vs Register).

## 4. UX Patterns
- **Transitions:** Tab switching (Login/Register) must be instantaneous but visually anchored by a sliding active background in the `.auth-tabs` component.
- **Feedback:** Error states must trigger a subtle "shake" animation on the card or specific input, followed by the appearance of the `.form-error` alert.

---
*Date: 2026-05-08*
*Status: Production Ready*
