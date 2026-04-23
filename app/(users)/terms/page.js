"use client";
import { useState } from "react";

const sections = [
  {
    id: "s1",
    title: "Acceptance of Terms",
    content: (
      <>
        <p>By accessing or using the Kiddex website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website or services.</p>
        <p>These terms apply to all visitors, users, and customers of Kiddex. We may update these terms from time to time, and your continued use of the site constitutes acceptance of any changes.</p>
      </>
    ),
  },
  {
    id: "s2",
    title: "Use of Our Website",
    content: (
      <>
        <p>You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others. You must not:</p>
        <ul>
          <li>Use the site in any way that is unlawful or fraudulent</li>
          <li>Attempt to gain unauthorised access to our systems or data</li>
          <li>Transmit any harmful, offensive, or unsolicited material</li>
          <li>Reproduce or redistribute content without written permission</li>
        </ul>
        <p>We reserve the right to restrict or terminate access for any user who violates these conditions.</p>
      </>
    ),
  },
  {
    id: "s3",
    title: "Products & Orders",
    content: (
      <>
        <p>All products listed on Kiddex are subject to availability. We reserve the right to limit quantities or discontinue any product at any time without prior notice.</p>
        <p>Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order. You will receive a confirmation email once your order is accepted and payment is verified.</p>
        <div className="highlight">⚠️ All toys sold on Kiddex are intended for children aged 3 and above unless otherwise stated. Please check age suitability on individual product pages.</div>
      </>
    ),
  },
  {
    id: "s4",
    title: "Pricing & Payment",
    content: (
      <>
        <p>All prices on Kiddex are displayed in Indian Rupees (₹) and include applicable taxes unless stated otherwise. We reserve the right to change prices at any time without notice.</p>
        <p>We accept payments via UPI, credit/debit cards, net banking, and other methods available at checkout. All transactions are processed securely through our payment partners.</p>
        <p>In the event of a pricing error, we reserve the right to cancel affected orders and issue a full refund.</p>
      </>
    ),
  },
  {
    id: "s5",
    title: "Shipping & Delivery",
    content: (
      <>
        <p>We offer free delivery on orders above ₹50. Delivery timelines vary by location and are estimates only — we are not liable for delays caused by courier partners or unforeseen circumstances.</p>
        <ul>
          <li>Standard delivery: 4–7 business days</li>
          <li>Express delivery: 1–3 business days (where available)</li>
          <li>Remote locations may take longer</li>
        </ul>
        <p>Risk of loss and title for items pass to you upon delivery to the carrier.</p>
      </>
    ),
  },
  {
    id: "s6",
    title: "Returns & Refunds",
    content: (
      <>
        <p>We want you to be completely satisfied. If you are not happy with your purchase, you may return eligible items within <strong>7 days</strong> of delivery.</p>
        <ul>
          <li>Items must be unused, in original packaging, with all tags intact</li>
          <li>Damaged, opened, or used items are not eligible for return</li>
          <li>Refunds are processed within 5–7 business days of receiving the return</li>
        </ul>
        <p>To initiate a return, please contact us at <a href="mailto:support@kiddex.in">support@kiddex.in</a> with your order details.</p>
      </>
    ),
  },
  {
    id: "s7",
    title: "Intellectual Property",
    content: (
      <>
        <p>All content on this website — including logos, images, text, graphics, and product descriptions — is the property of Kiddex and is protected by applicable intellectual property laws.</p>
        <p>You may not copy, reproduce, distribute, or create derivative works from any content without our explicit written consent.</p>
      </>
    ),
  },
  {
    id: "s8",
    title: "Limitation of Liability",
    content: (
      <>
        <p>To the maximum extent permitted by law, Kiddex shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products.</p>
        <p>Our total liability for any claim related to a purchase shall not exceed the amount you paid for that specific product.</p>
      </>
    ),
  },
  {
    id: "s9",
    title: "Governing Law",
    content: (
      <p>These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in India.</p>
    ),
  },
  {
    id: "s10",
    title: "Contact Us",
    content: (
      <>
        <p>If you have any questions about these Terms and Conditions, please reach out to us:</p>
        <ul>
          <li><strong>Email:</strong> support@kiddex.in</li>
          <li><strong>Phone:</strong> +91 98765 43210</li>
          <li><strong>Address:</strong> Kiddex Store, New Delhi, India</li>
        </ul>
      </>
    ),
  },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState(null);

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
              }}>📄 Legal</span>
              <h1 style={{ fontFamily:"Nunito,sans-serif", fontWeight:900, fontSize:"clamp(28px,5vw,44px)", color:"#fff", lineHeight:1.2, marginBottom:8 }}>
                Terms &amp; Conditions
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
                  style={{ marginBottom: 36, scrollMarginTop: 24, animationDelay: `${i * 0.05}s` }}
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