"use client";

const sections = [
  {
    id: "s1",
    title: "Acceptance of Terms",
    icon: "📄",
    content: (
      <p>
        By accessing or using the Kiddex website, you agree to be bound by these
        Terms and Conditions. Your continued use of the site after any updates
        constitutes acceptance of the revised terms.
      </p>
    ),
  },
  {
    id: "s2",
    title: "Return Eligibility",
    icon: "↩️",
    content: (
      <>
        <p>
          We <strong>only accept returns</strong> in the following cases:
        </p>
        <ul>
          <li>
            The product received is <strong>damaged</strong>
          </li>
          <li>
            The product is <strong>defective</strong>
          </li>
          <li>
            The product is <strong>wrong or missing items</strong>
          </li>
        </ul>
        <div className="kx-highlight">
          <strong>Mandatory:</strong> A clear unboxing video from the moment the
          package is opened is required as proof. Returns without video proof
          will be rejected.
        </div>
      </>
    ),
  },
  {
    id: "s3",
    title: "Conditions for Returns",
    icon: "✅",
    content: (
      <ul>
        <li>The product must be unused and in original packaging</li>
        <li>
          All return shipments <strong>must be prepaid</strong>
        </li>
        <li>
          <strong>COD return packages will be rejected</strong>
        </li>
        <li>
          You are responsible for <strong>all return shipping costs</strong> to
          our warehouse
        </li>
        <li>
          Returns must be requested within <strong>24–48 hours</strong> of
          delivery (for damage cases)
        </li>
      </ul>
    ),
  },
  {
    id: "s4",
    title: "Order Cancellation",
    icon: "🚫",
    content: (
      <ul>
        <li>
          Orders can only be cancelled <strong>before they are shipped</strong>{" "}
          from our warehouse
        </li>
        <li>
          Once an order is dispatched,{" "}
          <strong>cancellations are not possible</strong>
        </li>
        <li>
          Prepaid cancellations (if approved before dispatch) may take a few
          days depending on the payment gateway
        </li>
      </ul>
    ),
  },
  {
    id: "s5",
    title: "Refunds",
    icon: "💰",
    content: (
      <>
        <p>
          Refunds are provided only after the returned item is received,
          inspected, and approved. Refunds will be issued to the original
          payment method.
        </p>
        <div className="kx-highlight">
          ⚠️ <strong>No refunds</strong> for: missing unboxing video · return
          requests after the allowed time · used, damaged, or incomplete
          products returned by the customer.
        </div>
      </>
    ),
  },
  {
    id: "s6",
    title: "Non-Returnable Items",
    icon: "🔒",
    content: (
      <ul>
        <li>Customised or personalised products</li>
        <li>Products damaged due to customer handling</li>
        <li>Items purchased during special sale events</li>
      </ul>
    ),
  },
  {
    id: "s7",
    title: "Pricing & Payment",
    icon: "₹",
    content: (
      <p>
        All prices are in Indian Rupees (₹) and include applicable taxes. We
        accept UPI, credit/debit cards, and net banking. In the event of a
        pricing error, we reserve the right to cancel affected orders and issue
        a full refund.
      </p>
    ),
  },
  {
    id: "s8",
    title: "Intellectual Property",
    icon: "©️",
    content: (
      <p>
        All content on this website — logos, images, text, and product
        descriptions — is the property of Kiddex and protected by applicable IP
        laws. Reproduction without written consent is prohibited.
      </p>
    ),
  },
  {
    id: "s9",
    title: "Governing Law",
    icon: "⚖️",
    content: (
      <p>
        These Terms are governed by the laws of India. Any disputes shall be
        subject to the exclusive jurisdiction of courts in India.
      </p>
    ),
  },
  {
    id: "s10",
    title: "Contact Us",
    icon: "📬",
    content: (
      <ul>
        <li>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${process.env.EMAIL_FROM}`}>
            {process.env.EMAIL_FROM || "operation.a2vgroups@gmail.com"}
          </a>
        </li>
        <li>
          <strong>Phone:</strong> {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
        </li>
        <li>
          <strong>Address:</strong> {process.env.NEXT_PUBLIC_ADDRESS}
        </li>
      </ul>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      {/*
        SCOPED STYLES ONLY — no global resets, no body/html/*, no @import tailwindcss, no @theme.
        All class names prefixed with kx- to avoid clashing with your navbar/footer/topbar.
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Nunito+Sans:wght@400;600&display=swap');

        /* Pink palette:
           Page bg    : #FFE4EC  (blush from photo)
           Accent     : #D63A7A  (deep rose)
           Accent2    : #F472A8  (mid pink)
           Light pink : #FFF0F5  (toc/highlight bg)
           Border     : #F9BFDA  (dividers, borders)
           Text dark  : #3B1A2E  (headings)
           Text body  : #6B3352  (body copy)
        */

        @keyframes kx-gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        @keyframes kx-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes kx-fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .kx-root {
          background: #FFE4EC;
          padding: 40px 16px 60px;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }
        .kx-root *, .kx-root *::before, .kx-root *::after {
          box-sizing: border-box;
        }

        /* Decorative blobs */
        .kx-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .kx-blob1 {
          width: 300px; height: 300px;
          top: -70px; right: -70px;
          background: radial-gradient(circle, #F472A855, transparent);
          animation: kx-float 8s ease-in-out infinite;
        }
        .kx-blob2 {
          width: 240px; height: 240px;
          bottom: -60px; left: -60px;
          background: radial-gradient(circle, #D63A7A33, transparent);
          animation: kx-float 11s ease-in-out infinite reverse;
        }
        .kx-blob3 {
          width: 160px; height: 160px;
          top: 40%; left: -40px;
          background: radial-gradient(circle, #F9BFDA55, transparent);
          animation: kx-float 13s ease-in-out infinite;
        }

        /* Card */
        .kx-card {
          background: #fff;
          border-radius: 22px;
          max-width: 800px;
          margin: 0 auto;
          box-shadow:
            0 8px 40px rgba(214,58,122,0.14),
            0 2px 8px rgba(214,58,122,0.06);
          overflow: hidden;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .kx-header {
          background: linear-gradient(135deg, #D63A7A, #F472A8, #C02060, #F472A8, #D63A7A);
          background-size: 300% 300%;
          animation: kx-gradientShift 5s ease infinite;
          padding: 48px 32px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .kx-header-circle1 {
          position: absolute; top: -24px; left: -24px;
          width: 160px; height: 160px; border-radius: 50%;
          background: rgba(255,255,255,0.12);
        }
        .kx-header-circle2 {
          position: absolute; bottom: -28px; right: -28px;
          width: 200px; height: 200px; border-radius: 50%;
          background: rgba(255,255,255,0.10);
        }
        .kx-header-circle3 {
          position: absolute; top: 20px; right: 80px;
          width: 80px; height: 80px; border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }
        .kx-header-inner { position: relative; z-index: 1; }

        .kx-badge {
          display: inline-block;
          background: rgba(255,255,255,0.22);
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 6px 18px;
          border-radius: 100px;
          border: 1.5px solid rgba(255,255,255,0.4);
          margin-bottom: 16px;
        }
        .kx-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: clamp(24px, 5vw, 40px);
          color: #fff;
          line-height: 1.2;
          margin: 0 0 8px;
          text-shadow: 0 2px 12px rgba(180,20,80,0.25);
        }
        .kx-subtitle {
          font-size: 12px;
          color: rgba(255,255,255,0.82);
          font-weight: 600;
          margin: 0;
          font-family: 'Nunito Sans', sans-serif;
        }

        /* Body */
        .kx-body { padding: 32px 36px 44px; }

        /* TOC */
        .kx-toc {
          background: #FFF0F5;
          border: 2px solid #F9BFDA;
          border-radius: 14px;
          padding: 20px 24px;
          margin-bottom: 36px;
        }
        .kx-toc-label {
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #D63A7A;
          margin: 0 0 12px;
        }
        .kx-toc ol {
          padding-left: 18px;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: 4px 24px;
        }
        .kx-toc a {
          font-size: 13px;
          font-weight: 600;
          color: #3B1A2E;
          text-decoration: none;
          font-family: 'Nunito Sans', sans-serif;
          transition: color 0.15s;
        }
        .kx-toc a:hover { color: #D63A7A; }

        /* Sections */
        .kx-section {
          margin-bottom: 28px;
          scroll-margin-top: 20px;
          animation: kx-fadeUp 0.3s ease both;
        }
        .kx-section-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }
        .kx-num {
          width: 34px; height: 34px; min-width: 34px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 13px;
          color: #fff;
          background: linear-gradient(135deg, #D63A7A, #F472A8, #D63A7A);
          background-size: 200% 200%;
          animation: kx-gradientShift 5s ease infinite;
          flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(214,58,122,0.3);
        }
        .kx-section-title {
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 17px;
          color: #3B1A2E;
          margin: 0;
        }

        /* Prose */
        .kx-prose {
          padding-left: 46px;
          font-family: 'Nunito Sans', sans-serif;
        }
        .kx-prose p {
          font-size: 14px;
          color: #6B3352;
          margin: 0 0 8px;
          line-height: 1.75;
        }
        .kx-prose p:last-child { margin-bottom: 0; }
        .kx-prose ul {
          padding-left: 18px;
          margin: 0 0 8px;
        }
        .kx-prose ul li {
          font-size: 14px;
          color: #6B3352;
          margin-bottom: 5px;
          list-style: disc;
          line-height: 1.75;
        }
        .kx-prose strong { color: #3B1A2E; }
        .kx-prose a { color: #D63A7A; font-weight: 700; text-decoration: none; }

        /* Highlight box */
        .kx-highlight {
          background: #FFF0F5;
          border-left: 4px solid #F472A8;
          border-radius: 0 10px 10px 0;
          padding: 10px 14px;
          margin-top: 10px;
          font-size: 13px;
          color: #6B3352;
          line-height: 1.65;
          font-family: 'Nunito Sans', sans-serif;
        }

        .kx-divider {
          border: none;
          border-top: 1.5px solid #F9BFDA;
          margin: 0 0 28px;
        }

        /* Footer */
        .kx-footer {
          background: #FFF0F5;
          border-top: 1.5px solid #F9BFDA;
          padding: 16px 32px;
          text-align: center;
          font-size: 12px;
          color: #C08090;
          font-weight: 600;
          font-family: 'Nunito Sans', sans-serif;
        }
        .kx-footer a { color: #D63A7A; text-decoration: none; }

        /* Responsive */
        @media (max-width: 600px) {
          .kx-root { padding: 24px 12px 48px; }
          .kx-header { padding: 32px 20px; }
          .kx-body { padding: 24px 18px 32px; }
          .kx-prose { padding-left: 0; }
          .kx-toc { padding: 16px; }
          .kx-toc ol { grid-template-columns: 1fr; }
          .kx-footer { padding: 14px 20px; }
        }
      `}</style>

      <div className="kx-root">
        <div className="kx-blob kx-blob1" />
        <div className="kx-blob kx-blob2" />
        <div className="kx-blob kx-blob3" />

        <div className="kx-card">
          {/* Header */}
          <div className="kx-header">
            <div className="kx-header-circle1" />
            <div className="kx-header-circle2" />
            <div className="kx-header-circle3" />
            <div className="kx-header-inner">
              <div className="kx-badge">Legal</div>
              <h1 className="kx-title">Terms &amp; Conditions</h1>
              <p className="kx-subtitle">Effective immediately</p>
            </div>
          </div>

          {/* Body */}
          <div className="kx-body">
            {/* TOC */}
            <div className="kx-toc">
              <p className="kx-toc-label"> Contents</p>
              <ol>
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>
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
                  className="kx-section"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className="kx-section-head">
                    <div className="kx-num">{i + 1}</div>
                    <h2 className="kx-section-title">{s.title}</h2>
                  </div>
                  <div className="kx-prose">{s.content}</div>
                </div>
                {i < sections.length - 1 && <hr className="kx-divider" />}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="kx-footer">
            © {new Date().getFullYear()} Kiddex · Made with ❤️ for little ones ·{" "}
            <a href={`mailto:${process.env.EMAIL_FROM}`}>
              {process.env.EMAIL_FROM || "operation.a2vgroups@gmail.com"}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
