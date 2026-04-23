"use client";

const sections = [
  {
    id: "s1",
    title: "Introduction",
    content: (
      <>
        <p>Welcome to Kiddex! We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our website, shop our products, or interact with us in any way.</p>
        <p>By using Kiddex, you agree to the collection and use of information in accordance with this policy. If you have questions, contact us at <a href="mailto:support@kiddex.in">support@kiddex.in</a>.</p>
        <div className="highlight">🛡️ We never sell your personal data to third parties. Your trust is our top priority.</div>
      </>
    ),
  },
  {
    id: "s2",
    title: "Information We Collect",
    content: (
      <>
        <p>We collect information you provide directly and information collected automatically when you use our services.</p>
        <p><strong>Information you provide:</strong></p>
        <ul>
          <li>Name, email, phone number, and shipping/billing address when placing an order</li>
          <li>Payment information (processed securely — we do not store card details)</li>
          <li>Account credentials if you create an account</li>
          <li>Communications you send us via email, chat, or contact forms</li>
          <li>Reviews, ratings, or feedback you submit</li>
        </ul>
        <p><strong>Information collected automatically:</strong></p>
        <ul>
          <li>IP address, browser type, and device information</li>
          <li>Pages visited, time spent, and clickstream data</li>
          <li>Referring URLs and search terms</li>
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
        <p>We use the information we collect to provide, improve, and personalise our services. Specifically, we use it to:</p>
        <ul>
          <li>Process and fulfil your orders, including sending confirmations and shipping updates</li>
          <li>Manage your account and provide customer support</li>
          <li>Send transactional emails (order receipts, delivery notifications)</li>
          <li>Send promotional emails and offers — only if you opt in</li>
          <li>Improve our website, product listings, and user experience</li>
          <li>Detect, investigate, and prevent fraudulent transactions or abuse</li>
          <li>Comply with applicable legal obligations</li>
        </ul>
        <div className="highlight">📧 You can unsubscribe from marketing emails at any time using the link at the bottom of any promotional message.</div>
      </>
    ),
  },
  {
    id: "s4",
    title: "Sharing Your Information",
    content: (
      <>
        <p>We do not sell, trade, or rent your personal information to third parties. We may share your data with trusted partners only to the extent necessary to operate our business:</p>
        <ul>
          <li>Shipping &amp; logistics partners — to deliver your orders</li>
          <li>Payment processors — to securely handle your transactions</li>
          <li>Analytics providers — to understand how our website is used (data is anonymised)</li>
          <li>Email service providers — to send transactional and marketing communications</li>
          <li>Legal authorities — if required by law, court order, or to protect our rights</li>
        </ul>
        <p>All third-party partners are contractually required to handle your data responsibly and in accordance with applicable data protection laws.</p>
      </>
    ),
  },
  {
    id: "s5",
    title: "Cookies & Tracking",
    content: (
      <>
        <p>Kiddex uses cookies and similar technologies to enhance your browsing experience, analyse site traffic, and personalise content.</p>
        <p><strong>Types of cookies we use:</strong></p>
        <ul>
          <li>Essential cookies — required for core site functionality (e.g. shopping cart)</li>
          <li>Analytics cookies — help us understand site usage patterns</li>
          <li>Preference cookies — remember your settings and choices</li>
          <li>Marketing cookies — used to show relevant ads (only with consent)</li>
        </ul>
        <p>You can control or disable cookies through your browser settings. Note that disabling essential cookies may affect site functionality.</p>
      </>
    ),
  },
  {
    id: "s6",
    title: "Data Retention",
    content: (
      <>
        <p>We retain your personal data only as long as necessary to fulfil the purposes described in this policy, or as required by applicable law.</p>
        <ul>
          <li>Order and transaction data: retained for up to 7 years for accounting and legal purposes</li>
          <li>Account data: retained for the duration of your account and up to 2 years after deletion</li>
          <li>Marketing data: retained until you unsubscribe or request deletion</li>
          <li>Analytics data: retained in anonymised form indefinitely</li>
        </ul>
        <p>Once your data is no longer needed, we securely delete or anonymise it.</p>
      </>
    ),
  },
  {
    id: "s7",
    title: "Your Rights",
    content: (
      <>
        <p>As a Kiddex customer, you have the following rights regarding your personal data:</p>
        <ul>
          <li>Right to access — request a copy of the personal data we hold about you</li>
          <li>Right to rectification — ask us to correct inaccurate or incomplete data</li>
          <li>Right to erasure — request deletion of your personal data ("right to be forgotten")</li>
          <li>Right to restrict processing — ask us to limit how we use your data</li>
          <li>Right to data portability — receive your data in a structured, machine-readable format</li>
          <li>Right to object — object to processing of your data for marketing purposes</li>
        </ul>
        <p>To exercise any of these rights, email us at <a href="mailto:support@kiddex.in">support@kiddex.in</a>. We will respond within 30 days.</p>
      </>
    ),
  },
  {
    id: "s8",
    title: "Children's Privacy",
    content: (
      <>
        <p>Kiddex sells products for children, but our website and services are intended for use by adults (18+). We do not knowingly collect personal data from children under the age of 13.</p>
        <p>If you believe a child has provided us with personal information, please contact us immediately at <a href="mailto:support@kiddex.in">support@kiddex.in</a> and we will promptly delete it.</p>
        <div className="highlight">👨‍👩‍👧 Parents and guardians are responsible for supervising children's interactions with our website and any related services.</div>
      </>
    ),
  },
  {
    id: "s9",
    title: "Security",
    content: (
      <>
        <p>We take the security of your personal data seriously and implement industry-standard measures including:</p>
        <ul>
          <li>SSL/TLS encryption for all data transmitted between your browser and our servers</li>
          <li>Secure, PCI-DSS compliant payment processing via trusted partners</li>
          <li>Access controls — only authorised staff can access personal data</li>
          <li>Regular security audits and vulnerability assessments</li>
        </ul>
        <p>However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</p>
      </>
    ),
  },
  {
    id: "s10",
    title: "Changes to This Policy",
    content: (
      <>
        <p>We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any significant changes by posting the new policy on this page with an updated effective date.</p>
        <p>Your continued use of Kiddex after any changes constitutes your acceptance of the updated policy.</p>
      </>
    ),
  },
  {
    id: "s11",
    title: "Contact Us",
    content: (
      <>
        <p>If you have questions, concerns, or requests regarding your privacy or this policy, please get in touch:</p>
        <ul>
          <li><strong>Email:</strong> support@kiddex.in</li>
          <li><strong>Phone:</strong> +91 98765 43210</li>
          <li><strong>Address:</strong> Kiddex Store, New Delhi, India</li>
        </ul>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Nunito+Sans:wght@400;600&display=swap');

        @import "tailwindcss";

        @theme {
          --color-kpink: #E8197A;
          --color-kyellow: #FFB800;
          --color-kbg: #FDB347;
          --color-kdark: #1a1a2e;
          --color-kpurple: #3a2a4e;
          --font-nunito: 'Nunito', sans-serif;
          --font-body: 'Nunito Sans', sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Nunito Sans', sans-serif;
          background: #FDB347;
          min-height: 100vh;
        }

        html { scroll-behavior: smooth; }

        @keyframes gradientShift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        .grad-animate {
          background: linear-gradient(135deg,#E8197A,#FFB800,#E8197A);
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
        }

        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        .blob {
          position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
        }
        .blob1 {
          width: 320px; height: 320px; top: -80px; right: -80px;
          background: radial-gradient(circle,#E8197A33,transparent);
          animation: float 8s ease-in-out infinite;
        }
        .blob2 {
          width: 240px; height: 240px; bottom: -60px; left: -60px;
          background: radial-gradient(circle,#FFB80044,transparent);
          animation: float 10s ease-in-out infinite reverse;
        }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .section-row { animation: fadeUp 0.35s ease both; }

        .highlight {
          background: #fff8f0;
          border-left: 4px solid #FFB800;
          border-radius: 0 12px 12px 0;
          padding: 12px 16px;
          margin-top: 10px;
          font-size: 14px;
          color: #3a2a4e;
        }

        .prose p { font-size:15px; color:#3a2a4e; margin-bottom:10px; line-height:1.75; }
        .prose ul { padding-left:20px; margin-bottom:10px; }
        .prose ul li { font-size:15px; color:#3a2a4e; margin-bottom:6px; list-style:disc; line-height:1.75; }
        .prose a { color:#E8197A; font-weight:700; text-decoration:none; }
        .prose strong { color:#1a1a2e; }
        .prose p:last-child { margin-bottom:0; }
      `}</style>

      <div className="blob blob1" />
      <div className="blob blob2" />

      <div style={{ position:"relative", zIndex:1, padding:"48px 20px 64px" }}>
        <div style={{
          background:"#fff",
          borderRadius:"24px",
          maxWidth:"820px",
          margin:"0 auto",
          boxShadow:"0 8px 40px rgba(232,25,122,0.12),0 2px 8px rgba(0,0,0,0.06)",
          overflow:"hidden",
        }}>

          {/* Header */}
          <div className="grad-animate" style={{ padding:"52px 40px", textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-20, left:-20, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
            <div style={{ position:"absolute", bottom:-30, right:-30, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
            <div style={{ position:"relative", zIndex:1 }}>
              <span style={{
                display:"inline-block", background:"rgba(255,255,255,0.2)", color:"#fff",
                fontFamily:"Nunito,sans-serif", fontWeight:800, fontSize:11, letterSpacing:"1.5px",
                textTransform:"uppercase", padding:"6px 18px", borderRadius:"100px",
                border:"1.5px solid rgba(255,255,255,0.35)", marginBottom:16,
              }}>🔒 Legal</span>
              <h1 style={{ fontFamily:"Nunito,sans-serif", fontWeight:900, fontSize:"clamp(28px,5vw,44px)", color:"#fff", lineHeight:1.2, marginBottom:8 }}>
                Privacy Policy
              </h1>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.8)", fontWeight:600 }}>
                Last updated: June 1, 2025 · Effective immediately
              </p>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding:"40px 48px 52px" }}>

            {/* TOC */}
            <div style={{ background:"#fff8f0", border:"2px solid #FFB800", borderRadius:16, padding:"24px 28px", marginBottom:44 }}>
              <h3 style={{ fontFamily:"Nunito,sans-serif", fontWeight:800, fontSize:12, letterSpacing:"1px", textTransform:"uppercase", color:"#E8197A", marginBottom:14 }}>
                📋 Contents
              </h3>
              <ol style={{ paddingLeft:20, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"6px 32px" }}>
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      style={{ fontSize:14, fontWeight:600, color:"#1a1a2e", textDecoration:"none", transition:"color 0.15s" }}
                      onMouseEnter={e => e.target.style.color = "#E8197A"}
                      onMouseLeave={e => e.target.style.color = "#1a1a2e"}
                    >
                      {i + 1}. {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Sections */}
            {sections.map((s, i) => (
              <div key={s.id}>
                <div
                  id={s.id}
                  className="section-row"
                  style={{ marginBottom:36, scrollMarginTop:24, animationDelay:`${i * 0.05}s` }}
                >
                  <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                    <div
                      className="grad-animate"
                      style={{
                        width:38, height:38, minWidth:38, borderRadius:10,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontFamily:"Nunito,sans-serif", fontWeight:900, fontSize:15, color:"#fff",
                      }}
                    >
                      {i + 1}
                    </div>
                    <h2 style={{ fontFamily:"Nunito,sans-serif", fontWeight:800, fontSize:19, color:"#1a1a2e" }}>
                      {s.title}
                    </h2>
                  </div>
                  <div className="prose" style={{ paddingLeft:52 }}>
                    {s.content}
                  </div>
                </div>
                {i < sections.length - 1 && (
                  <hr style={{ border:"none", borderTop:"1.5px solid #ffe0f0", margin:"0 0 36px" }} />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ background:"#fff0f6", borderTop:"1.5px solid #ffd0e8", padding:"18px 40px", textAlign:"center", fontSize:13, color:"#aaa", fontWeight:600 }}>
            © {new Date().getFullYear()} Kiddex · Made with ❤️ for little ones ·{" "}
            <a href="mailto:support@kiddex.in" style={{ color:"#E8197A" }}>support@kiddex.in</a>
          </div>
        </div>
      </div>
    </>
  );
}