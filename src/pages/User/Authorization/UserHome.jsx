import React, { useState } from "react";

/* ============================================================
   UserHome.jsx — لوحة العميل الرئيسية
   ملخص الحساب + نقاط المكافآت + إحصائيات + آخر الطلبات + عرض ترويجي
   ملاحظات:
   - تعمل بدون Header/Footer (مكونان مستقلان لديك مسبقاً)
   - البيانات Mock تُستبدل بنداءات API لاحقاً
   - الروابط (href) توضيحية — اربطها بـ react-router لديك
   ============================================================ */

const USER = {
  name: "أحمد محمود",
  firstName: "أحمد",
  initials: "أم",
  email: "ahmed.mahmoud@gmail.com",
  memberSince: "مارس 2025",
  level: "عضو ذهبي",
  points: 340,
  pointsToNext: 60,
  progress: 85, // نسبة التقدم للمستوى التالي (٪)
};

const STATUS = {
  delivered: { label: "تم التسليم", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  paid: { label: "مدفوع", cls: "bg-violet-50 text-violet-700 ring-1 ring-violet-200" },
  draft: { label: "مسودة", cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
};

const RECENT_ORDERS = [
  { id: "ORD-2026-1042", product: "قالب عيد ميلاد — نجوم ذهبية", emoji: "🎂", grad: "from-amber-400 to-orange-500", date: "10 نوفمبر 2026", price: 250, status: "delivered" },
  { id: "ORD-2026-1039", product: "دعوة زفاف — لافندر", emoji: "✉️", grad: "from-violet-400 to-purple-500", date: "5 نوفمبر 2026", price: 150, status: "paid" },
  { id: "ORD-2026-1036", product: "قالب تخرج — قبعة وفش", emoji: "🎓", grad: "from-sky-400 to-blue-600", date: "1 نوفمبر 2026", price: 200, status: "draft" },
];

const STATS = [
  { label: "إجمالي الطلبات", value: "6", sub: "+1 هذا الشهر", emoji: "📦", grad: "from-violet-500 to-indigo-500" },
  { label: "هدايا مُسلّمة", value: "2", sub: "روابط فعّالة", emoji: "✅", grad: "from-emerald-500 to-teal-500" },
  { label: "قوالب المفضلة", value: "4", sub: "محفوظة لاحقاً", emoji: "❤️", grad: "from-pink-500 to-rose-500" },
  { label: "مشاهدات هداياك", value: "312", sub: "+48 خلال أمس", emoji: "👀", grad: "from-amber-500 to-orange-500" },
];

const ACTIONS = [
  { emoji: "🎨", title: "أنشئ قالباً جديداً", desc: "اختر من مئات القوالب وخصّصها في دقائق", href: "/store" },
  { emoji: "🔗", title: "روابط الهدايا", desc: "أدر روابطك النشطة وشاركها مع أحبابك", href: "/dashboard/orders" },
  { emoji: "💬", title: "الدعم الفني", desc: "فريقنا يرد خلال أقل من ساعة", href: "#" },
];

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

const ChevronIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

/* ===== القشرة الموحدة للوحة: شريط علوي ===== */
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

/* ===== القشرة الموحدة للوحة: تبويبات التنقل ===== */
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

export default function UserHome() {
  const [copied, setCopied] = useState(false);

  const copyPromo = () => {
    try { if (navigator.clipboard) navigator.clipboard.writeText("LOVE15"); } catch (e) { /* تجاهل */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-800">
      <style>{KEYFRAMES}</style>
      <DashTopbar />
      <DashNav active="home" />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* الهيرو الترحيبي + نقاط المكافآت */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white p-6 sm:p-8 shadow-lg" style={{ animation: "fadeUp .5s ease both" }}>
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-white/10 rounded-full" />
          <div className="absolute -bottom-20 -right-10 w-48 h-48 bg-white/10 rounded-full" />
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold backdrop-blur">✨ {USER.level} • عضو منذ {USER.memberSince}</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">أهلاً بعودتك، {USER.firstName} 👋</h1>
              <p className="text-white/80 mt-2 text-sm sm:text-base leading-relaxed">لديك طلب واحد قيد التخصيص، وهديتان جاهزتان للمشاركة. واصل من حيث توقفت!</p>
              <div className="flex flex-wrap gap-3 mt-5">
                <a href="/store" className="bg-white text-brand-primary font-bold px-5 py-2.5 rounded-xl hover:bg-white/90 transition shadow-lg">🎨 أنشئ قالباً جديداً</a>
                <a href="/dashboard/orders" className="border-2 border-white/40 px-5 py-2.5 rounded-xl font-bold hover:bg-white/10 transition">📦 متابعة طلباتي</a>
              </div>
            </div>
            <div className="lg:w-72 bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80 font-medium">نقاط المكافآت</span>
                <span className="text-2xl" style={{ animation: "floatY 3s ease-in-out infinite" }}>🏆</span>
              </div>
              <p className="text-3xl font-extrabold mt-1">{USER.points} <span className="text-sm font-bold text-white/70">نقطة</span></p>
              <div className="h-2.5 bg-white/20 rounded-full mt-3 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-accent to-yellow-300" style={{ width: `${USER.progress}%` }} />
              </div>
              <p className="text-[11px] text-white/75 mt-2 leading-relaxed">باقي {USER.pointsToNext} نقطة فقط للوصول إلى مستوى «بلاتيني» 💎</p>
            </div>
          </div>
        </section>

        {/* بطاقات الإحصائيات */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((s, i) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition" style={{ animation: `fadeUp .5s ease both ${0.1 + i * 0.07}s` }}>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${s.grad} flex items-center justify-center text-xl shadow-sm`}>{s.emoji}</div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-3">{s.value}</p>
              <p className="text-sm text-slate-500 font-medium">{s.label}</p>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">{s.sub}</p>
            </div>
          ))}
        </section>

        {/* إجراءات سريعة */}
        <section className="grid sm:grid-cols-3 gap-3 sm:gap-4">
          {ACTIONS.map((a, i) => (
            <a key={a.title} href={a.href} className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:border-brand-primary/40 hover:shadow-md transition flex items-center gap-4" style={{ animation: `fadeUp .5s ease both ${0.35 + i * 0.08}s` }}>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl transition group-hover:bg-gradient-to-tr group-hover:from-brand-primary group-hover:to-brand-secondary">{a.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800">{a.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{a.desc}</p>
              </div>
              <ChevronIcon className="w-4 h-4 text-slate-300 group-hover:text-brand-primary transition" />
            </a>
          ))}
        </section>

        {/* آخر الطلبات */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden" style={{ animation: "fadeUp .5s ease both .55s" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-extrabold text-slate-800">📦 آخر الطلبات</h2>
            <a href="/dashboard/orders" className="text-sm font-bold text-brand-primary hover:opacity-80 flex items-center gap-1">عرض الكل <ChevronIcon className="w-4 h-4" /></a>
          </div>
          <ul className="divide-y divide-slate-100">
            {RECENT_ORDERS.map((o) => (
              <li key={o.id}>
                <a href={`/dashboard/orders/${o.id}`} className="flex items-center gap-3 sm:gap-4 px-5 py-4 hover:bg-slate-50 transition">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${o.grad} flex items-center justify-center text-2xl shrink-0`}>{o.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{o.product}</p>
                    <p className="text-xs text-slate-400 mt-0.5"><span dir="ltr">{o.id}</span> • {o.date}</p>
                  </div>
                  <div className="hidden sm:flex flex-col items-start gap-1">
                    <p className="font-extrabold text-slate-800 whitespace-nowrap">{fmt(o.price)}</p>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${STATUS[o.status].cls}`}>{STATUS[o.status].label}</span>
                  </div>
                  <ChevronIcon className="w-4 h-4 text-slate-300 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* بانر عرض ترويجي */}
        <section className="rounded-3xl bg-gradient-to-l from-amber-400 via-orange-400 to-brand-secondary p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center gap-4 shadow-lg" style={{ animation: "fadeUp .5s ease both .65s" }}>
          <span className="text-4xl sm:text-5xl" style={{ animation: "floatY 3.5s ease-in-out infinite" }}>🎁</span>
          <div className="flex-1 text-center sm:text-right">
            <p className="font-extrabold text-lg">خصم 15% على قوالب الزفاف 💍</p>
            <p className="text-white/85 text-sm mt-0.5">استخدم الكود عند الدفع — العرض ساري حتى نهاية الشهر</p>
          </div>
          <button onClick={copyPromo} className="bg-white text-slate-800 font-extrabold px-5 py-2.5 rounded-xl hover:bg-white/90 transition shadow-lg border-2 border-dashed border-orange-200 whitespace-nowrap">
            {copied ? "تم النسخ ✓" : "الكود: LOVE15"}
          </button>
        </section>
      </main>
    </div>
  );
}
