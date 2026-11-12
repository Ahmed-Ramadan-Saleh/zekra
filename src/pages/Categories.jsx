import { useState, useMemo } from "react";

/* ============================================================
   Categories.jsx — تصفح القوالب حسب التصنيف
   المسار المقترح: /categories
   الضغط على أي تصنيف هيودي لصفحة المتجر مفلتر عليه:
   /store?category=birthday  (محاكاة — الربط بـ Router لاحقاً)
   ============================================================ */

/* ---------- بيانات التصنيفات التجريبية (هتيجي من API لاحقاً) ---------- */
const CATEGORIES = [
  { id: "birthday",  name: "عيد ميلاد",       emoji: "🎂", desc: "تهاني وتصاميم تخلي السنة الجديدة مميزة",   count: 32, gradient: "from-pink-500 to-purple-600",     popular: true },
  { id: "wedding",   name: "زواج",            emoji: "💍", desc: "دعوات وتهاني ليلة العمر",                  count: 18, gradient: "from-rose-400 to-pink-600",       popular: true },
  { id: "graduation",name: "تخرج",            emoji: "🎓", desc: "احتفل بأجمل إنجاز مع اللي بيحبوك",         count: 15, gradient: "from-indigo-500 to-purple-700",   popular: true },
  { id: "newborn",   name: "مواليد جديدة",    emoji: "👶", desc: "أول صورة لأجمل خبر في العيلة",             count: 12, gradient: "from-sky-400 to-blue-600",        popular: false },
  { id: "invites",   name: "دعوات مناسبات",   emoji: "💌", desc: "دعوات رقمية أنيقة لكل مناسبة",             count: 21, gradient: "from-amber-400 to-orange-500",    popular: false },
  { id: "love",      name: "رسائل حب",        emoji: "❤️", desc: "كلام من القلب للناس الغالية",              count: 16, gradient: "from-red-400 to-rose-600",        popular: false },
  { id: "thanks",    name: "شكر وتقدير",      emoji: "🙏", desc: "لأن الكلمة الطيبة تستاهل ذكرى",            count: 9,  gradient: "from-emerald-400 to-teal-600",    popular: false },
  { id: "islamic",   name: "مناسبات إسلامية", emoji: "🌙", desc: "رمضان والعيود بأجواء روحانية",             count: 11, gradient: "from-teal-500 to-emerald-700",    popular: false },
];

