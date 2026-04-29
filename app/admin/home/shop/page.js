"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ROWS_OPTIONS = [10, 20, 50];

export default function MyShopPage() {
  const router = useRouter();
  const [toys, setToys] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    async function fetchToys() {
      setLoading(true);
      try {
        const res = await fetch("/api/toys?limit=1000");
        const data = await res.json();
        setToys(data.toys || []);
      } catch (err) {
        console.error("Failed to fetch toys:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchToys();
  }, []);

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/toys/${id}`, { method: "DELETE" });
      if (res.ok) {
        setToys((prev) => prev.filter((t) => t._id !== id));
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  /* ── helper: get categories array from either old or new schema ── */
  function getCategories(toy) {
    if (Array.isArray(toy.category) && toy.category.length > 0) return toy.category;
    return [];
  }

  const filtered = useMemo(() => {
    return toys.filter((t) => {
      const cats = getCategories(t).join(" ");
      return [t.title, cats, t.brand, t.gender, t.age]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [toys, search]);

  useEffect(() => { setCurrentPage(1); }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginated = filtered.slice(startIdx, endIdx);

  function getPageNumbers() {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, "…", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "…", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages);
    }
    return pages;
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-200" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        .shop-table { width: 100%; border-collapse: separate; border-spacing: 0; }
        .shop-table thead tr th {
          background: #1a1a2e; color: white; font-size: 10px; font-weight: 800;
          letter-spacing: 0.18em; text-transform: uppercase;
          padding: 14px 16px; text-align: left;
        }
        .shop-table thead tr th:first-child { border-radius: 14px 0 0 0; }
        .shop-table thead tr th:last-child  { border-radius: 0 14px 0 0; }
        .shop-table tbody tr { background: white; transition: background 0.15s; }
        .shop-table tbody tr:hover { background: #fff5fb; }
        .shop-table tbody tr td {
          padding: 13px 16px; font-size: 13px; font-weight: 600;
          color: #1a1a2e; border-bottom: 1px solid #f3f3f3; vertical-align: middle;
        }
        .shop-table tbody tr:last-child td:first-child { border-radius: 0 0 0 14px; }
        .shop-table tbody tr:last-child td:last-child  { border-radius: 0 0 14px 0; }
        .shop-table tbody tr:last-child td { border-bottom: none; }

        .badge { display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: 10px; font-weight: 800; letter-spacing: 0.04em; white-space: nowrap; }
        .badge-pink   { background: #fff0f7; color: #E84393; }
        .badge-purple { background: #f3e8ff; color: #7c3aed; }
        .badge-yellow { background: #fffbe0; color: #b07d00; }
        .badge-green  { background: #f0fff4; color: #16a34a; }
        .badge-gray   { background: #f5f5f5; color: #888; }

        .btn-edit {
          padding: 6px 14px; border-radius: 99px; font-size: 11px; font-weight: 800;
          background: linear-gradient(135deg, #E84393, #FFB800); color: white;
          border: none; cursor: pointer; transition: opacity 0.15s, transform 0.15s;
          text-decoration: none; display: inline-block;
        }
        .btn-edit:hover { opacity: 0.85; transform: translateY(-1px); }

        .btn-delete {
          padding: 6px 14px; border-radius: 99px; font-size: 11px; font-weight: 800;
          background: white; color: #E84393; border: 2px solid #fbb6d4;
          cursor: pointer; transition: all 0.15s;
        }
        .btn-delete:hover { background: #fff0f7; transform: translateY(-1px); }
        .btn-delete:disabled { opacity: 0.4; cursor: not-allowed; }

        .search-input {
          width: 100%; padding: 12px 18px 12px 44px; border-radius: 99px;
          border: 2px solid #f0f0f0; background: white;
          font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 600;
          color: #1a1a2e; outline: none; box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input:focus { border-color: #E84393; box-shadow: 0 4px 20px rgba(232,67,147,0.12); }
        .search-input::placeholder { color: #ccc; font-weight: 600; }

        .pagination-bar {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px; margin-top: 16px;
          padding: 12px 18px; background: white;
          border-radius: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        .pagination-info { font-size: 12px; font-weight: 700; color: #888; }
        .page-btn {
          min-width: 32px; height: 32px; padding: 0 10px;
          border-radius: 99px; border: 2px solid #f0f0f0;
          background: white; color: #1a1a2e;
          font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 800;
          cursor: pointer; transition: all 0.15s;
        }
        .page-btn:hover:not(:disabled) { border-color: #E84393; color: #E84393; }
        .page-btn.active { background: linear-gradient(135deg, #E84393, #FFB800); border-color: transparent; color: white; }
        .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .page-ellipsis { font-size: 13px; font-weight: 800; color: #ccc; padding: 0 4px; }
        .rows-select {
          font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 700;
          padding: 5px 10px; border-radius: 99px; border: 2px solid #f0f0f0;
          background: white; color: #1a1a2e; cursor: pointer; outline: none;
        }
        .rows-select:focus { border-color: #E84393; }

        .confirm-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.35);
          backdrop-filter: blur(4px); display: flex; align-items: center;
          justify-content: center; z-index: 999;
        }
        .confirm-box {
          background: white; border-radius: 24px; padding: 36px 32px;
          max-width: 360px; width: 90%; text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }

        /* category overflow: show 2, rest collapsed */
        .cat-list { display: flex; flex-wrap: wrap; gap: 4px; max-width: 180px; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase shadow-sm mb-3" style={{ color: "#E84393" }}>
              <span>🏪</span> My Shop
            </div>
            <h1 className="text-4xl font-black" style={{ color: "#1a1a2e" }}>
              Product <span style={{ color: "#E84393" }}>Inventory</span> <span style={{ color: "#FFB800" }}>📦</span>
            </h1>
            <p className="text-sm font-semibold text-gray-400 mt-1">{toys.length} products total</p>
          </div>
          <Link href="/admin/home/addProduct">
            <button className="px-6 py-3 rounded-full text-white font-black text-sm tracking-wide shadow-lg hover:opacity-90 transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #E84393, #FFB800)", boxShadow: "0 6px 24px rgba(232,67,147,0.3)" }}>
              + Add Product
            </button>
          </Link>
        </div>

        {/* SEARCH */}
        <div className="relative mb-6 max-w-md">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input className="search-input" placeholder="Search by name, category, brand…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="text-5xl animate-spin">🎡</div>
            <p className="text-sm font-bold text-gray-400">Loading your products…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-black" style={{ color: "#1a1a2e" }}>{search ? "No results found" : "Your shop is empty"}</h2>
            <p className="text-sm text-gray-400 font-semibold mt-1">{search ? `No products match "${search}"` : "Start by adding your first product"}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl shadow-md">
              <table className="shop-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Categories</th>
                    <th>Brand</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Tags</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((toy, idx) => {
                    const cats = getCategories(toy);
                    return (
                      <tr key={toy._id}>
                        <td className="text-gray-400 text-xs font-bold">{startIdx + idx + 1}</td>

                        <td>
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-pink-50 flex items-center justify-center">
                            {toy.images?.[0] ? (
                              <img src={toy.images[0]} alt={toy.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl">🧸</span>
                            )}
                          </div>
                        </td>

                        <td><span className="font-bold text-[#1a1a2e]">{toy.title}</span></td>

                        {/* ── multi-category cell ── */}
                        <td>
                          <div className="cat-list">
                            {cats.length > 0 ? (
                              cats.map((cat, i) => (
                                <span key={i} className="badge badge-purple">{cat}</span>
                              ))
                            ) : (
                              <span className="text-gray-300 text-xs font-bold">—</span>
                            )}
                          </div>
                        </td>

                        <td className="text-gray-500">{toy.brand || "—"}</td>
                        <td className="text-gray-500">{toy.age || "—"}</td>

                        <td>
                          <span className={`badge ${toy.gender === "Boy" ? "badge-yellow" : toy.gender === "Girl" ? "badge-pink" : "badge-gray"}`}>
                            {toy.gender}
                          </span>
                        </td>

                        <td>
                          <span className={`badge ${toy.stock > 0 ? "badge-green" : "badge-gray"}`}>
                            {toy.stock > 0 ? `${toy.stock} in stock` : "Out of stock"}
                          </span>
                        </td>

                        <td>
                          <span className="badge badge-green">Rs.{toy.price ?? "—"}</span>
                        </td>

                        <td>
                          <div className="flex flex-wrap gap-1">
                            {toy.tags?.length > 0 ? (
                              toy.tags.map((tag) => (
                                <span key={tag} className="badge badge-yellow">{tag}</span>
                              ))
                            ) : (
                              <span className="text-gray-300 text-xs font-bold">—</span>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/home/products/${toy._id}`} className="btn-edit">Edit</Link>
                            <button className="btn-delete" disabled={deletingId === toy._id} onClick={() => setConfirmId(toy._id)}>
                              {deletingId === toy._id ? "…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="pagination-bar">
              <span className="pagination-info">
                Showing {startIdx + 1}–{Math.min(endIdx, filtered.length)} of {filtered.length} products
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <button className="page-btn" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}>← Prev</button>
                {getPageNumbers().map((page, i) =>
                  page === "…" ? (
                    <span key={`e-${i}`} className="page-ellipsis">…</span>
                  ) : (
                    <button key={page} className={`page-btn ${currentPage === page ? "active" : ""}`} onClick={() => setCurrentPage(page)}>{page}</button>
                  )
                )}
                <button className="page-btn" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}>Next →</button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#888" }}>Rows per page:</span>
                <select className="rows-select" value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                  {ROWS_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      {/* DELETE CONFIRM */}
      {confirmId && (
        <div className="confirm-overlay" onClick={() => setConfirmId(null)}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-xl font-black mb-2" style={{ color: "#1a1a2e" }}>Delete this product?</h3>
            <p className="text-sm text-gray-400 font-semibold mb-6">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmId(null)} className="px-6 py-2.5 rounded-full border-2 border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">Cancel</button>
              <button onClick={() => handleDelete(confirmId)} disabled={deletingId === confirmId}
                className="px-6 py-2.5 rounded-full text-white text-sm font-black transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #E84393, #ff6b6b)" }}>
                {deletingId === confirmId ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}