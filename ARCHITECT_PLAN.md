# Going Genius: Architectural Vision & Feature Roadmap

## 1. Vision & Core Philosophy
Going Genius is not just an identity provider; it is an **Intelligence-First Identity & Revenue Ecosystem**. Our architectural decisions are guided by three pillars:
*   **User-Centricity:** Reducing friction to zero for the end-user.
*   **Developer-Centricity:** Providing "Plug-and-Play" infrastructure for builders.
*   **Performance Excellence:** Sub-100ms response times for core auth and billing flows.

---

## 2. User-Centric Evolution (The End-User Experience)
*End-users are the heart of the platform. We focus on security, transparency, and seamless mobility across the GG ecosystem.*

### A. Unified Subscription Dashboard (The "Universal Wallet")
*   **Concept:** A single interface where users can view and manage every subscription they have across any app built on Going Genius.
*   **Feature:** One-click cancellations, plan upgrades, and payment method updates that sync globally.
*   **Tech:** Cross-app data aggregation using Prisma multi-tenant queries.

### B. "Genius" Onboarding (AI-Assisted)
*   **Concept:** Replace long forms with a conversational AI agent (using Genkit) that collects profile data and configures security settings based on user preference.
*   **Tech:** Integration of `genkit` with `AppBotPreview` patterns to create a "Smart Welcome" flow.

### C. Passkeys & Biometric Security
*   **Concept:** Move beyond passwords. Implement WebAuthn/Passkeys as the primary login method.
*   **Performance:** Reduces login time by ~70% compared to traditional password/OTP flows.

---

## 3. Developer-Centric Ecosystem (The Builder Experience)
*Developers should spend 0% of their time on boilerplate. We provide the "Identity + AI + Billing" trifecta as a service.*

### A. The GG-SDK (React & Node.js)
*   **Concept:** A lightweight SDK that provides hooks like `useGGAuth()`, `useGGPlan()`, and components like `<GGBillingButton />`.
*   **Developer UX:** Reduces integration time from days to minutes.

### B. AI Agent Playground & Debugger
*   **Concept:** A visual IDE within the Developer Console where devs can test Genkit flows, inspect tool-calling logs, and optimize prompt performance before deploying to their apps.
*   **Tech:** Genkit Trace integration exposed through a custom dashboard UI.

### C. No-Code Billing Engine
*   **Concept:** A drag-and-drop builder for creating complex subscription tiers, trial periods, and discount coupons (integrated with Khalti/eSewa).

### D. AI-Driven Lead Generation (CRM as a Service)
*   **Concept:** Turn every AI agent into a proactive sales machine. Developers can enable "Lead Capture" mode to automatically qualify users and save contacts.
*   **Feature:** Integrated "Leads & CRM" dashboard for managing captured interest, contact details, and conversion statuses.
*   **Tech:** Genkit tool-calling (`saveLead`) integrated with a dedicated Prisma model.

### E. WordPress Integration Plugin (E-Commerce & Scheduling)
*   **Concept:** A dedicated WordPress plugin for easy implementation of Going Genius into existing sites, focusing on shopping (e-commerce) and scheduling workflows.
*   **Feature:** "Drop-in" checkout and booking features similar to the subscription flow. Includes a robust bulk import facility to seamlessly onboard multiple existing users, products, or appointments at once.
*   **UI/UX:** Premium, high-conversion interfaces using top-tier icon libraries (e.g., Lucide) to ensure a modern, consistent aesthetic within the WordPress environment.

---

## 4. Architectural & Performance Optimization
*Scale without sacrifice. Performance is a feature, not an afterthought.*

### A. Edge-First Identity Logic
*   **Strategy:** Move session validation and basic profile retrieval to Vercel Edge Functions.
*   **Goal:** Global sub-50ms latency for auth checks.
*   **Implementation:** Use `jose` for JWT validation at the edge, bypassing main database hits for cached sessions.

### B. AI Latency Reduction (Streaming & Hybrid Execution)
*   **Strategy:** Implement response streaming as the default for all AI Agent interactions.
*   **Tech:** Next.js Server Components with `Suspense` and Genkit streaming API.

### C. Advanced Observability & Performance Monitoring
*   **Strategy:** Integrate real-time Core Web Vitals tracking and Prisma Query Logging.
*   **Maintenance:** Automated alerts for any query exceeding 200ms or any LCP (Largest Contentful Paint) drop below 2.5s.

---

## 5. Implementation Roadmap

### Phase 1: Core Hardening (Q2 2026)
*   Finalize Khalti/eSewa webhook handlers for asynchronous payment confirmation.
*   Implement `router.refresh()` and granular `revalidatePath` across the Dev Console.
*   **Performance Goal:** 95+ Lighthouse Score across all dashboard pages.

### Phase 2: The SDK Alpha (Q3 2026)
*   Release `@going-genius/react` SDK.
*   Launch the Unified User Subscription Portal.
*   Beta testing of the AI Agent Debugger.

### Phase 3: Global Scale (Q4 2026)
*   Full Passkey support.
*   Edge runtime migration for OAuth endpoints.
*   Multi-currency and global payment gateway expansion (Stripe/PayPal integration).

---

## 6. Performance Maintenance Checklist
*   [ ] **Daily:** Monitor Vercel Analytics for latency spikes.
*   [ ] **Weekly:** Run `prisma-audit` to detect N+1 query patterns.
*   [ ] **Monthly:** Profile AI Agent costs and prompt efficiency.
*   [ ] **Per Release:** Mandatory Lighthouse audit in CI/CD pipeline.

---

## 7. Reference Documentation
*   **eSewa Developer Portal:** [https://developer.esewa.com.np/](https://developer.esewa.com.np/)
*   **Khalti Documentation:** [https://docs.khalti.com/](https://docs.khalti.com/)

---
> **Architect's Note:** Every line of code added to Going Genius must answer one question: *"Does this make it faster for the user, or easier for the developer?"* If the answer is no, we don't build it.