/* ---------- الحركات المخصصة ---------- */
const KEYFRAMES = `
  @keyframes riseIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

/* ---------- أيقونات SVG مدمجة ---------- */
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* ============================================================
   الصفحة الرئيسية
   ============================================================ */
export default function Categories() {
  const [query, setQuery] = useState("");

  /* الفلترة الفورية على اسم التصنيف أو الوصف */
  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((c) => c.name.includes(q) || c.desc.includes(q));
  }, [query]);

  const isSearching = query.trim() !== "";
  const popular = CATEGORIES.filter((c) => c.popular);
  const totalTemplates = CATEGORIES.reduce((sum, c) => sum + c.count, 0);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pb-14">
      <style>{KEYFRAMES}</style>

      {/* ============ الهيرو ============ */}
      <section className="relative overflow-hidden bg-gradient-to-l from-brand-primary via-purple-700 to-brand-secondary text-white px-4 pt-10 pb-20">
        {/* زخارف دوائر شفافة */}
        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/10" />
        <div className="absolute top-10 left-1/3 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 -right-10 w-64 h-64 rounded-full bg-white/10" />

        <div className="relative z-10 max-w-6xl mx-auto text-center" style={{ animation: "riseIn 0.6s ease-out both" }}>
          {/* مسار التنقل */}
          <nav className="flex items-center justify-center gap-2 text-white/70 text-sm">
            <button className="hover:text-white transition-colors">الرئيسية</button>
            <span>/</span>
            <span className="text-white font-bold">التصنيفات</span>
          </nav>

          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-snug">
            استكشف <span className="text-amber-300">تصنيفات</span> القوالب
          </h1>
          <p className="mt-3 text-white/80 max-w-xl mx-auto leading-relaxed">
            كل مناسبة ليها بصمة.. اختار التصنيف اللي يناسب مناسبتك وابدأ التخصيص على طول
          </p>

          {/* شرائح إحصائيات */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[
              `${CATEGORIES.length} تصنيفات`,
              `${totalTemplates}+ قالب`,
              "تخصيص كامل 🎨",
              "معاينة فورية 👀",
            ].map((chip) => (
              <span
                key={chip}
                className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm font-bold"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ البحث العائم ============ */}
      <div className="relative z-20 max-w-xl mx-auto px-4 -mt-8" style={{ animation: "riseIn 0.6s ease-out 0.15s both" }}>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 px-4 py-3.5">
          <SearchIcon />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="دوّر على تصنيف.. مثلاً: ميلاد، زواج، تخرج"
            className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm md:text-base"
          />
          {isSearching && (
            <button
              onClick={() => setQuery("")}
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              title="مسح البحث"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </div>

      {/* ============ الأكثر رواجاً (بيختفي وقت البحث) ============ */}
      {!isSearching && (
        <section className="max-w-6xl mx-auto px-4 mt-10" style={{ animation: "riseIn 0.6s ease-out 0.25s both" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-lg">🔥</span>
              الأكثر رواجاً
            </h2>
            <span className="text-gray-400 text-sm">التصنيفات اللي الناس بتحبها</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {popular.map((c) => (
              <button
                key={c.id}
                className={`group relative overflow-hidden rounded-3xl p-6 text-right bg-gradient-to-br ${c.gradient} text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
              >
                {/* زخارف */}
                <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
                <div className="absolute -left-3 -bottom-3 w-20 h-20 rounded-full bg-white/10" />

                {/* شارة رائج */}
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-white/25 backdrop-blur text-[11px] font-bold">
                  🔥 رائج
                </span>

                <span className="relative text-5xl inline-block group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                  {c.emoji}
                </span>
                <h3 className="relative mt-3 text-xl font-extrabold">{c.name}</h3>
                <p className="relative text-white/80 text-sm mt-1">{c.desc}</p>

                <div className="relative mt-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold">
                    {c.count} قالب
                  </span>
                  <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                    <ArrowLeftIcon />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ============ كل التصنيفات ============ */}
      <section className="max-w-6xl mx-auto px-4 mt-10" style={{ animation: "riseIn 0.6s ease-out 0.35s both" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-lg">🗂️</span>
            {isSearching ? "نتائج البحث" : "كل التصنيفات"}
          </h2>
          <span className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-500 text-sm font-bold shadow-sm">
            {filtered.length} تصنيف
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {filtered.map((c) => (
              <button
                key={c.id}
                className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-purple-200 transition-all duration-300 text-center"
              >
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-3xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
                >
                  {c.emoji}
                </div>
                <h3 className="mt-4 font-extrabold text-gray-800">{c.name}</h3>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">{c.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-xs text-gray-500 group-hover:bg-purple-50 group-hover:text-brand-primary transition-colors">
                  {c.count} قالب
                </div>
                <p className="mt-3 text-brand-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  تصفح القوالب ←
                </p>
              </button>
            ))}
          </div>
        ) : (
          /* حالة عدم وجود نتائج */
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <span className="text-6xl">🔍</span>
            <p className="mt-4 font-bold text-gray-700">مفيش تصنيف بالاسم ده</p>
            <p className="text-gray-400 text-sm mt-1">جرب كلمة تانية أو امسح البحث وشوف كل التصنيفات</p>
            <button
              onClick={() => setQuery("")}
              className="mt-5 px-6 py-2.5 rounded-xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white text-sm font-bold shadow-md hover:shadow-lg transition-shadow"
            >
              عرض كل التصنيفات
            </button>
          </div>
        )}
      </section>

      {/* ============ CTA: قالب مخصص ============ */}
      <section className="max-w-6xl mx-auto px-4 mt-12" style={{ animation: "riseIn 0.6s ease-out 0.45s both" }}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-brand-primary to-brand-secondary p-8 md:p-10 text-white text-center shadow-xl">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-14 -left-14 w-48 h-48 rounded-full bg-white/10" />

          <span className="relative text-4xl inline-block">✨</span>
          <h3 className="relative mt-2 text-2xl md:text-3xl font-extrabold">مش لاقي التصنيف المناسب؟</h3>
          <p className="relative mt-2 text-white/80 max-w-md mx-auto">
            قولنا فكرتك.. واحنا نصمم لك قالب مخصوص لمناسبتك من الصفر
          </p>
          <button className="relative mt-5 px-7 py-3 rounded-2xl bg-white text-brand-primary font-extrabold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all">
            اطلب قالب مخصص 🎨
          </button>
        </div>
      </section>
    </div>
  );
}