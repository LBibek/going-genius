import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Search, Sparkles, TrendingUp, Layers, Code, Briefcase, GraduationCap } from 'lucide-react';

export const metadata = {
  title: 'App Marketplace | Going Genius',
  description: 'Discover and install the best apps built on Going Genius.',
};

export default async function MarketplacePage() {
  const apps = await prisma.oAuthApp.findMany({
    where: { 
      isPublic: true,
      moderationStatus: 'APPROVED'
    },
    include: {
      owner: { select: { displayName: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const categories = [
    { name: 'Productivity', icon: Layers },
    { name: 'Finance', icon: TrendingUp },
    { name: 'Marketing', icon: Sparkles },
    { name: 'Development', icon: Code },
    { name: 'Education', icon: GraduationCap },
  ];

  const featuredApps = apps.filter(app => app.isFeatured).slice(0, 3);
  const newApps = apps.slice(0, 6);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pattern-dots pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black font-heading mb-6 tracking-tight">
            Discover the future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">SaaS</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Browse, install, and subscribe to incredible applications built by developers on the Going Genius ecosystem.
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search for apps, categories, or developers..." 
              className="w-full bg-card/80 backdrop-blur-md border border-border rounded-full py-4 pl-12 pr-6 text-lg focus:outline-none focus:border-primary shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-y border-border/50 bg-card/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(cat => (
              <Link 
                key={cat.name} 
                href={`/marketplace/${cat.name.toLowerCase()}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-background border border-border rounded-full hover:border-primary hover:text-primary transition-colors font-medium text-sm"
              >
                <cat.icon size={16} />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 mt-16 space-y-20">
        {/* Featured Apps */}
        {featuredApps.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="text-amber-500" />
              <h2 className="text-2xl font-bold font-heading">Featured Apps</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredApps.map(app => (
                <AppCard key={app.id} app={app} featured />
              ))}
            </div>
          </section>
        )}

        {/* New Arrivals */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="text-primary" />
            <h2 className="text-2xl font-bold font-heading">New Arrivals</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {newApps.map(app => (
              <AppCard key={app.id} app={app} />
            ))}
            {newApps.length === 0 && (
              <div className="col-span-3 text-center py-12 text-muted-foreground bg-card/30 rounded-2xl border border-border/50">
                No public apps available yet. Be the first to publish one!
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function AppCard({ app, featured = false }: { app: any, featured?: boolean }) {
  return (
    <Link 
      href={`/apps/${app.id}`}
      className={`group block bg-card rounded-2xl border border-border overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 ${featured ? 'md:col-span-1' : ''}`}
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
        
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-xs font-medium px-2.5 py-1 bg-secondary rounded-md text-secondary-foreground">
            {app.marketplaceCategory || 'Other'}
          </span>
          <span className="text-sm font-bold text-primary">View App →</span>
        </div>
      </div>
    </Link>
  );
}
