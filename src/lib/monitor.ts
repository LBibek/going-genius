/**
 * Performance Monitoring Utility for Going Genius.
 * Tracks execution time of functions and database queries.
 */

export class Monitor {
  static async trace<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      // Log high latency operations ( > 100ms )
      if (duration > 100) {
        console.warn(`[PERF WARNING] ${name} took ${duration.toFixed(2)}ms`);
      } else if (process.env.NODE_ENV === 'development') {
        console.log(`[PERF] ${name}: ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`[PERF ERROR] ${name} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  /**
   * Simple timer for manual instrumentation.
   */
  static start(name: string) {
    const start = performance.now();
    return {
      stop: () => {
        const duration = performance.now() - start;
        console.log(`[PERF] ${name}: ${duration.toFixed(2)}ms`);
        return duration;
      }
    };
  }
}
