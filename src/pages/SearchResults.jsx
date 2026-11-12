import { useState, useMemo } from "react";

/* ============================================================
   SearchResults.jsx — نتائج البحث
   المسار المقترح: /search?q=...
   البحث هنا فعّال على البيانات التجريبية (اسم القالب + التصنيف)
   ============================================================ */

/* ---------- بيانات تجريبية ---------- */
const PRODUCTS = [
  { id: 1, name: "قالب عيد ميلاد نجمي", category: "عيد ميلاد", emoji: "🎂", price: 149, oldPrice: 199, rating: 4.8, sold: 320, type: "فيديو تفاعلي", gradient: "from-pink-500 to-purple-600" },
  { id: 2, name: "قالب عيد ميلاد أجواء سايبر", category: "عيد ميلاد", emoji: "🎮", price: 199, oldPrice: 249, rating: 4.9, sold: 210, type: "فيديو تفاعلي", gradient: "from-indigo-500 to-blue-600" },
  { id: 3, name: "دعوة زفاف ملكية", category: "زواج", emoji: "💍", price: 129, oldPrice: 179, rating: 4.7, sold: 480, type: "قالب تفاعلي", gradient: "from-rose-400 to-pink-600" },
  { id: 4, name: "تهنئة تخرج بالطيران", category: "تخرج", emoji: "🎓", price: 99, oldPrice: 139, rating: 4.6, sold: 150, type: "فيديو تفاعلي", gradient: "from-indigo-500 to-purple-700" },
  { id: 5, name: "رسالة حب بالذكريات", category: "رسائل حب", emoji: "❤️", price: 79, oldPrice: 109, rating: 4.9, sold: 640, type: "قالب تفاعلي", gradient: "from-red-400 to-rose-600" },
  { id: 6, name: "عيد ميلاد الأطفال بالبالونات", category: "عيد ميلاد", emoji: "🎈", price: 119, oldPrice: 149, rating: 4.8, sold: 275, type: "فيديو تفاعلي", gradient: "from-amber-400 to-orange-500" },
  { id: 7, name: "شهادة شكر للمعلّم", category: "شكر وتقدير", emoji: "🙏", price: 69, oldPrice: 99, rating: 4.5, sold: 95, type: "قالب تفاعلي", gradient: "from-emerald-400 to-teal-600" },
  { id: 8, name: "دعوة خطوبة على النيل", category: "خطوبة", emoji: "💐", price: 139, oldPrice: 189, rating: 4.7, sold: 130, type: "فيديو تفاعلي", gradient: "from-fuchsia-500 to-purple-600" },
];

const CATEGORIES = [
  { id: "birthday", name: "عيد ميلاد", emoji: "🎂", count: 32, gradient: "from-pink-500 to-purple-600" },
  { id: "wedding", name: "زواج", emoji: "💍", count: 18, gradient: "from-rose-400 to-pink-600" },
  { id: "graduation", name: "تخرج", emoji: "🎓", count: 15, gradient: "from-indigo-500 to-purple-700" },
  { id: "love", name: "رسائل حب", emoji: "❤️", count: 16, gradient: "from-red-400 to-rose-600" },
  { id: "kids", name: "أطفال", emoji: "🧸", count: 20, gradient: "from-sky-400 to-blue-600" },
  { id: "invites", name: "دعوات مناسبات", emoji: "💌", count: 21, gradient: "from-amber-400 to-orange-500" },
];

const SUGGESTIONS = ["عيد ميلاد", "زواج", "تخرج", "دعوة", "حب", "أطفال"];

const TABS = [
  { id: "all", label: "الكل" },
  { id: "templates", label: "القوالب" },
  { id: "categories", label: "التصنيفات" },
];

