import { useState, useEffect } from 'react';
import { Sun, Moon, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const isDark = theme === 'dark';

  // Preload form images for both themes
  useEffect(() => {
    const imagesToPreload = [
      '/images/DarkMentorForm.webp',
      '/images/LightMentorForm.webp'
    ];

    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Check for common email typos
  const checkEmailTypo = (email) => {
    const commonDomains = {
      'gmail.com': ['gmai.com', 'gmial.com', 'gmal.com', 'gmil.com', 'gmaii.com', 'gmaill.com'],
      'hotmail.com': ['hotmai.com', 'hotmial.com', 'hotmil.com', 'hotmaii.com', 'hotmaill.com'],
      'yahoo.com': ['yaho.com', 'yahooo.com', 'yhoo.com', 'yaoo.com'],
      'outlook.com': ['outlok.com', 'outloo.com', 'outloook.com'],
      'icloud.com': ['iclod.com', 'iclou.com', 'icoud.com'],
      'aol.com': ['ao.com', 'aoll.com']
    };

    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return null;

    for (const [correct, typos] of Object.entries(commonDomains)) {
      if (typos.includes(domain)) {
        return correct;
      }
    }
    return null;
  };

  const validatePage1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    } else {
      // Check for typos
      const suggestedDomain = checkEmailTypo(formData.email);
      if (suggestedDomain) {
        const username = formData.email.split('@')[0];
        newErrors.email = `Did you mean ${username}@${suggestedDomain}?`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePage2 = () => {
    const newErrors = {};
    
    if (!formData.hobbies.trim()) {
      newErrors.hobbies = 'Please list at least one hobby or skill';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validatePage1()) {
      return;
    }

    // Check for duplicate email before moving to page 2
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const emailToCheck = formData.email.trim().toLowerCase();
      const { data: existingUsers, error: checkError } = await supabase
        .from('mentors')
        .select('email')
        .eq('email', emailToCheck)
        .limit(1);

      if (checkError) {
        console.error('Error checking duplicate email:', checkError);
        setSubmitError('An error occurred. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (existingUsers && existingUsers.length > 0) {
        setErrors({ email: 'This email is already registered as a mentor' });
        setSubmitError('This email is already registered. Please use a different email or contact us if you need help.');
        setIsSubmitting(false);
        return;
      }

      // Email is unique, proceed to page 2
      setIsSubmitting(false);
      setCurrentPage(2);
    } catch (err) {
      console.error('Error during duplicate check:', err);
      setSubmitError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentPage(1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validatePage2()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Proceed with insertion
      const { data, error } = await supabase
        .from('mentors')
        .insert([
          {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim() || null,
            hobbies: formData.hobbies.trim(),
            participate_research: formData.participateResearch,
            notify_launch: formData.notifyLaunch,
            how_heard: formData.howHeard || null,
            other_source: formData.otherSource.trim() || null
          }
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        setSubmitError('There was an error submitting your form. Please try again.');
        return;
      }

      // Success - move to thank you page
      setCurrentPage(3);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen font-['Inter',sans-serif] transition-colors ${
      isDark ? 'text-white' : ''
    }`}
    style={isDark ? { backgroundColor: '#143269', color: 'white' } : { backgroundColor: '#E6F6FF', color: '#143269' }}>
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
                isDark ? 'hover:opacity-80' : 'hover:text-gray-600'
              }`}
              style={isDark ? { color: '#C7DBFF', transition: 'color 0.2s' } : { color: '#143269', transition: 'color 0.2s' }}
            >
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
                        errors.firstName
                          ? 'border-red-500 focus:border-red-500'
                          : isDark 
                            ? 'bg-gray-900 border-gray-700' 
                            : 'bg-white border-gray-300 focus:border-black text-black'
                      }`}
                      style={isDark && !errors.firstName ? { borderColor: '#C7DBFF', color: '#C7DBFF' } : {}}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
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
                        errors.lastName
                          ? 'border-red-500 focus:border-red-500'
                          : isDark 
                            ? 'bg-gray-900 border-gray-700' 
                            : 'bg-white border-gray-300'
                      }`}
                      style={isDark && !errors.lastName ? { borderColor: '#C7DBFF', color: '#C7DBFF' } : {}}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
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
                      errors.email
                        ? 'border-red-500 focus:border-red-500'
                        : isDark 
                          ? 'bg-gray-900 border-gray-700' 
                          : 'bg-white border-gray-300'
                    }`}
                    style={isDark && !errors.email ? { borderColor: '#C7DBFF', color: '#C7DBFF' } : {}}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
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
                        ? 'bg-gray-900 border-gray-700' 
                        : 'bg-white border-transparent'
                    }`}
                    style={isDark ? { borderColor: '#C7DBFF', color: '#C7DBFF' } : {}}
                  />
                </div>

                {submitError && (
                  <div className="p-4 rounded-lg bg-red-100 border border-red-300 text-red-700">
                    {submitError}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-full font-medium transition-colors ${
                      isSubmitting
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark 
                          ? 'hover:opacity-80' 
                          : 'bg-black text-white hover:bg-gray-800'
                    }`}
                    style={isDark && !isSubmitting ? { backgroundColor: '#C7DBFF', color: '#143269' } : {}}
                  >
                    {isSubmitting ? 'Checking...' : 'Next'}
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
                      errors.hobbies
                        ? 'border-red-500 focus:border-red-500'
                        : isDark 
                          ? 'bg-gray-900 border-gray-700 placeholder-gray-500' 
                          : 'bg-white border-gray-300 placeholder-gray-400'
                    }`}
                    style={isDark && !errors.hobbies ? { borderColor: '#C7DBFF', color: '#C7DBFF' } : (!isDark && !errors.hobbies ? { borderColor: '#143269', color: '#143269' } : {})}
                  />
                  {errors.hobbies && (
                    <p className="text-red-500 text-sm mt-1">{errors.hobbies}</p>
                  )}
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
                    How did you hear about us?
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
                            ? 'bg-gray-900 border-gray-700' 
                            : 'bg-white border-gray-300'
                        }`}
                        style={isDark ? { borderColor: '#C7DBFF', color: '#C7DBFF' } : { borderColor: '#143269', color: '#143269' }}
                      />
                    )}
                  </div>
                </div>

                {submitError && (
                  <div className="p-4 rounded-lg bg-red-100 border border-red-300 text-red-700">
                    {submitError}
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-full font-medium transition-colors ${
                      isSubmitting
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark 
                          ? 'bg-gray-800 hover:bg-gray-700' 
                          : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    style={isDark && !isSubmitting ? { color: '#C7DBFF' } : (!isDark ? { color: '#143269' } : {})}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-full font-medium transition-colors ${
                      isSubmitting
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark 
                          ? 'hover:opacity-80' 
                          : 'bg-black text-white hover:bg-gray-800'
                    }`}
                    style={isDark && !isSubmitting ? { backgroundColor: '#C7DBFF', color: '#143269' } : {}}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Page 3: Thank You */}
          {currentPage === 3 && (
            <div className="text-center">
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
                  loading="eager"
                  fetchpriority="high"
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