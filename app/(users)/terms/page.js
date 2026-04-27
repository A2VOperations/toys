"use client";

const SUPPORT_EMAIL = "operation.a2vgroups@gmail.com";
const SUPPORT_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
const SUPPORT_ADDRESS =
  process.env.NEXT_PUBLIC_ADDRESS || "Toys for Kids Store, New Delhi, India";

const sections = [
  {
    id: "s1",
    title: "Acceptance of Terms",
    icon: "📄",
    content: (
      <p>
        By accessing or using the Toys for Kids website, you agree to be bound by these
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
          We <strong className="text-[#3B1A2E]">only accept returns</strong> in
          the following cases:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>
            The product received is{" "}
            <strong className="text-[#3B1A2E]">damaged</strong>
          </li>
          <li>
            The product is <strong className="text-[#3B1A2E]">defective</strong>
          </li>
          <li>
            The product is{" "}
            <strong className="text-[#3B1A2E]">wrong or missing items</strong>
          </li>
        </ul>
        <div className="bg-[#FFF0F5] border-l-4 border-[#F472A8] rounded-r-xl px-4 py-3 mt-3 text-sm text-[#6B3352] leading-relaxed">
          <strong className="text-[#3B1A2E]">Mandatory:</strong> A clear
          unboxing video from the moment the package is opened is required as
          proof. Returns without video proof will be rejected.
        </div>
      </>
    ),
  },
  {
    id: "s3",
    title: "Conditions for Returns",
    icon: "✅",
    content: (
      <ul className="list-disc pl-5 space-y-1">
        <li>The product must be unused and in original packaging</li>
        <li>
          All return shipments{" "}
          <strong className="text-[#3B1A2E]">must be prepaid</strong>
        </li>
        <li>
          <strong className="text-[#3B1A2E]">
            COD return packages will be rejected
          </strong>
        </li>
        <li>
          You are responsible for{" "}
          <strong className="text-[#3B1A2E]">all return shipping costs</strong>{" "}
          to our warehouse
        </li>
        <li>
          Returns must be requested within{" "}
          <strong className="text-[#3B1A2E]">24–48 hours</strong> of delivery
          (for damage cases)
        </li>
      </ul>
    ),
  },
  {
    id: "s4",
    title: "Order Cancellation",
    icon: "🚫",
    content: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Orders can only be cancelled{" "}
          <strong className="text-[#3B1A2E]">before they are shipped</strong>{" "}
          from our warehouse
        </li>
        <li>
          Once an order is dispatched,{" "}
          <strong className="text-[#3B1A2E]">
            cancellations are not possible
          </strong>
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
        <div className="bg-[#FFF0F5] border-l-4 border-[#F472A8] rounded-r-xl px-4 py-3 mt-3 text-sm text-[#6B3352] leading-relaxed">
          ⚠️ <strong className="text-[#3B1A2E]">No refunds</strong> for: missing
          unboxing video · return requests after the allowed time · used,
          damaged, or incomplete products returned by the customer.
        </div>
      </>
    ),
  },
  {
    id: "s6",
    title: "Non-Returnable Items",
    icon: "🔒",
    content: (
      <ul className="list-disc pl-5 space-y-1">
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
        descriptions — is the property of Toys for Kids and protected by applicable IP
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
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong className="text-[#3B1A2E]">Email:</strong>{" "}{SUPPORT_EMAIL}
        </li>
        <li>
          <strong className="text-[#3B1A2E]">Phone:</strong> {SUPPORT_NUMBER}
        </li>
        <li>
          <strong className="text-[#3B1A2E]">Address:</strong> {SUPPORT_ADDRESS}
        </li>
      </ul>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Nunito+Sans:wght@400;600&display=swap');

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

        .grad-header {
          background: linear-gradient(135deg, #D63A7A, #F472A8, #C02060, #F472A8, #D63A7A);
          background-size: 300% 300%;
          animation: kx-gradientShift 5s ease infinite;
        }
        .grad-num {
          background: linear-gradient(135deg, #D63A7A, #F472A8, #D63A7A);
          background-size: 200% 200%;
          animation: kx-gradientShift 5s ease infinite;
        }
        .blob-float-1 { animation: kx-float 8s ease-in-out infinite; }
        .blob-float-2 { animation: kx-float 11s ease-in-out infinite reverse; }
        .blob-float-3 { animation: kx-float 13s ease-in-out infinite; }
        .section-fadein { animation: kx-fadeUp 0.3s ease both; }
      `}</style>

      <div
        className="bg-[#FFE4EC] px-4 py-10 relative overflow-hidden"
        style={{ fontFamily: "'Nunito Sans', sans-serif" }}
      >
        {/* Blobs */}
        <div
          className="blob-float-1 absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none -translate-y-1/4 translate-x-1/4"
          style={{
            background:
              "radial-gradient(circle, rgba(244,114,168,0.33), transparent)",
          }}
        />
        <div
          className="blob-float-2 absolute bottom-0 left-0 w-60 h-60 rounded-full pointer-events-none translate-y-1/4 -translate-x-1/4"
          style={{
            background:
              "radial-gradient(circle, rgba(214,58,122,0.20), transparent)",
          }}
        />
        <div
          className="blob-float-3 absolute top-1/2 left-0 w-40 h-40 rounded-full pointer-events-none -translate-x-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(249,191,218,0.33), transparent)",
          }}
        />

        {/* Card */}
        <div className="relative z-10 max-w-3xl mx-auto bg-white rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(214,58,122,0.14),0_2px_8px_rgba(214,58,122,0.06)]">
          {/* Header */}
          <div className="grad-header px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute -top-6 -left-6 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-8 -right-8 w-52 h-52 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute top-5 right-20 w-20 h-20 rounded-full bg-white/[0.08] pointer-events-none" />
            <div className="relative z-10">
              <span
                className="inline-block bg-white/20 text-white text-[10px] font-black tracking-[2px] uppercase px-5 py-1.5 rounded-full border border-white/40 mb-4"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                Legal
              </span>
              <h1
                className="text-white font-black text-4xl leading-tight mb-2 drop-shadow-md"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                Terms &amp; Conditions
              </h1>
              <p className="text-white/80 text-xs font-semibold">
                Effective immediately
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-8 sm:px-10">
            {/* TOC */}
            <div className="bg-[#FFF0F5] border-2 border-[#F9BFDA] rounded-2xl px-6 py-5 mb-10">
              <p
                className="text-[#D63A7A] font-black text-[11px] tracking-widest uppercase mb-3"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                Contents
              </p>
              <ol className="pl-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 list-decimal">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-sm font-semibold text-[#3B1A2E] hover:text-[#D63A7A] transition-colors"
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
                <div
                  id={s.id}
                  className="section-fadein mb-7 scroll-mt-5"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {/* Heading row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="grad-num w-9 h-9 min-w-[36px] rounded-xl flex items-center justify-center text-white font-black text-sm shadow-[0_3px_10px_rgba(214,58,122,0.3)] shrink-0"
                      style={{ fontFamily: "'Nunito', sans-serif" }}
                    >
                      {i + 1}
                    </div>
                    <h2
                      className="font-black text-lg text-[#3B1A2E]"
                      style={{ fontFamily: "'Nunito', sans-serif" }}
                    >
                      {s.title}
                    </h2>
                  </div>

                  {/* Content */}
                  <div className="pl-12 text-sm text-[#6B3352] leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_a]:text-[#D63A7A] [&_a]:font-bold [&_strong]:text-[#3B1A2E]">
                    {s.content}
                  </div>
                </div>

                {i < sections.length - 1 && (
                  <hr className="border-[#F9BFDA] mb-7" />
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
