import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Sun, Moon } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HobskiLanding({ onNavigate, theme, setTheme }) {
  const [activeTab, setActiveTab] = useState('learner');
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const isDark = theme === 'dark';

  return (
    <div 
      className={`min-h-screen font-['Inter',sans-serif] transition-colors ${
        isDark ? 'bg-black text-white' : 'bg-blue-300 text-black'
      }`}
    >
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b transition-colors ${
        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-4xl font-bold hover:opacity-80 transition-opacity"
          >
            hobski
          </button>
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => scrollToSection('get-involved')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                isDark 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              Join
            </button>
            <button 
              onClick={() => onNavigate('about')}
              className={`px-6 py-2 transition-colors ${
              isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
            }`}>
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className={`px-6 py-2 transition-colors ${
                isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
              }`}
            >
              Contact
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section with GSAP ScrollTrigger - UNTOUCHED */}
      {isMobile ? (
        <MobileHeroSection isDark={isDark} scrollToSection={scrollToSection} />
      ) : (
        <GSAPHeroSection 
          isDark={isDark} 
          scrollToSection={scrollToSection}
        />
      )}

      {/* Hand-drawn border after hero */}
      <HandDrawnBorder isDark={isDark} variant="hero" />

      {/* How Does It Work Section */}
      <ScrollSection 
          id="how-it-works" 
          isDark={isDark}
        >
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-5xl md:text-6xl font-bold mb-12">
              How does it work?
            </h2>

            {/* Tab Buttons */}
            <div className="flex justify-center gap-6 mb-12">
              <button
                onClick={() => setActiveTab('learner')}
                className={`px-12 py-4 rounded-full font-medium transition-all text-lg ${
                  activeTab === 'learner'
                    ? isDark 
                      ? 'bg-white text-black' 
                      : 'bg-black text-white'
                    : isDark
                      ? 'bg-transparent text-white border border-white hover:bg-white/10'
                      : 'bg-transparent text-black border border-black hover:bg-black/10'
                }`}
              >
                As a Learner
              </button>
              <button
                onClick={() => setActiveTab('mentor')}
                className={`px-12 py-4 rounded-full font-medium transition-all text-lg ${
                  activeTab === 'mentor'
                    ? isDark 
                      ? 'bg-white text-black' 
                      : 'bg-black text-white'
                    : isDark
                      ? 'bg-transparent text-white border border-white hover:bg-white/10'
                      : 'bg-transparent text-black border border-black hover:bg-black/10'
                }`}
              >
                As a Mentor
              </button>
            </div>

            {/* Content Area */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                {activeTab === 'learner' ? (
                  <p className={`text-lg leading-relaxed ${
                    isDark ? 'text-gray-300' : 'text-black-700'
                  }`}>
                    Explore a new hobby, get guidance on that DIY project, and take your skills to the next level when you join our community of learners.
                  </p>
                ) : (
                  <p className={`text-lg leading-relaxed ${
                    isDark ? 'text-gray-300' : 'text-black-700'
                  }`}>
                    Share your passions, pass down your knowledge, and help others achieve their goals when you make their hobby dreams come true as a mentor.
                  </p>
                )}
              </div>
            </div>

            {/* Pssst There's More */}
            <div className="text-center mt-16">
              <p className={`italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>*pssst*</p>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>There's more</p>
            </div>
          </div>
        </ScrollSection>

        {/* Hand-drawn border */}
        <HandDrawnBorder isDark={isDark} />

        {/* Get Involved Section */}
        <ScrollSection 
          id="get-involved" 
          isDark={isDark}
          className={isDark ? 'bg-gray-900' : 'bg-gray-50'}
        >
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get involved
            </h2>
            <p className={`text-lg mb-12 ${
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
                  ? 'bg-black border-gray-700 hover:border-white' 
                  : 'bg-white border-gray-300 hover:border-black'
              }`}>
                <div className={`rounded-lg aspect-video mb-6 flex items-center justify-center ${
                  isDark ? 'bg-gray-800' : 'bg-gray-200'
                }`}>
                  <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Learner Image
                  </span>
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
                  ? 'bg-black border-gray-700 hover:border-white' 
                  : 'bg-white border-gray-300 hover:border-black'
              }`}>
                <div className={`rounded-lg aspect-video mb-6 flex items-center justify-center ${
                  isDark ? 'bg-gray-800' : 'bg-gray-200'
                }`}>
                  <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Mentor Image
                  </span>
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

        {/* Hand-drawn border */}
        <HandDrawnBorder isDark={isDark} />

        {/* Contact Section */}
        <ScrollSection 
          id="contact" 
          isDark={isDark}
        >
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              Contact us
            </h2>

            <div className="space-y-6">
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
                        : 'bg-white border-gray-300 focus:border-black text-black'
                    }`}
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
                        : 'bg-white border-gray-300 focus:border-black text-black'
                    }`}
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
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
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
          © 2024 hobski. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// Hand-drawn irregular border line component
function HandDrawnBorder({ isDark, variant = 'default' }) {
  // Different path patterns for variety
  const paths = {
    default: "M0,6 Q15,2 30,7 T60,5 Q75,9 90,4 T120,6 Q135,2 150,8 T180,5 Q195,9 210,3 T240,7 Q255,2 270,6 T300,4 Q315,9 330,5 T360,7 Q375,2 390,6 T420,5 Q435,9 450,4 T480,6 Q495,2 510,8 T540,5 Q555,9 570,3 T600,7 Q615,2 630,6 T660,4 Q675,9 690,5 T720,7 Q735,2 750,6 T780,5 Q795,9 810,4 T840,6 Q855,2 870,8 T900,5 Q915,9 930,3 T960,7 Q975,2 990,6 T1020,4 Q1035,9 1050,5 T1080,7 Q1095,2 1110,6 T1140,5 Q1155,9 1170,4 T1200,6",
    hero: "M0,5 Q20,9 40,4 T80,6 Q100,2 120,8 T160,4 Q180,9 200,5 T240,7 Q260,2 280,6 T320,5 Q340,8 360,3 T400,7 Q420,2 440,8 T480,4 Q500,9 520,5 T560,6 Q580,2 600,7 T640,5 Q660,9 680,3 T720,7 Q740,2 760,6 T800,4 Q820,9 840,5 T880,7 Q900,2 920,6 T960,5 Q980,8 1000,4 T1040,6 Q1060,2 1080,8 T1120,4 Q1140,9 1160,5 T1200,7"
  };

  return (
    <div className="w-full overflow-hidden py-6">
      <svg 
        width="100%" 
        height="16" 
        viewBox="0 0 1200 16" 
        preserveAspectRatio="none"
        className="w-full"
      >
        <path
          d={paths[variant] || paths.default}
          fill="none"
          stroke={isDark ? '#ffffff' : '#000000'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}

// ScrollSection Component - Now with data attribute for magnetic scroll
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

// GSAP Hero Section - COMPLETELY UNTOUCHED
function GSAPHeroSection({ isDark, scrollToSection }) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  
  const illustrations = [
    { text: '/images/DreamIt.png', art: '/images/DreamItArt.png', id: 'dream' },
    { text: '/images/LearnIt.png', art: '/images/LearnItArt.png', id: 'learn' },
    { text: '/images/DoIt.png', art: '/images/DoItArt.png', id: 'do' }
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Get all elements
    const elements = illustrations.map((_, index) => ({
      text: container.querySelector(`#text-${index}`),
      art: container.querySelector(`#art-${index}`)
    }));

    // Set ALL initial positions BEFORE creating timeline
    elements.forEach((el, index) => {
      if (!el.text || !el.art) return;

      if (index === 0) {
        // First illustration: visible in center
        gsap.set([el.text, el.art], { x: 0, opacity: 1 });
      } else {
        // Others: offscreen right
        gsap.set([el.text, el.art], { x: window.innerWidth * 1.2, opacity: 0 });
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
        }
      }
    });

    // Add animations for each transition
    illustrations.forEach((_, index) => {
      if (index === illustrations.length - 1) return;

      const current = elements[index];
      const next = elements[index + 1];
      
      if (!current.text || !current.art || !next.text || !next.art) return;

      const transitionDuration = 0.35;
      const pauseDuration = 0.05;
      const transitionStart = index * (transitionDuration + pauseDuration);
      
      // Current illustration exits left
      mainTimeline.to([current.text, current.art], {
        x: -window.innerWidth,
        opacity: 0,
        ease: 'power2.inOut',
        duration: transitionDuration
      }, transitionStart);

      // Next illustration ART enters from right FIRST
      mainTimeline.to(next.art, {
        x: 0,
        opacity: 1,
        ease: 'power2.inOut',
        duration: transitionDuration
      }, transitionStart);

      // Next illustration TEXT enters from right (slightly delayed for parallax)
      const textFinalX = index === 1 ? window.innerWidth * 0.02 : window.innerWidth * -0.32;
      
      mainTimeline.to(next.text, {
        x: textFinalX,
        opacity: 1,
        ease: 'power2.inOut',
        duration: transitionDuration
      }, transitionStart + 0.05);
    });

    mainTimeline.to({}, { duration: 0.15 });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Illustrations - all positioned absolutely */}
      {illustrations.map((illust, index) => (
        <div key={illust.id} className="absolute inset-0 flex items-center justify-center">
          <img
            id={`text-${index}`}
            src={illust.text}
            alt={`${illust.id} text`}
            className="absolute max-w-[80vw] max-h-[80vh] object-contain z-10"
            style={{ 
              opacity: index === 0 ? 1 : 0,
              maxWidth: index === 2 ? '90vw' : '80vw',
              maxHeight: index === 2 ? '90vh' : '80vh'
            }}
          />
          
          <img
            id={`art-${index}`}
            src={illust.art}
            alt={`${illust.id} art`}
            className="absolute max-w-[80vw] max-h-[80vh] object-contain"
            style={{ opacity: index === 0 ? 1 : 0 }}
          />
        </div>
      ))}

      {/* Progress bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className={`h-1 w-32 rounded-full ${
          isDark ? 'bg-gray-800' : 'bg-gray-200'
        } overflow-hidden`}>
          <div
            className={`h-full transition-all duration-300 ${isDark ? 'bg-white' : 'bg-black'}`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className={`mt-2 text-xs font-medium text-center ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {Math.min(Math.floor(progress * 3) + 1, 3)}/3
        </div>
      </div>

      {/* Keep scrolling button */}
      <div 
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50"
        style={{ opacity: progress > 0.9 ? 1 : 0, transition: 'opacity 0.3s' }}
      >
        <button 
          onClick={() => scrollToSection('how-it-works')}
          className={`inline-flex items-center gap-2 transition-colors group ${
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
          }`}
        >
          Keep scrolling
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// Mobile Hero Section - UNTOUCHED
function MobileHeroSection({ isDark, scrollToSection }) {
  const illustrations = [
    { text: '/images/DreamIt.png', art: '/images/DreamItArt.png', id: 'dream' },
    { text: '/images/LearnIt.png', art: '/images/LearnItArt.png', id: 'learn' },
    { text: '/images/DoIt.png', art: '/images/DoItArt.png', id: 'do' }
  ];

  return (
    <div className="pt-20 pb-10">
      {illustrations.map((illust, index) => (
        <motion.div
          key={illust.id}
          className="min-h-screen flex items-center justify-center px-6 relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
            delay: 0.2
          }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="relative w-full max-w-md">
            <motion.img
              src={illust.text}
              alt={`${illust.id} text`}
              className="w-full relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
            />
            
            <motion.img
              src={illust.art}
              alt={`${illust.id} art`}
              className="w-full absolute top-0 left-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                ease: "easeOut",
                delay: 0.3
              }}
              viewport={{ once: true }}
            />
          </div>
        </motion.div>
      ))}

      <div className="flex justify-center pb-10">
        <button 
          onClick={() => scrollToSection('how-it-works')}
          className={`inline-flex items-center gap-2 transition-colors group ${
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
          }`}
        >
          Keep scrolling
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}