'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src?: string | null;
  fallbackIcon?: React.ReactNode;
}

/**
 * OptimizedImage component that wraps next/image with additional logic:
 * 1. Automatic Uploadcare URL optimization (if applicable)
 * 2. Error handling with fallback support
 * 3. Consistent styling for avatars and logos
 */
export function OptimizedImage({ 
  src, 
  alt, 
  fallbackIcon, 
  className, 
  ...props 
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  // If no source is provided, or an error occurred, show fallback
  if (!src || error) {
    const size = typeof props.width === 'number' ? props.width : 40;
    return (
      <div className={`image-fallback ${className}`} style={{ width: props.width, height: props.height, fontSize: size > 50 ? '2rem' : '1rem' }}>
        {fallbackIcon || (typeof alt === 'string' ? alt.slice(0, 1).toUpperCase() : '?')}
        <style jsx>{`
          .image-fallback {
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--primary);
            color: #000;
            font-weight: 800;
            border-radius: 8px;
            overflow: hidden;
          }
        `}</style>
      </div>
    );
  }

  // Handle Uploadcare optimization
  let optimizedSrc = src;
  if (typeof src === 'string' && src.includes('ucarecdn.com')) {
    // Add quality and preview transformations if not already present
    if (!src.includes('-/preview/')) {
      const w = props.width && typeof props.width === 'number' ? props.width : 400;
      const h = props.height && typeof props.height === 'number' ? props.height : 400;
      optimizedSrc = `${src}-/preview/${w}x${h}/-/quality/smart/-/format/auto/`;
    }
  }

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
