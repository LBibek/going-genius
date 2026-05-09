'use client';

import { GoingGeniusProvider } from '@going-genius/react';

export default function WordPressDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoingGeniusProvider 
      clientId="gg_demo_wp_123" 
      config={{
        apiBase: "/api/gg"
      }}
    >
      {children}
    </GoingGeniusProvider>
  );
}
