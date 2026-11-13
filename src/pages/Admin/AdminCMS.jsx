import React, { useEffect, useState } from "react";

/* ============================================================
   AdminCMS.jsx — إدارة المحتوى التسويقي
   تبويبات: البانرات (CRUD) / العروض والكوبونات الإعلانية /
   أقسام الصفحة الرئيسية (إظهار + ترتيب)
   ============================================================ */
/* ⭐ هذه الصفحة "محتوى فقط" — تُعرض داخل AdminLayout عبر <Outlet />
   القشرة (Sidebar + Topbar + العنوان) تأتي من الـLayout ولا تُستدعى هنا. */



const BANNERS = [
  { id: 1, title: "خصم 15% على قوالب الزفاف", subtitle: "استخدم الكود LOVE15 — حتى نهاية الشهر", emoji: "💍", grad: "from-rose-500 via-pink-500 to-brand-secondary", order: 1, active: true },
  { id: 2, title: "تخفيضات نهاية الأسبوع", subtitle: "حتى 30% على قوالب أعياد الميلاد", emoji: "🎂", grad: "from-amber-400 via-orange-400 to-rose-500", order: 2, active: true },
  { id: 3, title: "مواسم التخرج بدأت", subtitle: "قالب تخرج كامل مع فيديو تهنئة", emoji: "🎓", grad: "from-sky-500 via-blue-500 to-indigo-600", order: 3, active: false },
];

const OFFERS = [
  { id: 1, code: "LOVE15", text: "خصم 15% على قوالب الزفاف", until: "30 نوفمبر 2026", active: true },
  { id: 2, code: "GRAD10", text: "خصم 10% على قوالب التخرج", until: "15 ديسمبر 2026", active: true },
  { id: 3, code: "WELCOME", text: "خصم ترحيبي 25 ج.م لأول طلب", until: "لا ينتهي", active: true },
];

const HOME_SECTIONS = [
  { key: "hero", label: "الهيرو الترحيبي", desc: "العنوان الرئيسي وزر ابدأ الآن", on: true },
  { key: "trending", label: "الأكثر رواجاً", desc: "شريط القوالب الأكثر مبيعاً", on: true },
  { key: "categories", label: "شبكة التصنيفات", desc: "بطاقات المناسبات الثمانية", on: true },
  { key: "how", label: "كيف تعمل المنصة", desc: "خطوات: اختر ← خصّص ← شارك", on: true },
  { key: "showcase", label: "معرض الأعمال", desc: "أعمال عملاء حقيقية", on: true },
  { key: "testimonials", label: "آراء العملاء", desc: "شهادات وتقييمات", on: true },
  { key: "faq", label: "الأسئلة الشائعة", desc: "أسئلة ما قبل الشراء", on: false },
];

const GRADIENTS = [
  "from-rose-500 via-pink-500 to-brand-secondary",
  "from-amber-400 via-orange-400 to-rose-500",
  "from-sky-500 via-blue-500 to-indigo-600",
  "from-violet-500 via-purple-500 to-fuchsia-600",
  "from-emerald-400 via-teal-500 to-cyan-600",
];

const KEYFRAMES = `
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { 0% { transform: scale(.85); opacity: 0; } 70% { transform: scale(1.04); } 100% { transform: scale(1); opacity: 1; } }
`;


