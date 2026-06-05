import React from 'react';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getPrompts } from '@/app/actions/ai';
import { PromptManagerClient } from './PromptManagerClient';

export const metadata = {
  title: 'AI Prompts | Going Genius',
};

export default async function PromptsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const appId = resolvedParams.id;
  const session = await getSession();

  if (!session) redirect('/auth/login');

  const app = await prisma.oAuthApp.findUnique({
    where: { id: appId, ownerId: session.userId }
  });

  if (!app) redirect('/developer/dashboard');

  const prompts = await getPrompts(appId);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-foreground">AI Prompts</h1>
        <p className="text-muted-light mt-2">Manage and A/B test system instructions for your Genkit AI Agents.</p>
      </div>

      <PromptManagerClient appId={appId} initialPrompts={prompts} />
    </div>
  );
}
