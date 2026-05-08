# Design Specification: Hero & Growth (Landing Page)

## 1. Vision & Strategy
The landing page for Going Genius is the "Digital Flagship" of the identity platform. It must communicate **Trust**, **Speed**, and **Local Heritage**. The primary goal is to convert developers and business owners by showcasing a world-class infrastructure that feels deeply integrated into the Nepali ecosystem.

## 2. Visual Architecture
### Layout Structure
- **Global Navigation:** Fixed glass-navbar with `backdrop-filter: blur(12px)`. Logos and primary CTAs must be anchored at the extremes.
- **Hero Section:** Hero content is centered, utilizing HERO-TYPE (Outfit) with `-0.05em` tracking. The background features an animated 60px grid and a central `pulse-glow` around the primary value proposition.
- **Bento Features Grid:** High-density feature cards using `glass-card` styling. Each card must have a distinct emoji or icon that glow on hover.

### Surface Details
- **The "Golden Ratio":** Use `#FFB116` sparingly as a "high-velocity" highlight. Gradients should flow from `#FFFFFF` to `#FFB116` to symbolize the "dawn of intelligence."
- **Typography Stacking:** 
  - `h1`: Display Hero (Outfit, 900 weight)
  - `h2`: Section Header (Outfit, 800 weight)
  - `p`: Body Text (Inter, 400 weight)

## 3. Interactive Patterns
- **Animated Grid:** The `auth-bg-grid` must move at a constant 8s linear rate, providing a sense of "perpetual motion" in the infrastructure.
- **Micro-Transitions:** 
  - Buttons must shift `translateY(-2px)` on hover with a shadow expansion.
  - Features cards should exhibit a subtle `1.02x` scale up on hover with border-color activation.

## 4. Content Components
### The "Nepal Badge"
A consistent high-visibility badge: `PROUDLY MADE IN NEPAL 🇳🇵`.
- **Styling:** `rgba(239, 68, 68, 0.1)` background with `#fca5a5` text.

### Code Preview
A functional-looking terminal component (`code-card`) showing configuration snippets. 
- **Colors:** Deep midnight backgrounds (`#08080c`) with vibrant semantic tokens (Syntax highlighting).

---
*Date: 2026-05-08*
*Status: Production Ready*
