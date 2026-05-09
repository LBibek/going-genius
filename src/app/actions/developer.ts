/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { z } from 'zod';
import crypto from 'crypto';
import { Monitor } from '@/lib/monitor';

const AppSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  redirectUris: z.string().transform((val) => val.split(',').map(s => s.trim()).filter(Boolean)),
  logoUrl: z.string().url().optional().or(z.literal('')),
});

export async function createApp(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  const validatedFields = AppSchema.safeParse({
    name: formData.get('name'),
    redirectUris: formData.get('redirectUris'),
    logoUrl: formData.get('logoUrl'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  return await Monitor.trace('createApp', async () => {
    const { name, redirectUris, logoUrl } = validatedFields.data;

    const app = await prisma.oAuthApp.create({
      data: {
        name,
        redirectUris,
        logoUrl: logoUrl || null,
        ownerId: session.userId,
        clientSecret: crypto.randomBytes(32).toString('hex'),
      },
    });

    revalidatePath('/developer');
    redirect(`/developer/apps/${app.id}`);
  });
}

export async function updateApp(appId: string, prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
  if (!app || app.ownerId !== session.userId) return { message: 'Forbidden' };

  const validatedFields = AppSchema.safeParse({
    name: formData.get('name'),
    redirectUris: formData.get('redirectUris'),
    logoUrl: formData.get('logoUrl'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { name, redirectUris, logoUrl } = validatedFields.data;

  await prisma.oAuthApp.update({
    where: { id: appId },
    data: { name, redirectUris, logoUrl: logoUrl || null },
  });

  revalidatePath(`/developer/apps/${appId}`);
  return { success: true, message: 'App updated successfully' };
}

export async function deleteApp(appId: string) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
  if (!app || app.ownerId !== session.userId) return { message: 'Forbidden' };

  await Monitor.trace('deleteApp', async () => {
    await prisma.oAuthApp.delete({ where: { id: appId } });

    revalidatePath('/developer');
    redirect('/developer');
  });
}

export async function updateAppUser(appId: string, userId: string, metadata: any) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
  if (!app || app.ownerId !== session.userId) return { message: 'Forbidden' };

  await prisma.appUser.update({
    where: { appId_userId: { appId, userId } },
    data: { metadata },
  });

  revalidatePath(`/developer/apps/${appId}/users`);
}

export async function deleteAppUser(appId: string, userId: string) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
  if (!app || app.ownerId !== session.userId) return { message: 'Forbidden' };

  // Soft delete / revoke access
  await prisma.appUser.update({
    where: { appId_userId: { appId, userId } },
    data: { isActive: false },
  });

  // Also revoke tokens
  await prisma.oAuthToken.deleteMany({
    where: { appId, userId },
  });

  revalidatePath(`/developer/apps/${appId}/users`);
}

export async function regenerateClientSecret(appId: string) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
  if (!app || app.ownerId !== session.userId) return { message: 'Forbidden' };

  const newSecret = crypto.randomBytes(32).toString('hex');

  await prisma.oAuthApp.update({
    where: { id: appId },
    data: { clientSecret: newSecret },
  });

  revalidatePath(`/developer/apps/${appId}`);
  return { success: true, secret: newSecret };
}

export async function createAppInvite(appId: string, email?: string) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
  if (!app || app.ownerId !== session.userId) return { message: 'Forbidden' };

  const invite = await prisma.appInvite.create({
    data: {
      appId,
      email: email || null,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  revalidatePath(`/developer/apps/${appId}`);
  return { success: true, invite };
}

export async function deleteAppInvite(inviteId: string) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  const invite = await prisma.appInvite.findUnique({
    where: { id: inviteId },
    include: { app: true }
  });

  if (!invite || invite.app.ownerId !== session.userId) return { message: 'Forbidden' };

  await prisma.appInvite.delete({ where: { id: inviteId } });

  revalidatePath(`/developer/apps/${invite.appId}`);
  return { success: true };
}

export async function addAppUserDirectly(appId: string, identifier: string) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
  if (!app || app.ownerId !== session.userId) return { message: 'Forbidden' };

  // Find existing GGUser by email or username
  const user = await prisma.gGUser.findFirst({
    where: { OR: [{ email: identifier }, { username: identifier }] }
  });

  if (!user) return { message: 'User not found. Try sending an invite link instead.' };

  await prisma.appUser.upsert({
    where: { appId_userId: { appId, userId: user.id } },
    update: { isActive: true },
    create: { appId, userId: user.id },
  });

  revalidatePath(`/developer/apps/${appId}`);
  return { success: true, message: `Successfully added ${user.displayName} to your app.` };
}

export async function manualCreateAppUser(appId: string, data: { email: string, displayName: string, username?: string }) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
  if (!app || app.ownerId !== session.userId) return { message: 'Forbidden' };

  // Check if user exists
  let user = await prisma.gGUser.findUnique({ where: { email: data.email } });

  if (!user) {
    // Create new user (Manual creation by developer)
    const baseUsername = data.username || data.email.split('@')[0] + Math.random().toString(36).substring(2, 5);
    user = await prisma.gGUser.create({
      data: {
        email: data.email,
        displayName: data.displayName,
        username: baseUsername.toLowerCase(),
        passwordHash: null, // No password set yet
        emailVerified: true, // Marked as verified by dev
      }
    });
  }

  await prisma.appUser.upsert({
    where: { appId_userId: { appId, userId: user.id } },
    update: { isActive: true },
    create: { appId, userId: user.id },
  });

  revalidatePath(`/developer/apps/${appId}`);
  return { success: true, message: `Successfully created and added ${user.displayName}.` };
}

export async function editAppUserInfo(appId: string, userId: string, data: { displayName: string, metadata?: any }) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
  if (!app || app.ownerId !== session.userId) return { message: 'Forbidden' };

  // Update linked user's display name (optional: might be restricted in some cases)
  await prisma.gGUser.update({
    where: { id: userId },
    data: { displayName: data.displayName }
  });

  // Update app-specific metadata
  await prisma.appUser.update({
    where: { appId_userId: { appId, userId } },
    data: { metadata: data.metadata || {} }
  });

  revalidatePath(`/developer/apps/${appId}`);
  return { success: true, message: 'User updated successfully.' };
}

