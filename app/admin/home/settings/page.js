"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState(null);
  const [showPass, setShowPass] = useState({ current: false, next: false, confirm: false });

  const [form, setForm] = useState({
    name: "", email: "", mobile: "",
    currentPassword: "", newPassword: "", confirmPassword: "",
  });

  // ── read email from cookie on client ──────────────────────
  useEffect(() => {
    // parse the httpOnly cookie via API call — we ask our own API who is logged in
    async function load() {
      try {
        const res  = await fetch("/api/auth/me");
        const data = await res.json();
        if (!res.ok) { router.push("/admin"); return; }

        const email = data.email;
        const profile = await fetch(`/api/auth/settings?email=${email}`);
        const pdata   = await profile.json();

        if (profile.ok) {
          setForm((f) => ({
            ...f,
            name:   pdata.user.name   || "",
            email:  pdata.user.email  || "",
            mobile: pdata.user.mobile || "",
          }));
        }
      } catch {
        showToast("error", "Could not load profile.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSave(e) {
    e.preventDefault();
    if (form.newPassword) {
      if (!form.currentPassword) return showToast("error", "Enter your current password.");
      if (form.newPassword !== form.confirmPassword)
        return showToast("error", "New passwords don't match.");
      if (form.newPassword.length < 6)
        return showToast("error", "Password must be at least 6 characters.");
    }

    setSaving(true);
    try {
      const res  = await fetch("/api/auth/settings", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:           form.email,
          name:            form.name,
          mobile:          form.mobile,
          currentPassword: form.currentPassword || undefined,
          newPassword:     form.newPassword     || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("success", "Profile updated! 🎉");
        setForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" }));
      } else {
        showToast("error", data.message || "Update failed.");
      }
    } catch {
      showToast("error", "Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "linear-gradient(135deg,#fff5f9 0%,#fffdf0 50%,#f0fff4 100%)", fontFamily: "'Nunito',sans-serif" }}>
        <div className="text-6xl animate-spin">⚙️</div>
        <p className="text-sm font-bold text-gray-400">Loading your settings…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4"
      style={{ background: "linear-gradient(135deg,#fff5f9 0%,#fffdf0 50%,#f0fff4 100%)", fontFamily: "'Nunito',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .s-card { background:white; border-radius:20px; box-shadow:0 2px 12px rgba(0,0,0,0.05); padding:20px 24px; transition:box-shadow 0.2s; }
        .s-card:focus-within { box-shadow:0 4px 24px rgba(232,67,147,0.12); }
        .s-input { width:100%; padding:11px 14px; border-radius:12px; border:2px solid #f0f0f0; background:#fafafa; font-family:'Nunito',sans-serif; font-size:14px; font-weight:600; color:#1a1a2e; outline:none; transition:border-color 0.2s,background 0.2s; }
        .s-input::placeholder { color:#ccc; font-weight:500; }
        .s-input:focus { border-color:#E84393; background:#fff; }
        .s-input:disabled { background:#f9f9f9; color:#aaa; cursor:default; }
        .s-label { display:block; font-size:10px; font-weight:800; letter-spacing:0.18em; text-transform:uppercase; color:#E84393; margin-bottom:8px; }
        .s-section { font-size:11px; font-weight:900; letter-spacing:0.2em; text-transform:uppercase; color:#1a1a2e; display:flex; align-items:center; gap:8px; margin-bottom:16px; }
        .s-section::after { content:''; flex:1; height:2px; background:linear-gradient(90deg,#f0f0f0,transparent); border-radius:2px; }
        .pass-wrap { position:relative; }
        .pass-toggle { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:16px; }
        .avatar { width:72px; height:72px; border-radius:50%; background:linear-gradient(135deg,#E84393,#FFB800); display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:900; color:white; box-shadow:0 8px 24px rgba(232,67,147,0.3); flex-shrink:0; }
        .s-save { width:100%; padding:15px; border-radius:99px; border:none; background:linear-gradient(135deg,#E84393,#FFB800); color:white; font-family:'Nunito',sans-serif; font-size:14px; font-weight:900; letter-spacing:0.08em; text-transform:uppercase; cursor:pointer; box-shadow:0 6px 24px rgba(232,67,147,0.35); transition:opacity 0.2s,transform 0.15s; }
        .s-save:hover:not(:disabled) { opacity:0.88; transform:translateY(-2px); }
        .s-save:disabled { opacity:0.5; cursor:not-allowed; }
        .toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); padding:14px 28px; border-radius:99px; font-family:'Nunito',sans-serif; font-size:13px; font-weight:800; color:white; z-index:999; box-shadow:0 8px 32px rgba(0,0,0,0.15); animation:toastIn 0.3s ease; white-space:nowrap; }
        .toast-success { background:linear-gradient(135deg,#16a34a,#22c55e); }
        .toast-error   { background:linear-gradient(135deg,#E84393,#ff6b6b); }
        @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>

      <div className="max-w-xl mx-auto">

        {/* BACK + HEADER */}
        <div className="mb-8">
          <button onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-pink-500 transition-colors mb-5">
            ← Back
          </button>
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase shadow-sm mb-3"
            style={{ color: "#E84393" }}>
            <span>⚙️</span> Account Settings
          </div>
          <h1 className="text-3xl font-black" style={{ color: "#1a1a2e" }}>
            Your <span style={{ color: "#E84393" }}>Profile</span> 👤
          </h1>
        </div>

        {/* PROFILE CARD */}
        <div className="s-card mb-5 flex items-center gap-5">
          <div className="avatar">{form.name?.charAt(0).toUpperCase() || "?"}</div>
          <div>
            <p className="text-lg font-black text-[#1a1a2e]">{form.name || "—"}</p>
            <p className="text-sm font-semibold text-gray-400">{form.email}</p>
            {form.mobile && <p className="text-sm font-semibold text-gray-400">📱 {form.mobile}</p>}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">

          {/* PERSONAL INFO */}
          <div className="s-card space-y-4">
            <p className="s-section"><span>👤</span> Personal Info</p>

            <div>
              <label className="s-label">Full Name</label>
              <input className="s-input" value={form.name} onChange={set("name")} placeholder="Your full name" required />
            </div>

            <div>
              <label className="s-label">Email Address</label>
              <input className="s-input" value={form.email} disabled />
              <p className="text-[11px] font-semibold text-gray-400 mt-1.5 ml-1">🔒 Email cannot be changed</p>
            </div>

            <div>
              <label className="s-label">Mobile Number</label>
              <input className="s-input" value={form.mobile} onChange={set("mobile")}
                placeholder="9876543210" type="tel" minLength={10} maxLength={10} />
            </div>
          </div>

          {/* CHANGE PASSWORD */}
          <div className="s-card space-y-4">
            <p className="s-section"><span>🔑</span> Change Password</p>
            <p className="text-xs font-semibold text-gray-400 -mt-2">Leave blank to keep current password.</p>

            {[
              { key: "currentPassword", label: "Current Password",  vis: "current" },
              { key: "newPassword",     label: "New Password",      vis: "next"    },
              { key: "confirmPassword", label: "Confirm Password",  vis: "confirm" },
            ].map(({ key, label, vis }) => (
              <div key={key}>
                <label className="s-label">{label}</label>
                <div className="pass-wrap">
                  <input
                    className="s-input" style={{ paddingRight: "40px" }}
                    type={showPass[vis] ? "text" : "password"}
                    value={form[key]} onChange={set(key)}
                    placeholder={key === "newPassword" ? "Min. 6 characters" : "••••••••"}
                  />
                  <button type="button" className="pass-toggle"
                    onClick={() => setShowPass((p) => ({ ...p, [vis]: !p[vis] }))}>
                    {showPass[vis] ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            ))}

            {form.newPassword && form.confirmPassword && (
              <p className={`text-[11px] font-bold ml-1 ${form.newPassword === form.confirmPassword ? "text-green-500" : "text-pink-500"}`}>
                {form.newPassword === form.confirmPassword ? "✅ Passwords match" : "❌ Don't match"}
              </p>
            )}
          </div>

          <button type="submit" className="s-save" disabled={saving}>
            {saving ? "Saving… 🌀" : "Save Changes 🚀"}
          </button>
        </form>

        {/* LOGOUT */}
        <button onClick={handleLogout}
          className="w-full mt-4 py-3 rounded-full border-2 border-pink-200 text-sm font-bold text-pink-400 hover:bg-pink-50 transition-all">
          🚪 Log Out
        </button>

      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? "✅ " : "❌ "}{toast.msg}
        </div>
      )}
    </div>
  );
}