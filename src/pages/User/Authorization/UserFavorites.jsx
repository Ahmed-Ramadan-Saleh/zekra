import React, { useEffect, useState } from "react";

/* ============================================================
   UserFavorites.jsx — المفضلة
   القوالب المحفوظة لشرائها لاحقاً: شبكة كروت + إزالة فورية
   + إفراغ الكل بتأكيد + إشعار Toast + حالة فراغ
   ملاحظات:
   - تعمل بدون Header/Footer (مكونان مستقلان لديك مسبقاً)
   - البيانات Mock تُستبدل بنداءات API لاحقاً
   ============================================================ */

const FAVORITES = [
  { id: 1, title: "قالب زفاف — روز جولد", emoji: "💍", category: "زواج", price: 350, rating: 4.9, ratings: 212, addedAt: "2 نوفمبر 2026", grad: "from-rose-400 to-pink-600" },
  { id: 2, title: "قالب تخرج — قبعة وفش", emoji: "🎓", category: "تخرج", price: 200, rating: 4.8, ratings: 156, addedAt: "28 أكتوبر 2026", grad: "from-sky-400 to-blue-600" },
  { id: 3, title: "دعوة حفل خطوبة — لمعة ذهبية", emoji: "✨", category: "دعوات", price: 150, rating: 4.7, ratings: 98, addedAt: "20 أكتوبر 2026", grad: "from-amber-400 to-yellow-500" },
  { id: 4, title: "قالب عيد ميلاد — ديناصور", emoji: "🦖", category: "أعياد ميلاد", price: 250, rating: 4.9, ratings: 187, addedAt: "12 أكتوبر 2026", grad: "from-emerald-400 to-teal-600" },
];

const USER = { initials: "أم", email: "ahmed.mahmoud@gmail.com" };

const NAV = [
  { key: "home", label: "الرئيسية", emoji: "🏠", href: "/dashboard" },
  { key: "orders", label: "طلباتي", emoji: "📦", href: "/dashboard/orders" },
  { key: "favorites", label: "المفضلة", emoji: "❤️", href: "/dashboard/favorites" },
  { key: "profile", label: "بيانات الحساب", emoji: "⚙️", href: "/dashboard/profile" },
];

const fmt = (n) => `${Number(n).toLocaleString("en-US")} ج.م`;

const KEYFRAMES = `
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes floatY { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes pop { 0% { transform: scale(.85); opacity: 0; } 70% { transform: scale(1.04); } 100% { transform: scale(1); opacity: 1; } }
`;

/* ===== أيقونات SVG مدمجة ===== */
const BellIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const HeartIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

/* ===== القشرة الموحدة للوحة ===== */
function DashTopbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white font-extrabold flex items-center justify-center shrink-0">{USER.initials}</div>
          <div className="min-w-0">
            <p className="font-extrabold text-slate-800 text-sm sm:text-base truncate">لوحة العميل</p>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate">{USER.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="الإشعارات" className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition">
            <BellIcon />
            <span className="absolute -top-1 -left-1 w-5 h-5 bg-brand-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">3</span>
          </button>
          <a href="/store" className="hidden sm:inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white text-sm font-bold hover:opacity-90 transition shadow-sm">🎨 قالب جديد</a>
        </div>
      </div>
    </header>
  );
}

