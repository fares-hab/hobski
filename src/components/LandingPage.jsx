import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ImageWithSkeleton from './ImageWithSkeleton';
import Navigation from './Navigation';

export default function HobskiLanding({ theme, setTheme }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('learner');
  const [showNotice, setShowNotice] = useState(true);
  const [isMobile, setIsMobile] = useState(() => {
    // Initialize with correct value to prevent flash of wrong component
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

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
      className="min-h-screen font-['Inter',sans-serif] bg-theme-primary text-theme-primary"
    >
      {/* Navigation */}
      <Navigation 
        theme={theme} 
        setTheme={setTheme} 
        variant="landing" 
        activeTab={activeTab}
        onScrollToSection={scrollToSection}
      />

      {/* Hero Carousel Section */}
      <HeroCarousel theme={theme} scrollToSection={scrollToSection} />

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
      <div 
        className="bg-theme-secondary"
        style={{ 
          marginTop: '-1.5rem',
          marginBottom: '-5rem',
          paddingTop: '3rem',
          paddingBottom: '3rem',
        clipPath: isMobile ? 'url(#wavy-top-bottom-mobile)' : 'url(#wavy-top-bottom)'
      }}>
        <ScrollSection 
            id="how-it-works"
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
                  className={`flex-1 px-4 py-2 md:px-8 md:py-3 font-semibold text-lg md:text-xl ${
                    activeTab === 'learner'
                      ? 'text-white z-10 bg-theme-tab-active'
                      : 'text-theme-tab-inactive bg-theme-tab-inactive hover:brightness-95'
                  }`}
                  style={{ 
                    borderRadius: '9999px 0 0 9999px',
                    position: 'relative',
                    transform: activeTab === 'learner' ? 'scaleX(1.05) scaleY(1.05)' : 'scale(1)',
                    transformOrigin: 'right center',
                    transition: 'filter 0.2s'
                  }}
                >
                  Learner
                </button>
                <button
                  onClick={() => setActiveTab('mentor')}
                  className={`flex-1 px-4 py-2 md:px-8 md:py-3 font-semibold text-lg md:text-xl ${
                    activeTab === 'mentor'
                      ? 'text-white z-10 bg-theme-tab-active'
                      : 'text-theme-tab-inactive bg-theme-tab-inactive hover:brightness-95'
                  }`}
                  style={{ 
                    borderRadius: '0 9999px 9999px 0',
                    position: 'relative',
                    transform: activeTab === 'mentor' ? 'scaleX(1.05) scaleY(1.05)' : 'scale(1)',
                    transformOrigin: 'left center',
                    transition: 'filter 0.2s'
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
                <div className="hidden md:block mb-12 max-w-6xl mx-auto">
                  {/* Single Horizontal Image */}
                  <div className="w-full mb-8 rounded-lg overflow-hidden">
                    <ImageWithSkeleton
                      src={`/images/${isDark ? 'Dark' : 'Light'}LearnerSteps.png`}
                      alt="Learner steps illustration"
                      className="w-full h-auto object-contain"
                      loading="lazy"
                      skeletonClassName="!bg-transparent !bg-none"
                      showErrorMessage={false}
                    />
                  </div>

                  {/* Step Descriptions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
                    {/* Step 1 */}
                    <div className="flex flex-col items-start">
                      <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-theme-primary">
                        1. Find your hobby
                      </h3>
                      <p className="text-base md:text-lg font-normal leading-relaxed text-theme-primary">
                        Got a hobby or project in mind? Just type it into our search bar, or browse through our categories for inspiration!
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-start">
                      <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-theme-primary">
                        2. Browse mentors
                      </h3>
                      <p className="text-base md:text-lg font-normal leading-relaxed text-theme-primary">
                        Take a look at available mentors and browse their portfolios, rates, schedules, resources, and reviews!
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-start">
                      <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-theme-primary">
                        3. Book a session
                      </h3>
                      <p className="text-base md:text-lg font-normal leading-relaxed text-theme-primary">
                        Request a session with a mentor. Outline your goals, resources, session preferences, and chat with your mentor before confirming!
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-start">
                      <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-theme-primary">
                        4. Get learning!
                      </h3>
                      <p className="text-base md:text-lg font-normal leading-relaxed text-theme-primary">
                        Meet in-person or virtually, depending on your preferences, and get learning!
                      </p>
                    </div>
                  </div>
                </div>

              {/* Mobile Carousel View */}
              <MobileStepCarousel 
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
              <div className="hidden md:block mb-12 max-w-6xl mx-auto">
                {/* Single Horizontal Image */}
                <div className="w-full mb-8 rounded-lg overflow-hidden">
                  <ImageWithSkeleton
                    src={`/images/${isDark ? 'Dark' : 'Light'}MentorSteps.png`}
                    alt="Mentor steps illustration"
                    className="w-full h-auto object-contain"
                    loading="lazy"
                    skeletonClassName="!bg-transparent !bg-none"
                    showErrorMessage={false}
                  />
                </div>

                {/* Step Descriptions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
                  {/* Mentor Step 1 */}
                  <div className="flex flex-col items-start">
                    <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-theme-primary">
                      1. Find your skill OR Create one
                    </h3>
                    <p className="text-base md:text-lg font-normal leading-relaxed text-theme-primary">
                      Browse through our skill categories and choose yours. If you can't find it, request to add a new one to our list!
                    </p>
                  </div>

                  {/* Mentor Step 2 */}
                  <div className="flex flex-col items-start">
                    <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-theme-primary">
                      2. Set up your profile
                    </h3>
                    <p className="text-base md:text-lg font-normal leading-relaxed text-theme-primary">
                      Demonstrate your skill. Pick your skill level, rate, schedule, and outline your session preferences (resources offered, session size, and location).
                    </p>
                  </div>

                  {/* Mentor Step 3 */}
                  <div className="flex flex-col items-start">
                    <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-theme-primary">
                      3. Chat with learners
                    </h3>
                    <p className="text-base md:text-lg font-normal leading-relaxed text-theme-primary">
                      Start a conversation with learners when they've requested a session and discuss goals and sessions details before confirming!
                    </p>
                  </div>

                  {/* Mentor Step 4 */}
                  <div className="flex flex-col items-start">
                    <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-theme-primary">
                      4. Get mentoring!
                    </h3>
                    <p className="text-base md:text-lg font-normal leading-relaxed text-theme-primary">
                      Meet your learners in-person or virtually, depending on your preferences, and get mentoring!
                    </p>
                  </div>
                </div>
              </div>


              {/* Mobile Carousel View */}
              <MobileStepCarousel 
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
        <div 
          className="bg-theme-involved"
          style={{ 
            marginTop: '-4rem',
            paddingTop: '2rem'
          }}
        >
          <ScrollSection 
            id="get-involved"
          >
            <div className="max-w-7xl mx-auto px-5 sm:px-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-theme-involved">
              Get involved
            </h2>
            <p className="text-2xl mb-8 md:mb-60 text-theme-involved">              
              Got a hobby or skill you're interested in? Join us!
            </p>

            <div className="flex flex-col md:flex-row gap-6 md:gap-16 justify-center items-stretch md:items-stretch items-center">
              {/* As a Learner Card with Illustration */}
              <div className="relative w-full max-w-md md:max-w-xl group md:transition-transform md:hover:scale-110">
                {/* Card wrapper - mt creates space for image on mobile */}
                <div className="relative mt-28 md:mt-0">
                  {/* Character Illustration - anchored to card top */}
                  <img 
                    src={`/images/${isDark ? 'Dark' : 'Light'}LearnerJoin.webp`}
                    alt=""
                    loading="eager"
                    fetchPriority="high"
                    className="absolute pointer-events-none w-full md:w-[120%] h-auto object-contain z-10"
                    style={{
                      // LEARNER IMAGE - Locked to card position
                      // bottom: 100% = image bottom aligns with card top
                      // marginBottom = negative to overlap, positive to add gap
                      bottom: '19%',
                      marginBottom: '0px',  // ADJUST: overlap onto card (px)
                      left: '-2%',            // ADJUST: horizontal position
                    }}
                  />
                  
                  {/* Card */}
                  <button 
                    onClick={() => navigate('/signup/learner')}
                    className="relative z-0 rounded-2xl p-8 text-left w-full bg-theme-involved-card"
                  >
                    <h3 className="text-2xl font-bold mb-3 text-theme-on-card">As a Learner</h3>
                    <p className="leading-relaxed text-theme-on-card-muted">
                      Explore a new hobby, get guidance on that DIY project, and take your skills to the next level when you join our community of learners.
                    </p>
                  </button>
                </div>
              </div>

              {/* As a Mentor Card with Illustration */}
              <div className="relative w-full max-w-md md:max-w-xl group md:transition-transform md:hover:scale-110 isolate">
                {/* Card wrapper - mt creates space for image on mobile */}
                <div className="relative mt-40 md:mt-0">
                  {/* Body Image - Behind the card, anchored to card top */}
                  <img 
                    src={`/images/${isDark ? 'Dark' : 'Light'}MentorBodyCard.webp`}
                    alt=""
                    loading="eager"
                    fetchPriority="high"
                    className="absolute pointer-events-none w-full md:w-[120%] h-auto object-contain z-0"
                    style={{
                      // MENTOR BODY - Locked to card position
                      bottom: '100%',
                      marginBottom: '-10px',  // ADJUST: overlap onto card (px)
                      left: '5%',             // ADJUST: horizontal position
                    }}
                  />

                  {/* Card */}
                  <button 
                    onClick={() => navigate('/signup/mentor')}
                    className="relative z-10 rounded-2xl p-8 text-left w-full bg-theme-involved-card"
                  >
                    <h3 className="text-2xl font-bold mb-3 text-theme-on-card">As a Mentor</h3>
                    <p className="leading-relaxed text-theme-on-card-muted">
                      Share your passions, pass down your knowledge, and help others achieve their goals when you make their hobby dreams come true as a mentor.
                    </p>
                  </button>
                  
                  {/* Arm Image - Above the card, anchored to card top */}
                  <img 
                    src={`/images/${isDark ? 'Dark' : 'Light'}MentorArm.webp`}
                    alt=""
                    loading="eager"
                    fetchPriority="high"
                    className="absolute pointer-events-none w-full md:w-[120%] h-auto object-contain z-20"
                    style={{
                      // MENTOR ARM - Locked to card position
                      bottom: '100%',
                      marginBottom: '-10px',  // ADJUST: overlap onto card (px)
                      left: '5%',             // ADJUST: horizontal position
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
          marginTop: '-4.5rem',
          marginBottom: '-4.0rem',
          paddingTop: '1rem',
          paddingBottom: '1rem',
          clipPath: isMobile ? 'url(#wavy-top-bottom-mobile)' : 'url(#wavy-top-bottom)'
        }}
        className="bg-theme-secondary"
        >
        <ScrollSection 
          id="contact"
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              Contact us
            </h2>

            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm mb-2 text-theme-muted">
                    First Name (required)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-0 rounded-lg focus:outline-none bg-theme-primary text-theme-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-theme-muted">
                    Last Name (required)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-0 rounded-lg focus:outline-none bg-theme-primary text-theme-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-theme-muted">
                    Email (required)
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border-0 rounded-lg focus:outline-none bg-theme-primary text-theme-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2 text-theme-muted">
                  Message
                </label>
                <textarea
                  rows="6"
                  className="w-full px-4 py-3 border-0 rounded-lg focus:outline-none resize-none bg-theme-primary text-theme-primary"
                />
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Handle form submission
                }}
                className="w-full px-8 py-4 rounded-full font-medium text-lg bg-theme-accent text-theme-on-accent hover:opacity-80"
              >
                Send Message
              </button>
            </div>
          </div>
        </ScrollSection>
        </div>

      {/* Footer */}
      <footer className="relative z-20 py-8 px-6 bg-theme-primary">
        <div className="max-w-7xl mx-auto text-center text-sm text-theme-secondary">
          ℠ 2026 hobski. 
        </div>
      </footer>

      {/* Construction Notice Bubble */}
      {showNotice && (
        <div 
          className="fixed bottom-6 left-6 z-50 max-w-sm rounded-2xl shadow-2xl border-2 bg-theme-notice border-theme-notice"
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
              className="absolute top-2 right-2 p-1 rounded-full transition-colors hover:bg-theme-hover"
              aria-label="Close notice"
            >
              <svg 
                className="w-5 h-5 text-theme-notice-icon"
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
            <p className="text-sm font-medium leading-relaxed text-theme-notice">
              We are still under construction but feel free to look around!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ScrollSection Component - Memoized to prevent unnecessary re-renders
const ScrollSection = memo(function ScrollSection({ id, children, className = '' }) {
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

// Hero Carousel Component
const HeroCarousel = memo(function HeroCarousel({ theme, scrollToSection }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const slides = [
    { 
      text: 'Dream it', 
      image: `/images/${theme === 'dark' ? 'Dark' : 'Light'}DreamItArt.webp`,
      alt: 'Dream it illustration'
    },
    { 
      text: 'Learn it', 
      image: `/images/${theme === 'dark' ? 'Dark' : 'Light'}LearnItArt.webp`,
      alt: 'Learn it illustration'
    },
    { 
      text: 'Do it', 
      image: `/images/${theme === 'dark' ? 'Dark' : 'Light'}DoItArt.webp`,
      alt: 'Do it illustration'
    }
  ];

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-screen pt-16 bg-theme-primary">
      {/* Carousel wrapper */}
      <div className="relative h-full overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const isPrev = index < currentSlide;
          const isNext = index > currentSlide;
          
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-transform duration-700 ease-out ${
                isActive 
                  ? 'translate-x-0 z-10' 
                  : isPrev 
                    ? '-translate-x-full z-0' 
                    : 'translate-x-full z-0'
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full px-8 -mt-10">
                {/* Text Header */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold mb-0 md:-mb-32 text-center text-theme-primary">
                  {slide.text}
                </h1>
                {/* Image */}
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full md:w-[95%] lg:w-[90%] max-w-7xl object-contain"
                  style={{ maxHeight: '80vh' }}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Slider indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 space-x-3 bottom-24 left-1/2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className="w-3 h-3 rounded-full transition-colors"
            style={{
              backgroundColor: index === currentSlide ? '#377BD9' : '#95a8c5'
            }}
            aria-current={index === currentSlide}
            aria-label={`Slide ${index + 1}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Slider controls */}
      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full card-nav-arrow group-hover:opacity-80 group-focus:ring-4 group-focus:outline-none">
          <svg 
            className="w-5 h-5 text-theme-primary" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7"/>
          </svg>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full card-nav-arrow group-hover:opacity-80 group-focus:ring-4 group-focus:outline-none">
          <svg 
            className="w-5 h-5 text-theme-primary" 
            aria-hidden="true" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7"/>
          </svg>
        </span>
      </button>

      {/* Scroll down button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button 
          onClick={() => scrollToSection('how-it-works')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 group border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-theme-on-accent transition-colors"
        >
          Pssst there's more
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
});


// Mobile Step Carousel Component - Memoized to prevent unnecessary re-renders
const MobileStepCarousel = memo(function MobileStepCarousel({ steps, activeTab }) {
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
                loading="lazy"
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
          <h3 className="text-xl font-bold mb-4 text-theme-on-card">
            {steps[currentStep].number}. {steps[currentStep].title}
          </h3>
          
          {/* Step Description */}
          <p className="text-base md:text-lg font-normal leading-relaxed text-theme-primary">
            {steps[currentStep].description}
          </p>
        </div>
        
        {/* Navigation Arrows - Positioned relative to px-6 container */}
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`absolute left-0 top-[45%] -translate-y-1/2 z-10 text-theme-primary ${
            currentStep === 0
              ? 'opacity-0 pointer-events-none'
              : 'card-nav-arrow'
          }`}
          aria-label="Previous step"
        >
          <ChevronDown className="w-6 h-6 rotate-90" />
        </button>

        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className={`absolute right-0 top-[45%] -translate-y-1/2 z-10 text-theme-primary ${
            currentStep === steps.length - 1
              ? 'opacity-0 pointer-events-none'
              : 'card-nav-arrow'
          }`}
          aria-label="Next step"
        >
          <ChevronDown className="w-6 h-6 -rotate-90" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => goToStep(index)}
            className="rounded-full transition-colors duration-200"
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