/* ---------- الحركات المخصصة ---------- */
const KEYFRAMES = `
  @keyframes riseIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

/* ---------- أيقونات SVG مدمجة ---------- */
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* ---------- تظليل الكلمة المطابقة في النتيجة ---------- */
const Highlight = ({ text, q }) => {
  if (!q) return text;
  const parts = text.split(q);
  if (parts.length === 1) return text;
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <mark className="bg-amber-200/70 rounded px-0.5 text-inherit">{q}</mark>
          )}
        </span>
      ))}
    </>
  );
};

/* ============================================================
   الصفحة الرئيسية
   ============================================================ */
export default function SearchResults() {
  const [query, setQuery] = useState("عيد ميلاد");
  const [tab, setTab] = useState("all"); // all | templates | categories

  const q = query.trim();

  /* البحث الفوري: الاسم أو التصنيف يحتوي الكلمة */
  const matchedTemplates = useMemo(
    () => (q ? PRODUCTS.filter((p) => p.name.includes(q) || p.category.includes(q)) : []),
    [q]
  );
  const matchedCategories = useMemo(
    () => (q ? CATEGORIES.filter((c) => c.name.includes(q)) : []),
    [q]
  );

  const total = matchedTemplates.length + matchedCategories.length;
  const counts = { all: total, templates: matchedTemplates.length, categories: matchedCategories.length };

  const showCategories = (tab === "all" || tab === "categories") && matchedCategories.length > 0;
  const showTemplates = (tab === "all" || tab === "templates") && matchedTemplates.length > 0;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pb-14">
      <style>{KEYFRAMES}</style>

      {/* ============ شريط البحث العلوي ============ */}
      <section className="relative overflow-hidden bg-gradient-to-l from-brand-primary via-purple-700 to-brand-secondary px-4 pt-10 pb-16">
        <div className="absolute -top-14 -left-14 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -right-10 w-56 h-56 rounded-full bg-white/10" />

        <div className="relative z-10 max-w-3xl mx-auto" style={{ animation: "riseIn 0.6s ease-out both" }}>
          <h1 className="text-white text-2xl md:text-3xl font-extrabold text-center">
            نتائج البحث 🔎
          </h1>

          {/* حقل البحث */}
          <div className="mt-6 bg-white rounded-2xl shadow-2xl flex items-center gap-3 px-4 py-3.5">
            <SearchIcon />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setTab("all");
              }}
              placeholder="اكتب اسم قالب أو مناسبة..."
              className="flex-1 outline-none text-gray-700 placeholder-gray-300 text-sm md:text-base bg-transparent"
            />
            {q && (
              <button
                onClick={() => setQuery("")}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                title="مسح البحث"
              >
                <CloseIcon />
              </button>
            )}
          </div>

          {/* اقتراحات البحث الشائع */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="text-white/60 text-xs self-center">الأكثر بحثاً:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs hover:bg-white/20 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ منطقة النتائج ============ */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-8" style={{ animation: "riseIn 0.6s ease-out 0.2s both" }}>
        {/* ملخص + تبويبات */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <p className="text-gray-500 text-sm">
            {q ? (
              <>
                لقينا <b className="text-gray-800">{total}</b> نتيجة لـ{" "}
                «<span className="text-brand-primary font-bold">{q}</span>»
              </>
            ) : (
              "اكتب كلمة في البحث فوق لعرض النتائج"
            )}
          </p>

          <div className="flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3.5 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                  tab === t.id
                    ? "bg-gradient-to-l from-brand-primary to-brand-secondary text-white shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label} ({counts[t.id]})
              </button>
            ))}
          </div>
        </div>

        {/* لا يوجد بحث */}
        {!q && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <span className="text-6xl">🔎</span>
            <h3 className="mt-4 font-extrabold text-gray-800 text-lg">اكتب كلمة وابدأ البحث</h3>
            <p className="text-gray-400 text-sm mt-2">مثلاً: «عيد ميلاد» أو «دعوة زفاف»</p>
          </div>
        )}

        {/* لا توجد نتائج */}
        {q && total === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <span className="text-6xl">🕵️</span>
            <h3 className="mt-4 font-extrabold text-gray-800 text-lg">مفيش نتائج لـ «{q}»</h3>
            <p className="text-gray-400 text-sm mt-2">جرب كلمات أعم زي:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-brand-primary text-sm font-bold hover:bg-purple-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={() => setQuery("")}
              className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white text-sm font-bold shadow-md hover:shadow-lg transition-shadow"
            >
              امسح البحث وتصفح التصنيفات
            </button>
          </div>
        )}

        {/* نتائج التصنيفات */}
        {q && showCategories && (
          <section className="mb-8">
            <h2 className="text-lg font-extrabold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-base">🗂️</span>
              تصنيفات مطابقة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchedCategories.map((c) => (
                <button
                  key={c.id}
                  className="flex items-center gap-4 w-full bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all text-right"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-2xl shrink-0`}>
                    {c.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-gray-800">
                      <Highlight text={c.name} q={q} />
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5">{c.count} قالب جاهز للتخصيص</p>
                  </div>
                  <span className="text-brand-primary font-bold text-sm shrink-0">تصفح ←</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* نتائج القوالب */}
        {q && showTemplates && (
          <section>
            <h2 className="text-lg font-extrabold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center text-base">🎁</span>
              قوالب مطابقة
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {matchedTemplates.map((p) => (
                <div
                  key={p.id}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* الغلاف */}
                  <div className={`relative h-32 md:h-36 bg-gradient-to-br ${p.gradient} flex items-center justify-center`}>
                    <span className="text-6xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {p.emoji}
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/30 backdrop-blur text-white text-[10px] font-bold">
                      ▶ {p.type}
                    </span>
                    {p.oldPrice > p.price && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-amber-400 text-white text-[10px] font-extrabold">
                        وفّر {p.oldPrice - p.price} ج.م
                      </span>
                    )}
                  </div>

                  {/* التفاصيل */}
                  <div className="p-3.5 md:p-4">
                    <h3 className="font-extrabold text-gray-800 text-sm line-clamp-1">
                      <Highlight text={p.name} q={q} />
                    </h3>
                    <div className="flex items-center justify-between mt-1.5 text-xs text-gray-400">
                      <span>{p.category}</span>
                      <span className="text-amber-500 font-bold">⭐ {p.rating}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <p className="text-brand-primary font-extrabold text-sm md:text-base">{p.price} ج.م</p>
                        {p.oldPrice > p.price && (
                          <p className="text-gray-300 text-xs line-through">{p.oldPrice} ج.م</p>
                        )}
                      </div>
                      <button className="px-3 md:px-3.5 py-2 rounded-xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white text-xs font-bold shadow-md hover:shadow-lg transition-all">
                        تخصيص
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}