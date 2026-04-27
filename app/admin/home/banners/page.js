"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const getNow = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().slice(0, 16);
};

export default function BannerManager() {
  const [formData, setFormData] = useState({
    start: "",
    end: "",
    files: [],
    timing: 5000,
  });
  const [previews, setPreviews] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
  const [conflict, setConflict] = useState(null);

  const startRef = useRef(null);
  const endRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3500);
  };

  const checkConflict = (start, end) => {
    if (!start || !end) {
      setConflict(null);
      return;
    }
    const s = new Date(start),
      e = new Date(end);
    const found = scheduled.find((b) => {
      if (editingId && b._id === editingId) return false;
      const bs = new Date(b.startDate),
        be = new Date(b.endDate);
      return s < be && e > bs;
    });
    setConflict(found || null);
  };

  const fetchBanners = useCallback(async () => {
    try {
      setFetching(true);
      const res = await fetch("/api/banners");
      const data = await res.json();
      setScheduled(data);
    } catch (err) {
      console.error("Failed to fetch banners", err);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData({ ...formData, files: selectedFiles });
    const localPreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file),
    );
    setPreviews(localPreviews);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.start || !formData.end) {
      showToast("Please provide start/end dates.", "error");
      return;
    }

    if (!editingId && formData.files.length === 0) {
      showToast("Please select at least one image.", "error");
      return;
    }

    if (conflict) {
      showToast("Please resolve the overlapping slot first.", "warning");
      return;
    }

    setLoading(true);
    try {
      let base64Images = [];
      if (
        formData.files &&
        formData.files.length > 0 &&
        formData.files[0] instanceof File
      ) {
        base64Images = await Promise.all(
          formData.files.map((file) => convertToBase64(file)),
        );
      }

      const payload = {
        startDate: formData.start,
        endDate: formData.end,
        timing: Number(formData.timing),
      };

      if (base64Images.length > 0) {
        payload.images = base64Images;
      }

      let res;
      if (editingId) {
        res = await fetch("/api/banners", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, id: editingId }),
        });
      } else {
        res = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (res.ok) {
        showToast(
          editingId
            ? "Banner updated successfully!"
            : "Banner scheduled successfully!",
          "success",
        );
        setFormData({ start: "", end: "", files: [], timing: 5000 });
        setPreviews([]);
        setEditingId(null);
        setConflict(null);
        fetchBanners();
      } else {
        showToast(
          data.message || data.error || "Something went wrong",
          "error",
        );
      }
    } catch (err) {
      showToast("Action failed. Check console.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setEditingId(banner._id);

    const toLocalDatetimeInput = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const offset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - offset);
      return localDate.toISOString().slice(0, 16);
    };

    const start = toLocalDatetimeInput(banner.startDate);
    const end = toLocalDatetimeInput(banner.endDate);

    setFormData({
      start,
      end,
      files: [],
      timing: Number(banner.timing) || 5000,
    });
    setPreviews(banner.images || banner.urls || []);
    setConflict(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`/api/banners?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Banner deleted", "success");
        fetchBanners();
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <>
      {/* Nunito font — matches all other admin pages */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
      `}</style>

      {/* TOAST */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-semibold transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : toast.type === "error"
                ? "bg-red-50 border border-red-200 text-red-800"
                : "bg-yellow-50 border border-yellow-200 text-yellow-800"
          }`}
        >
          {toast.type === "success" && (
            <svg
              className="w-4 h-4 text-green-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {toast.type === "error" && (
            <svg
              className="w-4 h-4 text-red-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          {toast.type === "warning" && (
            <svg
              className="w-4 h-4 text-yellow-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <div
              className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase shadow-sm mb-3"
              style={{ color: "#E84393" }}
            >
              <span>🏪</span> My Banner
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Banner <span className="text-[#E84393]">Scheduler</span>
            </h1>
            <p className="text-gray-500 font-medium">
              Schedule and automate platform hero content.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* FORM SECTION */}
            <div className="lg:col-span-4 order-1">
              <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 lg:sticky lg:top-8"
              >
                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#E84393] rounded-full inline-block"></span>
                  {editingId ? "Edit Banner" : "Create Schedule"}
                </h2>

                <div className="space-y-5">
                  {/* START DATE */}
                  <div className="group">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">
                      Start Date & Time
                    </label>
                    <div className="relative mt-1">
                      <input
                        ref={startRef}
                        type="datetime-local"
                        min={getNow()}
                        onClick={() => startRef.current.showPicker()}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 font-medium p-3 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all cursor-pointer"
                        onChange={(e) => {
                          setFormData({ ...formData, start: e.target.value });
                          checkConflict(e.target.value, formData.end);
                        }}
                        value={formData.start}
                      />
                    </div>
                  </div>

                  {/* END DATE */}
                  <div className="group">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">
                      End Date & Time
                    </label>
                    <div className="relative mt-1">
                      <input
                        ref={endRef}
                        type="datetime-local"
                        min={formData.start || getNow()}
                        onClick={() => endRef.current.showPicker()}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 font-medium p-3 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all cursor-pointer"
                        onChange={(e) => {
                          setFormData({ ...formData, end: e.target.value });
                          checkConflict(formData.start, e.target.value);
                        }}
                        value={formData.end}
                      />
                    </div>
                  </div>

                  {/* CONFLICT WARNING */}
                  {conflict && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800">
                      <p className="font-bold flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                          />
                        </svg>
                        Overlaps an existing banner
                      </p>
                      <p className="mt-1 text-yellow-700">
                        {new Date(conflict.startDate).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" },
                        )}{" "}
                        &rarr;{" "}
                        {new Date(conflict.endDate).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" },
                        )}
                        {" · "}
                        {new Date(conflict.startDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" – "}
                        {new Date(conflict.endDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}

                  {/* TIMING */}
                  <div className="group">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">
                      Auto-play Timing (ms)
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="number"
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 font-medium p-3 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all"
                        placeholder="e.g. 5000"
                        onChange={(e) =>
                          setFormData({ ...formData, timing: e.target.value })
                        }
                        value={formData.timing}
                      />
                    </div>
                  </div>

                  {/* FILE UPLOAD */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">
                      Banner Assets{" "}
                      {editingId && (
                        <span className="normal-case text-gray-400 font-normal">
                          (leave empty to keep existing)
                        </span>
                      )}
                    </label>
                    <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-pink-300 transition-colors bg-gray-50/50">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#E84393] file:text-white hover:file:bg-[#d63384] cursor-pointer"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  {/* Previews */}
                  {previews.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {previews.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          className="h-14 w-14 rounded-xl object-cover border-2 border-white shadow-sm"
                          alt="Preview"
                        />
                      ))}
                    </div>
                  )}

                  <button
                    disabled={loading || !!conflict}
                    className="w-full bg-[#E84393] text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-100 hover:bg-[#d63384] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:bg-gray-300 disabled:shadow-none disabled:translate-y-0"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </span>
                    ) : conflict ? (
                      "Resolve conflict to continue"
                    ) : editingId ? (
                      "Update Banner"
                    ) : (
                      "Schedule Banner"
                    )}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFormData({
                          start: "",
                          end: "",
                          files: [],
                          timing: 5000,
                        });
                        setPreviews([]);
                        setConflict(null);
                      }}
                      className="w-full mt-2 text-gray-500 font-bold py-2 hover:text-gray-700 transition-colors"
                    >
                      Cancel Editing
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* LIST SECTION */}
            <div className="lg:col-span-8 order-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Planned Slots
                </h2>
                <button
                  onClick={fetchBanners}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  title="Refresh List"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>

              {fetching ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-28 bg-white/50 animate-pulse rounded-2xl border border-gray-200"
                    />
                  ))}
                </div>
              ) : scheduled.length === 0 ? (
                <div className="bg-white p-16 rounded-3xl border border-dashed border-gray-300 text-center">
                  <p className="text-gray-400 font-medium italic">
                    No banners on the horizon.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scheduled.map((b) => {
                    const now = new Date();
                    const isLive =
                      new Date(b.startDate) <= now &&
                      new Date(b.endDate) >= now;
                    return (
                      <div
                        key={b._id}
                        className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm hover:shadow-md transition-shadow gap-4"
                      >
                        <div className="flex items-center gap-5">
                          <div className="flex -space-x-5 flex-shrink-0">
                            {(b.images || b.urls || [])
                              ?.slice(0, 3)
                              .map((url, idx) => (
                                <img
                                  key={idx}
                                  src={url}
                                  className="h-16 w-16 rounded-2xl object-cover border-4 border-white shadow-md"
                                />
                              ))}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-x-2">
                              <span className="font-black text-gray-800 text-lg">
                                {new Date(b.startDate).toLocaleDateString(
                                  undefined,
                                  { month: "short", day: "numeric" },
                                )}
                              </span>
                              <span className="text-gray-300 font-bold">
                                &rarr;
                              </span>
                              <span className="font-black text-gray-800 text-lg">
                                {new Date(b.endDate).toLocaleDateString(
                                  undefined,
                                  { month: "short", day: "numeric" },
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                {new Date(b.startDate).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span className="text-gray-300 text-xs">to</span>
                              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                {new Date(b.endDate).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                          <span
                            className={`inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tighter ${
                              isLive
                                ? "bg-green-100 text-green-700 animate-pulse"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {isLive ? (
                              <>
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Live Now
                              </>
                            ) : (
                              "Scheduled"
                            )}
                          </span>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(b)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(b._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
