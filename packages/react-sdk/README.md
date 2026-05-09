# @going-genius/react

The official React SDK for Going Genius—the identity and subscription ecosystem for modern apps.

## Installation

```bash
npm install @going-genius/react
```

## Features

- **Seamless Auth**: Universal login across the Going Genius ecosystem.
- **Drop-in Billing**: One-click checkout with Khalti/eSewa support.
- **Feature Gating**: Declaratively protect premium content.
- **Universal Wallet**: Users manage subscriptions centrally on Going Genius.

## Usage

### 1. Wrap your app with `GoingGeniusProvider`

```tsx
import { GoingGeniusProvider } from '@going-genius/react';

function App() {
  return (
    <GoingGeniusProvider appId="your_app_id">
      <YourContent />
    </GoingGeniusProvider>
  );
}
```

### 2. Add a Billing Button

```tsx
import { GGBillingButton } from '@going-genius/react';

function Pricing() {
  return (
    <GGBillingButton 
      appId="your_app_id" 
      planId="pro_plan_id" 
      label="Upgrade to Pro" 
    />
  );
}
```

### 3. Protect Premium Features

```tsx
import { GGFeatureGate } from '@going-genius/react';

function ProDashboard() {
  return (
    <GGFeatureGate appId="your_app_id">
      <div>This is premium content only subscribers can see!</div>
    </GGFeatureGate>
  );
}
```

### 4. Custom Auth Logic

```tsx
import { useGoingGenius } from '@going-genius/react';

function Profile() {
  const { user, login, logout, isLoading } = useGoingGenius();

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <button onClick={login}>Login</button>;

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## API Reference

- `GoingGeniusProvider`: Context provider for the SDK.
- `useGoingGenius()`: Hook to access user session and auth methods.
- `useGGPlan(appId)`: Hook to check subscription status.
- `<GGBillingButton />`: Pre-styled button for checkout flows.
- `<GGFeatureGate />`: Component for conditional rendering based on subscription.

## License

MIT © [Going Genius](https://going-genius.com)
