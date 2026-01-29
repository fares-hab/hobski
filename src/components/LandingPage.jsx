import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HobskiLanding({ onNavigate, theme, setTheme }) {
  const [activeTab, setActiveTab] = useState('learner');
  const [isMobile, setIsMobile] = useState(() => {
    // Initialize with correct value to prevent flash of wrong component
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });
  
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 120; // Offset to position section lower in viewport
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const isDark = theme === 'dark';

  return (
    <div 
      className={`min-h-screen font-['Inter',sans-serif] transition-colors ${
        isDark ? 'text-white' : ''
      }`}
      style={isDark ? { backgroundColor: '#143269', color: 'white' } : { backgroundColor: '#E6F6FF', color: '#143269' }}
    >
      {/* Header */}
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
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-2xl sm:text-4xl font-bold hover:opacity-80 px-2 sm:px-6"
            style={{ transition: 'opacity 0.2s' }}
          >
            hobski
          </button>
          <div className="flex gap-2 sm:gap-6 items-center">
            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-2 rounded-full ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
              style={{ transition: 'background-color 0.2s' }}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button 
              onClick={() => scrollToSection('get-involved')}
              className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium ${
                isDark 
                  ? 'bg-white hover:bg-gray-200' 
                  : 'bg-[#143269] text-white hover:opacity-80'
              }`}
              style={{ transition: 'background-color 0.2s', color: isDark ? '#143269' : 'white' }}
            >
              Join
            </button>
            <button 
              onClick={() => onNavigate('about')}
              className={`px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base ${
              isDark ? 'text-white hover:text-gray-300' : 'hover:opacity-80'
            }`}
              style={{ transition: 'color 0.2s', color: isDark ? 'white' : '#143269' }}
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className={`px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base ${
                isDark ? 'text-white hover:text-gray-300' : 'hover:opacity-80'
              }`}
              style={{ transition: 'color 0.2s', color: isDark ? 'white' : '#143269' }}
            >
              Contact
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section with GSAP ScrollTrigger */}
      {isMobile ? (
        <MobileHeroSection isDark={isDark} scrollToSection={scrollToSection} />
      ) : (
        <GSAPHeroSection 
          isDark={isDark} 
          scrollToSection={scrollToSection}
        />
      )}

      {/* SVG definitions for wavy clip paths */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="wavy-top-bottom" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.05 Q 0.05,0.02 0.1,0.05 T 0.2,0.05 Q 0.25,0.08 0.3,0.05 T 0.4,0.05 Q 0.45,0.02 0.5,0.05 T 0.6,0.05 Q 0.65,0.08 0.7,0.05 T 0.8,0.05 Q 0.85,0.02 0.9,0.05 T 1,0.05 L 1,0.95 Q 0.95,0.98 0.9,0.95 T 0.8,0.95 Q 0.75,0.92 0.7,0.95 T 0.6,0.95 Q 0.55,0.98 0.5,0.95 T 0.4,0.95 Q 0.35,0.92 0.3,0.95 T 0.2,0.95 Q 0.15,0.98 0.1,0.95 T 0,0.95 Z" />
          </clipPath>
          <clipPath id="wavy-top-bottom-mobile" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.02 Q 0.25,0.01 0.5,0.02 T 1,0.02 L 1,0.98 Q 0.75,0.99 0.5,0.98 T 0,0.98 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* How Does It Work Section */}
      <div style={{ 
        backgroundColor: isDark ? '#3F60CF' : '#B7D0FF',
        marginTop: '-1.5rem',
        marginBottom: '-1.5rem',
        paddingTop: '3rem',
        paddingBottom: '3rem',
        clipPath: isMobile ? 'url(#wavy-top-bottom-mobile)' : 'url(#wavy-top-bottom)'
      }}>
        <ScrollSection 
            id="how-it-works" 
            isDark={isDark}
          >
            <div className="max-w-7xl mx-auto px-5 sm:px-12">
            <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold mb-8">
              How does it work?
            </h2>

            {/* Tab Buttons */}
            <div className="max-w-7xl mx-auto mb-10">
              <div className="flex gap-0">
                <button
                  onClick={() => setActiveTab('learner')}
                  className={`flex-1 px-8 py-3 font-semibold transition-all text-xl ${
                    activeTab === 'learner'
                      ? 'text-white z-10'
                      : isDark
                        ? 'text-[#143269] hover:bg-white/10'
                        : 'text-[#143269] hover:opacity-80'
                  }`}
                  style={{ 
                    borderRadius: '9999px 0 0 9999px',
                    backgroundColor: activeTab === 'learner' 
                      ? '#0D2A5E'
                      : (isDark ? 'white' : '#E6F6FF'),
                    position: 'relative',
                    transform: activeTab === 'learner' ? 'scaleX(1.05) scaleY(1.05)' : 'scale(1)',
                    transformOrigin: 'right center'
                  }}
                >
                  Learner
                </button>
                <button
                  onClick={() => setActiveTab('mentor')}
                  className={`flex-1 px-8 py-3 font-semibold transition-all text-xl ${
                    activeTab === 'mentor'
                      ? 'text-white z-10'
                      : isDark
                        ? 'text-[#143269] hover:bg-white/10'
                        : 'text-[#143269] hover:opacity-80'
                  }`}
                  style={{ 
                    borderRadius: '0 9999px 9999px 0',
                    backgroundColor: activeTab === 'mentor' 
                      ? '#0D2A5E'
                      : (isDark ? 'white' : '#E6F6FF'),
                    position: 'relative',
                    transform: activeTab === 'mentor' ? 'scaleX(1.05) scaleY(1.05)' : 'scale(1)',
                    transformOrigin: 'left center'
                  }}
                >
                  Mentor
                </button>
              </div>
            </div>

            {/* 4-Step Process */}
            {activeTab === 'learner' ? (
              <>
                {/* Desktop Grid View */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                {/* Step 1 */}
                <div className="flex flex-col items-start relative">
                  <h3 className="text-xl font-bold mb-6" style={{ color: isDark ? 'white' : '#143269' }}>
                    1. Find your hobby
                  </h3>
                  
                  {/* Image Placeholder */}
                  <div className="w-full aspect-square rounded-lg mb-6 flex items-center justify-center">
                    <img 
                      src={`/images/${isDark ? 'Dark' : 'Light'}LearnerStep1.png`} 
                      alt="Find your hobby illustration"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-gray-600 text-sm">Image</span>';
                      }}
                    />
                  </div>
                  
                  <p className="text-lg font-normal leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.9)' : '#143269' }}>
                    Got a hobby or project in mind? Just type it into our search bar, or browse through our categories for inspiration!
                  </p>
                  
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-start relative">
                  <h3 className="text-xl font-bold mb-6" style={{ color: isDark ? 'white' : '#143269' }}>
                    2. Browse mentors
                  </h3>
                  
                  {/* Image Placeholder */}
                  <div className="w-full aspect-square rounded-lg mb-6 flex items-center justify-center">
                    <img 
                      src={`/images/${isDark ? 'Dark' : 'Light'}LearnerStep2.png`} 
                      alt="Browse mentors illustration"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-gray-600 text-sm">Image</span>';
                      }}
                    />
                  </div>
                  
                  <p className="text-lg font-normal leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.9)' : '#143269' }}>
                    Take a look at available mentors and browse their portfolios, rates, schedules, resources, and reviews!
                  </p>
                  
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-start relative">
                  <h3 className="text-xl font-bold mb-6" style={{ color: isDark ? 'white' : '#143269' }}>
                    3. Book a session
                  </h3>
                  
                  {/* Image Placeholder */}
                  <div className="w-full aspect-square rounded-lg mb-6 flex items-center justify-center">
                    <img 
                      src={`/images/${isDark ? 'Dark' : 'Light'}LearnerStep3.png`} 
                      alt="Book a session illustration"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-gray-600 text-sm">Image</span>';
                      }}
                    />
                  </div>
                  
                  <p className="text-lg font-normal leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.9)' : '#143269' }}>
                    Request a session with a mentor. Outline your goals, resources, session preferences, and chat with your mentor before confirming!
                  </p>
                  
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-start">
                  <h3 className="text-xl font-bold mb-6" style={{ color: isDark ? 'white' : '#143269' }}>
                    4. Get learning!
                  </h3>
                  
                  {/* Image Placeholder */}
                  <div className="w-full aspect-square rounded-lg mb-6 flex items-center justify-center">
                    <img 
                      src={`/images/${isDark ? 'Dark' : 'Light'}BothStep4.png`} 
                      alt="Get learning illustration"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-gray-600 text-sm">Image</span>';
                      }}
                    />
                  </div>
                  
                  <p className="text-lg font-normal leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.9)' : '#143269' }}>
                    Meet in-person or virtually, depending on your preferences, and get learning!
                  </p>
                </div>
              </div>

              {/* Mobile Carousel View */}
              <MobileStepCarousel 
                isDark={isDark}
                activeTab={activeTab}
                steps={[
                  {
                    number: 1,
                    title: 'Find your hobby',
                    image: `/images/${isDark ? 'Dark' : 'Light'}LearnerStep1.png`,
                    description: 'Got a hobby or project in mind? Just type it into our search bar, or browse through our categories for inspiration!'
                  },
                  {
                    number: 2,
                    title: 'Browse mentors',
                    image: `/images/${isDark ? 'Dark' : 'Light'}LearnerStep2.png`,
                    description: 'Take a look at available mentors and browse their portfolios, rates, schedules, resources, and reviews!'
                  },
                  {
                    number: 3,
                    title: 'Book a session',
                    image: `/images/${isDark ? 'Dark' : 'Light'}LearnerStep3.png`,
                    description: 'Request a session with a mentor. Outline your goals, resources, session preferences, and chat with your mentor before confirming!'
                  },
                  {
                    number: 4,
                    title: 'Get learning!',
                    image: `/images/${isDark ? 'Dark' : 'Light'}BothStep4.png`,
                    description: 'Meet in-person or virtually, depending on your preferences, and get learning!'
                  }
                ]}
              />
              </>
            ) : (
              <>
              {/* Desktop Grid View */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                {/* Mentor Step 1 */}
                <div className="flex flex-col items-start relative">
                  <h3 className="text-xl font-bold mb-6" style={{ color: isDark ? 'white' : '#143269' }}>
                    1. Find your skill OR Create one
                  </h3>
                  
                  {/* Image Placeholder */}
                  <div className="w-full aspect-square rounded-lg mb-6 flex items-center justify-center">
                    <img 
                      src={`/images/${isDark ? 'Dark' : 'Light'}MentorStep1.png`} 
                      alt="Mentor step 1 illustration"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-gray-600 text-sm">Image</span>';
                      }}
                    />
                  </div>
                  
                  <p className="text-lg font-normal leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.9)' : '#143269'}}>
                    Browse through our skill categories and choose yours. If you can’t find it, request to add a new one to our list!
                  </p>
                  
                </div>

                {/* Mentor Step 2 */}
                <div className="flex flex-col items-start relative">
                  <h3 className="text-xl font-bold mb-6" style={{ color: isDark ? 'white' : '#143269' }}>
                    2. Set up your profile
                  </h3>
                  
                  {/* Image Placeholder */}
                  <div className="w-full aspect-square rounded-lg mb-6 flex items-center justify-center">
                    <img 
                      src={`/images/${isDark ? 'Dark' : 'Light'}MentorStep2.png`} 
                      alt="Mentor step 2 illustration"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-gray-600 text-sm">Image</span>';
                      }}
                    />
                  </div>
                  
                  <p className="text-lg font-normal leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.9)' : '#143269' }}>
                    Demonstrate your skill. Pick your skill level, rate, schedule, and outline your session preferences (resources offered, session size, and location).
                  </p>
                  
                </div>

                {/* Mentor Step 3 */}
                <div className="flex flex-col items-start relative">
                  <h3 className="text-xl font-bold mb-6" style={{ color: isDark ? 'white' : '#143269' }}>
                    3. Chat with learners
                  </h3>
                  
                  {/* Image Placeholder */}
                  <div className="w-full aspect-square rounded-lg mb-6 flex items-center justify-center">
                    <img 
                      src={`/images/${isDark ? 'Dark' : 'Light'}MentorStep3.png`} 
                      alt="Mentor step 3 illustration"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-gray-600 text-sm">Image</span>';
                      }}
                    />
                  </div>
                  
                  <p className="text-lg font-normal leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.9)' : '#143269'}}>
                    Start a conversation with learners when they’ve requested a session and discuss goals and sessions details before confirming!
                  </p>
                  
                </div>

                {/* Mentor Step 4 */}
                <div className="flex flex-col items-start">
                  <h3 className="text-xl font-bold mb-6" style={{ color: isDark ? 'white' : '#143269' }}>
                    4. Get mentoring!
                  </h3>
                  
                  {/* Image Placeholder */}
                  <div className="w-full aspect-square rounded-lg mb-6 flex items-center justify-center">
                    <img 
                      src={`/images/${isDark ? 'Dark' : 'Light'}BothStep4.png`} 
                      alt="Mentor step 4 illustration"
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-gray-600 text-sm">Image</span>';
                      }}
                    />
                  </div>
                  
                  <p className="text-lg font-normal leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.9)' : '#143269' }}>
                    Meet your learners in-person or virtually, depending on your preferences, and get mentoring!
                  </p>
                </div>
              </div>

              {/* Mobile Carousel View */}
              <MobileStepCarousel 
                isDark={isDark}
                activeTab={activeTab}
                steps={[
                  {
                    number: 1,
                    title: 'Find your skill OR Create one',
                    image: `/images/${isDark ? 'Dark' : 'Light'}MentorStep1.png`,
                    description: 'Browse through our skill categories and choose yours. If you can\'t find it, request to add a new one to our list!'
                  },
                  {
                    number: 2,
                    title: 'Set up your profile',
                    image: `/images/${isDark ? 'Dark' : 'Light'}MentorStep2.png`,
                    description: 'Demonstrate your skill. Pick your skill level, rate, schedule, and outline your session preferences (resources offered, session size, and location).'
                  },
                  {
                    number: 3,
                    title: 'Chat with learners',
                    image: `/images/${isDark ? 'Dark' : 'Light'}MentorStep3.png`,
                    description: 'Start a conversation with learners when they\'ve requested a session and discuss goals and sessions details before confirming!'
                  },
                  {
                    number: 4,
                    title: 'Get mentoring!',
                    image: `/images/${isDark ? 'Dark' : 'Light'}BothStep4.png`,
                    description: 'Meet your learners in-person or virtually, depending on your preferences, and get mentoring!'
                  }
                ]}
              />
              </>
            )}

          </div>
        </ScrollSection>
      </div>

        {/* Get Involved Section */}
        <div style={{ 
          backgroundColor: isDark ? '#0D2A5E' : '#E6F6FF',
          marginTop: '-4rem',
          paddingTop: '3rem'
        }}>
          <ScrollSection 
            id="get-involved" 
            isDark={isDark}
          >
            <div className="max-w-7xl mx-auto px-5 sm:px-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get involved
            </h2>
            <p className={`text-2xl mb-12 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Got a hobby or skill you're interested in? Join us!
            </p>

            <div className="flex gap-8 justify-center items-stretch">
              {/* As a Learner Card */}
              <button 
              onClick={() => onNavigate('learner-signup')}
              className={`group rounded-2xl p-8 text-left transition-all hover:scale-105 transform w-full max-w-md border-2 ${
                isDark 
                  ? 'border-gray-700 hover:border-white' 
                  : 'bg-white border-gray-300'
              }`}
              style={isDark ? { backgroundColor: '#143269' } : { borderColor: '#143269' }}>
                <div className="rounded-lg aspect-video mb-6 flex items-center justify-center overflow-hidden">
                  <img 
                    src={`/images/${isDark ? 'Dark' : 'Light'}LearnerCard.webp`}
                    alt="Learner illustration"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-3">As a Learner</h3>
                <p className={`leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Explore a new hobby, get guidance on that DIY project, and take your skills to the next level when you join our community of learners.
                </p>
              </button>

              {/* As a Mentor Card */}
              <button 
              onClick={() => onNavigate('mentor-signup')}
              className={`group rounded-2xl p-8 text-left transition-all hover:scale-105 transform w-full max-w-md border-2 ${
                isDark 
                  ? 'border-gray-700 hover:border-white' 
                  : 'bg-white border-gray-300'
              }`}
              style={isDark ? { backgroundColor: '#143269' } : { borderColor: '#143269' }}>
                <div className="rounded-lg aspect-video mb-6 flex items-center justify-center overflow-hidden">
                  <img 
                    src={`/images/${isDark ? 'Dark' : 'Light'}MentorCard.webp`}
                    alt="Mentor illustration"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-3">As a Mentor</h3>
                <p className={`leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Share your passions, pass down your knowledge, and help others achieve their goals when you make their hobby dreams come true as a mentor.
                </p>
              </button>
            </div>
          </div>
        </ScrollSection>
        </div>

        {/* Contact Section */}
        <ScrollSection 
          id="contact" 
          isDark={isDark}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              Contact us
            </h2>

            <div className="max-w-2xl space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    First Name (required)
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-gray-900 border-gray-700 focus:border-white text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                    style={!isDark ? { borderColor: '#143269', color: '#143269' } : {}}
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Last Name (required)
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-gray-900 border-gray-700 focus:border-white text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                    style={!isDark ? { borderColor: '#143269', color: '#143269' } : {}}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email (required)
                </label>
                <input
                  type="email"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-gray-900 border-gray-700 focus:border-white text-white' 
                      : 'bg-white border-gray-300 focus:border-black text-black'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Message
                </label>
                <textarea
                  rows="6"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors resize-none ${
                    isDark 
                      ? 'bg-gray-900 border-gray-700 focus:border-white text-white' 
                      : 'bg-white border-gray-300 focus:border-black text-black'
                  }`}
                />
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Handle form submission
                }}
                className={`w-full px-8 py-4 rounded-full font-medium transition-colors text-lg ${
                  isDark 
                    ? 'bg-white hover:bg-gray-200' 
                    : 'bg-[#143269] text-white hover:opacity-80'
                }`}
                style={isDark ? { color: '#143269' } : {}}
              >
                Send Message
              </button>
            </div>
          </div>
        </ScrollSection>

      {/* Footer */}
      <footer className={`py-8 px-6 border-t transition-colors ${
        isDark ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <div className={`max-w-7xl mx-auto text-center text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          ℠ 2026 hobski. 
        </div>
      </footer>
    </div>
  );
}

// Hand-drawn irregular border line component
// ScrollSection Component
function ScrollSection({ id, children, isDark, className = '' }) {
  const sectionRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Subtle slide-up effect as sections come into view
  const y = useTransform(scrollYProgress, 
    [0, 0.2, 0.8, 1], 
    [60, 0, 0, -60]
  );
  
  const opacity = useTransform(scrollYProgress, 
    [0, 0.2, 0.8, 1], 
    [0, 1, 1, 0.3]
  );

  return (
    <motion.section
      ref={sectionRef}
      id={id}
      data-scroll-section
      className={`min-h-screen flex items-center justify-center ${className}`}
      style={{ 
        y, 
        opacity
      }}
    >
      <div className="w-full py-20">
        {children}
      </div>
    </motion.section>
  );
}

// GSAP Hero Section with navigation arrows
function GSAPHeroSection({ isDark, scrollToSection }) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timelineRef = useRef(null);
  
  const illustrations = [
    { text: 'Dream it', art: `/images/${isDark ? 'Dark' : 'Light'}DreamItArt.webp`, id: 'dream' },
    { text: 'Learn it', art: `/images/${isDark ? 'Dark' : 'Light'}LearnItArt.webp`, id: 'learn' },
    { text: 'Do it', art: `/images/${isDark ? 'Dark' : 'Light'}DoItArt.webp`, id: 'do' }
  ];

  // Navigate to specific slide
  const goToSlide = (index) => {
    if (timelineRef.current && index >= 0 && index < illustrations.length) {
      const targetProgress = index / (illustrations.length - 1);
      
      // Get the ScrollTrigger instance
      const scrollTrigger = timelineRef.current.scrollTrigger;
      
      if (scrollTrigger) {
        // Temporarily disable scrub to prevent conflict
        const originalScrub = scrollTrigger.vars.scrub;
        scrollTrigger.vars.scrub = false;
        
        // Animate the timeline
        gsap.to(timelineRef.current, {
          progress: targetProgress,
          duration: 0.8,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (timelineRef.current) {
              setProgress(timelineRef.current.progress());
            }
          },
          onComplete: () => {
            // Re-enable scrub and update scroll position to match
            scrollTrigger.vars.scrub = originalScrub;
            
            // Sync scroll position to match the new timeline progress
            const scrollStart = scrollTrigger.start;
            const scrollEnd = scrollTrigger.end;
            const targetScroll = scrollStart + (scrollEnd - scrollStart) * targetProgress;
            
            // Instantly update scroll position without animation
            window.scrollTo(0, targetScroll);
            scrollTrigger.update();
          }
        });
      }
      
      setCurrentSlide(index);
    }
  };

  const nextSlide = () => {
    if (currentSlide < illustrations.length - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let initTimeout;
    let resizeTimeout;

    const initAnimation = () => {
      // Kill any existing ScrollTriggers first to prevent conflicts
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });

      // Small delay to ensure DOM is ready and dimensions are correct
      initTimeout = setTimeout(() => {
        // Get all elements
        const elements = illustrations.map((_, index) => ({
          text: container.querySelector(`#text-${index}`),
          art: container.querySelector(`#art-${index}`)
        }));

        // Verify all elements exist
        const allElementsExist = elements.every(el => el.text && el.art);
        if (!allElementsExist) {
          console.warn('Not all hero elements found, skipping animation setup');
          return;
        }

        // Get viewport dimensions safely
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const isMobile = viewportWidth < 768;

        // Set ALL initial positions BEFORE creating timeline
        elements.forEach((el, index) => {
          if (!el.text || !el.art) return;

          if (index === 0) {
            // First illustration: visible in center
            gsap.set([el.text, el.art], { x: 0, y: 0, opacity: 1 });
          } else {
            // Others: offscreen (right for desktop, bottom for mobile)
            if (isMobile) {
              gsap.set([el.text, el.art], { x: 0, y: viewportHeight * 1.2, opacity: 0 });
            } else {
              gsap.set([el.text, el.art], { x: viewportWidth * 1.2, y: 0, opacity: 0 });
            }
          }
        });

    // Create timeline
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=300%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          setProgress(self.progress);
          // Update current slide based on scroll progress
          const slideIndex = Math.round(self.progress * (illustrations.length - 1));
          setCurrentSlide(slideIndex);
        }
      }
    });

    timelineRef.current = mainTimeline;

    // Add animations for each transition
    illustrations.forEach((_, index) => {
      if (index === illustrations.length - 1) return;

      const current = elements[index];
      const next = elements[index + 1];
      
      if (!current.text || !current.art || !next.text || !next.art) return;

      const transitionDuration = 0.35;
      const pauseDuration = 0.05;
      const transitionStart = index * (transitionDuration + pauseDuration);
      
      // Special handling for first and second illustrations exit
      if (index === 0 || index === 1) {
        // Text exits FIRST (slightly earlier)
        mainTimeline.to(current.text, {
          x: isMobile ? 0 : -viewportWidth,
          y: isMobile ? -viewportHeight : 0,
          opacity: 0,
          ease: 'power2.inOut',
          duration: transitionDuration
        }, transitionStart);
        
        // Art exits slightly after text
        mainTimeline.to(current.art, {
          x: isMobile ? 0 : -viewportWidth,
          y: isMobile ? -viewportHeight : 0,
          opacity: 0,
          ease: 'power2.inOut',
          duration: transitionDuration
        }, transitionStart + 0.05);
      } else {
        // Other illustrations exit together
        mainTimeline.to([current.text, current.art], {
          x: isMobile ? 0 : -viewportWidth,
          y: isMobile ? -viewportHeight : 0,
          opacity: 0,
          ease: 'power2.inOut',
          duration: transitionDuration
        }, transitionStart);
      }

      // Next illustration ART enters from bottom (mobile) or right (desktop) FIRST
      mainTimeline.to(next.art, {
        x: 0,
        y: 0,
        opacity: 1,
        ease: 'power2.inOut',
        duration: transitionDuration
      }, transitionStart);

      // Next illustration TEXT enters from bottom (mobile) or right (desktop) (slightly delayed for parallax)
      mainTimeline.to(next.text, {
        x: 0,
        y: 0,
        opacity: 1,
        ease: 'power2.inOut',
        duration: transitionDuration
      }, transitionStart + 0.05);
    });

    mainTimeline.to({}, { duration: 0.04 });
      }, 100); // End of setTimeout
    };

    // Initialize on mount
    initAnimation();

    // Reinitialize on resize to handle desktop/mobile transitions
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initAnimation();
      }, 300);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initTimeout);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden pt-16 md:pt-0">
      {/* Illustrations - all positioned absolutely */}
      {illustrations.map((illust, index) => (
        <div key={illust.id} className="absolute inset-0 flex items-center justify-center">
          <h1
            id={`text-${index}`}
            className="absolute z-10 font-['Inter',sans-serif] font-bold text-center leading-none"
            style={{ 
              fontSize: 'clamp(4rem, 9vw, 8rem)',
              color: isDark ? '#ffffff' : '#143269',
              left: index === 0 ? '35%' : index === 1 ? '30%' : '49%',
              top: index === 0 ? '22%' : index === 1 ? '22%' : '22%',
              transform: 'translate(-50%, -50%)',
              opacity: 0
            }}
          >
            {illust.text}
          </h1>
          {/* Comment this code later */}
          <img
            id={`art-${index}`}
            src={illust.art}
            alt={`${illust.id} art`}
            className="absolute max-w-[80vw] max-h-[80vh] object-contain"
            style={{ 
              opacity: 0,
              ...(index === 1 ? { left: '30%', transform: 'translate(-50%, -50%)' } : {})
            }}
          />
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={currentSlide === 0}
        className={`absolute left-1/2 -translate-x-1/2 top-20 md:left-8 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 z-50 p-2 rounded-full transition-all backdrop-blur-sm ${
          currentSlide === 0
            ? 'opacity-0 pointer-events-none'
            : isDark
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'hover:opacity-80'
        }`}
        style={!isDark && currentSlide !== 0 ? { backgroundColor: 'rgba(20, 50, 105, 0.1)', color: '#143269' } : {}}
        aria-label="Previous illustration"
      >
        <ChevronLeft className="w-6 h-6 md:block hidden" />
        <ChevronDown className="w-6 h-6 md:hidden rotate-180" />
      </button>

      <button
        onClick={nextSlide}
        disabled={currentSlide === illustrations.length - 1}
        className={`absolute left-1/2 -translate-x-1/2 bottom-32 md:right-8 md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:bottom-auto z-50 p-2 rounded-full transition-all backdrop-blur-sm ${
          currentSlide === illustrations.length - 1
            ? 'opacity-0 pointer-events-none'
            : isDark
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'hover:opacity-80'
        }`}
        style={!isDark && currentSlide !== illustrations.length - 1 ? { backgroundColor: 'rgba(20, 50, 105, 0.1)', color: '#143269' } : {}}
        aria-label="Next illustration"
      >
        <ChevronRight className="w-6 h-6 md:block hidden" />
        <ChevronDown className="w-6 h-6 md:hidden" />
      </button>

      {/* Progress indicator */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-50">
        <div className="flex gap-2 items-center">
          {illustrations.map((_, index) => (
            <div
              key={index}
              className="rounded-full transition-all duration-300"
              style={{
                width: index === currentSlide ? '12px' : '8px',
                height: index === currentSlide ? '12px' : '8px',
                backgroundColor: index === currentSlide ? '#377BD9' : '#95a8c5'
              }}
            />
          ))}
        </div>
      </div>

      {/* Permanent scroll down button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={() => scrollToSection('how-it-works')}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all group ${
            isDark 
              ? 'text-white border-white hover:bg-white hover:text-[#143269]' 
              : 'text-[#143269] border-[#143269] hover:bg-[#143269] hover:text-white'
          }`}
        >
          Pssst there's more
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// Mobile Step Carousel Component
function MobileStepCarousel({ isDark, steps, activeTab }) {
  const [currentStep, setCurrentStep] = useState(0);

  // Reset to first step when tab changes
  useEffect(() => {
    setCurrentStep(0);
  }, [activeTab]);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const goToStep = (index) => {
    setCurrentStep(index);
  };

  return (
    <div className="md:hidden mb-16 relative">
      {/* Step Card */}
      <div className="px-6">
        <div className="transition-opacity duration-300 min-h-[550px]">
          {/* Step Title */}
          <h3 className="text-xl font-bold mb-4" style={{ color: isDark ? 'white' : '#143269' }}>
            {steps[currentStep].number}. {steps[currentStep].title}
          </h3>
          
          {/* Step Image */}
          <div className="w-full aspect-square rounded-lg mb-1 flex items-center justify-center relative">
            <img 
              src={steps[currentStep].image}
              alt={`${steps[currentStep].title} illustration`}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-gray-600 text-sm">Image</span>';
              }}
            />
            
            {/* Navigation Arrows */}
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`absolute -left-6 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all ${
                currentStep === 0
                  ? 'opacity-0 pointer-events-none'
                  : isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-[#143269]/10 hover:bg-[#143269]/20 text-[#143269]'
              }`}
              aria-label="Previous step"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className={`absolute -right-6 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all ${
                currentStep === steps.length - 1
                  ? 'opacity-0 pointer-events-none'
                  : isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-[#143269]/10 hover:bg-[#143269]/20 text-[#143269]'
              }`}
              aria-label="Next step"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          
          {/* Step Description */}
          <p className="text-lg font-normal leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.9)' : '#143269' }}>
            {steps[currentStep].description}
          </p>
        </div>

      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => goToStep(index)}
            className="rounded-full transition-all duration-300"
            style={{
              width: index === currentStep ? '12px' : '8px',
              height: index === currentStep ? '12px' : '8px',
              backgroundColor: index === currentStep ? '#377BD9' : '#95a8c5'
            }}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Mobile Hero Section - Static vertical layout
