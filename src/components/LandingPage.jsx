import { useState } from 'react';
import { ChevronDown, Sun, Moon } from 'lucide-react';

export default function HobskiLanding({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('learner');
  const [theme, setTheme] = useState('dark');

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-['Inter',sans-serif] transition-colors ${
      isDark ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b transition-colors ${
        isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'
      }`}>
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-4xl font-bold">hobski</div>
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
            <button className={`px-6 py-2 transition-colors ${
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-5xl font-bold mb-6 leading-tight">
            Find your mentor.<br />
            Master your hobby.<br />
            Bring your projects to life.
          </h1>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className={`inline-flex items-center gap-2 transition-colors mt-8 group ${
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            Keep scrolling
            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* How Does It Work Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
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
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Explore a new hobby, get guidance on that DIY project, and take your skills to the next level when you join our community of learners.
                </p>
              ) : (
                <p className={`text-lg leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Share your passions, pass down your knowledge, and help others achieve their goals when you make their hobby dreams come true as a mentor.
                </p>
              )}
            </div>

            {/* Image Placeholder */}
            <div className={`rounded-lg aspect-square flex items-center justify-center ${
              isDark ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {activeTab === 'learner' ? 'Learner Image' : 'Mentor Image'}
              </span>
            </div>
          </div>

          {/* Pssst There's More */}
          <div className="text-center mt-16">
            <p className={`italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>*pssst*</p>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>There's more</p>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section id="get-involved" className={`py-20 px-6 transition-colors ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-6xl mx-auto">
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
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
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
      </section>

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