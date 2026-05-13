import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { MarketplaceClient } from './components/MarketplaceClient';

export default async function MarketplacePage() {
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