function MobileHeroSection({ isDark, scrollToSection }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const carouselRef = useRef(null);

  const illustrations = [
    { text: 'Dream it', art: `/images/${isDark ? 'Dark' : 'Light'}DreamItArt.webp`, id: 'dream' },
    { text: 'Learn it', art: `/images/${isDark ? 'Dark' : 'Light'}LearnItArt.webp`, id: 'learn' },
    { text: 'Do it', art: `/images/${isDark ? 'Dark' : 'Light'}DoItArt.webp`, id: 'do' }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScrollEnabled) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % illustrations.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [autoScrollEnabled, illustrations.length]);

  // Handle touch events for swiping
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      setAutoScrollEnabled(false); // Disable auto-scroll on user interaction
      
      if (diff > 0) {
        // Swiped left - go to next slide
        setCurrentSlide((prev) => (prev + 1) % illustrations.length);
      } else {
        // Swiped right - go to previous slide
        setCurrentSlide((prev) => (prev - 1 + illustrations.length) % illustrations.length);
      }
    }
  };

  const goToSlide = (index) => {
    setAutoScrollEnabled(false);
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setAutoScrollEnabled(false);
    setCurrentSlide((prev) => (prev + 1) % illustrations.length);
  };

  const prevSlide = () => {
    setAutoScrollEnabled(false);
    setCurrentSlide((prev) => (prev - 1 + illustrations.length) % illustrations.length);
  };

  return (
    <div className="pt-16 pb-6 min-h-screen flex flex-col justify-center relative">
      {/* Carousel container */}
      <div 
        ref={carouselRef}
        className="relative w-full overflow-hidden px-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Text centered above illustration */}
        <h1 
          className="text-center transition-opacity duration-500"
          style={{ 
            fontSize: 'clamp(4rem, 20vw, 7rem)',
            color: isDark ? '#ffffff' : '#143269',
            fontWeight: '900',
            transform: 'translateY(50px)',
            position: 'relative',
            zIndex: 10
          }}
        >
          {illustrations[currentSlide].text}
        </h1>

        {/* Illustrations */}
        <div className="relative h-[350px] flex items-center justify-center -my-4">
          {illustrations.map((illust, index) => (
            <div
              key={illust.id}
              className="absolute w-full h-full transition-all duration-500 ease-in-out"
              style={{
                transform: `translateX(${(index - currentSlide) * 100}%)`,
                opacity: index === currentSlide ? 1 : 0,
                pointerEvents: index === currentSlide ? 'auto' : 'none'
              }}
            >
              <img 
                src={illust.art}
                alt={`${illust.id} art`}
                className="w-full h-full object-contain"
                style={{ 
                  transform: 'scale(1.2)',
                  clipPath: 'inset(8% 0 8% 0)'
                }}
              />
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`absolute left-2 bottom-4 z-10 p-2 rounded-full transition-all ${
            currentSlide === 0
              ? 'opacity-0 pointer-events-none'
              : isDark
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-[#143269]/10 hover:bg-[#143269]/20 text-[#143269]'
          }`}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          disabled={currentSlide === illustrations.length - 1}
          className={`absolute right-2 bottom-4 z-10 p-2 rounded-full transition-all ${
            currentSlide === illustrations.length - 1
              ? 'opacity-0 pointer-events-none'
              : isDark
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-[#143269]/10 hover:bg-[#143269]/20 text-[#143269]'
          }`}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center gap-2 mt-8 mb-6">
        {illustrations.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="rounded-full transition-all duration-300"
            style={{
              width: index === currentSlide ? '12px' : '8px',
              height: index === currentSlide ? '12px' : '8px',
              backgroundColor: index === currentSlide ? '#377BD9' : '#95a8c5'
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Pssst there's more button */}
      <div className="flex justify-center pb-6">
        <button 
          onClick={() => scrollToSection('how-it-works')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 transition-all group"
          style={{
            color: '#143269',
            borderColor: '#143269'
          }}
        >
          Pssst there's more
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}