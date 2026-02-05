import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Sun, Moon } from 'lucide-react';
import { useThemeImagePreloader } from '../hooks/useImagePreloader';

/**
 * Shared Navigation component for all pages
 * 
 * Props:
 * - theme: 'light' | 'dark'
 * - setTheme: function to update theme
 * - variant: 'landing' | 'page' - determines which buttons to show
 * - activeTab: (optional) for landing page step image preloading
 * - onScrollToSection: (optional) function for landing page section scrolling
 */
export default function Navigation({ 
  theme, 
  setTheme, 
  variant = 'page',
  activeTab = 'learner',
  onScrollToSection 
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';

  // Image preloading for smooth theme switching
  const getStepImages = useCallback((themeMode, tab) => {
    const prefix = tab === 'learner' ? 'Learner' : 'Mentor';
    return [
      `/images/${themeMode === 'dark' ? 'Dark' : 'Light'}${prefix}Steps.png`
    ];
  }, []);

  const getCardImages = useCallback((themeMode) => [
    `/images/${themeMode === 'dark' ? 'Dark' : 'Light'}LearnerJoin.webp`,
    `/images/${themeMode === 'dark' ? 'Dark' : 'Light'}MentorJoin.webp`,
  ], []);

  // Smart theme preloader for smooth theme switching (only on landing page)
  const { preloadTheme, isPreloading } = useThemeImagePreloader(
    theme,
    useCallback((targetTheme) => {
      if (variant === 'landing') {
        return [
          ...getStepImages(targetTheme, activeTab),
          ...getCardImages(targetTheme),
        ];
      }
      return []; // Don't preload images on other pages
    }, [getStepImages, getCardImages, activeTab, variant])
  );

  // Handle theme change with optional preloading
  const handleThemeChange = useCallback(async (newTheme) => {
    if (theme === newTheme || isPreloading) return;

    if (variant === 'landing') {
      // Preload target theme images BEFORE switching
      await preloadTheme(newTheme);
    }
    
    // Use requestAnimationFrame for smooth visual transition
    requestAnimationFrame(() => {
      setTheme(newTheme);
    });
  }, [theme, isPreloading, preloadTheme, setTheme, variant]);

  // Preload opposite theme during idle time (landing page only)
  useEffect(() => {
    if (variant !== 'landing') return;

    const oppositeTheme = theme === 'dark' ? 'light' : 'dark';
    
    const schedulePreload = () => {
      preloadTheme(oppositeTheme);
    };

    if ('requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(schedulePreload, {
        timeout: 5000
      });
      return () => window.cancelIdleCallback(idleCallback);
    } else {
      const timeout = setTimeout(schedulePreload, 2000);
      return () => clearTimeout(timeout);
    }
  }, [theme, preloadTheme, variant]);

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleJoinClick = () => {
    if (location.pathname === '/') {
      onScrollToSection?.('get-involved');
    } else {
      navigate('/', { state: { scrollTo: 'get-involved' } });
    }
  };

  const handleContactClick = () => {
    if (location.pathname === '/') {
      onScrollToSection?.('contact');
    } else {
      navigate('/', { state: { scrollTo: 'contact' } });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 ${
        isDark ? 'border-gray-800' : 'border-blue-80'
      }`}
      style={{ 
        backgroundColor: isDark ? '#143269' : '#E6F6FF'
      }}
    >
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <button 
          onClick={handleLogoClick}
          className="text-2xl sm:text-4xl font-bold hover:opacity-80 px-2 sm:px-6"
          style={{ transition: 'opacity 0.2s', color: isDark ? '#C7DBFF' : '#143269' }}
        >
          hobski
        </button>
        <div className="flex gap-2 sm:gap-6 items-center">
          {/* Theme Toggle */}
          <button 
            onClick={() => handleThemeChange(isDark ? 'light' : 'dark')}
            className={`p-2 rounded-full ${
              isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            } ${isPreloading ? 'opacity-50 cursor-wait' : ''}`}
            style={{ transition: 'background-color 0.2s' }}
            aria-label="Toggle theme"
            disabled={isPreloading}
          >
            {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {variant === 'landing' ? (
            <>
              {/* Landing Page Navigation */}
              <button 
                onClick={handleJoinClick}
                className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium ${
                  isDark 
                    ? 'hover:opacity-80' 
                    : 'bg-[#143269] text-white hover:opacity-80'
                }`}
                style={isDark 
                  ? { backgroundColor: '#C7DBFF', color: '#143269', transition: 'opacity 0.2s' } 
                  : { transition: 'background-color 0.2s', color: 'white' }
                }
              >
                Join
              </button>
              <button 
                onClick={() => navigate('/about')}
                className={`px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base ${
                  isDark ? 'hover:opacity-80' : 'hover:opacity-80'
                }`}
                style={{ transition: 'color 0.2s', color: isDark ? '#C7DBFF' : '#143269' }}
              >
                About
              </button>
              <button 
                onClick={handleContactClick}
                className={`px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base ${
                  isDark ? 'hover:opacity-80' : 'hover:opacity-80'
                }`}
                style={{ transition: 'color 0.2s', color: isDark ? '#C7DBFF' : '#143269' }}
              >
                Contact
              </button>
            </>
          ) : (
            <>
              {/* Page Navigation (About, Signup pages) */}
              <button 
                onClick={() => navigate('/')}
                className={`flex items-center gap-2 px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base transition-colors ${
                  isDark ? 'hover:opacity-80' : 'hover:text-gray-600'
                }`}
                style={isDark 
                  ? { color: '#C7DBFF', transition: 'color 0.2s' } 
                  : { color: '#143269', transition: 'color 0.2s' }
                }
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Home
              </button>
              {location.pathname !== '/about' && (
                <button 
                  onClick={() => navigate('/about')}
                  className={`px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base transition-colors ${
                    isDark ? 'text-white hover:text-gray-300' : 'hover:text-gray-600'
                  }`}
                  style={!isDark 
                    ? { color: '#143269', transition: 'color 0.2s' } 
                    : { transition: 'color 0.2s' }
                  }
                >
                  About
                </button>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
