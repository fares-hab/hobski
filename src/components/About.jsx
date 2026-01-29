import { ChevronLeft, Sun, Moon } from 'lucide-react';

export default function About({ onNavigate, theme, setTheme }) {
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-['Inter',sans-serif] transition-colors ${
      isDark ? 'text-white' : ''
    }`}
    style={isDark ? { backgroundColor: '#143269' } : { backgroundColor: 'white', color: '#143269' }}>
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 ${
          isDark ? 'border-gray-800' : 'border-blue-80'
        }`}
        style={{ 
          backgroundColor: isDark ? 'rgba(20, 50, 105, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: isDark ? '1px solid rgb(31, 41, 55)' : '1px solid rgb(229, 231, 235)'
        }}
      >
        <nav className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('landing')}
            className="text-2xl sm:text-4xl font-bold hover:opacity-80 px-2 sm:px-6"
            style={{ transition: 'opacity 0.2s' }}
          >
            hobski
          </button>
          <div className="flex gap-2 sm:gap-4 items-center">
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
              onClick={() => onNavigate('landing')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base transition-colors ${
                isDark ? 'text-white hover:text-gray-300' : 'hover:text-gray-600'
              }`}
              style={!isDark ? { color: '#143269', transition: 'color 0.2s' } : { transition: 'color 0.2s' }}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              Home
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16 pt-32">
        <h1 className="text-5xl md:text-6xl font-bold mb-12">
          Who are we?
        </h1>

        <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
          {/* Text Content */}
          <div className="space-y-6">
            <p className={`text-lg leading-relaxed font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-900'
            }`}>
              Hi, we're Tala and Fares Habbab, the sibling founders of hobski! This all started when we each ran into obstacles with our hobbies. At roughly the same time, Tala wished she knew someone who could help her with her sewing project that she'd been stuck on for months, while Fares was having trouble reaching students interested in learning Muay Thai. We found ourselves wishing for a platform where peers could connect and help each other grow their interests.
            </p>

            <p className={`text-lg leading-relaxed font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-900'
            }`}>
              That's why we're building a new way for people to connect, share skills, and learn from each other. This is our early stage website, and we're inviting mentors and learners to join our community, share their interests, and help us bring hobski to life.
            </p>

            <p className={`text-lg leading-relaxed font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-900'
            }`}>
              Thank you for being a part of our journey.
            </p>

            <p className={`text-lg leading-relaxed font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-900'
            }`}>
              Fares & Tala
            </p>
          </div>

          {/* Image Placeholder */}
          <div className={`rounded-full aspect-square flex items-center justify-center ${
            isDark ? 'bg-gray-800' : 'bg-gray-200'
          }`}>
            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Image
            </span>
          </div>
        </div>
      </main>

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