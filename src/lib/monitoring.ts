/**
 * Sentry monitoring utilities for the Going Genius platform.
 * Import from here instead of directly from @sentry/nextjs to keep a clean abstraction.
 */
import * as Sentry from '@sentry/nextjs';

export { Sentry };

/**
 * Capture an exception with rich context.
 * Use this for all non-fatal errors that should be tracked but not crash the app.
 */
export function captureError(
  error: unknown,
  context?: {
    userId?: string;
    appId?: string;
    action?: string;
    extra?: Record<string, unknown>;
  }
) {
  Sentry.withScope((scope) => {
    if (context?.userId) scope.setUser({ id: context.userId });
    if (context?.appId) scope.setTag('app_id', context.appId);
    if (context?.action) scope.setTag('action', context.action);
    if (context?.extra) scope.setExtras(context.extra);
    Sentry.captureException(error);
  });
}

/**
 * Capture a custom event (non-error) for business metrics.
 * e.g. Track when a refund is processed or a lead is captured.
 */
export function captureEvent(
  message: string,
  data?: Record<string, unknown>
) {
  Sentry.captureMessage(message, {
    level: 'info',
    extra: data,
  });
}

/**
 * Wrap an async server action in Sentry tracing.
 * Returns the result or re-throws after capturing the error.
 */
export async function withSentryTrace<T>(
  name: string,
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  return Sentry.startSpan({ name, op: operation }, fn);
}
