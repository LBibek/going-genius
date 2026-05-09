# 🚀 Going Genius - Project Roadmap & Status

This document outlines the current state of the Going Genius platform and the upcoming milestones required for a full production-ready ecosystem.

---

## 🏗️ 1. Core Platform (Identity & Auth)
**Status: ✅ COMPLETED**

The foundation of the identity platform is solid, utilizing Supabase for authentication and Prisma for state management.

- **Completed**:
    - [x] **Universal Auth**: Integrated login/register flows with Supabase.
    - [x] **OAuth 2.0 Provider**: Ability for developers to register apps and obtain client IDs/secrets.
    - [x] **Session Management**: Secure, server-side session handling via `jose` and `bcryptjs`.
    - [x] **User Roles**: Tiered access control (USER, MODERATOR, ADMIN).
- **Context for Deployment**:
    - Ensure `SUPABASE_SERVICE_ROLE_KEY` is never exposed.
    - Deployment to Vercel requires environment variable synchronization for production Supabase URL.

---

## 💳 2. Billing & Universal Wallet
**Status: 🔄 IN PROGRESS**

The "Universal Wallet" is the core revenue driver, allowing cross-app subscription management.

- **Completed**:
    - [x] **Schema Design**: Comprehensive billing, subscription, and transaction models in Prisma.
    - [x] **Ecosystem Summary**: Logic to aggregate spending across all registered apps.
    - [x] **Pricing UI**: Beautiful, glassmorphic pricing tables for tiered access.
- **To Be Done**:
    - [ ] **Live Gateway Integration**: Finalize production webhooks for Khalti and eSewa.
    - [ ] **Subscription Sync**: Automate the "expiration" check via a serverless CRON job (planned in `vercel.json`).
    - [ ] **Refund Workflow**: Administrative interface for handling payment disputes and manual adjustments.
- **Context for Development**:
    - **No Mock Policy**: All payment verification must hit the real Khalti/eSewa test/prod APIs.
    - **Deployment**: Gateway keys must be secret and configured per-environment.

---

## 🤖 3. AI Agent Orchestration
**Status: ✅ COMPLETED / ENHANCING**

AI is the "brain" of Going Genius, used for both lead generation and billing support.

- **Completed**:
    - [x] **Genkit Foundation**: Initial setup of Genkit for flow orchestration.
    - [x] **MCP Server Implementation**: Created a local MCP endpoint to expose AI tools to IDEs and external agents.
    - [x] **Lead Capture Flow**: Genkit-powered flow for capturing user interest in developer apps.
- **To Be Done**:
    - [x] **Wallet Assistant Refactor**: Migrate the current AI SDK-based `walletAssistant` to Genkit to align with project standards (Rule 7).
    - [ ] **Multi-Provider Support**: Enable dynamic switching between Gemini, OpenAI, and DeepSeek based on app configuration.
    - [ ] **Memory Persistence**: Implement tool-calling that remembers user context across sessions (PostgreSQL backed).
- **Context for Development**:
    - **Genkit-First**: Use `genkit-mcp-server` for all orchestration to ensure compatibility with modern AI workflows.

---

## 🛠️ 4. Developer Experience (SDK & Documentation)
**Status: 🔄 IN PROGRESS**

Empowering third-party developers to build on top of Going Genius.

- **Completed**:
    - [x] **React SDK Alpha**: Initial structure in `packages/react-sdk`.
    - [x] **Developer Quickstart**: Comprehensive markdown guide for SDK integration.
    - [x] **App Management**: Dashboard for developers to manage their API keys and branding.
- **To Be Done**:
    - [ ] **SDK NPM Packaging**: Configure CI/CD for publishing `@going-genius/react` to NPM.
    - [ ] **Interactive API Docs**: Dynamic Swagger/OpenAPI documentation for the GG Identity API.
    - [ ] **Webhook Tester**: A tool in the developer dashboard to simulate GG events (e.g., `payment.success`).
- **Context for Deployment**:
    - SDK should be bundled using `tsup` for dual ESM/CJS compatibility.

---

## 📈 5. Admin & Monitoring
**Status: 🏗️ UNDER CONSTRUCTION**

Platform-wide governance and revenue tracking.

- **Completed**:
    - [x] **Super Admin Dashboard**: High-level view of platform growth (users, apps, revenue).
    - [x] **Usage Monitoring**: Basic token tracking for AI usage.
- **To Be Done**:
    - [ ] **Revenue Reconciliation**: Automated reports comparing gateway statements with database records.
    - [ ] **Audit Logs**: Comprehensive tracking of all administrative actions.
    - [ ] **Health Monitoring**: Integration with a service like Sentry or Axiom for real-time error tracking.

---

## 🚀 Deployment Strategy
1. **Database**: Managed PostgreSQL (Vercel Postgres or Supabase DB).
2. **Compute**: Vercel Serverless Functions (Next.js 16 App Router).
3. **Storage**: Uploadcare CDN for profile images and app logos.
4. **CI/CD**: Automatic branch deployments via GitHub/Vercel integration.

---

*Last Updated: 2026-05-09*
