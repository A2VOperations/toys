import Link from 'next/link';

function navLinkClass(isActive) {
  return [
    'rounded-full border-2 px-5 py-2 text-sm font-bold text-white transition-all duration-200',
    isActive
      ? 'nav-active border-white shadow-lg'
      : 'border-white/60 bg-white/20 hover:border-white hover:bg-white/30',
  ].join(' ');
}

export default function LegalLayout({
  children,
  title,
  subtitle,
  icon,
  sections,
  currentPath,
}) {
  return (
    <div className="min-h-screen px-5 py-12" style={{ background: '#FDB347' }}>
      <div
        className="blob1 pointer-events-none fixed right-[-80px] top-[-80px] h-72 w-72 rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, #E8197A33, transparent)' }}
      />
      <div
        className="blob2 pointer-events-none fixed bottom-[-60px] left-[-60px] h-56 w-56 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #FFB80044, transparent)' }}
      />

      <div className="relative z-10 mx-auto w-full" style={{ maxWidth: '860px' }}>
        <nav className="mb-8 flex justify-center gap-3">
          <Link
            href="/terms"
            className={navLinkClass(currentPath === '/terms')}
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            Terms &amp; Conditions
          </Link>
          <Link
            href="/privacy"
            className={navLinkClass(currentPath === '/privacy')}
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            Privacy Policy
          </Link>
        </nav>

        <div
          className="overflow-hidden rounded-3xl bg-white"
          style={{ boxShadow: '0 8px 40px rgba(232,25,122,0.12), 0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <div className="animated-gradient relative overflow-hidden px-10 py-12 text-center">
            <div className="absolute left-[-20px] top-[-20px] h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute bottom-[-30px] right-[-30px] h-52 w-52 rounded-full bg-white/10" />
            <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-white/10" />

            <div className="relative z-10">
              <span
                className="mb-4 inline-block rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-white"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {icon} Legal
              </span>
              <h1
                className="mb-2 text-4xl font-black text-white md:text-5xl"
                style={{ fontFamily: 'Nunito, sans-serif', lineHeight: 1.2 }}
              >
                {title}
              </h1>
              <p className="text-sm font-semibold text-white/80">{subtitle}</p>
            </div>
          </div>

          <div className="px-8 py-10 md:px-14">
            <div
              className="mb-10 rounded-2xl border-2 p-6"
              style={{ background: '#fff8f0', borderColor: '#FFB800' }}
            >
              <h3
                className="mb-4 text-xs font-black uppercase tracking-widest"
                style={{ fontFamily: 'Nunito, sans-serif', color: '#E8197A' }}
              >
                Contents
              </h3>
              <ol
                className="grid gap-x-8 gap-y-2"
                style={{ paddingLeft: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
              >
                {sections.map((section, index) => (
                  <li key={section}>
                    <a
                      href={`#s${index + 1}`}
                      className="text-sm font-semibold transition-colors duration-150 hover:underline"
                      style={{ color: '#1a1a2e' }}
                    >
                      {section}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {children}
          </div>

          <div
            className="px-8 py-6 text-center text-xs font-semibold"
            style={{ background: '#fff0f6', color: '#999', borderTop: '1.5px solid #ffd0e8' }}
          >
            © {new Date().getFullYear()} Toys for Kids · Made with love for little ones ·{' '}
            <a href="mailto:support@Toys for Kids.in" style={{ color: '#E8197A' }}>
              support@Toys for Kids.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
