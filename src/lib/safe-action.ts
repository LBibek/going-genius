import { getSession } from './session';
import { z } from 'zod';
import { captureError } from './monitoring';

export interface ActionState<T> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Creates a type-safe Server Action wrapped in validation, authentication, and monitoring.
 */
export function createSafeAction<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  handler: (data: TInput, userId: string, role: string) => Promise<TOutput>
) {
  return async (input: TInput): Promise<ActionState<TOutput>> => {
    try {
      // 1. Zod Validation
      const parsed = schema.safeParse(input);
      if (!parsed.success) {
        const fieldErrors: Record<string, string[]> = {};
        parsed.error.issues.forEach((err) => {
          const path = err.path.join('.');
          if (!fieldErrors[path]) {
            fieldErrors[path] = [];
          }
          fieldErrors[path].push(err.message);
        });

        return {
          success: false,
          error: 'Validation failed.',
          fieldErrors,
        };
      }

      // 2. Authentication Check
      const session = await getSession();
      if (!session || !session.userId) {
        return {
          success: false,
          error: 'Unauthorized access. Please log in.',
        };
      }

      // 3. Execute handler
      const result = await handler(parsed.data, session.userId, session.role);
      
      return {
        success: true,
        data: result,
      };
    } catch (err: any) {
      // Log failure to monitoring system using our Sentry wrapper
      captureError(err, {
        userId: (await getSession())?.userId,
        action: 'safeActionExecution',
      });

      return {
        success: false,
        error: err.message || 'An unexpected database or server error occurred.',
      };
    }
  };
}

