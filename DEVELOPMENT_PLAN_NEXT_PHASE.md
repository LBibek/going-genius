# Going Genius: Features & Development Plan (Next Phase)

This document translates the **Profitability Plan** into a concrete technical roadmap. The focus for this phase is **Ecosystem Readiness**—building the tools that allow other developers to use Going Genius to generate revenue.

---

## 1. Project Status & Progress

### Phase 1: Profitability & Monetization (COMPLETED ✅)
- [x] **Subscription Analytics Dashboard**: Daily user growth, active subscriptions, and revenue tracking in the developer console.
- [x] **API Key Management Console**: Secure UI for developers to manage AI (Gemini/OpenAI) and Payment (Khalti/eSewa) provider keys.
- [x] **Premium UI Visual Cues**: Sparkle indicators and PRO badges across the dashboard and app cards.
- [x] **Production Actions**: Secure server actions for provider credential handling and analytic aggregations.

### Phase 2: Ecosystem Growth & Integration (COMPLETED ✅)
- [x] **WordPress Demo Site**: Live showcase of drop-in checkout, scheduling widgets, and integration vision at `/demo/wordpress`.
- [x] **Integrations Hub**: Dedicated tab in developer console for CMS connectors and migration tools.
- [x] **Bulk Data Import Utility**: High-fidelity UI for migrating existing user bases from legacy platforms.
- [x] **Environment Validation**: Centralized Zod-based production hardening in `src/lib/env.ts`.

### Phase 3: Production Hardening & Scaling (IN PROGRESS ⏳)
- [ ] **SDK Distribution**: Build and publish the `@going-genius/react` package for public use.
- [ ] **Edge Migration**: Move session validation logic to Vercel Edge for sub-100ms performance.
- [ ] **Advanced AI Orchestration**: Implement Prompt Manager and usage-based cost monitoring.

---

## 2. Core Infrastructure Components

### A. The "Developer Hub" (Management Console)
*   **App Registration:** UI for creating `OAuthApp` entities (Client IDs, Secrets).
*   **Billing Configurator:** No-code interface to define `SubscriptionPlans` (Price, Interval, Features).
*   **Integrations Hub:** Manage WordPress plugins, bulk imports, and outbound webhooks.
*   **Analytics Dashboard:** Real-time tracking of users, active subscriptions, and revenue.

### B. The GG-SDK (React Alpha)
*   **`useGGAuth()` Hook:** Seamless session management across the GG ecosystem.
*   **`<GGBillingButton />`:** A "drop-in" component that handles the entire checkout flow.
*   **`<GGFeatureGate />`:** Component to conditionally render UI based on the user's active subscription plan.

### C. AI Agent Orchestration (Genkit Layer)
*   **Prompt Manager:** A UI to version and test Genkit flows.
*   **Cost Monitor:** Detailed breakdown of token usage per `OAuthApp` to enable usage-based billing.
*   **Provider Fallback:** Logic to automatically switch between Gemini and OpenAI.

---

## 3. "Profit-First" Development Milestones

| Milestone | Deliverable | Profitability Impact |
| :--- | :--- | :--- |
| **M1: Dash-Ready** | Functional Developer Console | Allows first "Early Access" SaaS partners to onboard. |
| **M2: SDK-Alpha** | Working `npm` package (local) | Enables developers to build apps *on top* of GG. |
| **M3: Revenue-Live** | Hardened Khalti/eSewa Webhooks | Ensures 100% revenue capture for all client apps. |
| **M4: Agent-Metrics** | AI Usage Dashboard | Enables usage-based billing and token markup revenue. |

---

## 4. Immediate Next Steps
1.  [ ] **SDK Finalization:** Standardize the React hooks and export the package for NPM.
2.  [ ] **Webhooks Hardening:** Implement signature verification for Khalti and eSewa callbacks.
3.  [ ] **WP Plugin Handshake:** Complete the OAuth handshake for the WordPress plugin.

---
**Status:** Feature-Complete (Phases 1 & 2)
**Updated:** 2026-05-09
