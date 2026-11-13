import React, { useMemo, useState } from "react";

/* ============================================================
   UserOrders.jsx — طلباتي ومنتجاتي
   قائمة الطلبات (مدفوع / مسودة / تم التسليم / ملغي)
   فلاتر بالحالة + بحث فوري + أزرار إجراء حسب الحالة
   ملاحظات:
   - تعمل بدون Header/Footer (مكونان مستقلان لديك مسبقاً)
   - البيانات Mock تُستبدل بنداءات API لاحقاً
   ============================================================ */

const ORDERS = [
  { id: "ORD-2026-1042", product: "قالب عيد ميلاد — نجوم ذهبية", emoji: "🎂", grad: "from-amber-400 to-orange-500", date: "10 نوفمبر 2026", price: 250, status: "delivered", recipient: "سارة", views: 128 },
  { id: "ORD-2026-1039", product: "دعوة زفاف — لافندر", emoji: "✉️", grad: "from-violet-400 to-purple-500", date: "5 نوفمبر 2026", price: 150, status: "paid", recipient: "نور وعمر" },
  { id: "ORD-2026-1036", product: "قالب تخرج — قبعة وفش", emoji: "🎓", grad: "from-sky-400 to-blue-600", date: "1 نوفمبر 2026", price: 200, status: "draft", recipient: "خالد" },
  { id: "ORD-2026-1028", product: "رسالة حب — قلبان متجاوران", emoji: "❤️", grad: "from-rose-400 to-pink-600", date: "25 أكتوبر 2026", price: 150, status: "draft", recipient: "منى" },
  { id: "ORD-2026-1021", product: "قالب زفاف — روز جولد", emoji: "💍", grad: "from-pink-400 to-rose-600", date: "18 أكتوبر 2026", price: 350, status: "delivered", recipient: "نور وعمر", views: 184 },
  { id: "ORD-2026-1013", product: "بطاقة شكر — شكراً من القلب", emoji: "🙏", grad: "from-emerald-400 to-green-600", date: "9 أكتوبر 2026", price: 150, status: "canceled", recipient: "الأستاذة فاطمة" },
];

