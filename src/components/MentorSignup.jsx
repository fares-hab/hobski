import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { sendConfirmationEmail } from '../lib/email';
import Navigation from './Navigation';

export default function MentorSignup({ theme, setTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const prefill = location.state?.prefill;

  const [currentPage, setCurrentPage] = useState(location.state?.startAtPage2 ? 2 : 1);
  const [formData, setFormData] = useState({
    firstName: prefill?.firstName || '',
    lastName:  prefill?.lastName  || '',
    email:     prefill?.email     || '',
    phone:     prefill?.phone     || '',
    hobbies: '',
    participateResearch: false,
    notifyLaunch: false,
    howHeard: '',
    otherSource: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [crossLinkChecking, setCrossLinkChecking] = useState(false);
  const [crossLinkError, setCrossLinkError] = useState('');

  const isDark = theme === 'dark';

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

  const handleCrossLinkToLearner = async () => {
    setCrossLinkChecking(true);
    setCrossLinkError('');
    try {
      const { data, error } = await supabase
        .from('learners')
        .select('email')
        .eq('email', formData.email.trim().toLowerCase())
        .limit(1);
      if (error) throw error;
      if (data && data.length > 0) {
        setCrossLinkError("You're already signed up as a learner, because you're cool like that!");
        return;
      }
      navigate('/signup/learner', {
        state: {
          prefill: { firstName: formData.firstName, lastName: formData.lastName,
                     email: formData.email, phone: formData.phone },
          startAtPage2: true
        }
      });
    } catch {
      setCrossLinkError('Something went wrong. Please try again.');
    } finally {
      setCrossLinkChecking(false);
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

      // Success - send confirmation email (don't block on failure)
      sendConfirmationEmail(formData.email.trim().toLowerCase(), formData.firstName.trim(), 'mentor');
      setCurrentPage(3);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-['Inter',sans-serif] bg-theme-primary text-theme-primary overflow-x-hidden">
      {/* Navigation */}
      <Navigation theme={theme} setTheme={setTheme} variant="page" />

      {/* Main Content */}
      <main className={`${currentPage === 3 ? 'pt-20' : 'pt-32'} pb-20 px-6`}>
        <div className="max-w-2xl mx-auto">
          
          {/* Page 1: Basic Info */}
          {currentPage === 1 && (
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Become a mentor</h1>
              <p className="text-lg mb-8 text-theme-muted">
                We are currently working to bring this app to you. Sign up to participate in our early testing, get notified when we launch, and help us make this a reality!
              </p>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-theme-muted">
                      First Name <span className="text-theme-required-signup">(required)</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg input-theme ${errors.firstName ? 'error' : ''}`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-theme-muted">
                      Last Name <span className="text-theme-required-signup">(required)</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg input-theme ${errors.lastName ? 'error' : ''}`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-theme-muted">
                    Email <span className="text-theme-required-signup">(required)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg input-theme ${errors.email ? 'error' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-theme-muted">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg input-theme"
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
                    className={`px-8 py-3 rounded-full font-medium transition-colors btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                  <label className="block mb-2 text-theme-muted">
                    List 1-3 hobbies, skills, or projects that you'd like to mentor <span className="text-theme-required-signup">(required)</span>
                  </label>
                  <textarea
                    name="hobbies"
                    value={formData.hobbies}
                    onChange={handleInputChange}
                    placeholder="(e.g, Guitar, Muay-Thai, Sewing, DIY home projects)"
                    rows="6"
                    className={`w-full px-4 py-3 border rounded-lg resize-none input-theme placeholder-theme-secondary ${errors.hobbies ? 'error' : ''}`}
                  />
                  {errors.hobbies && (
                    <p className="text-red-500 text-sm mt-1">{errors.hobbies}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-3 text-theme-muted">
                    I would like to... <span className="text-theme-required-signup">(required)</span>
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
                  <label className="block mb-3 text-theme-muted">
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
                        className="w-full max-w-md ml-8 px-4 py-2 border rounded-lg input-theme"
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
                    className={`px-8 py-3 rounded-full font-medium transition-colors btn-secondary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-full font-medium transition-colors btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              <h1 className="text-4xl md:text-3xl font-bold mb-6 md:whitespace-nowrap">Thank you for joining us on our journey!</h1>
              <div className="text-lg space-y-5 mb-1 text-primary">
                <p>
                  As an early mentor, you'll be part of our pilot and help shape how hobski works while connecting with curious learners in your community.
                </p>
                <p>
                  If there is a project you would like mentorship with or a skill you want to dip your toes into, be sure to <span
                    className={`underline font-semibold text-theme-required-signup ${crossLinkChecking ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                    onClick={crossLinkChecking ? undefined : handleCrossLinkToLearner}
                  >sign up as a learner as well!</span>
                  {crossLinkError && (
                    <span className="block mt-2 text-sm font-normal text-red-500">{crossLinkError}</span>
                  )}
                </p>
                <p className="font-medium">You're making it happen!</p>
              </div>

              {/* Character Image */}
              <div className="mt-0 w-full max-w-96 aspect-square mx-auto flex items-center justify-center">
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