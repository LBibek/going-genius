This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features

## 🚀 Quickstart

Get your own instance of Going Genius running in seconds:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLBibek%2Fgoing-genius&env=DATABASE_URL,SUPABASE_URL,SUPABASE_ANON_KEY,GOOGLE_GENAI_API_KEY&project-name=going-genius&repository-name=going-genius)

### 🛠️ Developer Adaptation

To integrate Going Genius into your existing stack:

1. **Install SDK**: `npm i @going-genius/react`
2. **Setup Provider**: Wrap your app with `GGProvider`.
3. **Protect Routes**: Use `GGFeatureGate` or `useGGPlan()`.

For detailed instructions, see [DEVELOPER_QUICKSTART.md](./DEVELOPER_QUICKSTART.md).

## 📦 Deployment

### Local Development
```bash
npm install
npx prisma db push
npm run dev
```

### Production (Vercel)
The project is optimized for Vercel deployment. Ensure you provide the following environment variables:
- `DATABASE_URL`: PostgreSQL connection string.
- `SUPABASE_URL` & `SUPABASE_ANON_KEY`: For authentication.
- `GOOGLE_GENAI_API_KEY`: For the integrated AI agents.
- `KHALTI_SECRET_KEY` & `ESEWA_MERCHANT_ID`: For payment processing.

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
