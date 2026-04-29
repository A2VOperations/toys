"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PRODUCT_CATEGORIES } from "@/constants/productCategories";

const CATEGORIES = PRODUCT_CATEGORIES;

const CATEGORY_EMOJIS = {
  "Outdoor & Sports":                    "⚽",
  "Battery Operated Toys":               "🔋",
  "Return Gifts Ideas":                  "🎁",
  "School Essentials":                   "🎒",
  "Stationary (Return Gifts + Regular)": "✏️",
  "Non Battery Toys":                    "🧸",
  "Soft and Plush Toys":                 "🐻",
  "Puzzles and Brain Teasers":           "🧩",
  "Learning and Education Toys":         "📚",
};

const TAGS = [
  "Bestseller", "New Arrivals", "Sale", "Limited Edition",
  "Award Winning", "Eco Friendly", "Battery Operated", "Non Battery Operated",
];

const TAG_EMOJIS = {
  "Bestseller": "🏆", "New Arrivals": "✨", "Sale": "🔥",
  "Limited Edition": "💎", "Award Winning": "🥇", "Eco Friendly": "🌿",
  "Battery Operated": "🔋", "Non Battery Operated": "🚫🔋",
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
    title:       "",
    category:    [],   // ← same as tags, [String]
    brand:       "",
    stock:       3,
    description: "",
    gender:      "Unisex",
    age:         "",
    tags:        [],
    price:       0,
  });

  const handleCategory = (cat) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter((c) => c !== cat)
        : [...prev.category, cat],
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const validFiles = [];
    for (const file of files) {
      const isValid = await new Promise((resolve) => {
        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          if (img.width !== 600 || img.height !== 600) {
            alert(`Image "${file.name}" is ${img.width}x${img.height}px.\nImages must be exactly 600x600 pixels!`);
            resolve(false);
          } else resolve(true);
        };
        img.onerror = () => { URL.revokeObjectURL(objectUrl); alert(`Failed to load "${file.name}".`); resolve(false); };
        img.src = objectUrl;
      });
      if (isValid) validFiles.push(file);
    }
    if (!validFiles.length) { e.target.value = ""; return; }
    Promise.all(validFiles.map((file) => new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    }))).then((results) => {
      setPreviews((p) => [...p, ...results]);
      setImageBase64s((p) => [...p, ...results]);
      e.target.value = "";
    });
  };

  const removeImage = (idx) => {
    setPreviews((p) => p.filter((_, i) => i !== idx));
    setImageBase64s((p) => p.filter((_, i) => i !== idx));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, title: value }));
    setTitleError("");
    clearTimeout(titleCheckTimeout.current);
    if (!value.trim()) { setCheckingTitle(false); return; }
    setCheckingTitle(true);
    titleCheckTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/toys?title=${encodeURIComponent(value.trim())}&limit=100`);
        const data = await res.json();
        const toys = Array.isArray(data?.toys) ? data.toys : [];
        if (toys.some((t) => t.title.toLowerCase() === value.trim().toLowerCase())) {
          setTitleError("A toy with this name already exists.");
        }
      } catch (err) { console.error("Title check failed:", err); }
      finally { setCheckingTitle(false); }
    }, 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (titleError)                    { alert("Please fix the errors before submitting."); return; }
    if (checkingTitle)                 { alert("Please wait while we validate the title."); return; }
    if (formData.category.length === 0){ alert("Please select at least one category."); return; }
    if (imageBase64s.length === 0)     { alert("Please select at least one image."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/toys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          stock:  Number(formData.stock),
          price:  Number(formData.price),
          images: imageBase64s,
          // category is already the array — no extra field needed
        }),
      });
      const data = await res.json();
      if (res.ok) { router.push("/admin/home"); }
      else { setLoading(false); alert("Error: " + (data.message || "Something went wrong")); }
    } catch (err) { console.error("Submit failed:", err); setLoading(false); alert("Submit failed: " + err.message); }
  };

  return (
    <div className="min-h-screen py-12 px-4 relative bg-gray-200" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .field-card { background:#fff; border-radius:20px; box-shadow:0 2px 12px rgba(0,0,0,0.05); padding:20px 24px; transition:box-shadow 0.2s; }
        .field-card:focus-within { box-shadow:0 4px 24px rgba(232,67,147,0.12); }
        .toy-input { width:100%; padding:10px 14px; border-radius:12px; border:2px solid #f0f0f0; background:#fafafa; font-family:'Nunito',sans-serif; font-size:14px; font-weight:600; color:#1a1a2e; outline:none; transition:border-color 0.2s,background 0.2s; }
        .toy-input::placeholder { color:#ccc; font-weight:500; }
        .toy-input:focus { border-color:#E84393; background:#fff; }
        .toy-input.input-error { border-color:#ef4444!important; background:#fff5f5; }
        .toy-input.input-success { border-color:#22c55e!important; background:#f0fdf4; }
        .upload-zone { border:2.5px dashed #fbb6d4; border-radius:20px; background:#fff9fc; padding:40px; text-align:center; cursor:pointer; transition:all 0.2s; }
        .upload-zone:hover { border-color:#E84393; background:#fff0f7; transform:scale(1.01); }
        .preview-thumb { position:relative; width:88px; height:88px; border-radius:14px; overflow:hidden; border:2.5px solid #f0f0f0; transition:transform 0.2s,border-color 0.2s; }
        .preview-thumb:hover { transform:scale(1.05); border-color:#E84393; }
        .preview-thumb:hover .remove-btn { opacity:1; }
        .remove-btn { position:absolute; top:4px; right:4px; width:20px; height:20px; background:#E84393; color:white; border-radius:50%; font-size:12px; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.15s; cursor:pointer; border:none; }
        .tag-pill { padding:8px 16px; border-radius:99px; font-size:12px; font-weight:800; border:2px solid #f0f0f0; background:white; color:#aaa; cursor:pointer; transition:all 0.18s; display:flex; align-items:center; gap:5px; }
        .tag-pill:hover { border-color:#E84393; color:#E84393; transform:translateY(-2px); }
        .tag-pill.active { background:linear-gradient(135deg,#E84393,#FFB800); border-color:transparent; color:white; box-shadow:0 4px 12px rgba(232,67,147,0.25); transform:translateY(-2px); }
        .cat-pill { padding:8px 16px; border-radius:99px; font-size:12px; font-weight:800; border:2px solid #f0f0f0; background:white; color:#aaa; cursor:pointer; transition:all 0.18s; display:flex; align-items:center; gap:5px; }
        .cat-pill:hover { border-color:#7c3aed; color:#7c3aed; transform:translateY(-2px); }
        .cat-pill.active { background:linear-gradient(135deg,#7c3aed,#e84393); border-color:transparent; color:white; box-shadow:0 4px 12px rgba(124,58,237,0.25); transform:translateY(-2px); }
        .submit-btn { width:100%; padding:16px; border-radius:99px; font-family:'Nunito',sans-serif; font-size:15px; font-weight:900; letter-spacing:0.08em; text-transform:uppercase; color:white; border:none; cursor:pointer; background:linear-gradient(135deg,#E84393,#FFB800); box-shadow:0 6px 24px rgba(232,67,147,0.35); transition:opacity 0.2s,transform 0.15s; }
        .submit-btn:hover:not(:disabled) { opacity:0.92; transform:translateY(-2px); }
        .submit-btn:active:not(:disabled) { transform:scale(0.98); }
        .submit-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .section-label { font-size:14px; font-weight:800; letter-spacing:0.18em; text-transform:uppercase; color:#E84393; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .loading-overlay { position:fixed; inset:0; z-index:50; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; background:linear-gradient(135deg,#fff5f9 0%,#fffdf0 50%,#f0fff4 100%); }
        .spin { display:inline-block; animation:spin 1s linear infinite; }
      `}</style>

      {loading && (
        <div className="loading-overlay">
          <span className="spin" style={{ fontSize: 52 }}>🎡</span>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#aaa", fontFamily: "'Nunito', sans-serif" }}>Saving your toy... 🧸</p>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-gray-100 rounded-3xl p-10">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase shadow-sm mb-4" style={{ color: "#E84393" }}>
            <span>🎁</span> Admin Panel
          </div>
          <h1 className="text-5xl font-black leading-tight" style={{ color: "#1a1a2e" }}>
            Add a New <span style={{ color: "#E84393" }}>Toy</span> <span style={{ color: "#FFB800" }}>🧸</span>
          </h1>
          <p className="text-sm font-semibold text-gray-400 mt-2">Fill in the details to add a product to your vault</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* IMAGE UPLOAD */}
          <div className="field-card">
            <span className="section-label">Product Images</span>
            <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
              <div className="text-5xl mb-3">📸</div>
              <p className="text-sm font-bold text-gray-500">Click to upload images</p>
              <p className="text-xs text-gray-400 mt-1 font-semibold">PNG, JPG, WEBP — multiple allowed</p>
              <p className="text-xs text-pink-500 mt-1 font-black">* Images must be 600x600 pixels</p>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
            </div>
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {previews.map((src, i) => (
                  <div key={i} className="preview-thumb">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" className="remove-btn" onClick={() => removeImage(i)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TITLE */}
          <div className="field-card">
            <span className="section-label">Product Title *</span>
            <div style={{ position: "relative" }}>
              <input
                className={`toy-input ${titleError ? "input-error" : formData.title && !checkingTitle && !titleError ? "input-success" : ""}`}
                required placeholder="e.g. Mega Blasters Action Set"
                value={formData.title} onChange={handleTitleChange} style={{ paddingRight: 40 }}
              />
              {checkingTitle && <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:11, fontWeight:700, color:"#aaa" }}>checking…</span>}
              {!checkingTitle && formData.title && !titleError && <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"#22c55e", fontSize:16, fontWeight:900 }}>✓</span>}
              {!checkingTitle && titleError && <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"#ef4444", fontSize:16, fontWeight:900 }}>✕</span>}
            </div>
            {titleError && <p style={{ marginTop:8, fontSize:11, fontWeight:700, color:"#ef4444", display:"flex", alignItems:"center", gap:4 }}><span>⚠️</span> {titleError}</p>}
          </div>

          {/* CATEGORY */}
          <div className="field-card">
            <span className="section-label">
              Categories *
              {formData.category.length > 0 && (
                <span className="normal-case text-[11px] font-bold tracking-normal px-2 py-0.5 rounded-full"
                  style={{ background: "#f3e8ff", color: "#7c3aed", letterSpacing: "normal" }}>
                  {formData.category.length} selected
                </span>
              )}
            </span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat} type="button" onClick={() => handleCategory(cat)}
                  className={`cat-pill ${formData.category.includes(cat) ? "active" : ""}`}>
                  <span>{CATEGORY_EMOJIS[cat] || "🧸"}</span>
                  {cat}
                </button>
              ))}
            </div>
            {formData.category.length === 0 && (
              <p style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: "#aaa" }}>Select at least one category</p>
            )}
          </div>

          {/* BRAND */}
          <div className="field-card">
            <span className="section-label">Brand</span>
            <input className="toy-input" placeholder="e.g. LEGO, Mattel" value={formData.brand}
              onChange={(e) => setFormData((p) => ({ ...p, brand: e.target.value }))} />
          </div>

          {/* STOCK + AGE + GENDER */}
          <div className="grid grid-cols-3 gap-4">
            <div className="field-card">
              <span className="section-label">Stock</span>
              <input className="toy-input" type="number" min={0} value={formData.stock}
                onChange={(e) => setFormData((p) => ({ ...p, stock: e.target.value }))} />
            </div>
            <div className="field-card">
              <span className="section-label">Age</span>
              <input className="toy-input" placeholder="e.g. 3–5 yrs" value={formData.age}
                onChange={(e) => setFormData((p) => ({ ...p, age: e.target.value }))} />
            </div>
            <div className="field-card">
              <span className="section-label">Gender</span>
              <select className="toy-input" value={formData.gender}
                onChange={(e) => setFormData((p) => ({ ...p, gender: e.target.value }))}>
                <option>Unisex</option><option>Boy</option><option>Girl</option>
              </select>
            </div>
          </div>

          {/* PRICE */}
          <div className="field-card">
            <span className="section-label">Price (Rs.) *</span>
            <input className="toy-input" type="number" min={0} required placeholder="e.g. 499"
              value={formData.price} onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))} />
          </div>

          {/* DESCRIPTION */}
          <div className="field-card">
            <span className="section-label">Description</span>
            <textarea rows={4} placeholder="What makes this toy special? Safety notes, materials, included pieces…"
              value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              className="toy-input" style={{ resize: "none" }} />
          </div>

          {/* TAGS */}
          <div className="field-card">
            <span className="section-label">Tags</span>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button key={tag} type="button" onClick={() => handleTag(tag)}
                  className={`tag-pill ${formData.tags.includes(tag) ? "active" : ""}`}>
                  <span>{TAG_EMOJIS[tag]}</span>{tag}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading || !!titleError || checkingTitle} className="submit-btn">
            {loading ? "Saving… 🌀" : "Save Product 🚀"}
          </button>
        </form>
        <div className="h-10" />
      </div>
    </div>
  );
}