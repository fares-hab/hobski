import Navigation from './Navigation';

export default function About({ theme, setTheme }) {
  return (
    <div className="min-h-screen font-['Inter',sans-serif] bg-theme-primary text-theme-primary overflow-x-hidden">
      {/* Navigation */}
      <Navigation theme={theme} setTheme={setTheme} variant="page" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16 pt-28">
        {/* Founders Image - Shows first on mobile, second on desktop */}
        <div className="flex items-center justify-center md:hidden mb-8">
          <img 
            src="/images/AboutImage.webp"
            alt="Fares and Tala Habbab, founders of hobski"
            loading="eager"
            fetchpriority="high"
            className="w-[85%] max-h-[50vh] h-auto object-contain"
          />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-12">
          Who are we?
        </h1>

        <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
          {/* Text Content */}
          <div className="space-y-6">
            <p className="text-lg leading-relaxed font-semi-bold">
              Hi, we're Tala and Fares Habbab, the sibling founders of hobski!
            </p>

            <p className="text-lg leading-relaxed font-semi-bold">
              This all started when we each ran into obstacles with our hobbies. At roughly the same time, Tala wished she knew someone who could help her with her sewing project that she'd been stuck on, while Fares was having trouble reaching students interested in learning Muay Thai. We found ourselves wishing for a platform where people could connect and help each other grow their interests.
            </p>

            <p className="text-lg leading-relaxed font-semi-bold">
              That's why we're building a new way for people to connect and share skills. This is our early stage website, and we're inviting mentors and learners to join our community and help us bring hobski to life.
            </p>

            <p className="text-lg leading-relaxed font-semi-bold">
              Thank you for being a part of our journey.
            </p>

            <p className="text-lg leading-relaxed font-semi-bold">
              Fares & Tala
            </p>
          </div>

          {/* Founders Image */}
          <div className="hidden md:flex items-center justify-center ml-8">
            <img 
              src="/images/AboutImage.webp"
              alt="Fares and Tala Habbab, founders of hobski"
              loading="eager"
              fetchpriority="high"
              className="w-full h-auto object-contain scale-125"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-8 px-6 bg-theme-primary">
        <div className="max-w-7xl mx-auto text-center text-sm text-theme-primary">
          ℠ 2026 hobski.
        </div>
      </footer>
    </div>
  );
}