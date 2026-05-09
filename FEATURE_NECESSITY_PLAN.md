# 🎯 Going Genius - Feature Necessity & Implementation Plan

This document analyzes the necessity of remaining features for the Going Genius platform and provides a prioritized execution plan.

---

## 🏗️ Core Pillars of Necessity

### 1. Financial & Billing Integrity (Priority: P0 - Critical)
*Real revenue generation requires production-grade payment handling and automated subscription maintenance.*

| Feature | Necessity | Rationale | Plan |
| :--- | :--- | :--- | :--- |
| **Live Gateway Webhooks** | **High** | Essential for secure, server-side transaction verification. Client-side verification is prone to manipulation. | Implement production webhooks in `src/app/api/webhooks/` for both Khalti and eSewa. |
| **CRON Subscription Sync** | **High** | Prevents "Revenue Leakage" by ensuring users lose access as soon as their subscription expires. | Finalize the Vercel CRON job configuration in `vercel.json` and set up the `CRON_SECRET`. |
| **Refund & Dispute Tools** | **Medium** | Necessary for handling customer support and maintaining platform trust. | Create an admin-only interface for manual transaction reversal in the Super Admin dashboard. |

### 2. AI Intelligence & UX (Priority: P1 - Strategic)
*AI is the primary value proposition; it must feel premium and contextual.*

| Feature | Necessity | Rationale | Plan |
| :--- | :--- | :--- | :--- |
| **Persistent AI Memory** | **High** | Context-aware AI (e.g., remembering a user's previous billing query) increases retention and perceived value. | Implement a `Thread` and `Message` model in Prisma linked to `GGUser` and use Genkit state management. |
| **Dynamic LLM Routing** | **Medium** | Optimizes operational costs by using cheaper models (Gemini Flash) for simple tasks and Pro models for complex reasoning. | Update the Genkit flow to inspect task complexity before selecting a model provider. |

### 3. Developer Ecosystem (Priority: P1 - Growth)
*Growth depends on how easily third-party developers can adopt the GG Identity platform.*

| Feature | Necessity | Rationale | Plan |
| :--- | :--- | :--- | :--- |
| **NPM SDK Distribution** | **High** | Standardization. Developers should be able to `npm install @going-genius/react` instead of copying files. | Configure `tsup` for bundling and establish a GitHub Action for automatic NPM publishing. |
| **Interactive API Docs** | **High** | Reduces integration friction. If it's hard to integrate, developers will choose competitors (Auth0, Clerk). | Use Genkit's reflection capabilities or Swagger to generate real-time API documentation. |
| **Webhook Simulator** | **Medium** | Allows developers to test their integration locally without making real transactions. | Add a "Test Webhook" button in the Developer Console that sends mock payloads to their registered endpoint. |

### 4. Governance & Monitoring (Priority: P2 - Operational)
*Maintaining a production system requires visibility and accountability.*

| Feature | Necessity | Rationale | Plan |
| :--- | :--- | :--- | :--- |
| **Admin Audit Logs** | **High** | Security and compliance. We must know who modified app settings or manual billing states. | Create an `AuditLog` model to track `create/update/delete` actions performed in the `/admin` area. |
| **Revenue Reconciliation** | **Medium** | Ensures financial accuracy by matching gateway receipts with database records. | Build an automated script that pulls gateway reports and highlights discrepancies. |

---

## 📅 Roadmap Execution Phases

### Phase 1: Revenue Hardening (Next 7 Days)
1. **Live Webhooks**: Wire real gateway handlers.
2. **Subscription CRON**: Deploy the serverless job.
3. **Environment Sync**: Audit all production secrets in Vercel.

### Phase 2: Developer Onboarding (Day 8-14)
1. **SDK Packaging**: Finalize and publish `@going-genius/react`.
2. **API Documentation**: Launch the interactive guide.
3. **Webhook Tester**: Deploy simulator tool.

### Phase 3: AI Intelligence (Day 15+)
1. **Memory Integration**: Backend persistence for chats.
2. **Multi-Model Routing**: Cost optimization logic.

---

## ✅ Necessity Verification Matrix
| Feature | Business Value | Technical Difficulty | Dependency |
| :--- | :--- | :--- | :--- |
| Webhooks | Extreme | Medium | Gateway Approval |
| CRON Sync | High | Low | Vercel Project |
| SDK NPM | High | Medium | Build Config |
| Audit Logs | Medium | Low | Prisma Schema |

*Prepared by: Antigravity AI*
*Date: 2026-05-09*
