import Link from "next/link";
import Image from "next/image";
import dbConnect from "@/backend/dbConfig/db";
import Toy from "@/backend/models/Toy";
import { getHomePageToys } from '@/backend/controller/toyController';
// async function getLatestProducts() {
//   await dbConnect();
//   return await Toy.find({}).sort({ createdAt: -1 }).lean();
// }

async function getLatestProducts() {
  return await getHomePageToys({ limit: 20 }); // latest 20, only needed fields
}

export default async function HomePage() {
  const { toys: products, totalItems } = await getLatestProducts();

  return (
    <div
      className="min-h-screen bg-gray-100"
      style={{
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        /* ── Wiggle animation for decorative icons ── */
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50%       { transform: rotate(5deg); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .wiggle { display: inline-block; animation: wiggle 2.4s ease-in-out infinite; }
        .float  { display: inline-block; animation: floatUp 3s ease-in-out infinite; }

        /* ── Header ── */
        .dash-header {
          background: #ffffff;
          border-bottom: 2.5px dashed #fce4f0;
          padding: 22px 32px 18px;
        }

        .dash-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fce4f0;
          color: #b5326e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          border-radius: 20px;
          padding: 4px 14px;
          margin-bottom: 10px;
        }
        .dash-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #E84393;
          animation: floatUp 1.8s ease-in-out infinite;
        }

        .dash-title {
          font-size: 32px;
          font-weight: 900;
          color: #1a0a14;
          line-height: 1.2;
          margin: 0 0 4px;
          letter-spacing: -0.5px;
        }
        .dash-title .pink { color: #E84393; }
        .dash-title .yellow { color: #FFB800; }

        .dash-sub {
          font-size: 12px;
          font-weight: 700;
          color: #c0a0b5;
          margin: 0;
        }

        /* ── Stat pills ── */
        .stats-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }
        .stat-pill {
          background: #fff;
          border: 1.5px solid #f5d0e6;
          border-radius: 18px;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(232,67,147,0.12);
        }
        .stat-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .stat-label {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #c0a0b5;
          margin-bottom: 2px;
        }
        .stat-val {
          font-size: 20px;
          font-weight: 900;
          color: #1a0a14;
          line-height: 1;
        }

        /* ── Add button ── */
        .add-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(130deg, #E84393, #FFB800);
          border: none;
          border-radius: 16px;
          padding: 12px 20px;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.3px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(232,67,147,0.3);
          transition: opacity 0.2s, transform 0.15s;
          text-decoration: none;
        }
        .add-btn:hover { opacity: 0.88; transform: translateY(-2px); }
        .add-btn:active { transform: scale(0.97); }

        /* ── Welcome banner ── */
        .welcome-banner {
          background: linear-gradient(130deg, #fce4f0 0%, #fffbe6 100%);
          border: 1.5px dashed #f5aed5;
          border-radius: 20px;
          padding: 16px 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          animation: fadeSlideIn 0.5s ease both;
        }
        .banner-icon {
          font-size: 36px;
          flex-shrink: 0;
        }
        .banner-title {
          font-size: 15px;
          font-weight: 900;
          color: #1a0a14;
          margin-bottom: 2px;
        }
        .banner-desc {
          font-size: 12px;
          font-weight: 700;
          color: #b5326e;
        }

        /* ── Section label ── */
        .section-label {
          font-size: 10px;
          font-weight: 800;
          color: #E84393;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }
        .section-label::after {
          content: '';
          flex: 1;
          height: 1.5px;
          background: repeating-linear-gradient(
            90deg,
            #fce4f0 0,
            #fce4f0 6px,
            transparent 6px,
            transparent 13px
          );
        }

        /* ── Product card ── */
        .toy-card {
          background: #ffffff;
          border-radius: 22px;
          border: 1.5px solid #fce4f0;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          animation: fadeSlideIn 0.5s ease both;
        }
        .toy-card:hover {
          transform: translateY(-8px) scale(1.025);
          box-shadow: 0 18px 44px rgba(232,67,147,0.15);
          border-color: #f5aed5;
        }
        .toy-card:hover .card-image-bg {
          background: linear-gradient(135deg, #fff0f9 0%, #fffbe0 100%);
        }

        .card-image-bg {
          background: linear-gradient(135deg, #fdf6ff 0%, #fffcee 100%);
          aspect-ratio: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }
        .card-fallback-icon {
          font-size: 56px;
          user-select: none;
        }

        .card-body { padding: 13px 15px 15px; }

        .card-category {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #E84393;
          margin-bottom: 4px;
        }

        .card-title-text {
          font-size: 13px;
          font-weight: 800;
          color: #1a0a14;
          line-height: 1.35;
          margin-bottom: 7px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-rating-text {
          font-size: 10px;
          font-weight: 700;
          color: #c0a0b5;
          margin-left: 3px;
        }

        .card-meta {
          font-size: 10px;
          font-weight: 700;
          color: #c0a0b5;
          margin-bottom: 12px;
        }

        .view-btn {
          width: 100%;
          background: linear-gradient(90deg, #E84393, #FFB800);
          border: none;
          border-radius: 30px;
          padding: 8px 0;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
        }

        /* ── New badge on first card ── */
        .new-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #E84393;
          color: #fff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 20px;
          z-index: 1;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        /* ── Empty state ── */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 0;
          text-align: center;
        }
        .empty-icon {
          font-size: 80px;
          margin-bottom: 20px;
          animation: floatUp 3s ease-in-out infinite;
        }
        .empty-title {
          font-size: 26px;
          font-weight: 900;
          color: #1a0a14;
          margin-bottom: 8px;
        }
        .empty-title .pink { color: #E84393; }
        .empty-sub {
          font-size: 13px;
          font-weight: 700;
          color: #c0a0b5;
          margin-bottom: 28px;
        }
        .empty-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #E84393, #FFB800);
          border: none;
          border-radius: 50px;
          padding: 14px 32px;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(232,67,147,0.35);
          text-decoration: none;
          transition: opacity 0.2s, transform 0.15s;
        }
        .empty-btn:hover { opacity: 0.88; transform: translateY(-2px); }

        @media (max-width: 640px) {
          .dash-header { padding: 18px 20px 14px; }
          .dash-title { font-size: 24px; }
          .db-body-pad { padding: 16px 20px 24px !important; }
          .products-grid { grid-template-columns: 1fr; }
        }

        @media (min-width: 641px) and (max-width: 900px) {
          .products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (min-width: 901px) and (max-width: 1180px) {
          .products-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="dash-header">
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {/* Left: Title block */}
          <div>
            <div className="dash-badge">
              <span className="dash-badge-dot" />
              Admin Dashboard
            </div>
            <h1 className="dash-title">
              Today&apos;s <span className="pink">popular</span>{" "}
              <span className="yellow">picks</span>{" "}
              <span className="wiggle">🎉</span>
            </h1>
            <p className="dash-sub">{totalItems} products in your vault</p>
          </div>

          {/* Right: Stats + CTA */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 12,
            }}
          >
            <div className="stats-row">
              <div className="stat-pill">
                <div className="stat-dot" style={{ background: "#E84393" }} />
                <div>
                  <div className="stat-label">Total</div>
                  <div className="stat-val">{totalItems}</div>
                </div>
              </div>
              <div className="stat-pill">
                <div className="stat-dot" style={{ background: "#FFB800" }} />
                <div>
                  <div className="stat-label">Last Added</div>
                  <div className="stat-val">
                    {products[0]
                      ? new Date(products[0].createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                          },
                        )
                      : "—"}
                  </div>
                </div>
              </div>
              <div className="stat-pill">
                <div className="stat-dot" style={{ background: "#22c55e" }} />
                <div>
                  <div className="stat-label">On Home page</div>
                  <div className="stat-val">{products.length}</div>
                </div>
              </div>
            </div>

            <Link href="/admin/home/addProduct" className="add-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 5v6M5 8h6"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
              Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div
        className="db-body-pad"
        style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 32px 40px" }}
      >
        {products.length > 0 ? (
          <>
            {/* Welcome banner */}
            {/* <div className="welcome-banner">
              <div className="banner-icon">
                <span className="float">🌟</span>
              </div>
              <div>
                <div className="banner-title">You&apos;re doing great!</div>
                <div className="banner-desc">
                  New products
                  live — keep building your amazing toy vault.
                </div>
              </div>
            </div> */}

            {/* Section label */}
            <div className="section-label">Latest products</div>

            {/* Grid */}
            <div className="products-grid">
              {products.map((product, index) => (
                <div
                  key={String(product._id)}
                  className="toy-card"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Image */}
                  <div className="card-image-bg">
                    {index === 0 && <span className="new-badge">New</span>}
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-contain p-4"
                      />
                    ) : (
                      <div className="card-fallback-icon">🧸</div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="card-body">
                    {/* <div className="card-category">
                      {product.category || "Toy"}
                    </div> */}
                    <div className="card-title-text">{product.title}</div>
                    <div className="card-meta">
                      {product.brand ? `${product.brand} · ` : "Self · "}{product.age}
                    </div>

                    <div
                      style={{
                        fontWeight: 900,
                        color: "#E84393",
                        fontSize: 14,
                        marginBottom: 8,
                      }}
                    >
                      ₹{product.price ?? "—"}
                    </div>

                    <Link href={`/admin/home/products/${product._id}`}>
                      <button className="view-btn">View Details →</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="empty-state">
            <div className="empty-icon">🧸</div>
            <h2 className="empty-title">
              Your vault is <span className="pink">empty!</span>
            </h2>
            <p className="empty-sub">Ready to add your very first toy?</p>
            <Link href="/admin/home/addProduct" className="empty-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3v10M3 8h10"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
              Add First Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
