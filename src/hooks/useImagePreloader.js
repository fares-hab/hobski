import { useEffect, useState, useCallback } from 'react';

/**
 * Hook for preloading images with progress tracking and priority control
 * @param {string[]} images - Array of image URLs to preload
 * @param {string} priority - 'high', 'low', or 'auto' (default)
 * @param {boolean} decode - Whether to decode images after loading (prevents jank)
 * @returns {object} { loaded, progress, errors }
 */
export function useImagePreloader(images = [], priority = 'auto', decode = true) {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (!images || images.length === 0) {
      setLoaded(true);
      return;
    }

    let cancelled = false;
    const imageElements = [];
    let loadedCount = 0;
    const imageErrors = [];

    const updateProgress = () => {
      loadedCount++;
      if (!cancelled) {
        const newProgress = (loadedCount / images.length) * 100;
        setProgress(Math.round(newProgress));
        
        if (loadedCount === images.length) {
          setLoaded(true);
          if (imageErrors.length > 0) {
            setErrors(imageErrors);
          }
        }
      }
    };

    const preloadImage = async (src) => {
      const img = new Image();
      
      // Set loading priority
      if (priority === 'high') {
        img.fetchPriority = 'high';
      } else if (priority === 'low') {
        img.loading = 'lazy';
      }
      
      img.onload = async () => {
        if (decode && img.decode && !cancelled) {
          try {
            await img.decode();
          } catch (err) {
            console.warn(`Failed to decode image: ${src}`, err);
          }
        }
        updateProgress();
      };
      
      img.onerror = (err) => {
        console.warn(`Failed to preload image: ${src}`, err);
        imageErrors.push({ src, error: err });
        updateProgress(); // Still count it to not block
      };
      
      img.src = src;
      imageElements.push(img);
    };

    // Start preloading all images
    images.forEach(preloadImage);

    // Cleanup function
    return () => {
      cancelled = true;
      imageElements.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [images, priority, decode]);

  return { loaded, progress, errors };
}

/**
 * Hook specifically for theme-based image preloading
 * Preloads images for the target theme before switching
 * @param {string} currentTheme - Current active theme
 * @param {function} getImagePaths - Function that returns image paths for a theme
 * @returns {object} { preloadedTheme, isPreloading, preloadTheme }
 */
export function useThemeImagePreloader(currentTheme, getImagePaths) {
  const [preloadedTheme, setPreloadedTheme] = useState(currentTheme);
  const [isPreloading, setIsPreloading] = useState(false);
  
  const preloadTheme = useCallback(async (targetTheme) => {
    if (targetTheme === preloadedTheme || isPreloading) {
      return Promise.resolve();
    }

    setIsPreloading(true);
    const imagePaths = getImagePaths(targetTheme);
    
    const preloadPromises = imagePaths.map(src => {
      return new Promise((resolve) => {
        const img = new Image();
        img.fetchPriority = 'high';
        
        img.onload = async () => {
          // Decode the image to prevent jank when displaying
          if (img.decode) {
            try {
              await img.decode();
            } catch (err) {
              console.warn(`Failed to decode: ${src}`);
            }
          }
          resolve(true);
        };
        
        img.onerror = () => {
          console.warn(`Failed to preload: ${src}`);
          resolve(false);
        };
        
        img.src = src;
      });
    });

    return Promise.allSettled(preloadPromises).then(() => {
      setPreloadedTheme(targetTheme);
      setIsPreloading(false);
    });
  }, [preloadedTheme, isPreloading, getImagePaths]);

  return { preloadedTheme, isPreloading, preloadTheme };
}

/**
 * Hook for progressive image loading with intersection observer
 * Loads images only when they're about to enter the viewport
 * @param {string} src - Image source URL
 * @param {object} options - Intersection observer options
 * @returns {object} { imageSrc, isLoaded, setImageRef }
 */
export function useLazyImage(src, options = {}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageRef, setImageRef] = useState(null);

  useEffect(() => {
    if (!imageRef || !src) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image();
            img.onload = async () => {
              if (img.decode) {
                try {
                  await img.decode();
                } catch (err) {
                  console.warn(`Failed to decode lazy image: ${src}`);
                }
              }
              setImageSrc(src);
              setIsLoaded(true);
            };
            img.onerror = () => {
              console.error(`Failed to load lazy image: ${src}`);
              setImageSrc(src); // Set it anyway to show broken image state
            };
            img.src = src;
            
            observer.unobserve(imageRef);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
        ...options
      }
    );

    observer.observe(imageRef);

    return () => {
      if (imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, src, options]);

  return { imageSrc, isLoaded, setImageRef };
}