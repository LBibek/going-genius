'use client';

import { GoingGeniusProvider } from '@going-genius/react';

export default function SDKDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoingGeniusProvider clientId="demo-client-id">
      {children}
    </GoingGeniusProvider>
  );
}
