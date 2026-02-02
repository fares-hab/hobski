import { useState, useRef, useEffect } from 'react';

/**
 * Image component with skeleton loader and error handling
 * Provides visual feedback while images load
 */
export default function ImageWithSkeleton({ 
  src, 
  alt, 
  className = '',
  skeletonClassName = '',
  loading = 'lazy',
  fetchpriority = 'auto',
  onLoad,
  onError,
  showErrorMessage = true,
  aspectRatio = 'auto', // e.g., '16/9', '1/1', '4/3'
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Handle image load
  const handleLoad = (e) => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) onLoad(e);
  };

  // Handle image error
  const handleError = (e) => {
    setHasError(true);
    setIsLoaded(false);
    console.error(`Failed to load image: ${src}`);
    if (onError) onError(e);
  };

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div 
      className="relative overflow-hidden"
      style={aspectRatio !== 'auto' ? { aspectRatio } : undefined}
    >
      {/* Skeleton Loader - shows while loading */}
      {!isLoaded && !hasError && (
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-lg ${skeletonClassName}`}
          aria-hidden="true"
        />
      )}
      
      {/* Actual Image */}
      {!hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          loading={loading}
          fetchpriority={fetchpriority}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
      
      {/* Error State */}
      {hasError && showErrorMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-lg">
          <svg 
            className="w-12 h-12 text-gray-300 mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <span className="text-gray-400 text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  );
}