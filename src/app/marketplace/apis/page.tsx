import { prisma } from '@/lib/prisma';
import { ApiMarketplaceClient } from '../components/ApiMarketplaceClient';

export default async function ApiMarketplace() {
  const apis = await prisma.oAuthApp.findMany({
    where: { 
      isPublic: true,
      marketplaceCategory: 'API',
      moderationStatus: 'APPROVED'
    },
    include: { owner: true }
  });

  return <ApiMarketplaceClient apis={apis} />;
}
