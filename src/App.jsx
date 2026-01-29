import { useState } from 'react';
import LandingPage from './components/LandingPage';
import About from './components/About';
import LearnerSignup from './components/LearnerSignup';
import MentorSignup from './components/MentorSignup';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [theme, setTheme] = useState('light');

  const handleNavigation = (page) => {
    setCurrentPage(page);
    // Scroll to top when navigating
    window.scrollTo(0, 0);
  };

  return (
    <>
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
    </>
  );
}

export default App;