function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold whitespace-nowrap max-w-[90vw]" style={{ animation: "pop .3s ease both" }}>
      {msg}
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ animation: "pop .25s ease both" }}>
        <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-slate-100 rounded-t-3xl">
          <h3 className="font-extrabold text-slate-800">{title}</h3>
          <button onClick={onClose} aria-label="إغلاق" className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button type="button" onClick={onChange} role="switch" aria-checked={on} className={`relative w-12 h-7 rounded-full transition-colors duration-300 shrink-0 ${on ? "bg-gradient-to-l from-brand-primary to-brand-secondary" : "bg-slate-300"}`}>
      <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${on ? "left-1" : "right-1"}`} />
    </button>
  );
}

const inputCls = "w-full px-4 py-3 rounded-xl border-2 bg-slate-50 focus:bg-white outline-none transition text-sm font-medium border-slate-200 focus:border-brand-primary";

const TABS = [
  { key: "banners", label: "البانرات", emoji: "🖼️" },
  { key: "offers", label: "العروض", emoji: "🔥" },
  { key: "home", label: "أقسام الرئيسية", emoji: "🏠" },
];

export default function AdminCMS() {
  const [tab, setTab] = useState("banners");
  const [banners, setBanners] = useState(BANNERS);
  const [offers, setOffers] = useState(OFFERS);
  const [sections, setSections] = useState(HOME_SECTIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

  const [bTitle, setBTitle] = useState("");
  const [bSubtitle, setBSubtitle] = useState("");
  const [bEmoji, setBEmoji] = useState("🎉");
  const [bGrad, setBGrad] = useState(GRADIENTS[0]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (m) => setToast(m);

  const openAdd = () => {
    setEditingId(null);
    setBTitle(""); setBSubtitle(""); setBEmoji("🎉"); setBGrad(GRADIENTS[0]);
    setModalOpen(true);
  };

  const openEdit = (b) => {
    setEditingId(b.id);
    setBTitle(b.title); setBSubtitle(b.subtitle); setBEmoji(b.emoji); setBGrad(b.grad);
    setModalOpen(true);
  };

  const saveBanner = () => {
    if (!bTitle.trim()) return showToast("اكتب عنوان البانر ⚠️");
    if (editingId) {
      setBanners(banners.map((b) => (b.id === editingId ? { ...b, title: bTitle.trim(), subtitle: bSubtitle, emoji: bEmoji, grad: bGrad } : b)));
      showToast("تم تحديث البانر ✓");
    } else {
      setBanners([...banners, { id: Date.now(), title: bTitle.trim(), subtitle: bSubtitle, emoji: bEmoji, grad: bGrad, order: banners.length + 1, active: true }]);
      showToast("تمت إضافة البانر ✓");
    }
    setModalOpen(false);
  };

  const moveBanner = (i, dir) => {
    setBanners((prev) => {
      const arr = [...prev];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return prev;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr.map((b, x) => ({ ...b, order: x + 1 }));
    });
  };

  const toggleBanner = (id) => setBanners(banners.map((b) => (b.id === id ? { ...b, active: !b.active } : b)));

  const deleteBanner = (id) => {
    setBanners(banners.filter((b) => b.id !== id));
    showToast("تم حذف البانر 🗑️");
  };

  const moveSection = (i, dir) => {
    setSections((prev) => {
      const arr = [...prev];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return prev;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  };

  const toggleOffer = (id) => setOffers(offers.map((o) => (o.id === id ? { ...o, active: !o.active } : o)));

  return (
    <>
      <style>{KEYFRAMES}</style>
      {/* التبويبات */}
      <div className="flex gap-2 overflow-x-auto bg-white rounded-2xl border border-slate-200/70 shadow-sm p-2" style={{ animation: "fadeUp .45s ease both", scrollbarWidth: "none" }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition ${tab === t.key ? "bg-gradient-to-l from-brand-primary to-brand-secondary text-white shadow-sm" : "text-slate-500 hover:text-brand-primary hover:bg-violet-50"}`}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* البانرات */}
      {tab === "banners" && (
        <div style={{ animation: "fadeUp .4s ease both" }}>
          <div className="flex items-center justify-between mt-5">
            <h2 className="font-extrabold text-slate-800">🖼️ بانرات الصفحة الرئيسية ({banners.length})</h2>
            <button onClick={openAdd} className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition shadow-sm">+ بانر جديد</button>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
            {banners.map((b, i) => (
              <div key={b.id} className="bg-white rounded-3xl border border-slate-200/70 shadow-sm overflow-hidden" style={{ animation: `fadeUp .4s ease both ${i * 0.05}s` }}>
                <div className={`relative h-28 bg-gradient-to-l ${b.grad} flex flex-col items-center justify-center text-white text-center px-4`}>
                  <span className="text-3xl">{b.emoji}</span>
                  <p className="font-extrabold text-sm mt-1.5">{b.title}</p>
                  <p className="text-[11px] text-white/80 mt-0.5">{b.subtitle}</p>
                  <span className="absolute top-2 right-2 bg-white/90 text-[10px] font-extrabold text-slate-700 px-2 py-0.5 rounded-full">#{b.order}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">{b.active ? "ظاهر للعملاء" : "مخفي"}</span>
                    <Toggle on={b.active} onChange={() => toggleBanner(b.id)} />
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    <button onClick={() => moveBanner(i, -1)} disabled={i === 0} className={`w-8 h-8 rounded-lg text-xs font-bold transition ${i === 0 ? "bg-slate-50 text-slate-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>▲</button>
                    <button onClick={() => moveBanner(i, 1)} disabled={i === banners.length - 1} className={`w-8 h-8 rounded-lg text-xs font-bold transition ${i === banners.length - 1 ? "bg-slate-50 text-slate-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>▼</button>
                    <button onClick={() => openEdit(b)} className="flex-1 text-xs font-bold py-2 rounded-xl bg-violet-50 text-brand-primary hover:bg-violet-100 transition">✏️ تعديل</button>
                    <button onClick={() => deleteBanner(b.id)} className="text-xs font-bold py-2 px-3 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition">🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* العروض */}
      {tab === "offers" && (
        <div style={{ animation: "fadeUp .4s ease both" }}>
          <h2 className="font-extrabold text-slate-800 mt-5">🔥 العروض الإعلانية ({offers.length})</h2>
          <p className="text-xs text-slate-400 mt-1">تظهر في شريط العروض أعلى المتجر — لإدارة كوبونات الخصم الفعلية اذهب لصفحة الكوبونات</p>
          <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm mt-4 divide-y divide-slate-100">
            {offers.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center gap-3 p-4">
                <span className="font-extrabold text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg tracking-wider" dir="ltr">{o.code}</span>
                <p className="flex-1 min-w-[180px] text-sm font-bold text-slate-700">{o.text}</p>
                <span className="text-xs text-slate-400 font-bold whitespace-nowrap">⏳ {o.until}</span>
                <Toggle on={o.active} onChange={() => toggleOffer(o.id)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* أقسام الرئيسية */}
      {tab === "home" && (
        <div style={{ animation: "fadeUp .4s ease both" }}>
          <h2 className="font-extrabold text-slate-800 mt-5">🏠 أقسام الصفحة الرئيسية</h2>
          <p className="text-xs text-slate-400 mt-1">أظهر أو أخفِ كل قسم وترتيبه — التغيير ينعكس على صفحة Home.jsx مباشرة عند الربط</p>
          <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm mt-4 divide-y divide-slate-100">
            {sections.map((s, i) => (
              <div key={s.key} className="flex items-center gap-3 p-4">
                <span className="w-8 h-8 rounded-lg bg-slate-100 text-xs font-extrabold text-slate-500 flex items-center justify-center shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700">{s.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{s.desc}</p>
                </div>
                <button onClick={() => moveSection(i, -1)} disabled={i === 0} aria-label="تقديم" className={`w-8 h-8 rounded-lg text-xs font-bold transition shrink-0 ${i === 0 ? "bg-slate-50 text-slate-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>▲</button>
                <button onClick={() => moveSection(i, 1)} disabled={i === sections.length - 1} aria-label="تأخير" className={`w-8 h-8 rounded-lg text-xs font-bold transition shrink-0 ${i === sections.length - 1 ? "bg-slate-50 text-slate-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>▼</button>
                <Toggle on={s.on} onChange={() => setSections(sections.map((x) => (x.key === s.key ? { ...x, on: !x.on } : x)))} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal بانر */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "تعديل البانر" : "إضافة بانر جديد"}>
        <div className="space-y-4">
          {/* معاينة حية */}
          <div className={`h-24 rounded-2xl bg-gradient-to-l ${bGrad} flex flex-col items-center justify-center text-white text-center px-4`}>
            <span className="text-2xl">{bEmoji}</span>
            <p className="font-extrabold text-sm mt-1">{bTitle || "عنوان البانر"}</p>
            <p className="text-[11px] text-white/80">{bSubtitle || "العنوان الفرعي"}</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">العنوان *</label>
            <input value={bTitle} onChange={(e) => setBTitle(e.target.value)} placeholder="مثال: خصم عيد الأم" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">العنوان الفرعي</label>
            <input value={bSubtitle} onChange={(e) => setBSubtitle(e.target.value)} placeholder="التفاصيل أو كود الخصم" className={inputCls} />
          </div>
          <div className="grid sm:grid-cols-[80px_1fr] gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">الأيقونة</label>
              <input value={bEmoji} onChange={(e) => setBEmoji(e.target.value)} maxLength="2" className={`${inputCls} text-center text-xl`} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">التدرج اللوني</label>
              <div className="flex gap-2">
                {GRADIENTS.map((g) => (
                  <button key={g} type="button" onClick={() => setBGrad(g)} className={`h-10 flex-1 rounded-xl bg-gradient-to-l ${g} transition ${bGrad === g ? "ring-4 ring-brand-primary/50" : "opacity-70 hover:opacity-100"}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={saveBanner} className="flex-1 bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-bold py-3 rounded-xl hover:opacity-90 transition">{editingId ? "حفظ التعديلات" : "إضافة البانر"}</button>
            <button onClick={() => setModalOpen(false)} className="px-6 bg-white border-2 border-slate-200 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-50 transition">إلغاء</button>
          </div>
        </div>
      </Modal>

      <Toast msg={toast} />
    </>
  );
}
