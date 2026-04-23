export function Section({ id, num, title, children }) {
  return (
    <>
      <div id={id} className="section-animate mb-10 scroll-mt-8">
        <div className="mb-4 flex items-center gap-4">
          <div
            className="animated-gradient flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-xl text-base font-black text-white"
            style={{ fontFamily: 'Nunito, sans-serif', minWidth: '38px' }}
          >
            {num}
          </div>
          <h2
            className="text-xl font-black"
            style={{ fontFamily: 'Nunito, sans-serif', color: '#1a1a2e' }}
          >
            {title}
          </h2>
        </div>

        <div className="space-y-3 pl-0 md:pl-14">{children}</div>
      </div>

      <hr style={{ border: 'none', borderTop: '1.5px solid #ffe0f0', margin: '0 0 40px' }} />
    </>
  );
}

export function SectionP({ children }) {
  return (
    <p className="text-sm leading-relaxed" style={{ color: '#3a2a4e' }}>
      {children}
    </p>
  );
}

export function SectionUl({ items }) {
  return (
    <ul className="space-y-2" style={{ paddingLeft: '20px' }}>
      {items.map((item) => (
        <li key={item} className="list-disc text-sm leading-relaxed" style={{ color: '#3a2a4e' }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Highlight({ children }) {
  return (
    <div
      className="rounded-r-xl text-sm leading-relaxed"
      style={{
        background: '#fff8f0',
        borderLeft: '4px solid #FFB800',
        padding: '14px 18px',
        color: '#3a2a4e',
      }}
    >
      {children}
    </div>
  );
}

export function ContactCard({ icon, label, value, href }) {
  return (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      className="flex items-center gap-3 rounded-2xl border-2 px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        borderColor: '#ffd0e8',
        background: '#fff0f6',
        textDecoration: 'none',
      }}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <div
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: '#E8197A', fontFamily: 'Nunito, sans-serif' }}
        >
          {label}
        </div>
        <div className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
          {value}
        </div>
      </div>
    </a>
  );
}
