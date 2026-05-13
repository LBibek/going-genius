import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { notFound } from 'next/navigation';
import { AppDetailClient } from '../components/AppDetailClient';

export default async function AppMarketplaceDetail({ params }: { params: { id: string } }) {
  const session = await getSession();
  const { id } = await params;

  const app = await prisma.oAuthApp.findUnique({
    where: { id, isPublic: true },
    include: { owner: true }
  });

  if (!app) notFound();

  // Check if current user already has this app connected (simplified check)
  const isConnected = session ? !!(await prisma.appUser.findUnique({
    where: { appId_userId: { appId: app.id, userId: session.userId } }
  })) : false;

  return (
    <AppDetailClient 
      app={app} 
      session={session} 
      isConnected={isConnected} 
    />
  );
}
