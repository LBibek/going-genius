# Going Genius: Universal Wallet Implementation Plan

## 1. Executive Summary
The **Universal Wallet** is the cornerstone of the Going Genius end-user experience. It serves as a unified command center for users to manage their digital identity and subscriptions across all apps integrated with the GG platform. This plan outlines the transition from a basic subscription list to a full-featured "Identity + Revenue" dashboard.

---

## 2. Research Findings (Context7 & Web Research)

### A. Multi-Tenant Data Aggregation
*   **Pattern**: Using Prisma's relational capabilities to perform cross-app aggregation.
*   **Finding**: The current schema (Prisma v7.8.0) supports nested includes that are efficient for fetching user-app relations.
*   **Recommendation**: Implement a dedicated `BillingAggregator` service in `src/lib/billing.ts` to handle complex calculations like "Total Ecosystem Spend" and "Projected Monthly Cost".

### B. Recurring Billing in Nepal (Khalti/eSewa)
*   **Status**: Direct "auto-debit" is limited to specific enterprise merchants.
*   **Workaround**: Use "Tokenization/Vaulting" if supported, or implement a "One-Click Renewal" flow where the platform stores the user's preferred gateway and pre-fills the checkout session.
*   **Insight**: Users prefer transparency. Automated "Upcoming Payment" alerts 3 days before expiry are more effective than silent renewals in the current market.

### C. Plan Transitions (Upgrades/Downgrades)
*   **Best Practice**: Use "Proration" logic. If a user upgrades from a NPR 500 plan to NPR 1,500 plan halfway through the month, credit the remaining NPR 250 to the new purchase.
*   **Implementation**: Create a `calculateProration` Server Action.

---

## 3. Core Feature Roadmap

### Phase 1: Enhanced Aggregation & UX (Next 2 Weeks)
*   **Feature**: Real-time spending analytics with `recharts`.
*   **Feature**: "One-Click Renewal" for expired subscriptions.
*   **Tech**: Next.js Server Components with `Suspense` for skeleton loading of app logos.

### Phase 2: AI-Driven "Smart Wallet" (✅ COMPLETED)
*   **Feature**: **GG-Wallet-Bot**. An AI agent using **Firebase Genkit** that helps users understand their spending.
*   **Capability**: "Show me all my active subscriptions," "How much will I spend next month?", "Cancel my subscription to App X."
*   **Orchestration**: Genkit tools mapping to `getBillingSummaryTool` and future `cancelSubscription` actions.
*   **Implementation**: Successfully implemented `walletAssistantFlow` and registered it via the Genkit MCP server.

### Phase 3: Global Payment Sync & Tokenization (Q4 2026)
*   **Feature**: Saved Payment Methods. Store a secure reference to Khalti/eSewa identifiers (not credentials) to speed up checkout.
*   **Feature**: Multi-currency support for global GG users (Stripe/PayPal).

---

## 4. Technical Architecture

### A. Data Layer (Prisma)
We will utilize the existing `Subscription` and `Transaction` models but add a `metadata` field to `Transaction` to store gateway-specific response tokens for future reconciliation.

### B. AI Logic (Genkit)
Using `ai.defineFlow` and `ai.defineTool` to create a modular, scalable agent architecture as seen in `src/lib/ai/flows.ts`.

---

## 5. Performance Goals
*   **Aggregation Latency**: < 150ms for fetching ecosystem-wide data.
*   **Accessibility**: Full WCAG 2.1 compliance for billing history (critical for inclusivity).
*   **Security**: Zero-knowledge storage of payment credentials; only gateway tokens persisted.

---

## 6. Maintenance & Scalability
*   Implement `revalidatePath('/dashboard/subscriptions')` after every successful transaction.
*   Use Prisma `$transaction` for all wallet-related state changes (Upgrade/Downgrade/Cancellation) to ensure atomicity.

---
> **Researcher Note:** The "Universal" aspect is the value proposition. Users should feel that Going Genius protects their data and simplifies their life across the entire Nepali digital landscape.
