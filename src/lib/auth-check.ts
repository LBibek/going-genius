import { getSession } from './session';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

export async function authCheck() {
  const session = await getSession();

  if (!session?.userId) {
    redirect('/auth/login');
  }

  return session;
}

export async function adminCheck() {
  const session = await authCheck();

  if (session.role !== Role.ADMIN) {
    throw new Error('Unauthorized: Admin access required');
  }

  return session;
}

/**
 * Higher-order function for server actions with Zod validation and Auth check
 */
export function createServerAction<TInput, TOutput>(
  schema: import('zod').ZodSchema<TInput>,
  action: (data: TInput, session: import('./definitions').SessionPayload) => Promise<TOutput>,
  requiredRole?: Role
) {
  return async (data: TInput): Promise<TOutput> => {
    const session = await getSession();

    if (!session?.userId) {
      throw new Error('Unauthorized');
    }

    if (requiredRole && session.role !== requiredRole && session.role !== Role.ADMIN) {
      throw new Error('Forbidden');
    }

    const validatedData = schema.parse(data);
    return action(validatedData, session);
  };
}