export async function updateAppPaymentProviders(appId: string, data: {
  khaltiPublicKey?: string,
  khaltiSecretKey?: string,
  esewaMerchantId?: string,
  esewaSecretKey?: string
}) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
  if (!app || app.ownerId !== session.userId) return { message: 'Forbidden' };
  if (!app.isPremium) return { message: 'Upgrade to Premium to access payment settings.' };

  await prisma.oAuthApp.update({
    where: { id: appId },
    data: {
      khaltiPublicKey: data.khaltiPublicKey || null,
      khaltiSecretKey: data.khaltiSecretKey || null,
      esewaMerchantId: data.esewaMerchantId || null,
      esewaSecretKey: data.esewaSecretKey || null,
    },
  });

  revalidatePath(`/developer/apps/${appId}`);
  return { success: true, message: 'Payment providers updated.' };
}

export async function updateAppSocialProviders(appId: string, data: {
  googleClientId?: string,
  googleClientSecret?: string,
  githubClientId?: string,
  githubClientSecret?: string,
  steamApiKey?: string
}) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
  if (!app || app.ownerId !== session.userId) return { message: 'Forbidden' };

  await prisma.oAuthApp.update({
    where: { id: appId },
    data: {
      googleClientId: data.googleClientId || null,
      googleClientSecret: data.googleClientSecret || null,
      githubClientId: data.githubClientId || null,
      githubClientSecret: data.githubClientSecret || null,
      steamApiKey: data.steamApiKey || null,
    },
  });

  revalidatePath(`/developer/apps/${appId}`);
  return { success: true, message: 'Social providers updated.' };
}

export async function updateAppAIAgents(appId: string, data: {
  openaiApiKey?: string,
  geminiApiKey?: string,
  anthropicApiKey?: string,
  deepseekApiKey?: string,
  systemPrompt?: string
}) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
  if (!app || app.ownerId !== session.userId) return { message: 'Forbidden' };

  await prisma.oAuthApp.update({
    where: { id: appId },
    data: {
      openaiApiKey: data.openaiApiKey || null,
      geminiApiKey: data.geminiApiKey || null,
      anthropicApiKey: data.anthropicApiKey || null,
      deepseekApiKey: data.deepseekApiKey || null,
      systemPrompt: data.systemPrompt || null,
    },
  });

  revalidatePath(`/developer/apps/${appId}`);
  return { success: true, message: 'AI Agent configurations updated.' };
}

export async function createAppSubscriptionPlan(appId: string, data: {
  name: string,
  description?: string,
  price: number,
  interval: string,
  features: string[]
}) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
  if (!app || app.ownerId !== session.userId) return { message: 'Forbidden' };

  await prisma.subscriptionPlan.create({
    data: {
      appId,
      name: data.name,
      description: data.description,
      price: data.price,
      interval: data.interval,
      features: data.features
    }
  });

  revalidatePath(`/developer/apps/${appId}`);
  return { success: true, message: 'Subscription plan created.' };
}

export async function deleteAppSubscriptionPlan(appId: string, planId: string) {
  const session = await getSession();
  if (!session) return { message: 'Unauthorized' };

  const app = await prisma.oAuthApp.findUnique({ where: { id: appId } });
  if (!app || app.ownerId !== session.userId) return { message: 'Forbidden' };

  await prisma.subscriptionPlan.delete({
    where: { id: planId }
  });

  revalidatePath(`/developer/apps/${appId}`);
  return { success: true, message: 'Plan deleted.' };
}
