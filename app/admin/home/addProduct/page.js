"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";

const CATEGORIES = PRODUCT_CATEGORIES;

const TAGS = [
  "Bestseller",
  "New",
  "Sale",
  "Limited Edition",
  "Award Winning",
  "Eco Friendly",
];

const TAG_EMOJIS = {
  Bestseller: "🏆",
  New: "✨",
  Sale: "🔥",
  "Limited Edition": "💎",
  "Award Winning": "🥇",
  "Eco Friendly": "🌿",
};

export default function AddToyForm() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const titleCheckTimeout = useRef(null);

  const [previews, setPreviews] = useState([]);
  const [imageBase64s, setImageBase64s] = useState([]);
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [checkingTitle, setCheckingTitle] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Action Figures",
    brand: "",
    stock: 3,
    description: "",
    gender: "Unisex",
    age: "",
    tags: [],
    price: 0,
  });

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const MIN_WIDTH = 600;
    const MIN_HEIGHT = 600;
    const MAX_WIDTH = 600;
    const MAX_HEIGHT = 600;

    const validFiles = [];

    for (const file of files) {
      const isValid = await new Promise((resolve) => {
        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
            alert(`Image "${file.name}" is too small (${img.width}x${img.height} pixels).\n\nImages must be at least ${MIN_WIDTH}x${MIN_HEIGHT} pixels!`);
            resolve(false);
          } else if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
            alert(`Image "${file.name}" is too large (${img.width}x${img.height} pixels).\n\nImages must be no larger than ${MAX_WIDTH}x${MAX_HEIGHT} pixels!`);
            resolve(false);
          } else {
            resolve(true);
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          alert(`Failed to load image "${file.name}".`);
          resolve(false);
        };
        img.src = objectUrl;
      });

      if (isValid) {
        validFiles.push(file);
      }
    }

    // If none of the selected files met the requirements, just return
    if (!validFiles.length) {
      e.target.value = "";
      return;
    }

    const readers = validFiles.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(readers).then((results) => {
      setPreviews((prev) => [...prev, ...results]);
      setImageBase64s((prev) => [...prev, ...results]);
      // Clear the input value so the same file can be selected again
      e.target.value = "";
    });
  };

  const removeImage = (idx) => {
    setPreviews((p) => p.filter((_, i) => i !== idx));
    setImageBase64s((p) => p.filter((_, i) => i !== idx));
    // Clear the input value so the removed file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  // ── DUPLICATE TITLE CHECK ──
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, title: value });
    setTitleError("");

    if (!value.trim()) {
      setCheckingTitle(false);
      clearTimeout(titleCheckTimeout.current);
      return;
    }

    clearTimeout(titleCheckTimeout.current);
    setCheckingTitle(true);

    titleCheckTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/toys?title=${encodeURIComponent(value.trim())}&limit=100`,
        );
        const data = await res.json();

        // API returns { toys: [...], pagination: {...} }
        const toys = Array.isArray(data?.toys) ? data.toys : [];

        const exists = toys.some(
          (t) => t.title.toLowerCase() === value.trim().toLowerCase(),
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (titleError) {
      alert("Please fix the errors before submitting.");
      return;
    }

    if (imageBase64s.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/toys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          stock: Number(formData.stock),
          images: imageBase64s,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin/home");
      } else {
        setLoading(false);
        alert("Error: " + (data.message || "Something went wrong"));
      }
    } catch (err) {
      console.error("Submit failed:", err);
      setLoading(false);
      alert("Submit failed: " + err.message);
    }
  };

  return (
    <div
      className="min-h-screen py-12 px-4 relative bg-gray-200"
      style={{
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        .field-card {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          padding: 20px 24px;
          transition: box-shadow 0.2s ease;
        }
        .field-card:focus-within {
          box-shadow: 0 4px 24px rgba(232, 67, 147, 0.12);
        }

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
        .toy-input:focus {
          border-color: #E84393;
          background: #fff;
        }
        .toy-input.input-error {
          border-color: #ef4444 !important;
          background: #fff5f5;
        }
        .toy-input.input-success {
          border-color: #22c55e !important;
          background: #f0fdf4;
        }

        .upload-zone {
          border: 2.5px dashed #fbb6d4;
          border-radius: 20px;
          background: #fff9fc;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
        }
        .upload-zone:hover {
          border-color: #E84393;
          background: #fff0f7;
          transform: scale(1.01);
        }

        .preview-thumb {
          position: relative;
          width: 88px;
          height: 88px;
          border-radius: 14px;
          overflow: hidden;
          border: 2.5px solid #f0f0f0;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .preview-thumb:hover {
          transform: scale(1.05);
          border-color: #E84393;
        }
        .preview-thumb:hover .remove-btn { opacity: 1; }
        .remove-btn {
          position: absolute; top: 4px; right: 4px;
          width: 20px; height: 20px;
          background: #E84393; color: white;
          border-radius: 50%; font-size: 12px;
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transition: opacity 0.15s ease;
          cursor: pointer;
          border: none;
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
        .tag-pill:hover {
          border-color: #E84393;
          color: #E84393;
          transform: translateY(-2px);
        }
        .tag-pill.active {
          background: linear-gradient(135deg, #E84393, #FFB800);
          border-color: transparent;
          color: white;
          box-shadow: 0 4px 12px rgba(232,67,147,0.25);
          transform: translateY(-2px);
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          border-radius: 99px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: white;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #E84393, #FFB800);
          box-shadow: 0 6px 24px rgba(232,67,147,0.35);
          transition: opacity 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(232,67,147,0.4);
        }
        .submit-btn:active:not(:disabled) { transform: scale(0.98); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .section-label {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #E84393;
          margin-bottom: 10px;
          display: block;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          background: linear-gradient(135deg, #fff5f9 0%, #fffdf0 50%, #f0fff4 100%);
        }
        .spin { display: inline-block; animation: spin 1s linear infinite; }
      `}</style>

      {/* ── FULL-SCREEN LOADING OVERLAY ── */}
      {loading && (
        <div className="loading-overlay">
          <span className="spin" style={{ fontSize: 52 }}>
            🎡
          </span>
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#aaa",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Saving your toy... 🧸
          </p>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-gray-100 rounded-3xl p-10">
        {/* ── HEADER ── */}
        <div className="mb-10 text-center">
          <div
            className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase shadow-sm mb-4"
            style={{ color: "#E84393" }}
          >
            <span>🎁</span> Admin Panel
          </div>
          <h1
            className="text-5xl font-black leading-tight"
            style={{ color: "#1a1a2e" }}
          >
            Add a New <span style={{ color: "#E84393" }}>Toy</span>{" "}
            <span style={{ color: "#FFB800" }}>🧸</span>
          </h1>
          <p className="text-sm font-semibold text-gray-400 mt-2">
            Fill in the details to add a product to your vault
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ── IMAGE UPLOAD ── */}
          <div className="field-card">
            <h3 className="section-label">Product Images</h3>
            <div
              className="upload-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-5xl mb-3">📸</div>
              <p className="text-sm font-bold text-gray-500">
                Click to upload images
              </p>
              <p className="text-xs text-gray-400 mt-1 font-semibold">
                PNG, JPG, WEBP — multiple allowed
              </p>
              <p className="text-xs text-pink-500 mt-1 font-black">
                * Images must be 600x600 pixels
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {previews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {previews.map((src, i) => (
                  <div key={i} className="preview-thumb">
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeImage(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── TITLE with duplicate check ── */}
          <div className="field-card">
            <h3 className="section-label">Product Title <span className="text-xl">*</span></h3>
            <div style={{ position: "relative" }}>
              <input
                className={`toy-input ${
                  titleError
                    ? "input-error"
                    : formData.title && !checkingTitle
                      ? "input-success"
                      : ""
                }`}
                required
                placeholder="e.g. Mega Blasters Action Set"
                value={formData.title}
                onChange={handleTitleChange}
                // leave room for the indicator on the right
                style={{ paddingRight: 40 }}
              />

              {/* Checking spinner */}
              {checkingTitle && (
                <span
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#aaa",
                    fontFamily: "'Nunito', sans-serif",
                    animation: "pulse 1s infinite",
                  }}
                >
                  checking…
                </span>
              )}

              {/* Green tick */}
              {!checkingTitle && formData.title && !titleError && (
                <span
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#22c55e",
                    fontSize: 16,
                    fontWeight: 900,
                  }}
                >
                  ✓
                </span>
              )}

              {/* Red cross */}
              {!checkingTitle && titleError && (
                <span
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#ef4444",
                    fontSize: 16,
                    fontWeight: 900,
                  }}
                >
                  ✕
                </span>
              )}
            </div>

            {/* Error message */}
            {titleError && (
              <p
                style={{
                  marginTop: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                <span>⚠️</span> {titleError}
              </p>
            )}
          </div>

          {/* ── CATEGORY + BRAND ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="field-card">
              <h3 className="section-label">Category <span className="text-xl">*</span></h3>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="toy-input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="field-card">
              <h3 className="section-label">Brand</h3>
              <input
                className="toy-input"
                placeholder="e.g. LEGO, Mattel"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
              />
            </div>
          </div>

          {/* ── STOCK + AGE + GENDER ── */}
          <div className="grid grid-cols-3 gap-4">
            <div className="field-card">
              <h3 className="section-label">Stock</h3>
              <input
                className="toy-input"
                type="number"
                min={0}
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
            </div>

            <div className="field-card">
              <h3 className="section-label">Age</h3>
              <input
                className="toy-input"
                placeholder="e.g. 3"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
              />
            </div>

            <div className="field-card">
              <h3 className="section-label">Gender</h3>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="toy-input"
              >
                <option>Unisex</option>
                <option>Boy</option>
                <option>Girl</option>
              </select>
            </div>
          </div>

          {/* ── PRICE ── */}
          <div className="field-card">
            <h3 className="section-label">
              Price (₹) <span className="text-xl">*</span>{" "}
            </h3>
            <input
              className="toy-input"
              type="number"
              min={0}
              required
              placeholder="e.g. 499"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>

          {/* ── DESCRIPTION ── */}
          <div className="field-card">
            <h3 className="section-label">Description</h3>
            <textarea
              rows={4}
              placeholder="What makes this toy special? Safety notes, materials, included pieces…"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="toy-input"
              style={{ resize: "none" }}
            />
          </div>

          {/* ── TAGS ── */}
          <div className="field-card">
            <h3 className="section-label">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTag(tag)}
                  className={`tag-pill ${formData.tags.includes(tag) ? "active" : ""}`}
                >
                  <span>{TAG_EMOJIS[tag]}</span>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* ── SUBMIT ── */}
          <button
            type="submit"
            disabled={loading || !!titleError || checkingTitle}
            className="submit-btn"
          >
            {loading ? "Saving… 🌀" : "Save Product 🚀"}
          </button>
        </form>

        <div className="h-10" />
      </div>
    </div>
  );
}
