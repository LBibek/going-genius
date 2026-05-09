/**
 * Uploadcare utility for Going Genius.
 * Handles CDN URL formatting and transformation logic.
 */

const CDN_BASE = 'https://ucarecdn.com';

export const uploadcare = {
  /**
   * Formats a raw Uploadcare UUID or URL into an optimized CDN URL.
   * @param source The UUID or URL of the image
   * @param options Transformation options
   */
  getOptimizedUrl: (source: string | null | undefined, options: { width?: number; height?: number; quality?: 'smart' | 'normal' | 'better' | 'best' } = {}) => {
    if (!source) return null;

    // If it's already a full URL but not Uploadcare, return as is
    if (source.startsWith('http') && !source.includes('ucarecdn.com')) {
      return source;
    }

    // Extract UUID if it's a full URL
    let uuid = source;
    if (source.includes('ucarecdn.com')) {
      const parts = source.split('/');
      uuid = parts.find(p => p.length === 36) || uuid;
    }

    // If it doesn't look like a UUID, return as is
    if (uuid.length < 32) return source;

    const { width = 800, height = 800, quality = 'smart' } = options;

    // Base URL with preview modifier for optimization
    return `${CDN_BASE}/${uuid}/-/preview/${width}x${height}/-/quality/${quality}/-/format/auto/`;
  },

  /**
   * Returns the public key for client-side uploads.
   */
  getPublicKey: () => process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || '',

  /**
   * Returns a standard fallback URL or avatar if needed.
   */
  getFallback: (text: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&background=random`;
  }
};
