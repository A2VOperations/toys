"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OffersAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    heading: "UP TO 30%\nOFF",
  });

  useEffect(() => {
    fetch("/api/offer")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.offer) {
          setFormData({
            heading: data.offer.heading || "UP TO 30%\nOFF",
          });
        }
      })
      .catch((err) => console.error("Error fetching offer:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/offer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Offer updated successfully!");
        router.refresh();
      } else {
        alert("Error: " + (data.error || "Something went wrong"));
      }
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Submit failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen py-12 px-4 relative bg-gray-200" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .field-card { background:#fff; border-radius:20px; box-shadow:0 2px 12px rgba(0,0,0,0.05); padding:20px 24px; transition:box-shadow 0.2s; }
        .field-card:focus-within { box-shadow:0 4px 24px rgba(232,67,147,0.12); }
        .offer-input { width:100%; padding:10px 14px; border-radius:12px; border:2px solid #f0f0f0; background:#fafafa; font-family:'Nunito',sans-serif; font-size:14px; font-weight:600; color:#1a1a2e; outline:none; transition:border-color 0.2s,background 0.2s; }
        .offer-input:focus { border-color:#E84393; background:#fff; }
        .submit-btn { width:100%; padding:16px; border-radius:99px; font-family:'Nunito',sans-serif; font-size:15px; font-weight:900; letter-spacing:0.08em; text-transform:uppercase; color:white; border:none; cursor:pointer; background:linear-gradient(135deg,#E84393,#FFB800); box-shadow:0 6px 24px rgba(232,67,147,0.35); transition:opacity 0.2s,transform 0.15s; }
        .submit-btn:hover:not(:disabled) { opacity:0.92; transform:translateY(-2px); }
        .submit-btn:active:not(:disabled) { transform:scale(0.98); }
        .submit-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .section-label { font-size:14px; font-weight:800; letter-spacing:0.18em; text-transform:uppercase; color:#E84393; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
      `}</style>

      <div className="max-w-2xl mx-auto bg-gray-100 rounded-3xl p-10">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase shadow-sm mb-4" style={{ color: "#E84393" }}>
            <span>🎁</span> Admin Panel
          </div>
          <h1 className="text-5xl font-black leading-tight" style={{ color: "#1a1a2e" }}>
            Update <span style={{ color: "#E84393" }}>Offer</span> <span style={{ color: "#FFB800" }}>🔥</span>
          </h1>
          <p className="text-sm font-semibold text-gray-400 mt-2">Manage the promotional offer shown in the navigation bar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="field-card">
            <span className="section-label">Main Heading (Use Enter for new line)</span>
            <textarea
              name="heading"
              rows={3}
              className="offer-input"
              style={{ resize: "none" }}
              value={formData.heading}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Saving… 🌀" : "Update Offer 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}
