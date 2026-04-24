"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

const CATEGORIES = [
  "Action Figures", "Board Games", "Educational Toys", "Dolls",
  "Vehicles", "Puzzles", "Outdoor & Sports", "Arts & Crafts",
  "Battery Operated Toys", "Building Sets" , "Return Gifts Toys" , "Lunch Box And Bottles",
  "School Bags", "Return Gifts Stationary","Non Battery Toys","Soft Toys"
];

const TAGS = ["Bestseller", "New", "Sale", "Limited Edition", "Award Winning", "Eco Friendly"];

const TAG_EMOJIS = {
  "Bestseller": "🏆", "New": "✨", "Sale": "🔥",
  "Limited Edition": "💎", "Award Winning": "🥇", "Eco Friendly": "🌿",
};

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const fileInputRef = useRef(null);
  const titleCheckTimeout = useRef(null);

  const [toy, setToy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  // ── title validation state ──
  const [titleError, setTitleError] = useState("");
  const [checkingTitle, setCheckingTitle] = useState(false);

  const [formData, setFormData] = useState({
    title: "", category: "Action Figures", brand: "",
    stock: 0, description: "", gender: "Unisex", age: "", tags: [], price: 0,
  });

  useEffect(() => {
    async function fetchToy() {
      setLoading(true);
      try {
        const res = await fetch(`/api/toys/${id}`);
        const data = await res.json();
        if (res.ok) {
          setToy(data.toy);
          setFormData({
            title: data.toy.title || "",
            category: data.toy.category || "Action Figures",
            brand: data.toy.brand || "",
            stock: data.toy.stock ?? 0,
            description: data.toy.description || "",
            gender: data.toy.gender || "Unisex",
            age: data.toy.age || "",
            tags: data.toy.tags || [],
            price: data.toy.price ?? 0,
          });
        } else {
          alert("Product not found");
          router.push("/admin/home/shop");
        }
      } catch (err) {
        alert("Error loading product");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchToy();
  }, [id, router]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const readers = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((results) => {
      setNewImages(results);
      setNewPreviews(results);
    });
  };

  const handleTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  // ── DUPLICATE TITLE CHECK (skips own current name) ──
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, title: value });
    setTitleError("");

    // If unchanged from original name, no need to check
    if (value.trim().toLowerCase() === toy?.title?.toLowerCase()) {
      setCheckingTitle(false);
      clearTimeout(titleCheckTimeout.current);
      return;
    }

    if (!value.trim()) {
      setCheckingTitle(false);
      clearTimeout(titleCheckTimeout.current);
      return;
    }

    clearTimeout(titleCheckTimeout.current);
    setCheckingTitle(true);

    titleCheckTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/toys?title=${encodeURIComponent(value.trim())}&limit=100`);
        const data = await res.json();

        const toys = Array.isArray(data?.toys) ? data.toys : [];

        // Exclude the current product itself by _id
        const exists = toys.some(
          (t) =>
            t.title.toLowerCase() === value.trim().toLowerCase() &&
            String(t._id) !== String(id)
        );

        if (exists) {
          setTitleError("A toy with this name already exists.");
        }
      } catch (err) {
        console.error("Title check failed:", err);
      } finally {
        setCheckingTitle(false);
      }
    }, 600);
  };

  const handleSave = async () => {
  if (titleError) {
    alert("Please fix the errors before saving.");
    return;
  }
  if (checkingTitle) {
    alert("Please wait while we validate the title.");
    return;
  }

  setSaving(true);

  try {
    const res = await fetch(`/api/toys/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        stock: Number(formData.stock),
        images: newImages.length > 0 ? newImages : toy.images,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      router.back(); // ✅ redirect on success
    } else {
      setSaving(false); // ✅ only stop loading on failure
      alert("Update failed: " + (data.message || "Unknown error"));
    }
  } catch (err) {
    setSaving(false); // ✅ stop loading on error
    alert("Error: " + err.message);
  }
  // ❌ no finally — overlay stays until router.back() fires
};

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "linear-gradient(135deg, #fff5f9 0%, #fffdf0 50%, #f0fff4 100%)", fontFamily: "'Nunito', sans-serif" }}
      >
        <div className="text-6xl animate-spin">🎡</div>
        <p className="text-sm font-bold text-gray-400">Loading product…</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-10 px-4 relative bg-gray-200"
      style={{
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        .field-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          padding: 20px 24px;
          transition: box-shadow 0.2s ease;
        }
        .field-card:focus-within { box-shadow: 0 4px 24px rgba(232,67,147,0.12); }

        .toy-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          border: 2px solid #f0f0f0;
          background: #fafafa;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #1a1a2e;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .toy-input::placeholder { color: #ccc; font-weight: 500; }
        .toy-input:focus { border-color: #E84393; background: #fff; }
        .toy-input:disabled { background: #f9f9f9; color: #999; cursor: default; }
        .toy-input.input-error { border-color: #ef4444 !important; background: #fff5f5; }
        .toy-input.input-success { border-color: #22c55e !important; background: #f0fdf4; }

        .section-label {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #E84393;
          margin-bottom: 10px;
          display: block;
        }

        .tag-pill {
          padding: 8px 16px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 800;
          border: 2px solid #f0f0f0;
          background: white;
          color: #aaa;
          cursor: pointer;
          transition: all 0.18s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .tag-pill:hover:not(.locked) { border-color: #E84393; color: #E84393; transform: translateY(-2px); }
        .tag-pill.active {
          background: linear-gradient(135deg, #E84393, #FFB800);
          border-color: transparent;
          color: white;
          box-shadow: 0 4px 12px rgba(232,67,147,0.25);
        }
        .tag-pill.locked { cursor: default; }

        .image-thumb {
          width: 100px; height: 100px;
          border-radius: 16px;
          overflow: hidden;
          border: 2.5px solid #f0f0f0;
          position: relative;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .image-thumb:hover { border-color: #E84393; transform: scale(1.04); }

        .upload-zone {
          border: 2.5px dashed #fbb6d4;
          border-radius: 20px;
          background: #fff9fc;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .upload-zone:hover { border-color: #E84393; background: #fff0f7; }

        .badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 800; }
        .badge-pink   { background: #fff0f7; color: #E84393; }
        .badge-yellow { background: #fffbe0; color: #b07d00; }
        .badge-green  { background: #f0fff4; color: #16a34a; }
        .badge-gray   { background: #f5f5f5; color: #888; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { display: inline-block; animation: spin 1s linear infinite; }
      `}</style>

      {/* ── SAVING OVERLAY ── */}
      {saving && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 16,
            background: "linear-gradient(135deg, #fff5f9 0%, #fffdf0 50%, #f0fff4 100%)",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          <span className="spin" style={{ fontSize: 52 }}>🎡</span>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#aaa" }}>
            Saving changes... 💾
          </p>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-gray-100 rounded-3xl p-10 mb-10">

        {/* BACK + HEADER */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-pink-500 transition-colors mb-4"
          >
            ← Back
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div
                className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase shadow-sm mb-3"
                style={{ color: "#E84393" }}
              >
                <span>🧸</span> Product Detail
              </div>
              <h1 className="text-3xl font-black" style={{ color: "#1a1a2e" }}>
                {editMode ? (
                  <> Editing <span style={{ color: "#E84393" }}>Product</span> ✏️ </>
                ) : (
                  toy?.title
                )}
              </h1>
            </div>

            {/* EDIT / SAVE / CANCEL */}
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setNewImages([]);
                      setNewPreviews([]);
                      setTitleError("");
                      setCheckingTitle(false);
                      // reset title back to original
                      setFormData((prev) => ({ ...prev, title: toy?.title || "" }));
                    }}
                    className="px-5 py-2.5 rounded-full border-2 border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !!titleError || checkingTitle}
                    className="px-6 py-2.5 rounded-full text-white text-sm font-black transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #E84393, #FFB800)", boxShadow: "0 4px 16px rgba(232,67,147,0.3)" }}
                  >
                    {saving ? "Saving… 🌀" : "Save Changes"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2.5 rounded-full text-white text-sm font-black transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #E84393, #FFB800)", boxShadow: "0 4px 16px rgba(232,67,147,0.3)" }}
                >
                  ✏️ Edit Product
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">

          {/* ── IMAGES ── */}
          <div className="field-card">
            <span className="section-label">Product Images</span>
            <div className="flex flex-wrap gap-3 mb-4">
              {(newPreviews.length > 0 ? newPreviews : toy?.images || []).map((src, i) => (
                <div key={i} className="image-thumb">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  {newPreviews.length > 0 && (
                    <span className="absolute top-1 left-1 bg-yellow-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                      NEW
                    </span>
                  )}
                </div>
              ))}
            </div>

            {editMode && (
              <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                <div className="text-3xl mb-2">📸</div>
                <p className="text-sm font-bold text-gray-400">
                  {newPreviews.length > 0
                    ? `${newPreviews.length} new image(s) selected — click to change`
                    : "Click to replace images"}
                </p>
                <p className="text-xs text-gray-300 font-semibold mt-1">PNG, JPG, WEBP</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>

          {/* ── TITLE with duplicate check ── */}
          <div className="field-card">
            <span className="section-label">Product Title</span>
            <div style={{ position: "relative" }}>
              <input
                className={`toy-input ${
                  !editMode
                    ? ""
                    : titleError
                    ? "input-error"
                    : formData.title &&
                      !checkingTitle &&
                      formData.title.toLowerCase() !== toy?.title?.toLowerCase()
                    ? "input-success"
                    : ""
                }`}
                value={formData.title}
                disabled={!editMode}
                onChange={handleTitleChange}
                placeholder="Product title"
                style={editMode ? { paddingRight: 40 } : {}}
              />

              {/* Checking indicator */}
              {editMode && checkingTitle && (
                <span style={{
                  position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 11, fontWeight: 700, color: "#aaa",
                  fontFamily: "'Nunito', sans-serif",
                }}>
                  checking…
                </span>
              )}

              {/* Green tick — unique new name */}
              {editMode && !checkingTitle && formData.title && !titleError &&
                formData.title.toLowerCase() !== toy?.title?.toLowerCase() && (
                <span style={{
                  position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)",
                  color: "#22c55e", fontSize: 16, fontWeight: 900,
                }}>✓</span>
              )}

              {/* Red cross */}
              {editMode && !checkingTitle && titleError && (
                <span style={{
                  position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)",
                  color: "#ef4444", fontSize: 16, fontWeight: 900,
                }}>✕</span>
              )}
            </div>

            {/* Error message */}
            {titleError && (
              <p style={{
                marginTop: 8, fontSize: 11, fontWeight: 700,
                color: "#ef4444", display: "flex", alignItems: "center", gap: 4,
                fontFamily: "'Nunito', sans-serif",
              }}>
                <span>⚠️</span> {titleError}
              </p>
            )}
          </div>

          {/* ── CATEGORY + BRAND ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="field-card">
              <span className="section-label">Category</span>
              <select
                className="toy-input"
                value={formData.category}
                disabled={!editMode}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field-card">
              <span className="section-label">Brand</span>
              <input
                className="toy-input"
                value={formData.brand}
                disabled={!editMode}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Brand name"
              />
            </div>
          </div>

          {/* ── STOCK + AGE + GENDER ── */}
          <div className="grid grid-cols-3 gap-4">
            <div className="field-card">
              <span className="section-label">Stock</span>
              <input
                className="toy-input"
                type="number"
                min={0}
                value={formData.stock}
                disabled={!editMode}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
            <div className="field-card">
              <span className="section-label">Age Range</span>
              <input
                className="toy-input"
                value={formData.age}
                disabled={!editMode}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="e.g. 3–5 yrs"
              />
            </div>
            <div className="field-card">
              <span className="section-label">Gender</span>
              <select
                className="toy-input"
                value={formData.gender}
                disabled={!editMode}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option>Unisex</option>
                <option>Boy</option>
                <option>Girl</option>
              </select>
            </div>
          </div>

          {/* ── PRICE ── */}
          <div className="field-card">
            <span className="section-label">Price (₹)</span>
            <input
              className="toy-input"
              type="number"
              min={0}
              value={formData.price}
              disabled={!editMode}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="e.g. 499"
            />
          </div>

          {/* ── DESCRIPTION ── */}
          <div className="field-card">
            <span className="section-label">Description</span>
            <textarea
              rows={4}
              className="toy-input"
              value={formData.description}
              disabled={!editMode}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description…"
              style={{ resize: "none" }}
            />
          </div>

          {/* ── TAGS ── */}
          <div className="field-card">
            <span className="section-label">Tags</span>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  disabled={!editMode}
                  onClick={() => editMode && handleTag(tag)}
                  className={`tag-pill ${formData.tags.includes(tag) ? "active" : ""} ${!editMode ? "locked" : ""}`}
                >
                  <span>{TAG_EMOJIS[tag]}</span>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* ── META ── */}
          {toy && (
            <div className="field-card">
              <span className="section-label">Meta</span>
              <div className="flex flex-wrap gap-3 text-xs font-bold text-gray-400">
                <span>🆔 {String(toy._id)}</span>
                <span>📅 Added {new Date(toy.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                {toy.updatedAt && (
                  <span>🔄 Updated {new Date(toy.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                )}
              </div>
            </div>
          )}

          {/* ── SAVE BUTTON (bottom) ── */}
          {editMode && (
            <button
              onClick={handleSave}
              disabled={saving || !!titleError || checkingTitle}
              className="w-full py-4 rounded-full text-white font-black text-sm tracking-wide uppercase transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #E84393, #FFB800)",
                boxShadow: "0 6px 24px rgba(232,67,147,0.35)",
              }}
            >
              {saving ? "Saving… 🌀" : "Save Changes "}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}