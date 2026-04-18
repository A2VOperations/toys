export default function Loading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{
        background:
          "linear-gradient(135deg, #fff5f9 0%, #fffdf0 50%, #f0fff4 100%)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
      `}</style>

      {/* Spinner */}
      <div className="text-5xl animate-spin">🎡</div>

      {/* Text */}
      <p className="text-sm font-bold text-gray-400">
        Loading...
      </p>
    </div>
  );
}