function DashNav({ active }) {
  return (
    <nav className="sticky top-16 z-30 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-2 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {NAV.map((n) => {
            const isActive = n.key === active;
            return (
              <a key={n.key} href={n.href} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition ${isActive ? "bg-gradient-to-l from-brand-primary to-brand-secondary text-white shadow-sm" : "text-slate-500 hover:text-brand-primary hover:bg-violet-50"}`}>
                <span>{n.emoji}</span> {n.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/* ===== كارت القالب المحفوظ ===== */
function FavCard({ fav, index, onRemove }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition overflow-hidden group" style={{ animation: `fadeUp .45s ease both ${index * 0.06}s` }}>
      {/* غلاف متدرج */}
      <div className={`relative h-36 bg-gradient-to-tr ${fav.grad} flex items-center justify-center`}>
        <span className="text-6xl drop-shadow-lg group-hover:scale-110 transition" style={{ animation: "floatY 4s ease-in-out infinite" }}>{fav.emoji}</span>
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-[11px] font-bold text-slate-700 px-2.5 py-1 rounded-full">{fav.category}</span>
        <button
          onClick={() => onRemove(fav.id)}
          aria-label="إزالة من المفضلة"
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-rose-500 hover:bg-white hover:scale-110 transition shadow"
        >
          <HeartIcon className="w-4 h-4" />
        </button>
      </div>
      {/* التفاصيل */}
      <div className="p-4">
        <h3 className="font-extrabold text-slate-800 truncate">{fav.title}</h3>
        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
          <span className="text-amber-400 text-sm">⭐</span>
          <b className="text-slate-700">{fav.rating}</b>
          <span className="text-slate-300">({fav.ratings} تقييم)</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="font-extrabold text-brand-primary">{fmt(fav.price)}</p>
          <p className="text-[11px] text-slate-400">أُضيف {fav.addedAt}</p>
        </div>
        <div className="flex gap-2 mt-3">
          <a href={`/product/${fav.id}`} className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white hover:opacity-90 transition">اشترِ الآن</a>
          <a href={`/product/${fav.id}`} className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition">معاينة</a>
        </div>
      </div>
    </div>
  );
}

export default function UserFavorites() {
  const [favs, setFavs] = useState(FAVORITES);
  const [toast, setToast] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  // إخفاء الإشعار تلقائياً
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const total = favs.reduce((sum, f) => sum + f.price, 0);

  const removeFav = (id) => {
    setFavs((prev) => prev.filter((f) => f.id !== id));
    setToast("تم الحذف من المفضلة 🗑️");
  };

  const handleClearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    } else {
      setFavs([]);
      setConfirmClear(false);
      setToast("تم إفراغ قائمة المفضلة");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-800">
      <style>{KEYFRAMES}</style>
      <DashTopbar />
      <DashNav active="favorites" />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* ترويسة الصفحة */}
        <div className="flex flex-wrap items-center justify-between gap-3" style={{ animation: "fadeUp .5s ease both" }}>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">قائمة المفضلة ❤️</h1>
            <p className="text-sm text-slate-500 mt-1">القوالب التي حفظتها لشرائها لاحقاً — {favs.length} قالب</p>
          </div>
          {favs.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-white border border-slate-200 text-slate-600 px-3 py-2.5 rounded-xl">إجمالي القيمة: <b className="text-brand-primary">{fmt(total)}</b></span>
              <button
                onClick={handleClearAll}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl transition ${confirmClear ? "bg-rose-600 text-white shadow-lg" : "bg-rose-50 text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100"}`}
              >
                {confirmClear ? "متأكد؟ اضغط للتأكيد ✓" : "🗑️ إفراغ الكل"}
              </button>
            </div>
          )}
        </div>

        {/* الشبكة / الحالة الفارغة */}
        {favs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {favs.map((f, i) => <FavCard key={f.id} fav={f} index={i} onRemove={removeFav} />)}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center" style={{ animation: "pop .4s ease both" }}>
            <span className="text-6xl">🤍</span>
            <h2 className="font-extrabold text-slate-700 text-lg mt-4">قائمة المفضلة فارغة</h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">اضغط على القلب ❤️ في أي قالب<br />ليُحفظ هنا وتعود إليه لاحقاً</p>
            <a href="/store" className="inline-block mt-5 bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition shadow-lg">🛍️ تصفح المتجر</a>
          </div>
        )}

        {/* شريط مساعدة صغير */}
        {favs.length > 0 && (
          <div className="text-xs text-slate-500 bg-white border border-slate-100 rounded-xl px-4 py-3 leading-relaxed" style={{ animation: "fadeUp .5s ease both .4s" }}>
            💡 القوالب في المفضلة لا تُحجز — قد يتغير سعرها عند العروض، فاطلب قبل انتهاء الخصم
          </div>
        )}
      </main>

      {/* إشعار Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold whitespace-nowrap" style={{ animation: "pop .3s ease both" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
