# 🏛️ Going Genius: Architect's MVP & Revenue Blueprint

This document defines the **Minimum Viable Product (MVP)** strategy for the "Intelligence-First Identity & Revenue Ecosystem." As an architect, the goal is to build a high-performance, revenue-generating engine that is ready for day-one users.

---

## 💎 1. The MVP "Must-Have" Feature Matrix

These features represent the absolute minimum required to prove the business model and start generating revenue.

| Pillar | Feature | Revenue Logic |
| :--- | :--- | :--- |
| **Identity** | **Universal OAuth2 Provider** | Onboards developers and users into the ecosystem. |
| **Wallet** | **Khalti/eSewa "Verified" Webhooks** | Enables real money transactions (2.5% platform fee). |
| **Billing** | **Tiered Subscription Engine** | Automated plan gating (Free vs Pro) via Prisma. |
| **AI** | **Genkit Wallet Assistant** | High-value utility that encourages user retention. |
| **SDK** | **NPM React Hooks (`@gg/react`)** | Direct integration path for 3rd party revenue partners. |

---

## 🚀 2. "Must-Used" Features (The User Experience Checklist)

Before sharing the app with the first batch of users, these features **must** be polished to a premium standard:

1.  **The "One-Tap" Checkout**: A glassmorphic payment modal that loads in <500ms and verifies the transaction via a real gateway callback.
2.  **The AI Billing Insight**: A chat interface where users can ask, *"How much did I spend last month across all apps?"* and get an accurate, database-backed answer.
3.  **The Developer Sandbox**: A simple dashboard view for developers to see their API traffic and revenue share in real-time.

---

## 📑 3. Detailed Architectural Workflow (Dev → Prod)

To ensure a "Top Tier" product launch, follow this rigorous 4-step workflow:

### **Step 1: Security & Identity Layer (Ground Zero)**
- **Middleware Hardening**: Implement a global `middleware.ts` to handle session verification at the edge.
- **RLS Policy**: Configure PostgreSQL Row Level Security to ensure strict data isolation between Apps and Users.
- **Action Validation**: Every Server Action must be wrapped in a `zod` schema validator and an `authCheck` wrapper.

### **Step 2: Revenue & Integration (The Engine)**
- **Webhook Idempotency**: Use a `ProcessedTransaction` table to ensure payment webhooks are never processed twice.
- **Gateway Sync**: Transition Khalti/eSewa from Sandbox to Production using encrypted Vercel environment variables.
- **Subscription CRON**: Deploy a Vercel Cron job to sync subscription expiration statuses every 24 hours.

### **Step 3: SDK & DX (The Distribution)**
- **Bundle Optimization**: Use `tsup` for the React SDK to ensure tree-shaking and zero-dependency footprint.
- **NPM Versioning**: Publish `@going-genius/react@1.0.0-rc` to a private registry for initial alpha testers.
- **Quickstart Guide**: Finalize `DEVELOPER_QUICKSTART.md` with copy-pasteable snippets for Next.js and Vite.

### **Step 4: Launch & Orchestration (The Deployment)**
- **AI Token Metering**: Implement a middleware for AI routes to log token counts to the `AiUsage` table for billing.
- **Sentry Integration**: Configure Sentry for real-time error reporting and performance tracing.
- **Vercel Edge Runtime**: Opt-in to the Edge runtime for `/api/auth` and `/api/mcp` routes for global low-latency.

---

## 💰 4. Revenue Generation Model
1.  **Transaction Fees**: 2.5% surcharge on all payments processed via the Universal Wallet.
2.  **AI Orchestration Markup**: 15% markup on raw LLM token costs (Gemini/DeepSeek) for the value-added Genkit orchestration.
3.  **Developer SaaS**: A flat $19/mo "Pro" tier for developers who need more than 3 active apps.

---

## 📈 5. Scalability & Future-Proofing

### **Horizontal Scaling**
- **Edge Functions**: Offload authentication and routing logic to the network edge.
- **Redis Caching**: Use Upstash Redis to cache frequent billing summaries, reducing Postgres load.

### **Vertical Growth**
- **Genkit Plugin System**: Allow developers to register their own "Tools" (e.g., `checkMyStock`, `orderPizza`) into the Going Genius AI ecosystem.
- **Universal Identity API**: Transition from a React SDK to a language-agnostic API (Go, Python, Rust) to capture the entire web/mobile market.

---

*Architectural Strategy by Antigravity*
*Vision: Intelligence-First Identity & Revenue Ecosystem*
