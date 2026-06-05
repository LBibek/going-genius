import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { OptimizedImage } from '@/components/OptimizedImage';
import { notFound } from 'next/navigation';
import { CheckCircle2, Shield, Globe, ArrowLeft, TerminalSquare } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const app = await prisma.oAuthApp.findUnique({ where: { id: resolvedParams.id } });
  
  if (!app) return { title: 'App Not Found' };
  
  return {
    title: `${app.name} | Going Genius`,
    description: app.marketplaceTagline || `Install ${app.name} on Going Genius`,
  };
}

export default async function AppLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const appId = resolvedParams.id;

  const app = await prisma.oAuthApp.findUnique({
    where: { 
      id: appId,
      isPublic: true,
      moderationStatus: 'APPROVED'
    },
    include: {
      owner: { select: { displayName: true } },
      plans: {
        where: { isActive: true },
        orderBy: { price: 'asc' }
      }
    }
  });

  if (!app) notFound();

  // Create an authorization URL for this app
  const redirectUri = app.redirectUris[0] || 'http://localhost:3000/demo/callback';
  const authUrl = `/oauth/authorize?client_id=${app.clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid profile email`;

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      <div className="max-w-5xl mx-auto px-6">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <div className="w-32 h-32 rounded-3xl overflow-hidden bg-card border border-border shrink-0 shadow-2xl">
            <OptimizedImage 
              src={app.logoUrl || '/images/app-placeholder.png'} 
              alt={app.name}
              width={128}
              height={128}
              style={{ objectFit: 'cover' }}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold font-heading">{app.name}</h1>
              {app.isOfficial && (
                <span className="flex items-center gap-1 text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-1 rounded-full">
                  <CheckCircle2 size={14} /> OFFICIAL
                </span>
              )}
            </div>
            
            <p className="text-xl text-muted-foreground mb-6">
              {app.marketplaceTagline || 'A powerful application built on the Going Genius ecosystem.'}
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                href={authUrl}
                className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform shadow-xl shadow-primary/20"
              >
                Connect App
              </Link>
              
              <Link 
                href={`/demo/billing/${app.id}`}
                className="bg-card border border-border text-foreground font-bold px-8 py-3 rounded-full hover:bg-muted transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>

        {/* Screenshots Gallery */}
        {app.marketplaceScreenshots && app.marketplaceScreenshots.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold font-heading mb-6">Gallery</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
              {app.marketplaceScreenshots.map((url, i) => (
                <div key={i} className="shrink-0 w-[80%] md:w-[600px] aspect-video rounded-2xl overflow-hidden border border-border bg-card relative snap-center shadow-xl">
                  <OptimizedImage 
                    src={url} 
                    alt={`${app.name} screenshot ${i + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold font-heading mb-6">About this app</h2>
              <div className="prose prose-invert max-w-none text-muted-light whitespace-pre-wrap">
                {app.marketplaceDescription || 'The developer has not provided a detailed description yet.'}
              </div>
            </section>
            
            {app.plans.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold font-heading mb-6">Pricing</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {app.plans.map(plan => (
                    <div key={plan.id} className="bg-card border border-border rounded-2xl p-6">
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                      <div className="text-2xl font-black mt-2">
                        {plan.price} <span className="text-sm font-medium text-muted-foreground">{plan.currency} /{plan.interval}</span>
                      </div>
                      <Link 
                        href={`/demo/billing/${app.id}`}
                        className="mt-6 block w-full text-center bg-muted text-foreground font-medium py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        Subscribe
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Globe size={18} className="text-primary" />
                Developer Info
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Developer</div>
                  <div className="font-medium">{app.owner.displayName}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Category</div>
                  <div className="font-medium px-2.5 py-1 bg-secondary text-secondary-foreground rounded-md inline-block text-sm">
                    {app.marketplaceCategory || 'Other'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Shield size={18} className="text-primary" />
                Permissions
              </h3>
              <p className="text-sm text-muted-light mb-4">
                This app uses the Going Genius Identity Platform and requests access to:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground"><CheckCircle2 size={16} className="text-emerald-500" /> Your basic profile info</li>
                <li className="flex items-center gap-2 text-muted-foreground"><CheckCircle2 size={16} className="text-emerald-500" /> Your email address</li>
              </ul>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-6">
               <h3 className="font-bold mb-4 flex items-center gap-2">
                <TerminalSquare size={18} className="text-primary" />
                API & Bot
              </h3>
              <p className="text-sm text-muted-light mb-4">
                Want to test out the AI bot for this app before connecting? 
              </p>
              <Link href="/developer/api-docs" className="block text-center border border-border py-2 rounded-md hover:bg-muted transition-colors text-sm font-bold">
                Chat with Bot
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
