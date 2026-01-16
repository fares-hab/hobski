import { useState } from 'react';
import LandingPage from './components/LandingPage';
import LearnerSignup from './components/LearnerSignup';
import MentorSignup from './components/MentorSignup';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  return (
    <div>
      {currentPage === 'landing' && <LandingPage onNavigate={setCurrentPage} />}
      {currentPage === 'learner-signup' && <LearnerSignup onNavigate={setCurrentPage} />}
      {currentPage === 'mentor-signup' && <MentorSignup onNavigate={setCurrentPage} />}
    </div>
  );
}

export default App;