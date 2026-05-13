import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Parallel search across different models
    const [myApps, marketplaceApps, users] = await Promise.all([
      // Search My Apps
      prisma.oAuthApp.findMany({
        where: {
          ownerId: session.userId,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5
      }),
      // Search Public Marketplace Apps
      prisma.oAuthApp.findMany({
        where: {
          isPublic: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { marketplaceTagline: { contains: query, mode: 'insensitive' } },
            { marketplaceCategory: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5
      }),
      // Search Users associated with user's apps
      prisma.appUser.findMany({
        where: {
          app: { ownerId: session.userId },
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { metadata: { path: ['name'], string_contains: query } }
          ]
        },
        include: { app: true },
        take: 5
      })
    ]);

    const results = [
      ...myApps.map((app: any) => ({
        type: 'app',
        id: app.id,
        title: app.name,
        subtitle: app.description || 'Developer App',
        url: `/developer/apps/${app.id}`,
        isPremium: app.isPremium
      })),
      ...marketplaceApps.map((app: any) => ({
        type: 'marketplace',
        id: app.id,
        title: app.name,
        subtitle: app.marketplaceTagline || app.description || 'Marketplace App',
        url: `/marketplace/${app.id}`,
        isOfficial: app.isOfficial
      })),
      ...users.map((u: any) => ({
        type: 'user',
        id: u.id,
        title: u.email,
        subtitle: `User of ${u.app.name}`,
        url: `/developer/apps/${u.appId}`,
      }))
    ];

    // Simple doc search mock (can be expanded later)
    const docs = [
      { title: 'API Authentication', subtitle: 'How to use JWT and API keys', url: '/developer/api-docs' },
      { title: 'Billing Integration', subtitle: 'Setting up Khalti and eSewa', url: '/developer/api-docs' },
      { title: 'Webhooks', subtitle: 'Handling secure payment callbacks', url: '/developer/api-docs' }
    ].filter(d => 
      d.title.toLowerCase().includes(query.toLowerCase()) || 
      d.subtitle.toLowerCase().includes(query.toLowerCase())
    ).map(d => ({ ...d, type: 'doc' }));

    return NextResponse.json({ 
      results: [...results, ...docs].sort((a, b) => a.title.localeCompare(b.title))
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
