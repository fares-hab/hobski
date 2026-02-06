import { useState, lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Lazy load route components for better code splitting
const LandingPage = lazy(() => import('./components/LandingPage'));
const About = lazy(() => import('./components/About'));
const LearnerSignup = lazy(() => import('./components/LearnerSignup'));
const MentorSignup = lazy(() => import('./components/MentorSignup'));

// Loading fallback component - uses CSS variables for automatic theme support
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-primary">
      <div className="text-2xl font-bold animate-pulse">Loading...</div>
    </div>
  );
}

// Scroll restoration component
function ScrollToTop() {
  const { pathname, state } = useLocation();
  
  useEffect(() => {
    // Check if we should scroll to a section (from navigation state)
    if (state?.scrollTo) {
      const element = document.getElementById(state.scrollTo);
      if (element) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const offset = headerHeight + 16;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;
        
        setTimeout(() => {
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }, 100);
        return;
      }
    }
    // Default: scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, state]);
  
  return null;
}

function AppContent() {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('hobski-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply theme class to root HTML element and persist to localStorage
  useEffect(() => {
    const root = document.documentElement;
    
    // Update class on <html> element
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Persist to localStorage
    localStorage.setItem('hobski-theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#143269' : '#E6F6FF');
    }
  }, [theme]);

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage 
                theme={theme}
                setTheme={setTheme}
              />
            } 
          />
          <Route 
            path="/about" 
            element={
              <About 
                theme={theme}
                setTheme={setTheme}
              />
            } 
          />
          <Route 
            path="/signup/learner" 
            element={
              <LearnerSignup 
                theme={theme}
                setTheme={setTheme}
              />
            } 
          />
          <Route 
            path="/signup/mentor" 
            element={
              <MentorSignup 
                theme={theme}
                setTheme={setTheme}
              />
            } 
          />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;