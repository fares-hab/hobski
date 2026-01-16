import { ChevronLeft, Sun, Moon } from 'lucide-react';

export default function About({ onNavigate, theme, setTheme }) {
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
          <div className="flex gap-4 items-center">
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
              onClick={() => onNavigate('landing')}
              className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
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
            <p className={`text-lg leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Hi, we're Tala and Fares Habbab, the sibling founders of hobski! This all started when we each ran into obstacles with our hobbies. At roughly the same time, Tala wished she knew someone who could help her with her sewing project that she'd been stuck on for months, while Fares was having trouble reaching students interested in learning Muay Thai. We found ourselves wishing for a platform where people could connect and help each other grow their interests.
            </p>

            <p className={`text-lg leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              That's why we're building a new way for people to connect, share skills, and learn from each other. This is our early stage website, and we're inviting mentors and learners to join our community, share their interests, and help us bring hobski to life.
            </p>

            <p className={`text-lg leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Thank you for being a part of our journey.
            </p>

            <p className={`text-lg leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-700'
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
          © 2024 hobski. All rights reserved.
        </div>
      </footer>
    </div>
  );
}