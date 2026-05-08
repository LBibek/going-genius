# Going Genius Design System Specification

## 1. Overview & Creative North Star
**The Creative North Star: "The Golden Intelligence"**

Going Genius is a premium identity and subscription platform that balances high-end aesthetics with technical precision. The design system is built on **Refined Glassmorphism** and **Tactile Elevation**. It aims to feel like a bespoke executive tool—clean, authoritative, and fast. We use a nocturnal "Space Dark" theme as the primary experience, punctuated by a signature "Genius Gold" accent.

---

## 2. Colors & Surface Architecture

### Primary Palette
*   **Genius Gold (Primary):** `#FFB116` - Used for primary actions, branding, and status highlights.
*   **Success:** `#10b981`
*   **Warning:** `#f59e0b`
*   **Danger:** `#ef4444`

### Surface Hierarchy (Dark Mode)
*   **Base Chassis:** `#0d0d12`
*   **Elevated Ground:** `#050507` (Alternative background)
*   **Glass Card:** `rgba(255, 255, 255, 0.03)` with `20px` backdrop-blur and a `rgba(255, 255, 255, 0.07)` border.
*   **Interaction Surfaces:** `rgba(255, 255, 255, 0.06)` for hover states.

### Surface Hierarchy (Light Mode)
*   **Base Chassis:** `#ffffff`
*   **Elevated Ground:** `#f8fafc`
*   **Glass Card:** `rgba(255, 255, 255, 0.7)` with `12px` backdrop-blur.

---

## 3. Typography: Executive Precision

We pair the modern utility of **Inter** with the geometric character of **Outfit**.

*   **Headlines (Outfit):** Used for all `h1` through `h4`. Letter-spacing: `-0.02em`. It provides a premium, "brand" feel.
*   **Body & Technical (Inter):** Used for all UI labels, inputs, and long-form text. Optimized for legibility across devices.
*   **Logo Type (Outfit):** Extra bold, `-0.05em` tracking for a dense, high-end signature.

---

## 4. Elevation & Visual Depth

*   **The Glass Principle:** Depth is created through semi-transparent layers and backdrop blurs rather than traditional shadows. 
*   **Glow Effects:** Use `var(--primary-glow)` (rgba(255, 177, 22, 0.25)) for subtle outer glows on active components.
*   **Background Grids:** A tactical 60x60px animated grid overlay is used in auth and hero sections to ground the design in a "building block" metaphor.

---

## 5. Components & UI Patterns

### Tactical Buttons
*   **Primary:** Linear gradient from `#FFB116` to `#e69e10`. 12px corner roundness.
*   **Outline:** 1px border with glass hover effects.
*   **Submit:** Large, high-contrast buttons with `30px` primary glow on hover.

### Secure Inputs
*   **Design:** Inset feel with `rgba(255, 255, 255, 0.04)` background (Dark).
*   **OTP Fields:** High-density, geometric inputs with `scale(1.05)` focus animation.
*   **Badges:** Role-based status chips with subtle backgrounds and high-contrast borders.

---

## 6. Motion & Interaction
*   **Fade-In:** Smooth `0.6s` cubic-bezier entry for all main containers.
*   **Grid Pulse:** Slow linear animation on background grids to create a "living" interface.
*   **Tactile Feedback:** Scale and glow transitions on interactive elements to confirm user intent.
