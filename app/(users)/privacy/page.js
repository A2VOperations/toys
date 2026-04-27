"use client";

const SUPPORT_EMAIL = process.env.EMAIL_FROM || "operation.a2vgroups@gmail.com";
const SUPPORT_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
const SUPPORT_ADDRESS =
  process.env.NEXT_PUBLIC_ADDRESS || "Toys for Kids Store, New Delhi, India";

const sections = [
  {
    id: "s1",
    title: "Introduction",
    content: (
      <p>
        Welcome to Toys For Kids! We are committed to protecting your personal
        information and your right to privacy. This policy explains how we
        collect, use, and share information about you when you use our website
        or purchase our products. By using Toys For Kids, you agree to the terms
        of this policy. Questions? Reach us at{" "}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="text-rose-300 font-bold hover:underline"
        >
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
    ),
  },
  {
    id: "s2",
    title: "Information We Collect",
    content: (
      <>
        <p className="font-semibold text-pink-950 mb-1">
          Information you provide:
        </p>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li>
            Name, email, phone number, and shipping / billing address when
            placing an order
          </li>
          <li>
            Payment information (processed securely — we do{" "}
            <strong className="text-pink-950">not</strong> store card details)
          </li>
          <li>Account credentials if you create an account</li>
          <li>Reviews, ratings, or feedback you submit</li>
        </ul>
        <p className="font-semibold text-pink-950 mb-1">
          Information collected automatically:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>IP address, browser type, and device information</li>
          <li>Pages visited, time spent, and clickstream data</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      </>
    ),
  },
  {
    id: "s3",
    title: "How We Use Your Information",
    content: (
      <>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li>
            Process and fulfil your orders, including sending confirmations and
            shipping updates
          </li>
          <li>Manage your account and provide customer support</li>
          <li>
            Send promotional emails —{" "}
            <strong className="text-pink-950">only if you opt in</strong>
          </li>
          <li>Improve our website, product listings, and user experience</li>
          <li>Detect and prevent fraudulent transactions or abuse</li>
          <li>Comply with applicable legal obligations</li>
        </ul>
        <div className="bg-pink-50 border-l-4 border-pink-400 rounded-r-xl px-4 py-3 text-sm text-pink-800">
          You can unsubscribe from marketing emails at any time using the link
          at the bottom of any promotional message.
        </div>
      </>
    ),
  },
  {
    id: "s4",
    title: "Sharing Your Information",
    content: (
      <>
        <p className="mb-2">
          We <strong className="text-pink-950">never sell</strong> your personal
          data. We share it only with trusted partners:
        </p>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li>Shipping &amp; logistics partners — to deliver your orders</li>
          <li>Payment processors — to securely handle transactions</li>
          <li>
            Analytics providers — to understand site usage (data is anonymised)
          </li>
          <li>Legal authorities — if required by law or court order</li>
        </ul>
        <div className="bg-pink-50 border-l-4 border-pink-400 rounded-r-xl px-4 py-3 text-sm text-pink-800">
          All third-party partners are contractually required to handle your
          data responsibly and in accordance with applicable data protection
          laws.
        </div>
      </>
    ),
  },
  {
    id: "s5",
    title: "Cookies & Tracking",
    content: (
      <>
        <p className="mb-2">
          Toys For Kids uses cookies to enhance your browsing experience and
          analyse site traffic.
        </p>
        <ul className="list-disc pl-5 mb-2 space-y-1">
          <li>
            <strong className="text-pink-950">Essential cookies</strong> —
            required for core functionality (e.g. shopping cart)
          </li>
          <li>
            <strong className="text-pink-950">Analytics cookies</strong> — help
            us understand usage patterns
          </li>
          <li>
            <strong className="text-pink-950">Marketing cookies</strong> — used
            to show relevant ads (only with consent)
          </li>
        </ul>
        <p>
          You can control or disable cookies through your browser settings.
          Disabling essential cookies may affect site functionality.
        </p>
      </>
    ),
  },
  {
    id: "s6",
    title: "Data Retention",
    content: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Order &amp; transaction data: retained for up to{" "}
          <strong className="text-pink-950">7 years</strong> for legal purposes
        </li>
        <li>
          Account data: retained up to{" "}
          <strong className="text-pink-950">2 years</strong> after account
          deletion
        </li>
        <li>
          Marketing data: retained until you unsubscribe or request deletion
        </li>
        <li>Analytics data: retained in anonymised form indefinitely</li>
      </ul>
    ),
  },
  {
    id: "s7",
    title: "Your Rights",
    content: (
      <>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li>
            <strong className="text-pink-950">Access</strong> — request a copy
            of the data we hold about you
          </li>
          <li>
            <strong className="text-pink-950">Rectification</strong> — ask us to
            correct inaccurate or incomplete data
          </li>
          <li>
            <strong className="text-pink-950">Erasure</strong> — request
            deletion of your personal data
          </li>
          <li>
            <strong className="text-pink-950">Portability</strong> — receive
            your data in a machine-readable format
          </li>
          <li>
            <strong className="text-pink-950">Object</strong> — opt out of
            processing for marketing purposes
          </li>
        </ul>
        <div className="bg-pink-50 border-l-4 border-pink-400 rounded-r-xl px-4 py-3 text-sm text-pink-800">
          To exercise any of these rights, email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-bold underline">
            {SUPPORT_EMAIL}
          </a>
          . We will respond within <strong>30 days</strong>.
        </div>
      </>
    ),
  },
  {
    id: "s8",
    title: "Children's Privacy",
    content: (
      <>
        <p className="mb-2">
          Toys For Kids sells products for children, but our website is intended
          for adults (18+). We do not knowingly collect personal data from
          children under 13.
        </p>
        <div className="bg-pink-50 border-l-4 border-pink-400 rounded-r-xl px-4 py-3 text-sm text-pink-800">
          If you believe a child has provided us with personal information,
          contact us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-bold underline">
            {SUPPORT_EMAIL}
          </a>{" "}
          and we will promptly delete it.
        </div>
      </>
    ),
  },
  {
    id: "s9",
    title: "Security",
    content: (
      <>
        <ul className="list-disc pl-5 mb-2 space-y-1">
          <li>SSL / TLS encryption for all data transmitted to our servers</li>
          <li>PCI-DSS compliant payment processing via trusted partners</li>
          <li>
            Access controls — only authorised staff can access personal data
          </li>
          <li>Regular security audits and vulnerability assessments</li>
        </ul>
        <p>
          No method of transmission over the internet is 100% secure. While we
          strive to protect your data, we cannot guarantee absolute security.
        </p>
      </>
    ),
  },
  {
    id: "s11",
    title: "Contact Us",
    content: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong className="text-pink-950">Email:</strong> {SUPPORT_EMAIL}
        </li>
        <li>
          <strong className="text-pink-950">Phone:</strong> {SUPPORT_NUMBER}
        </li>
        <li>
          <strong className="text-pink-950">Address:</strong> {SUPPORT_ADDRESS}
        </li>
      </ul>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <style>{`
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      .grad-animate {
        background-size: 200% 200% !important; 
        animation: gradientShift 4s ease infinite;
      }
    `}</style>
      <div className="bg-pink-100 px-4 py-10 relative overflow-hidden">
        {/* Blobs — absolute inside this div only, won't affect navbar/footer */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-pink-300/30 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-rose-300/25 translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-36 h-36 rounded-full bg-pink-200/40 -translate-x-1/2 pointer-events-none" />

        {/* Card */}
        <div className="relative z-10 max-w-3xl mx-auto bg-white rounded-3xl shadow-xl shadow-pink-200/60 overflow-hidden">
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #f15397, #fb7185, #e11d48)",
            }}
            className="px-8 py-12 text-center relative overflow-hidden grad-animate"
          >
            <div className="absolute -top-6 -left-6 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-8 -right-8 w-52 h-52 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute top-5 right-20 w-20 h-20 rounded-full bg-white/[0.08] pointer-events-none" />
            <div className="relative z-10">
              <span className="inline-block bg-white/20 text-white text-[10px] font-black tracking-[2px] uppercase px-5 py-1.5 rounded-full border border-white/40 mb-4">
                Legal
              </span>
              <h1 className="text-white font-black text-4xl leading-tight mb-2 drop-shadow-md">
                Privacy Policy
              </h1>
              <p className="text-white/80 text-xs font-semibold">
                Effective immediately
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-8 sm:px-10">
            {/* TOC */}
            <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl px-6 py-5 mb-10">
              <p className="text-rose-300 font-black text-[11px] tracking-widest uppercase mb-3">
                Contents
              </p>
              <ol className="pl-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 list-decimal">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-sm font-semibold text-pink-950 hover:text-rose-500 transition-colors"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Sections */}
            {sections.map((s, i) => (
              <div key={s.id}>
                <div id={s.id} className="mb-7 scroll-mt-5">
                  {/* Section heading row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 min-w-[36px] rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-pink-300/40 shrink-0">
                      {i + 1}
                    </div>
                    <h2 className="font-black text-lg text-pink-950">
                      {s.title}
                    </h2>
                  </div>

                  {/* Content */}
                  <div className="pl-12 text-sm text-pink-800 leading-relaxed">
                    {s.content}
                  </div>
                </div>

                {i < sections.length - 1 && (
                  <hr className="border-pink-100 mb-7" />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-[#FFF0F5] border-t border-[#F9BFDA] px-8 py-4 text-center text-xs text-[#C08090] font-semibold">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            Toys For Kids · Made with ❤️ for little ones ·{" "}
            <span className="text-[#D63A7A]">{SUPPORT_EMAIL}</span>
          </div>
        </div>
      </div>
    </>
  );
}
