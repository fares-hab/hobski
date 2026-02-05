import { useState, lazy, Suspense, useEffect } from 'react';

// Lazy load route components for better code splitting
const LandingPage = lazy(() => import('./components/LandingPage'));
const About = lazy(() => import('./components/About'));
const LearnerSignup = lazy(() => import('./components/LearnerSignup'));
const MentorSignup = lazy(() => import('./components/MentorSignup'));

// Loading fallback component
function PageLoader({ isDark }) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: isDark ? '#143269' : '#E6F6FF',
        color: isDark ? '#C7DBFF' : '#143269'
      }}
    >
      <div className="text-2xl font-bold animate-pulse">Loading...</div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('hobski-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Persist theme to localStorage
  useEffect(() => {
    localStorage.setItem('hobski-theme', theme);
    // Update meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#143269' : '#E6F6FF');
    }
  }, [theme]);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const isDark = theme === 'dark';

  return (
    <Suspense fallback={<PageLoader isDark={isDark} />}>
      {currentPage === 'landing' && (
        <LandingPage 
          onNavigate={handleNavigation} 
          theme={theme}
          setTheme={setTheme}
        />
      )}
      {currentPage === 'about' && (
        <About 
          onNavigate={handleNavigation}
          theme={theme}
          setTheme={setTheme}
        />
      )}
      {currentPage === 'learner-signup' && (
        <LearnerSignup 
          onNavigate={handleNavigation}
          theme={theme}
          setTheme={setTheme}
        />
      )}
      {currentPage === 'mentor-signup' && (
        <MentorSignup 
          onNavigate={handleNavigation}
          theme={theme}
          setTheme={setTheme}
        />
      )}
    </Suspense>
  );
}

export default App;