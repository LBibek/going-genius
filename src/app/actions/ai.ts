'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export async function getPrompts(appId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  return await prisma.aIPrompt.findMany({
    where: { appId },
    include: {
      versions: {
        orderBy: { version: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createPrompt(appId: string, data: { name: string, slug: string, content: string }) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const app = await prisma.oAuthApp.findUnique({
    where: { id: appId, ownerId: session.userId }
  });
  if (!app) throw new Error('App not found or unauthorized');

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const prompt = await tx.aIPrompt.create({
      data: {
        appId,
        name: data.name,
        slug: data.slug,
      }
    });

    await tx.aIPromptVersion.create({
      data: {
        promptId: prompt.id,
        version: 1,
        content: data.content,
        isLive: true,
        variantLabel: 'Control',
      }
    });

    return prompt;
  });

  revalidatePath(`/developer/apps/${appId}/prompts`);
  return result;
}

export async function addPromptVersion(promptId: string, appId: string, data: { content: string, variantLabel: string }) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const app = await prisma.oAuthApp.findUnique({
    where: { id: appId, ownerId: session.userId }
  });
  if (!app) throw new Error('App not found or unauthorized');

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const latestVersion = await tx.aIPromptVersion.findFirst({
      where: { promptId },
      orderBy: { version: 'desc' },
      select: { version: true }
    });

    const nextVersionNum = (latestVersion?.version || 0) + 1;

    return await tx.aIPromptVersion.create({
      data: {
        promptId,
        version: nextVersionNum,
        content: data.content,
        variantLabel: data.variantLabel,
        isLive: false
      }
    });
  });

  revalidatePath(`/developer/apps/${appId}/prompts`);
  return result;
}

export async function setLiveVersion(versionId: string, promptId: string, appId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const app = await prisma.oAuthApp.findUnique({
    where: { id: appId, ownerId: session.userId }
  });
  if (!app) throw new Error('App not found or unauthorized');

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.aIPromptVersion.updateMany({
      where: { promptId },
      data: { isLive: false }
    });

    await tx.aIPromptVersion.update({
      where: { id: versionId },
      data: { isLive: true }
    });
  });

  revalidatePath(`/developer/apps/${appId}/prompts`);
  return { success: true };
}
