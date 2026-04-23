"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function LoadingOverlay({ stage }) {
  // stage: "authenticating" | "redirecting"
  return (
    <>
      <style>{`
        .loader-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f857a6 0%, #ff5858 40%, #ff9a3c 100%);
          animation: overlayFadeIn 0.25s ease;
          gap: 28px;
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Spinner ring */
        .spinner-ring {
          width: 72px;
          height: 72px;
          position: relative;
        }
        .spinner-ring::before,
        .spinner-ring::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
        }
        .spinner-ring::before {
          border: 4px solid rgba(255,255,255,0.2);
        }
        .spinner-ring::after {
          border: 4px solid transparent;
          border-top-color: #fff;
          border-right-color: rgba(255,255,255,0.5);
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Lock icon inside spinner */
        .spinner-icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Dots */
        .loader-dots {
          display: flex;
          gap: 8px;
        }
        .loader-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          animation: dotBounce 1.2s ease-in-out infinite;
        }
        .loader-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loader-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }

        .loader-label {
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: rgba(255,255,255,0.92);
          letter-spacing: 0.5px;
        }

        /* Checkmark for redirecting stage */
        .check-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(255,255,255,0.22);
          border: 3px solid rgba(255,255,255,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: checkPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes checkPop {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        .check-path {
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
          animation: drawCheck 0.45s ease 0.1s forwards;
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      <div className="loader-overlay">
        {stage === "authenticating" ? (
          <>
            <div className="spinner-ring">
              <div className="spinner-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(255,255,255,0.85)" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
            </div>
            <div className="loader-label">Authenticating…</div>
            <div className="loader-dots">
              <span/><span/><span/>
            </div>
          </>
        ) : (
          <>
            <div className="check-circle">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <polyline
                  className="check-path"
                  points="7,16 13,22 25,10"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="loader-label">Redirecting to dashboard…</div>
            <div className="loader-dots">
              <span/><span/><span/>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(null); // "authenticating" | "redirecting"

  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetEmailError, setResetEmailError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => { setMounted(true); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setLoadingStage("authenticating");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (res.ok) {
        // Switch to "redirecting" stage briefly before navigation
        setLoadingStage("redirecting");
        await new Promise((r) => setTimeout(r, 900));
        router.push("/admin/home");
        router.refresh();
      } else {
        setLoadingStage(null);
        setLoading(false);
        showToast("❌ " + result.error);
      }
    } catch {
      setLoadingStage(null);
      setLoading(false);
      showToast("❌ Could not connect to server.");
    }
  };

  const handleForgotOpen = () => {
    setResetEmail(formData.email || "");
    setResetEmailError("");
    setShowForgot(true);
  };

  const handleForgotSubmit = async () => {
    if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      setResetEmailError("Please enter a valid email address.");
      return;
    }
    setResetEmailError("");
    setResetLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      setShowForgot(false);
      showToast("If that email exists, a reset link has been sent.");
    } catch {
      showToast("❌ Could not connect to server.");
    } finally {
      setResetLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        .login-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #f857a6 0%, #ff5858 40%, #ff9a3c 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'Nunito', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .orb1 { width: 100px; height: 100px; background: linear-gradient(135deg, #a259ff, #ff6b35); top: 6%; right: 5%; opacity: 0.8; }
        .orb2 { width: 75px; height: 75px; background: linear-gradient(135deg, #6a3de8, #c040a0); bottom: 10%; right: 4%; opacity: 0.75; }
        .orb3 { width: 55px; height: 55px; background: linear-gradient(135deg, #8a00d4, #d500f9); bottom: 22%; left: 4%; opacity: 0.45; }

        .ring { position: absolute; border-radius: 50%; border: 1px solid rgba(255,255,255,0.15); pointer-events: none; }
        .ring1 { width: 420px; height: 420px; top: -100px; left: -100px; }
        .ring2 { width: 340px; height: 340px; bottom: -120px; right: -80px; }

        .glass-card {
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 24px;
          padding: 2.75rem 2.25rem 2.25rem;
          width: 100%;
          max-width: 400px;
          position: relative;
          z-index: 2;
        }

        .card-title { font-size: 28px; font-weight: 900; color: #fff; margin-bottom: 6px; letter-spacing: -0.5px; }
        .card-subtitle { font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 2rem; line-height: 1.5; }

        .field-wrap { position: relative; margin-bottom: 4px; }
        .field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; opacity: 0.65; pointer-events: none; }
        .glass-input {
          width: 100%;
          background: rgba(255,255,255,0.22);
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 12px;
          padding: 14px 14px 14px 44px;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          outline: none;
          transition: background 0.2s, border-color 0.2s;
        }
        .glass-input::placeholder { color: rgba(255,255,255,0.6); }
        .glass-input:focus { background: rgba(255,255,255,0.3); border-color: rgba(255,255,255,0.65); }

        .error-msg { font-size: 11px; color: #ffe0e0; font-weight: 700; min-height: 20px; padding: 2px 4px 6px; }

        .forgot-link {
          display: block; text-align: right; font-size: 12px; font-weight: 700;
          color: rgba(255,255,255,0.85); cursor: pointer; margin-bottom: 1.5rem;
          background: none; border: none; font-family: 'Nunito', sans-serif;
          transition: color 0.2s; padding: 0; width: 100%;
        }
        .forgot-link:hover { color: #fff; text-decoration: underline; }

        .login-btn {
          width: 100%;
          background: rgba(255,255,255,0.25);
          border: 1.5px solid rgba(255,255,255,0.5);
          border-radius: 12px;
          padding: 14px;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .login-btn:hover:not(:disabled) { background: rgba(255,255,255,0.35); }
        .login-btn:active:not(:disabled) { transform: scale(0.98); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .overlay { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(0,0,0,0.45); }
        .modal { background: #fff; border-radius: 20px; padding: 2rem 1.75rem; width: 100%; max-width: 360px; position: relative; }
        .modal-title { font-size: 20px; font-weight: 900; color: #1a1a1a; margin-bottom: 8px; font-family: 'Nunito', sans-serif; }
        .modal-desc { font-size: 13px; color: #666; line-height: 1.6; margin-bottom: 1.25rem; font-family: 'Nunito', sans-serif; }
        .modal-input { width: 100%; border: 1.5px solid #e0e0e0; border-radius: 12px; padding: 13px 14px; font-family: 'Nunito', sans-serif; font-size: 14px; color: #1a1a1a; outline: none; transition: border-color 0.2s; margin-bottom: 6px; }
        .modal-input:focus { border-color: #f857a6; }
        .modal-input-err { font-size: 11px; color: #e24b4a; font-weight: 700; min-height: 18px; margin-bottom: 10px; font-family: 'Nunito', sans-serif; }
        .modal-actions { display: flex; gap: 10px; }
        .btn-cancel { flex: 1; padding: 12px; border: 1.5px solid #e0e0e0; background: #fff; border-radius: 12px; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700; color: #666; cursor: pointer; transition: background 0.2s; }
        .btn-cancel:hover { background: #f5f5f5; }
        .btn-send { flex: 2; padding: 12px; border: none; background: linear-gradient(135deg, #f857a6, #ff5858); border-radius: 12px; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 900; color: #fff; cursor: pointer; letter-spacing: 0.5px; transition: opacity 0.2s, transform 0.15s; }
        .btn-send:hover:not(:disabled) { opacity: 0.88; }
        .btn-send:active:not(:disabled) { transform: scale(0.97); }
        .btn-send:disabled { opacity: 0.6; cursor: not-allowed; }
        .modal-note { font-size: 11.5px; color: #888; margin-top: 14px; line-height: 1.55; padding: 10px 12px; background: #fafafa; border-radius: 10px; border-left: 3px solid #f857a6; font-family: 'Nunito', sans-serif; }

        .toast-wrap { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 100; pointer-events: none; }
        .toast { background: rgba(20,20,20,0.9); color: #fff; font-size: 13px; font-weight: 700; padding: 11px 22px; border-radius: 50px; white-space: nowrap; font-family: 'Nunito', sans-serif; animation: toastIn 0.3s ease; }
        @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 480px) {
          .glass-card { padding: 2rem 1.5rem 1.75rem; }
          .card-title { font-size: 24px; }
          .orb1 { width: 70px; height: 70px; }
          .orb2 { width: 55px; height: 55px; }
          .orb3 { display: none; }
        }
      `}</style>

      {/* Full-screen loading overlay */}
      {loadingStage && <LoadingOverlay stage={loadingStage} />}

      <div className="login-root">
        <div className="ring ring1" />
        <div className="ring ring2" />
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />

        <div className="glass-card">
          <div className="card-title">Welcome Back!</div>
          <div className="card-subtitle">Sign in to continue to your account</div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field-wrap">
              <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                className="glass-input"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="error-msg">{errors.email}</div>

            <div className="field-wrap">
              <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                className="glass-input"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="error-msg">{errors.password}</div>

            {/* <button type="button" className="forgot-link" onClick={handleForgotOpen}>
              Forgot password?
            </button> */}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
        </div>

        {showForgot && (
          <div className="overlay" onClick={e => { if (e.target === e.currentTarget) setShowForgot(false); }}>
            <div className="modal">
              <div className="modal-title">Reset your password</div>
              <div className="modal-desc">
                Enter your registered email. If it exists in our system, a secure reset link will be sent to it.
              </div>
              <input
                className="modal-input"
                type="email"
                placeholder="your@email.com"
                value={resetEmail}
                onChange={e => { setResetEmail(e.target.value); setResetEmailError(""); }}
                onKeyDown={e => e.key === "Enter" && handleForgotSubmit()}
                autoFocus
              />
              <div className="modal-input-err">{resetEmailError}</div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowForgot(false)}>Cancel</button>
                <button className="btn-send" onClick={handleForgotSubmit} disabled={resetLoading}>
                  {resetLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
              <div className="modal-note">
                <strong>Note:</strong> Your password is never emailed directly. You will receive a secure link to set a new password. If you don't receive it, contact your administrator.
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="toast-wrap">
          <div className="toast">{toast}</div>
        </div>
      )}
    </>
  );
}