import { useCallback, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Sun, Moon } from 'lucide-react';

/**
 * Shared Navigation component for all pages
 * Uses CSS variables for theming - colors update automatically when theme class changes
 * Memoized to prevent unnecessary re-renders
 * 
 * Props:
 * - theme: 'light' | 'dark' - for theme toggle
 * - setTheme: function to update theme
 * - variant: 'landing' | 'page' - determines which buttons to show
 * - activeTab: (optional) for tab state on landing page
 * - onScrollToSection: (optional) function for landing page section scrolling
 */
const Navigation = memo(function Navigation({ 
  theme, 
  setTheme, 
  variant = 'page',
  activeTab = 'learner',
  onScrollToSection 
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';

  // Simple theme change handler
  const handleThemeChange = useCallback((newTheme) => {
    if (theme === newTheme) return;
    setTheme(newTheme);
  }, [theme, setTheme]);

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-theme-primary overflow-hidden">
      <nav className="max-w-7xl mx-auto px-2 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <button 
          onClick={handleLogoClick}
          className="text-2xl sm:text-4xl font-bold text-primary hover:opacity-80 px-1 sm:px-6 transition-opacity flex-shrink-0"
        >
          hobski
        </button>
        <div className="flex gap-1 sm:gap-6 items-center">
          {/* Theme Toggle */}
          <button 
            onClick={() => handleThemeChange(isDark ? 'light' : 'dark')}
            className="p-2 rounded-full text-primary hover:bg-theme-hover-bg transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {variant === 'landing' ? (
            <>
              {/* Landing Page Navigation */}
              <button 
                onClick={handleJoinClick}
                className="px-2 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium bg-theme-accent text-theme-on-accent hover:opacity-80 transition-opacity"
              >
                Join
              </button>
              <button
                onClick={() => navigate('/about')}
                className="px-2 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base text-primary hover:opacity-80 transition-opacity"
              >
                About
              </button>
              <button
                onClick={handleContactClick}
                className="px-2 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base text-primary hover:opacity-80 transition-opacity"
              >
                Contact
              </button>
            </>
          ) : (
            <>
              {/* Page Navigation (About, Signup pages) */}
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base text-primary hover:opacity-80 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Home
              </button>
              {location.pathname !== '/about' && (
                <button 
                  onClick={() => navigate('/about')}
                  className="px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base text-primary hover:opacity-80 transition-opacity"
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
});

export default Navigation;
