import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { ChevronDown, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { useImagePreloader, useThemeImagePreloader } from '../hooks/useImagePreloader';
import ImageWithSkeleton from './ImageWithSkeleton';

export default function HobskiLanding({ onNavigate, theme, setTheme }) {
  const [activeTab, setActiveTab] = useState('learner');
  const [showNotice, setShowNotice] = useState(true);
  const [isMobile, setIsMobile] = useState(() => {
    // Initialize with correct value to prevent flash of wrong component
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // OPTIMIZATION: Define image categories for smart preloading
  const getCriticalImages = useCallback((themeMode) => [
    `/images/${themeMode === 'dark' ? 'Dark' : 'Light'}DreamItArt.webp`,
    `/images/${themeMode === 'dark' ? 'Dark' : 'Light'}LearnItArt.webp`,
    `/images/${themeMode === 'dark' ? 'Dark' : 'Light'}DoItArt.webp`,
  ], []);

  const getStepImages = useCallback((themeMode, tab) => {
    const prefix = tab === 'learner' ? 'Learner' : 'Mentor';
    return [
      `/images/${themeMode === 'dark' ? 'Dark' : 'Light'}${prefix}Step1.webp`,
      `/images/${themeMode === 'dark' ? 'Dark' : 'Light'}${prefix}Step2.webp`,
      `/images/${themeMode === 'dark' ? 'Dark' : 'Light'}${prefix}Step3.webp`,
      `/images/${themeMode === 'dark' ? 'Dark' : 'Light'}BothStep4.webp`,
    ];
  }, []);

  const getCardImages = useCallback((themeMode) => [
    `/images/${themeMode === 'dark' ? 'Dark' : 'Light'}LearnerJoin.webp`,
    `/images/${themeMode === 'dark' ? 'Dark' : 'Light'}MentorJoin.webp`,
  ], []);

  // Preload critical hero images with high priority
  const { loaded: heroImagesLoaded } = useImagePreloader(
    getCriticalImages(theme),
    'high',
    true
  );

  // Preload step images for active tab - only after hero is loaded
  const { loaded: stepImagesLoaded } = useImagePreloader(
    heroImagesLoaded ? getStepImages(theme, activeTab) : [],
    'low',
    false
  );

  // Smart theme preloader for smooth theme switching
  const { preloadTheme, isPreloading } = useThemeImagePreloader(
    theme,
    useCallback((targetTheme) => [
      ...getCriticalImages(targetTheme),
      ...getStepImages(targetTheme, activeTab),
      ...getCardImages(targetTheme),
    ], [getCriticalImages, getStepImages, getCardImages, activeTab])
  );

  // OPTIMIZATION: Improved theme change handler that preloads images before switching
  const handleThemeChange = useCallback(async (newTheme) => {
    if (theme === newTheme || isPreloading) return;

    // Preload target theme images BEFORE switching
    await preloadTheme(newTheme);
    
    // Use requestAnimationFrame for smooth visual transition
    requestAnimationFrame(() => {
      setTheme(newTheme);
    });
  }, [theme, isPreloading, preloadTheme, setTheme]);

  // OPTIMIZATION: Preload opposite theme during idle time - only after critical content loads
  useEffect(() => {
    if (heroImagesLoaded && stepImagesLoaded) {
      const oppositeTheme = theme === 'dark' ? 'light' : 'dark';
      
      const schedulePreload = () => {
        preloadTheme(oppositeTheme);
      };

      if ('requestIdleCallback' in window) {
        const idleCallback = window.requestIdleCallback(schedulePreload, {
          timeout: 5000 // Increased timeout to avoid interfering with critical rendering
        });
        return () => window.cancelIdleCallback(idleCallback);
      } else {
        const timeout = setTimeout(schedulePreload, 2000);
        return () => clearTimeout(timeout);
      }
    }
  }, [heroImagesLoaded, stepImagesLoaded, theme, preloadTheme]);

  // Detect mobile viewport with debounce for better performance
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    let timeoutId;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 200); // Optimized debounce timing
    };
    
    window.addEventListener('resize', debouncedCheck, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedCheck);
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Get the actual header height dynamically
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 0;
      
      // Add a small buffer (16px) for visual spacing
      const offset = headerHeight + 16;
      
      // Get the absolute position of the element
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

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
      style={isDark ? { backgroundColor: '#143269', color: '#C7DBFF' } : { backgroundColor: '#E6F6FF', color: '#143269' }}
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
            <button 
              onClick={() => scrollToSection('get-involved')}
              className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium ${
                isDark 
                  ? 'hover:opacity-80' 
                  : 'bg-[#143269] text-white hover:opacity-80'
              }`}
              style={isDark ? { backgroundColor: '#C7DBFF', color: '#143269', transition: 'opacity 0.2s' } : { transition: 'background-color 0.2s', color: 'white' }}
            >
              Join
            </button>
            <button 
              onClick={() => onNavigate('about')}
              className={`px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base ${
              isDark ? 'hover:opacity-80' : 'hover:opacity-80'
            }`}
              style={{ transition: 'color 0.2s', color: isDark ? '#C7DBFF' : '#143269' }}
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className={`px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base ${
                isDark ? 'hover:opacity-80' : 'hover:opacity-80'
              }`}
              style={{ transition: 'color 0.2s', color: isDark ? '#C7DBFF' : '#143269' }}
            >
              Contact
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section with GSAP ScrollTrigger */}
      {isMobile ? (
        <MobileHeroSection 
          isDark={isDark} 
          scrollToSection={scrollToSection}
          imagesLoaded={heroImagesLoaded}
        />
      ) : (
        <GSAPHeroSection 
          isDark={isDark} 
          scrollToSection={scrollToSection}
          imagesLoaded={heroImagesLoaded}
        />
      )}

      {/* SVG definitions for wavy clip paths */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <clipPath id="wavy-top-bottom" clipPathUnits="objectBoundingBox">
          <path d="M 0,0.05 Q 0.1,0.02 0.2,0.05 Q 0.3,0.08 0.4,0.05 Q 0.5,0.02 0.6,0.05 Q 0.7,0.08 0.8,0.05 Q 0.9,0.02 1,0.05 L 1,0.95 Q 0.9,0.98 0.8,0.95 Q 0.7,0.92 0.6,0.95 Q 0.5,0.98 0.4,0.95 Q 0.3,0.92 0.2,0.95 Q 0.1,0.98 0,0.95 Z" />
        </clipPath>
        <clipPath id="wavy-top-bottom-mobile" clipPathUnits="objectBoundingBox">
          <path d="M 0,0.02 Q 0.25,0 0.5,0.02 T 1,0.02 L 1,0.98 Q 0.75,1 0.5,0.98 T 0,0.98 Z" />
        </clipPath>
      </defs>
    </svg>

      {/* How Does It Work Section */}
      <div style={{ 
        backgroundColor: isDark ? '#3F60CF' : '#B7D0FF',
        marginTop: '-1.5rem',
        marginBottom: '-5rem',
        paddingTop: '3rem',
        paddingBottom: '3rem',
        clipPath: isMobile ? 'url(#wavy-top-bottom-mobile)' : 'url(#wavy-top-bottom)'
      }}>
        <ScrollSection 
            id="how-it-works" 
            isDark={isDark}
          >
            <div className="max-w-7xl mx-auto px-5 sm:px-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8">
              How does it work?
            </h2>

            {/* Tab Buttons */}
            <div className="max-w-7xl mx-auto mb-8 md:mb-10">
              <div className="flex gap-0">
                <button
                  onClick={() => setActiveTab('learner')}
                  className={`flex-1 px-4 py-2 md:px-8 md:py-3 font-semibold transition-all text-lg md:text-xl ${
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
                  className={`flex-1 px-4 py-2 md:px-8 md:py-3 font-semibold transition-all text-lg md:text-xl ${
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
                <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 mb-12 max-w-6xl mx-auto">
                {/* Step 1 */}
                <div className="flex flex-col items-start relative">
                  {/* Image Placeholder - Resized smaller and cropped */}
                  <div className="w-full rounded-lg mb-0 flex items-center justify-start overflow-hidden" style={{ aspectRatio: '1/1' }}>
                    <img 
                      src={`/images/${isDark ? 'Dark' : 'Light'}LearnerStep1.webp`} 
                      alt="Find your hobby illustration"
                      loading="eager"
                      fetchPriority="high"
                      className="w-[85%] h-[85%] object-cover rounded-lg"
                      style={{ 
                        objectPosition: 'center center',
                        clipPath: 'inset(10% 0 10% 0)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-gray-600 text-sm">Image</span>';
                      }}
                    />
                  </div>
                  
                  <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4" style={{ color: isDark ? '#C7DBFF' : '#143269' }}>
                    1. Find your hobby
                  </h3>
                  
                  <p className="text-base md:text-lg font-normal leading-relaxed" style={{ color: isDark ? '#C7DBFF' : '#143269' }}>
                    Got a hobby or project in mind? Just type it into our search bar, or browse through our categories for inspiration!
                  </p>
                  
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-start relative">
                  {/* Image Placeholder - Resized smaller and cropped */}
                  <div className="w-full rounded-lg mb-0 flex items-center justify-start overflow-hidden" style={{ aspectRatio: '1/1' }}>
                    <img 
                      src={`/images/${isDark ? 'Dark' : 'Light'}LearnerStep2.webp`} 
                      alt="Browse mentors illustration"
                      loading="eager"
                      fetchPriority="high"
                      className="w-[85%] h-[85%] object-cover rounded-lg"
                      style={{ 
                        objectPosition: 'center center',
                        clipPath: 'inset(10% 0 10% 0)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-gray-600 text-sm">Image</span>';
                      }}
                    />
                  </div>
                  
                  <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4" style={{ color: isDark ? '#C7DBFF' : '#143269' }}>
                    2. Browse mentors
                  </h3>
                  
                  <p className="text-base md:text-lg font-normal leading-relaxed" style={{ color: isDark ? '#C7DBFF' : '#143269' }}>
                    Take a look at available mentors and browse their portfolios, rates, schedules, resources, and reviews!
                  </p>
                  
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-start relative">
                  {/* Image Placeholder - Resized smaller and cropped */}
                  <div className="w-full rounded-lg mb-0 flex items-center justify-start overflow-hidden" style={{ aspectRatio: '1/1' }}>
                    <img 
                      src={`/images/${isDark ? 'Dark' : 'Light'}LearnerStep3.webp`} 
                      alt="Book a session illustration"
                      loading="eager"
                      fetchPriority="high"
                      className="w-[85%] h-[85%] object-cover rounded-lg"
                      style={{ 
                        objectPosition: 'center center',
                        clipPath: 'inset(10% 0 10% 0)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-gray-600 text-sm">Image</span>';
                      }}
                    />
                  </div>
                  
                  <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4" style={{ color: isDark ? '#C7DBFF' : '#143269' }}>
                    3. Book a session
                  </h3>
                  
                  <p className="text-base md:text-lg font-normal leading-relaxed" style={{ color: isDark ? '#C7DBFF' : '#143269' }}>
                    Request a session with a mentor. Outline your goals, resources, session preferences, and chat with your mentor before confirming!
                  </p>
                  
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-start">
                  {/* Image Placeholder - Resized smaller and cropped */}
                  <div className="w-full rounded-lg mb-0 flex items-center justify-start overflow-hidden" style={{ aspectRatio: '1/1' }}>
                    <img 
                      src={`/images/${isDark ? 'Dark' : 'Light'}BothStep4.webp`} 
                      alt="Get learning illustration"
                      loading="eager"
                      fetchPriority="high"
                      className="w-[85%] h-[85%] object-cover rounded-lg"
                      style={{ 
                        objectPosition: 'center center',
                        clipPath: 'inset(10% 0 10% 0)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-gray-600 text-sm">Image</span>';
                      }}
                    />
                  </div>
                  
                  <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4" style={{ color: isDark ? '#C7DBFF' : '#143269' }}>
                    4. Get learning!
                  </h3>
                  
                  <p className="text-base md:text-lg font-normal leading-relaxed" style={{ color: isDark ? '#C7DBFF' : '#143269' }}>
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
                    image: `/images/${isDark ? 'Dark' : 'Light'}LearnerStep1.webp`,
                    description: 'Got a hobby or project in mind? Just type it into our search bar, or browse through our categories for inspiration!'
                  },
                  {
                    number: 2,
                    title: 'Browse mentors',
                    image: `/images/${isDark ? 'Dark' : 'Light'}LearnerStep2.webp`,
                    description: 'Take a look at available mentors and browse their portfolios, rates, schedules, resources, and reviews!'
                  },
                  {
                    number: 3,
                    title: 'Book a session',
                    image: `/images/${isDark ? 'Dark' : 'Light'}LearnerStep3.webp`,
                    description: 'Request a session with a mentor. Outline your goals, resources, session preferences, and chat with your mentor before confirming!'
                  },
                  {
                    number: 4,
                    title: 'Get learning!',
                    image: `/images/${isDark ? 'Dark' : 'Light'}BothStep4.webp`,
                    description: 'Meet in-person or virtually, depending on your preferences, and get learning!'
                  }
                ]}
              />
              </>
            ) : (
              <>
              {/* Desktop Grid View */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 mb-12 max-w-6xl mx-auto">
                {/* Mentor Step 1 */}
                <div className="flex flex-col items-start relative">
                  {/* Image Placeholder - Resized smaller and cropped */}
                  <div className="w-full rounded-lg mb-0 flex items-center justify-start overflow-hidden" style={{ aspectRatio: '1/1' }}>
                    <img 
                      src={`/images/${isDark ? 'Dark' : 'Light'}MentorStep1.webp`} 
                      alt="Mentor step 1 illustration"
                      loading="eager"
                      fetchPriority="high"
                      className="w-[85%] h-[85%] object-cover rounded-lg"
                      style={{ 
                        objectPosition: 'center center',
                        clipPath: 'inset(10% 0 10% 0)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class=\"text-gray-600 text-sm\">Image</span>';
                      }}
                    />
                  </div>
                  
                  <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4" style={{ color: isDark ? '#C7DBFF' : '#143269' }}>
                    1. Find your skill OR Create one
                  </h3>
                  
                  <p className="text-base md:text-lg font-normal leading-relaxed" style={{ color: isDark ? '#C7DBFF' : '#143269'}}>
                    Browse through our skill categories and choose yours. If you can’t find it, request to add a new one to our list!
                  </p>
                  
                </div>

                {/* Mentor Step 2 */}
                <div className="flex flex-col items-start relative">
                  {/* Image Placeholder - Resized smaller and cropped */}
                  <div className="w-full rounded-lg mb-0 flex items-center justify-start overflow-hidden" style={{ aspectRatio: '1/1' }}>
                    <img 
                      src={`/images/${isDark ? 'Dark' : 'Light'}MentorStep2.webp`} 
                      alt="Mentor step 2 illustration"
                      loading="eager"
                      fetchPriority="high"
                      className="w-[85%] h-[85%] object-cover rounded-lg"
                      style={{ 
                        objectPosition: 'center center',
                        clipPath: 'inset(10% 0 10% 0)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-gray-600 text-sm">Image</span>';
                      }}
                    />
                  </div>
                  
                  <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4" style={{ color: isDark ? '#C7DBFF' : '#143269' }}>
                    2. Set up your profile
                  </h3>
                  
                  <p className="text-base md:text-lg font-normal leading-relaxed" style={{ color: isDark ? '#C7DBFF' : '#143269' }}>
                    Demonstrate your skill. Pick your skill level, rate, schedule, and outline your session preferences (resources offered, session size, and location).
                  </p>
                  
                </div>

                {/* Mentor Step 3 */}
                <div className="flex flex-col items-start relative">
                  {/* Image Placeholder - Resized smaller and cropped */}
                  <div className="w-full rounded-lg mb-0 flex items-center justify-start overflow-hidden" style={{ aspectRatio: '1/1' }}>
                    <img 
                      src={`/images/${isDark ? 'Dark' : 'Light'}MentorStep3.webp`} 
                      alt="Mentor step 3 illustration"
                      loading="eager"
                      fetchPriority="high"
                      className="w-[85%] h-[85%] object-cover rounded-lg"
                      style={{ 
                        objectPosition: 'center center',
                        clipPath: 'inset(10% 0 10% 0)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class=\"text-gray-600 text-sm\">Image</span>';
                      }}
                    />
                  </div>
                  
                  <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4" style={{ color: isDark ? '#C7DBFF' : '#143269' }}>
                    3. Chat with learners
                  </h3>
                  
                  <p className="text-base md:text-lg font-normal leading-relaxed" style={{ color: isDark ? '#C7DBFF' : '#143269'}}>
                    Start a conversation with learners when they’ve requested a session and discuss goals and sessions details before confirming!
                  </p>
                  
                </div>

                {/* Mentor Step 4 */}
                <div className="flex flex-col items-start">
                  {/* Image Placeholder - Resized smaller and cropped */}
                  <div className="w-full rounded-lg mb-0 flex items-center justify-start overflow-hidden" style={{ aspectRatio: '1/1' }}>
                    <img 
                      src={`/images/${isDark ? 'Dark' : 'Light'}BothStep4.webp`} 
                      alt="Mentor step 4 illustration"
                      loading="eager"
                      fetchPriority="high"
                      className="w-[85%] h-[85%] object-cover rounded-lg"
                      style={{ 
                        objectPosition: 'center center',
                        clipPath: 'inset(10% 0 10% 0)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-gray-600 text-sm">Image</span>';
                      }}
                    />
                  </div>
                  
                  <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4" style={{ color: isDark ? '#C7DBFF' : '#143269' }}>
                    4. Get mentoring!
                  </h3>
                  
                  <p className="text-base md:text-lg font-normal leading-relaxed" style={{ color: isDark ? '#C7DBFF' : '#143269' }}>
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
                    image: `/images/${isDark ? 'Dark' : 'Light'}MentorStep1.webp`,
                    description: 'Browse through our skill categories and choose yours. If you can\'t find it, request to add a new one to our list!'
                  },
                  {
                    number: 2,
                    title: 'Set up your profile',
                    image: `/images/${isDark ? 'Dark' : 'Light'}MentorStep2.webp`,
                    description: 'Demonstrate your skill. Pick your skill level, rate, schedule, and outline your session preferences (resources offered, session size, and location).'
                  },
                  {
                    number: 3,
                    title: 'Chat with learners',
                    image: `/images/${isDark ? 'Dark' : 'Light'}MentorStep3.webp`,
                    description: 'Start a conversation with learners when they\'ve requested a session and discuss goals and sessions details before confirming!'
                  },
                  {
                    number: 4,
                    title: 'Get mentoring!',
                    image: `/images/${isDark ? 'Dark' : 'Light'}BothStep4.webp`,
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
          paddingTop: '2rem'
        }}>
          <ScrollSection 
            id="get-involved" 
            isDark={isDark}
          >
            <div className="max-w-7xl mx-auto px-5 sm:px-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get involved
            </h2>
            <p className={`text-2xl mb-8 md:mb-60 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Got a hobby or skill you're interested in? Join us!
            </p>

            <div className="flex flex-col md:flex-row gap-6 md:gap-16 justify-center items-stretch md:items-stretch items-center">
              {/* As a Learner Card with Illustration */}
              <div className="relative w-full max-w-md md:max-w-xl group md:transition-transform md:hover:scale-110">
                {/* Card */}
                <button 
                  onClick={() => onNavigate('learner-signup')}
                  className={`relative z-0 rounded-2xl p-8 text-left w-full mt-28 md:mt-0 ${
                    isDark 
                      ? 'group-hover:border-white' 
                      : ''
                  }`}
                  style={isDark ? { backgroundColor: '#143269' } : { backgroundColor: '#0D2A5E' }}>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: isDark ? 'white' : '#C7DBFF' }}>As a Learner</h3>
                  <p className="leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.75)' : '#C7DBFF' }}>
                    Explore a new hobby, get guidance on that DIY project, and take your skills to the next level when you join our community of learners.
                  </p>
                </button>
                
                {/* Character Illustration - Overlays card on both mobile and desktop */}
                <div className="absolute inset-0 pointer-events-none overflow-visible z-10">
                  <img 
                    src={`/images/${isDark ? 'Dark' : 'Light'}LearnerJoin.webp`}
                    alt=""
                    loading="eager"
                    fetchPriority="high"
                    className="absolute w-full md:w-[120%] h-auto object-contain"
                    style={{
                      // Mobile positioning - adjust translateX and translateY values (in percentages or px)
                      ...(isMobile ? {
                        top: '-23%',
                        left: '0%',
                      } : {
                        // Desktop positioning - original values
                        top: '-144.9%',
                        left: '-4%',
                      })
                    }}
                  />
                </div>
              </div>

              {/* As a Mentor Card with Illustration */}
              <div className="relative w-full max-w-md md:max-w-xl group md:transition-transform md:hover:scale-110">
                {/* Card */}
                <button 
                  onClick={() => onNavigate('mentor-signup')}
                  className={`relative z-0 rounded-2xl p-8 text-left w-full mt-40 md:mt-0 ${
                    isDark 
                      ? 'group-hover:border-white' 
                      : ''
                  }`}
                  style={isDark ? { backgroundColor: '#143269' } : { backgroundColor: '#0D2A5E' }}>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: isDark ? 'white' : '#C7DBFF' }}>As a Mentor</h3>
                  <p className="leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.75)' : '#C7DBFF' }}>
                    Share your passions, pass down your knowledge, and help others achieve their goals when you make their hobby dreams come true as a mentor.
                  </p>
                </button>
                
                {/* Character Illustration - Overlays card on both mobile and desktop */}
                <div className="absolute inset-0 pointer-events-none overflow-visible z-10">
                  <img 
                    src={`/images/${isDark ? 'Dark' : 'Light'}MentorJoin.webp`}
                    alt=""
                    loading="eager"
                    fetchPriority="high"
                    className="absolute w-full md:w-[120%] h-auto object-contain"
                    style={{
                      // Mobile positioning - adjust top and left values (in percentages or px)
                      ...(isMobile ? {
                        top: '-7%',
                        left: '0%',
                      } : {
                        // Desktop positioning - original values
                        top: '-144.9%',
                        left: '19.7%',
                      })
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollSection>
        </div>

        {/* Contact Section */}
        <div style={{ 
          backgroundColor: isDark ? '#3F60CF' : '#B7D0FF',
          marginTop: '-4.5rem',
          marginBottom: '-4.0rem',
          paddingTop: '1rem',
          paddingBottom: '1rem',
          clipPath: isMobile ? 'url(#wavy-top-bottom-mobile)' : 'url(#wavy-top-bottom)'
        }}>
        <ScrollSection 
          id="contact" 
          isDark={isDark}
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              Contact us
            </h2>

            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className={`block text-sm mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    First Name (required)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-0 rounded-lg focus:outline-none transition-colors"
                    style={isDark ? { backgroundColor: '#0D2A5E', color: '#C7DBFF' } : { backgroundColor: '#E6F6FF', color: '#143269' }}
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
                    className="w-full px-4 py-3 border-0 rounded-lg focus:outline-none transition-colors"
                    style={isDark ? { backgroundColor: '#0D2A5E', color: '#C7DBFF' } : { backgroundColor: '#E6F6FF', color: '#143269' }}
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email (required)
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border-0 rounded-lg focus:outline-none transition-colors"
                    style={isDark ? { backgroundColor: '#0D2A5E', color: '#C7DBFF' } : { backgroundColor: '#E6F6FF', color: '#143269' }}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Message
                </label>
                <textarea
                  rows="6"
                  className="w-full px-4 py-3 border-0 rounded-lg focus:outline-none transition-colors resize-none"
                  style={isDark ? { backgroundColor: '#0D2A5E', color: '#C7DBFF' } : { backgroundColor: '#E6F6FF', color: '#143269' }}
                />
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Handle form submission
                }}
                className={`w-full px-8 py-4 rounded-full font-medium transition-colors text-lg ${
                  isDark 
                    ? 'hover:opacity-80' 
                    : 'bg-[#143269] text-white hover:opacity-80'
                }`}
                style={isDark ? { backgroundColor: '#C7DBFF', color: '#143269' } : {}}
              >
                Send Message
              </button>
            </div>
          </div>
        </ScrollSection>
        </div>

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

      {/* Construction Notice Bubble */}
      {showNotice && (
        <div 
          className={`fixed bottom-6 left-6 z-50 max-w-sm rounded-2xl shadow-2xl border-2 transition-all ${
            isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
          }`}
          style={{
            animation: 'slideIn 0.5s ease-out'
          }}
        >
          <style>{`
            @keyframes slideIn {
              from {
                transform: translateX(-100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}</style>
          <div className="p-4 pr-12 relative">
            <button
              onClick={() => setShowNotice(false)}
              className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              aria-label="Close notice"
            >
              <svg 
                className={`w-5 h-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <p className={`text-sm font-medium leading-relaxed ${
              isDark ? 'text-gray-200' : 'text-gray-800'
            }`}>
              We are still under construction but feel free to look around!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Hand-drawn irregular border line component
// ScrollSection Component - Memoized to prevent unnecessary re-renders
const ScrollSection = memo(function ScrollSection({ id, children, isDark, className = '' }) {
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
});

// GSAP Hero Section with navigation arrows - Memoized for performance
const GSAPHeroSection = memo(function GSAPHeroSection({ isDark, scrollToSection, imagesLoaded }) {
  const containerRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const illustrations = [
    { text: 'Dream it', art: `/images/${isDark ? 'Dark' : 'Light'}DreamItArt.webp`, id: 'dream' },
    { text: 'Learn it', art: `/images/${isDark ? 'Dark' : 'Light'}LearnItArt.webp`, id: 'learn' },
    { text: 'Do it', art: `/images/${isDark ? 'Dark' : 'Light'}DoItArt.webp`, id: 'do' }
  ];

  const goToSlide = (index, direction = 'next') => {
    if (isAnimating || index < 0 || index >= illustrations.length || index === currentSlide) return;
    
    setIsAnimating(true);
    const container = containerRef.current;
    if (!container) {
      setIsAnimating(false);
      return;
    }

    const currentElements = {
      text: container.querySelector(`#text-${currentSlide}`),
      art: container.querySelector(`#art-${currentSlide}`)
    };
    
    const nextElements = {
      text: container.querySelector(`#text-${index}`),
      art: container.querySelector(`#art-${index}`)
    };

    if (!nextElements.art) {
      setIsAnimating(false);
      return;
    }

    const isMobile = window.innerWidth < 768;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Determine animation direction
    const isGoingForward = direction === 'next';
    const exitMultiplier = isGoingForward ? -1 : 1;
    const enterMultiplier = isGoingForward ? 1 : -1;

    // Ensure the next image is fully loaded before animating
    const nextImage = nextElements.art;
    
    const performTransition = () => {
      // Animate out current slide - direction depends on navigation
      gsap.to([currentElements.text, currentElements.art], {
        x: isMobile ? 0 : exitMultiplier * viewportWidth,
        y: isMobile ? (isGoingForward ? -viewportHeight : viewportHeight) : 0,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut'
      });

      // Animate in next slide - enters from opposite side
      gsap.fromTo([nextElements.text, nextElements.art],
        {
          x: isMobile ? 0 : enterMultiplier * viewportWidth,
          y: isMobile ? (isGoingForward ? viewportHeight : -viewportHeight) : 0,
          opacity: 0
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.inOut',
          delay: 0.2,
          onComplete: () => {
            setIsAnimating(false);
          }
        }
      );

      setCurrentSlide(index);
    };

    // Check if image is already loaded
    if (nextImage.complete && nextImage.naturalHeight !== 0) {
      performTransition();
    } else {
      // Wait for image to load
      const handleLoad = () => {
        performTransition();
        nextImage.removeEventListener('load', handleLoad);
        nextImage.removeEventListener('error', handleError);
      };
      
      const handleError = () => {
        // Even on error, perform transition to avoid stuck state
        performTransition();
        nextImage.removeEventListener('load', handleLoad);
        nextImage.removeEventListener('error', handleError);
      };

      nextImage.addEventListener('load', handleLoad);
      nextImage.addEventListener('error', handleError);
      
      // Fallback timeout in case image never loads/errors
      setTimeout(() => {
        if (isAnimating) {
          nextImage.removeEventListener('load', handleLoad);
          nextImage.removeEventListener('error', handleError);
          performTransition();
        }
      }, 1000);
    }
  };

  const nextSlide = () => {
    if (currentSlide < illustrations.length - 1) {
      goToSlide(currentSlide + 1, 'next');
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1, 'prev');
    }
  };

  // Preload adjacent images for smoother navigation
  useEffect(() => {
    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
    };

    // Preload next and previous images
    if (currentSlide < illustrations.length - 1) {
      preloadImage(illustrations[currentSlide + 1].art);
    }
    if (currentSlide > 0) {
      preloadImage(illustrations[currentSlide - 1].art);
    }
  }, [currentSlide, illustrations]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !imagesLoaded) return;

    const initAnimation = () => {
      const isMobile = window.innerWidth < 768;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Get all elements
      const elements = illustrations.map((_, index) => ({
        text: container.querySelector(`#text-${index}`),
        art: container.querySelector(`#art-${index}`)
      }));

      // Set all slides offscreen except the first one
      elements.forEach((el, index) => {
        if (!el.text || !el.art) return;

        if (index === 0) {
          // First slide visible
          gsap.set([el.text, el.art], { x: 0, y: 0, opacity: 0 });
        } else {
          // Other slides offscreen
          gsap.set([el.text, el.art], {
            x: isMobile ? 0 : viewportWidth,
            y: isMobile ? viewportHeight : 0,
            opacity: 0
          });
        }
      });

      // Animate first slide entry
      gsap.to([elements[0].text, elements[0].art], {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 1.2,
        delay: 0.3,
        ease: 'power2.out',
        stagger: 0.15
      });
    };

    initAnimation();
  }, [imagesLoaded]);

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
              color: isDark ? '#C7DBFF' : '#143269',
              left: '50%',
              top: '20%',
              transform: 'translate(-50%, -50%)',
              opacity: 0
            }}
          >
            {illust.text}
          </h1>
          <img
            id={`art-${index}`}
            src={illust.art}
            alt={`${illust.id} art`}
            loading="eager"
            fetchPriority="high"
            className="absolute max-w-[80vw] max-h-[80vh] object-contain"
            style={{ 
              opacity: 0,
              ...(index === 1 ? { transform: 'translateX(10%)' } : {})
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
              ? 'bg-white/10 hover:bg-white/20'
              : 'hover:opacity-80'
        }`}
        style={isDark && currentSlide !== 0 ? { color: '#C7DBFF' } : (!isDark && currentSlide !== 0 ? { backgroundColor: 'rgba(20, 50, 105, 0.1)', color: '#143269' } : {})}
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
              ? 'bg-white/10 hover:bg-white/20'
              : 'hover:opacity-80'
        }`}
        style={isDark && currentSlide !== illustrations.length - 1 ? { color: '#C7DBFF' } : (!isDark && currentSlide !== illustrations.length - 1 ? { backgroundColor: 'rgba(20, 50, 105, 0.1)', color: '#143269' } : {})}
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
              ? 'hover:bg-white hover:text-[#143269]' 
              : 'text-[#143269] border-[#143269] hover:bg-[#143269] hover:text-white'
          }`}
          style={isDark ? { color: '#C7DBFF', borderColor: '#C7DBFF' } : {}}
        >
          Pssst there's more
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
});

// Mobile Step Carousel Component - Memoized to prevent unnecessary re-renders
const MobileStepCarousel = memo(function MobileStepCarousel({ isDark, steps, activeTab }) {
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
      <div className="px-6 relative">
        <div className="transition-opacity duration-300 min-h-[550px]">
          {/* Step Image Container */}
          <div className="w-full mb-0">
            {/* Image - Resized smaller and cropped */}
            <div className="w-full rounded-lg flex items-center justify-start overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <img 
                src={steps[currentStep].image}
                alt={`${steps[currentStep].title} illustration`}
                loading="eager"
                fetchPriority="high"
                className="w-[85%] h-[85%] object-cover rounded-lg"
                style={{ 
                  objectPosition: 'center center',
                  clipPath: 'inset(10% 0 10% 0)'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="text-gray-600 text-sm">Image</span>';
                }}
              />
            </div>
          </div>
          
          {/* Step Title */}
          <h3 className="text-xl font-bold mb-4" style={{ color: isDark ? 'white' : '#143269' }}>
            {steps[currentStep].number}. {steps[currentStep].title}
          </h3>
          
          {/* Step Description */}
          <p className="text-base md:text-lg font-normal leading-relaxed" style={{ color: isDark ? '#C7DBFF' : '#143269' }}>
            {steps[currentStep].description}
          </p>
        </div>
        
        {/* Navigation Arrows - Positioned relative to px-6 container */}
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`absolute left-0 top-[45%] -translate-y-1/2 z-10 p-2 rounded-full transition-all ${
            currentStep === 0
              ? 'opacity-0 pointer-events-none'
              : isDark
                ? 'bg-white/10 hover:bg-white/20'
                : 'bg-[#143269]/10 hover:bg-[#143269]/20 text-[#143269]'
          }`}
          style={isDark && currentStep !== 0 ? { color: '#C7DBFF' } : {}}
          aria-label="Previous step"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className={`absolute right-0 top-[45%] -translate-y-1/2 z-10 p-2 rounded-full transition-all ${
            currentStep === steps.length - 1
              ? 'opacity-0 pointer-events-none'
              : isDark
                ? 'bg-white/10 hover:bg-white/20'
                : 'bg-[#143269]/10 hover:bg-[#143269]/20 text-[#143269]'
          }`}
          style={isDark && currentStep !== steps.length - 1 ? { color: '#C7DBFF' } : {}}
          aria-label="Next step"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
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
});

// Mobile Hero Section - Static vertical layout - Memoized
const MobileHeroSection = memo(function MobileHeroSection({ isDark, scrollToSection, imagesLoaded }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);

  const illustrations = [
    { text: 'Dream it', art: `/images/${isDark ? 'Dark' : 'Light'}DreamItArt.webp`, id: 'dream' },
    { text: 'Learn it', art: `/images/${isDark ? 'Dark' : 'Light'}LearnItArt.webp`, id: 'learn' },
    { text: 'Do it', art: `/images/${isDark ? 'Dark' : 'Light'}DoItArt.webp`, id: 'do' }
  ];

  // Function to immediately stop auto-scroll
  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAutoScrollEnabled(false);
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScrollEnabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % illustrations.length);
    }, 3000); // Change slide every 3 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoScrollEnabled, illustrations.length]);

  // Handle touch events for swiping
  const handleTouchStart = (e) => {
    // Ignore touch events that start on buttons
    if (e.target.closest('button')) {
      return;
    }
    stopAutoScroll();
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    // Ignore if touch started on a button
    if (e.target.closest('button')) {
      return;
    }
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
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
    stopAutoScroll();
    setCurrentSlide(index);
  };

  const nextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    stopAutoScroll();
    setCurrentSlide((prev) => (prev + 1) % illustrations.length);
  };

  const prevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    stopAutoScroll();
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
                loading="eager"
                fetchPriority="high"
                className="w-full h-full object-contain"
                style={{ 
                  transform: 'scale(1.2)',
                  clipPath: 'inset(10% 0 10% 0)'
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
                ? 'bg-white/10 hover:bg-white/20'
                : 'bg-[#143269]/10 hover:bg-[#143269]/20 text-[#143269]'
          }`}
          style={isDark && currentSlide !== 0 ? { color: '#C7DBFF' } : {}}
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
                ? 'bg-white/10 hover:bg-white/20'
                : 'bg-[#143269]/10 hover:bg-[#143269]/20 text-[#143269]'
          }`}
          style={isDark && currentSlide !== illustrations.length - 1 ? { color: '#C7DBFF' } : {}}
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
});