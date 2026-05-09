# @going-genius/react

The official React SDK for the Going Genius Identity and Subscription Platform.

## Installation

```bash
npm install @going-genius/react
# or
yarn add @going-genius/react
# or
pnpm add @going-genius/react
```

## Setup

Wrap your application with the `GGProvider`:

```tsx
import { GGProvider } from '@going-genius/react';

function App() {
  return (
    <GGProvider appId="your-app-id">
      <YourAppContent />
    </GGProvider>
  );
}
```

## Usage

### Content Gating

Easily gate features or content based on user subscriptions:

```tsx
import { GGFeatureGate } from '@going-genius/react';

function PremiumFeature() {
  return (
    <GGFeatureGate plan="pro" fallback={<p>Please upgrade to access this feature.</p>}>
      <div>Welcome to the Pro Plan!</div>
    </GGFeatureGate>
  );
}
```

### Billing Buttons

Drop-in buttons for checkout and subscription management:

```tsx
import { GGBillingButton } from '@going-genius/react';

function Pricing() {
  return (
    <GGBillingButton planId="price_123" variant="premium">
      Upgrade to Pro
    </GGBillingButton>
  );
}
```

### Hooks

Access user plan information programmatically:

```tsx
import { useGGPlan } from '@going-genius/react';

function Dashboard() {
  const { plan, isLoading } = useGGPlan();

  if (isLoading) return <Spinner />;

  return <div>Current Plan: {plan.name}</div>;
}
```

## Documentation

For full documentation, visit [docs.going-genius.com](https://docs.going-genius.com)
