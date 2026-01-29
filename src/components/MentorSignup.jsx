import { useState } from 'react';
import { Sun, Moon, ChevronLeft } from 'lucide-react';

export default function MentorSignup({ onNavigate, theme, setTheme }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    hobbies: '',
    participateResearch: false,
    notifyLaunch: false,
    howHeard: '',
    otherSource: ''
  });

  const isDark = theme === 'dark';

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    setCurrentPage(2);
  };

  const handleBack = () => {
    setCurrentPage(1);
  };

  const handleSubmit = () => {
    setCurrentPage(3);
  };

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
            onClick={() => onNavigate('landing')}
            className={`flex items-center gap-2 px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base transition-colors ${
              isDark ? 'text-white hover:text-gray-300' : 'hover:text-gray-600'
            }`}
            style={!isDark ? { color: '#143269', transition: 'color 0.2s' } : { transition: 'color 0.2s' }}>
              <ChevronLeft className="w-4 h-4" />
              Home
            </button>
            <button 
            onClick={() => onNavigate('about')}
            className={`px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base transition-colors ${
              isDark ? 'text-white hover:text-gray-300' : 'hover:text-gray-600'
            }`}
            style={!isDark ? { color: '#143269', transition: 'color 0.2s' } : { transition: 'color 0.2s' }}>
              About
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          
          {/* Page 1: Basic Info */}
          {currentPage === 1 && (
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Become a mentor</h1>
              <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                We are currently working to bring this app to you. Sign up to participate in our early testing, get notified when we launch, and help us make this a reality!
              </p>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      First Name <span className="text-gray-400">(required)</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                        isDark 
                          ? 'bg-gray-900 border-gray-700 focus:border-white text-white' 
                          : 'bg-white border-gray-300 focus:border-black text-black'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Last Name <span className="text-gray-400">(required)</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
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
                  <label className={`block mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email <span className="text-gray-400">(required)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-gray-900 border-gray-700 focus:border-white text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                    style={!isDark ? { borderColor: '#143269', color: '#143269' } : {}}
                  />
                </div>

                <div>
                  <label className={`block mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${
                      isDark 
                        ? 'bg-gray-900 border-gray-700 focus:border-white text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                    style={!isDark ? { borderColor: '#143269', color: '#143269' } : {}}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className={`px-8 py-3 rounded-full font-medium transition-colors ${
                      isDark 
                        ? 'bg-white text-black hover:bg-gray-200' 
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Page 2: Additional Info */}
          {currentPage === 2 && (
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-8">Become a mentor</h1>

              <div className="space-y-8">
                <div>
                  <label className={`block mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    List 1-3 hobbies, skills, or projects that you'd like to mentor <span className="text-gray-400">(required)</span>
                  </label>
                  <textarea
                    name="hobbies"
                    value={formData.hobbies}
                    onChange={handleInputChange}
                    placeholder="(e.g, Guitar, Muay-Thai, Sewing, DIY home projects)"
                    rows="6"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors resize-none ${
                      isDark 
                        ? 'bg-gray-900 border-gray-700 focus:border-white text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 placeholder-gray-400'
                    }`}
                    style={!isDark ? { borderColor: '#143269', color: '#143269' } : {}}
                  />
                </div>

                <div>
                  <label className={`block mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    I would like to... <span className="text-gray-400">(required)</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="participateResearch"
                        checked={formData.participateResearch}
                        onChange={handleInputChange}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span>Participate in research & testing</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="notifyLaunch"
                        checked={formData.notifyLaunch}
                        onChange={handleInputChange}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span>Get notified when we launch</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className={`block mb-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Optional: How did you hear about us?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="howHeard"
                        value="reddit"
                        checked={formData.howHeard === 'reddit'}
                        onChange={handleInputChange}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span>Reddit</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="howHeard"
                        value="instagram"
                        checked={formData.howHeard === 'instagram'}
                        onChange={handleInputChange}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span>Instagram</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="howHeard"
                        value="flyer"
                        checked={formData.howHeard === 'flyer'}
                        onChange={handleInputChange}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span>Flyer</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="howHeard"
                        value="friends"
                        checked={formData.howHeard === 'friends'}
                        onChange={handleInputChange}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span>Friends</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="howHeard"
                        value="other"
                        checked={formData.howHeard === 'other'}
                        onChange={handleInputChange}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span>Other</span>
                    </label>
                    {formData.howHeard === 'other' && (
                      <input
                        type="text"
                        name="otherSource"
                        value={formData.otherSource}
                        onChange={handleInputChange}
                        className={`w-full max-w-md ml-8 px-4 py-2 border rounded-lg focus:outline-none transition-colors ${
                          isDark 
                            ? 'bg-gray-900 border-gray-700 focus:border-white text-white' 
                            : 'bg-white border-gray-300'
                        }`}
                        style={!isDark ? { borderColor: '#143269', color: '#143269' } : {}}
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={handleBack}
                    className={`px-8 py-3 rounded-full font-medium transition-colors ${
                      isDark 
                        ? 'bg-gray-800 text-white hover:bg-gray-700' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    style={!isDark ? { color: '#143269' } : {}}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={`px-8 py-3 rounded-full font-medium transition-colors ${
                      isDark 
                        ? 'bg-white text-black hover:bg-gray-200' 
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Page 3: Thank You */}
          {currentPage === 3 && (
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Thank you for joining us on our journey!</h1>
              <div className={`text-lg space-y-6 mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <p>
                  As an early mentor, you'll be part of our pilot and help shape how hobski works while connecting with curious learners in your community.
                </p>
                <p>
                  If there is a project you would like mentorship with or a skill you want to dip your toes into, be sure to <span className="underline cursor-pointer">sign up as a learner as well!</span>
                </p>
                <p className="font-medium">You're making it happen!</p>
              </div>

              {/* Character Image */}
              <div className="mt-12 w-96 h-96 mx-auto flex items-center justify-center">
                <img 
                  src={`/images/${isDark ? 'Dark' : 'Light'}MentorForm.webp`}
                  alt="Mentor character illustration"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}