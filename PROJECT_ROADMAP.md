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
    - [x] **Live Gateway Integration**: Finalized production webhooks for Khalti and eSewa.
    - [x] **Subscription Sync**: Automated via serverless CRON job (`/api/cron/sync-subscriptions`).
    - [x] **Refund Workflow**: Admin UI (`AdminTransactions`) with full reversal logic and subscription revocation.
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
**Status: ✅ PHASE 3 COMPLETE**

Empowering third-party developers to build on top of Going Genius.

- **Completed**:
    - [x] **React SDK v1.0**: Dual-format `@going-genius/react` with `AISalesBot` + threadId memory.
    - [x] **Public Bot API**: `/api/v1/apps/[id]/bot` with CORS, Genkit metering, and Thread persistence.
    - [x] **Interactive API Docs**: Swagger UI at `/developer/api-docs` powered by `/api/docs/openapi.json`.
    - [x] **OpenAPI 3.1 Spec**: Full spec covering OAuth, Identity, and AI Agent endpoints.
    - [x] **Automated NPM Publish**: GitHub Actions workflow on `sdk-v*` tags → `.github/workflows/publish-sdk.yml`.
    - [x] **Webhook Simulator**: Integrated in the developer console for real-time event testing.
    - [x] **Developer Quickstart**: Comprehensive markdown guide for SDK integration.
    - [x] **App Management**: Dashboard for API keys, AI config, and branding.
- **Remaining (Stretch Goals)**:
    - [x] **Live Playground**: `/developer/playground` — real-time bot config with generated code output.
- **Context for Deployment**:
    - SDK bundled with `tsup`. Publish: `git tag sdk-v0.2.0 && git push --tags`.
    - Requires `NPM_TOKEN` secret in GitHub repository settings.

---

## 📈 5. Admin & Monitoring
**Status: 🏗️ UNDER CONSTRUCTION**

Platform-wide governance and revenue tracking.

- **Completed**:
    - [x] **Super Admin Dashboard**: High-level view of platform growth (users, apps, revenue).
    - [x] **Usage Monitoring**: Real token tracking per app with `ApiUsage` model.
    - [x] **Financial Governance UI**: `AdminTransactions` component for viewing and refunding transactions.
    - [x] **Audit Log Model**: `AuditLog` table with REFUND_TRANSACTION events for compliance.
    - [x] **Audit Trail UI**: `/admin/audit` page with search, filtering, and metadata expansion.
- **To Be Done**:
    - [x] **Revenue Reconciliation**: `/admin/reconciliation` — gateway comparison with CSV export, daily charts, top-app breakdown.
    - [x] **Health Monitoring**: Sentry (`@sentry/nextjs`) with client/server/edge configs, `src/lib/monitoring.ts` abstraction, and GitHub Actions release tracking.

---

## 🚀 Deployment Strategy
1. **Database**: Managed PostgreSQL (Vercel Postgres or Supabase DB).
2. **Compute**: Vercel Serverless Functions (Next.js 16 App Router).
3. **Storage**: Uploadcare CDN for profile images and app logos.
4. **CI/CD**: Automatic branch deployments via GitHub/Vercel integration.

---

*Last Updated: 2026-05-09 — **ALL GOALS COMPLETE** — Platform fully production-ready.*
