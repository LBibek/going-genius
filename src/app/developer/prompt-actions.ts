'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

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
    orderBy: { updatedAt: 'desc' }
  });
}

export async function createPrompt(appId: string, name: string, slug: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const prompt = await prisma.aIPrompt.create({
    data: {
      appId,
      name,
      slug,
      versions: {
        create: {
          version: 1,
          content: 'You are a helpful assistant.',
          isLive: true,
          createdBy: session.userId
        }
      }
    }
  });

  revalidatePath(`/developer/apps/${appId}`);
  return prompt;
}

export async function createPromptVersion(promptId: string, content: string, config: any) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const latestVersion = await prisma.aIPromptVersion.findFirst({
    where: { promptId },
    orderBy: { version: 'desc' }
  });

  const newVersion = (latestVersion?.version || 0) + 1;

  const version = await prisma.aIPromptVersion.create({
    data: {
      promptId,
      version: newVersion,
      content,
      config,
      createdBy: session.userId
    },
    include: { prompt: true }
  });

  revalidatePath(`/developer/apps/${version.prompt.appId}`);
  return version;
}

export async function setLiveVersion(promptId: string, versionId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  await prisma.$transaction([
    prisma.aIPromptVersion.updateMany({
      where: { promptId },
      data: { isLive: false }
    }),
    prisma.aIPromptVersion.update({
      where: { id: versionId },
      data: { isLive: true }
    })
  ]);

  const prompt = await prisma.aIPrompt.findUnique({ where: { id: promptId } });
  if (prompt) revalidatePath(`/developer/apps/${prompt.appId}`);
}

export async function deletePrompt(promptId: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const prompt = await prisma.aIPrompt.delete({
    where: { id: promptId }
  });

  revalidatePath(`/developer/apps/${prompt.appId}`);
}