const STATUS = {
  paid: { label: "مدفوع", badge: "bg-violet-50 text-violet-700 ring-1 ring-violet-200", bar: "border-violet-400" },
  draft: { label: "مسودة", badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", bar: "border-amber-400" },
  delivered: { label: "تم التسليم", badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", bar: "border-emerald-400" },
  canceled: { label: "ملغي", badge: "bg-slate-100 text-slate-500 ring-1 ring-slate-200", bar: "border-slate-300" },
};

const FILTERS = [
  { key: "all", label: "الكل" },
  { key: "delivered", label: "تم التسليم" },
  { key: "paid", label: "مدفوع" },
  { key: "draft", label: "المسودات" },
  { key: "canceled", label: "ملغي" },
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
@keyframes pop { 0% { transform: scale(.85); opacity: 0; } 70% { transform: scale(1.04); } 100% { transform: scale(1); opacity: 1; } }
`;

/* ===== أيقونات SVG مدمجة ===== */
const BellIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
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

/* ===== كارت الطلب ===== */
function OrderCard({ order, index }) {
  const st = STATUS[order.status];
  return (
    <article className={`bg-white rounded-2xl border border-slate-100 border-r-4 ${st.bar} shadow-sm hover:shadow-md transition p-4 sm:p-5`} style={{ animation: `fadeUp .4s ease both ${index * 0.05}s` }}>
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${order.grad} flex items-center justify-center text-3xl shrink-0`}>{order.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-800 truncate">{order.product}</h3>
              <p className="text-xs text-slate-400 mt-1"><span dir="ltr">{order.id}</span> • {order.date}</p>
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${st.badge}`}>{st.label}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
            <span>🎁 المُهدى إليه: <b className="text-slate-700">{order.recipient}</b></span>
            <span>💰 {fmt(order.price)}</span>
            {order.status === "delivered" && <span>👀 {order.views} مشاهدة</span>}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <a href={`/dashboard/orders/${order.id}`} className="text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white hover:opacity-90 transition">تفاصيل الطلب</a>
            {order.status === "delivered" && (
              <a href="#" className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 transition">🔗 رابط الهدية</a>
            )}
            {order.status === "draft" && (
              <a href="/customize" className="text-xs font-bold px-4 py-2 rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100 transition">✏️ استكمال التخصيص</a>
            )}
            {order.status === "paid" && (
              <span className="text-xs font-medium px-4 py-2 rounded-xl bg-slate-50 text-slate-500">⏳ جاري تجهيز رابط الهدية خلال 24 ساعة</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function UserOrders() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c = { all: ORDERS.length };
    ORDERS.forEach((o) => { c[o.status] = (c[o.status] || 0) + 1; });
    return c;
  }, []);

  const list = useMemo(() => {
    const q = query.trim();
    return ORDERS.filter((o) => {
      const okFilter = filter === "all" || o.status === filter;
      const okQuery = !q || o.product.includes(q) || o.id.toLowerCase().includes(q.toLowerCase()) || o.recipient.includes(q);
      return okFilter && okQuery;
    });
  }, [filter, query]);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-800">
      <style>{KEYFRAMES}</style>
      <DashTopbar />
      <DashNav active="orders" />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* ترويسة الصفحة */}
        <div className="flex flex-wrap items-end justify-between gap-3" style={{ animation: "fadeUp .5s ease both" }}>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">طلباتي ومنتجاتي 📦</h1>
            <p className="text-sm text-slate-500 mt-1">تابع حالة كل طلب، واستكمل مسوداتك، وشارك روابط هداياك</p>
          </div>
          <a href="/store" className="text-sm font-bold px-4 py-2.5 rounded-xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white hover:opacity-90 transition shadow-sm">+ طلب جديد</a>
        </div>

        {/* شريط البحث */}
        <div className="relative" style={{ animation: "fadeUp .5s ease both .1s" }}>
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث برقم الطلب أو اسم القالب أو المُهدى إليه…"
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pr-11 pl-4 text-sm font-medium outline-none focus:border-brand-primary transition shadow-sm"
          />
        </div>

        {/* فلاتر الحالة */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none", animation: "fadeUp .5s ease both .15s" }}>
          {FILTERS.map((f) => {
            const count = f.key === "all" ? counts.all : (counts[f.key] || 0);
            const isActive = filter === f.key;
            return (
              <button key={f.key} onClick={() => setFilter(f.key)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition ${isActive ? "bg-gradient-to-l from-brand-primary to-brand-secondary text-white shadow-sm" : "bg-white text-slate-500 border border-slate-200 hover:border-brand-primary/50 hover:text-brand-primary"}`}>
                {f.label}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-extrabold ${isActive ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* ملاحظة سريعة */}
        <div className="text-xs text-slate-500 bg-white border border-slate-100 rounded-xl px-4 py-3 leading-relaxed" style={{ animation: "fadeUp .5s ease both .2s" }}>
          💡 الطلبات المدفوعة تُسلَّم خلال 24 ساعة، والمسودات تُحفظ تلقائياً لمدة 30 يوماً
        </div>

        {/* عداد النتائج */}
        <p className="text-sm text-slate-500" style={{ animation: "fadeUp .5s ease both .25s" }}>
          عرض <b className="text-slate-700">{list.length}</b> من {ORDERS.length} طلب
        </p>

        {/* القائمة / الحالة الفارغة */}
        {list.length > 0 ? (
          <div className="space-y-4">
            {list.map((o, i) => <OrderCard key={o.id} order={o} index={i} />)}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-10 text-center" style={{ animation: "pop .4s ease both" }}>
            <span className="text-5xl">🔍</span>
            <p className="font-extrabold text-slate-700 mt-3">لا توجد طلبات مطابقة</p>
            <p className="text-sm text-slate-400 mt-1">جرّب كلمة بحث أخرى أو غيّر الفلتر</p>
            <button onClick={() => { setQuery(""); setFilter("all"); }} className="mt-4 text-sm font-bold text-brand-primary hover:underline">مسح البحث والفلاتر</button>
          </div>
        )}
      </main>
    </div>
  );
}
