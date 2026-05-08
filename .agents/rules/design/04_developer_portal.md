# Design Specification: Developer Console

## 1. Vision & Strategy
The Developer Console is the "Cockpit" for engineers. It must prioritize **Density**, **Utility**, and **Real-time Diagnostics**. The aesthetic should be "Technically Professional"—clean lines, monospace data, and high-contrast status indicators.

## 2. Dashboard Layout
### Sidebar Navigation
- **Fixed Sidebar:** Slim sidebar with icon-only or collapsed states for maximum workspace.
- **Active State:** A vertical "Genius Gold" bar next to the active menu item.

### API Management
- **Key Management:** Obfuscated key views with "Click to Copy" tactile buttons.
- **Endpoint List:** A technical table view with `JetBrains Mono` or `Inter` technical font for paths and methods.

## 3. Data Visualization
- **Usage Charts:** Use `recharts` with thin lines and area glows.
- **Colors:**
  - Success Traffic: `#10b981`
  - Error Traffic: `#ef4444`
  - Latency: `#FFB116`

## 4. Component Details
### The "App Bot" Preview
- A live-preview container showing how the AI Support Bot looks on their site.
- Toggle switches for theme, position, and initial greeting.

### Team Management
- "Invite" badges showing pending status in `var(--warning)`.
- Role dropdowns using Radix UI Select for accessibility and consistent styling.

## 5. Interaction Patterns
- **Real-time Updates:** Success notifications for API key rotation or config changes using a "toast" system that slides in from the top-right.
- **Documentation Deep-linking:** "Help" icons next to complex configuration fields that link directly to the relevant docs section.

---
*Date: 2026-05-08*
*Status: Production Ready*
