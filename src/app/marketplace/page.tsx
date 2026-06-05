import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { MarketplaceClient } from './components/MarketplaceClient';

async function MarketplaceData() {
  const session = await getSession();

  const featuredApps = await prisma.oAuthApp.findMany({
    where: { isPublic: true, isFeatured: true },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  const allApps = await prisma.oAuthApp.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' }
  });

  const categories = Array.from(new Set(allApps.map((app: any) => app.marketplaceCategory).filter(Boolean))) as string[];

  return (
    <MarketplaceClient 
      session={session} 
      featuredApps={featuredApps} 
      allApps={allApps} 
      categories={categories} 
    />
  );
}

export default function MarketplacePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Loading Marketplace...</div>}>
        <MarketplaceData />
      </Suspense>
    </div>
  );
}
