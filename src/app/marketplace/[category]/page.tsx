import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Layers, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const category = resolvedParams.category;
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Apps | Going Genius Marketplace`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const categoryStr = resolvedParams.category;
  
  // Title case the category for the DB query since we saved it as 'Productivity', 'Finance' etc.
  const categoryTitle = categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1);

  const apps = await prisma.oAuthApp.findMany({
    where: { 
      isPublic: true,
      moderationStatus: 'APPROVED',
      marketplaceCategory: categoryTitle
    },
    include: {
      owner: { select: { displayName: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      <div className="max-w-6xl mx-auto px-6">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>
        
        <div className="mb-12 border-b border-border pb-8">
          <h1 className="text-4xl font-bold font-heading mb-4">{categoryTitle} Apps</h1>
          <p className="text-muted-foreground">Discover powerful {categoryStr} applications built on Going Genius.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {apps.map(app => (
            <Link 
              key={app.id} 
              href={`/apps/${app.id}`}
              className="group block bg-card rounded-2xl border border-border overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30"
            >
              {app.marketplaceScreenshots && app.marketplaceScreenshots.length > 0 ? (
                <div className="aspect-video w-full overflow-hidden bg-muted relative">
                  <OptimizedImage 
                    src={app.marketplaceScreenshots[0]} 
                    alt={`${app.name} screenshot`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <Layers size={48} className="text-primary/20" />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-background border border-border shrink-0">
                    <OptimizedImage 
                      src={app.logoUrl || '/images/app-placeholder.png'} 
                      alt={app.name}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{app.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">by {app.owner.displayName}</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-light line-clamp-2 min-h-[2.5rem]">
                  {app.marketplaceTagline || 'A powerful new application.'}
                </p>
              </div>
            </Link>
          ))}

          {apps.length === 0 && (
            <div className="col-span-3 text-center py-20 bg-card/50 rounded-2xl border border-border border-dashed">
              <h3 className="text-lg font-bold mb-2">No apps found</h3>
              <p className="text-muted-foreground">There are currently no public apps in the {categoryTitle} category.</p>
              <Link href="/developer" className="inline-block mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium">
                Build One
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
