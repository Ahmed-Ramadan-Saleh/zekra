import React, { useEffect, useState } from "react";

/* ============================================================
   AdminCategories.jsx — إدارة التصنيفات
   تصنيفات المناسبات: إضافة/تعديل/حذف + ترتيب + إظهار/إخفاء
   المعرفات (slug) متوافقة مع روابط /store?category=
   ============================================================ */
/* ⭐ هذه الصفحة "محتوى فقط" — تُعرض داخل AdminLayout عبر <Outlet />
   القشرة (Sidebar + Topbar + العنوان) تأتي من الـLayout ولا تُستدعى هنا. */



const CATEGORIES = [
  { id: 1, name: "أعياد ميلاد", slug: "birthday", emoji: "🎂", grad: "from-amber-400 to-orange-500", products: 9, visible: true },
  { id: 2, name: "زواج", slug: "wedding", emoji: "💍", grad: "from-pink-400 to-rose-600", products: 7, visible: true },
  { id: 3, name: "تخرج", slug: "graduation", emoji: "🎓", grad: "from-sky-400 to-blue-600", products: 5, visible: true },
  { id: 4, name: "مولود جديد", slug: "newborn", emoji: "👶", grad: "from-emerald-400 to-teal-600", products: 4, visible: true },
  { id: 5, name: "دعوات", slug: "invites", emoji: "✉️", grad: "from-violet-400 to-purple-600", products: 6, visible: true },
  { id: 6, name: "رسائل حب", slug: "love", emoji: "❤️", grad: "from-rose-400 to-red-600", products: 5, visible: true },
  { id: 7, name: "شكر وتقدير", slug: "thanks", emoji: "🙏", grad: "from-lime-400 to-green-600", products: 2, visible: false },
  { id: 8, name: "مناسبات إسلامية", slug: "islamic", emoji: "🕌", grad: "from-teal-400 to-emerald-700", products: 4, visible: true },
];

const GRADIENTS = [
  { key: "from-amber-400 to-orange-500", label: "برتقالي دافئ" },
  { key: "from-pink-400 to-rose-600", label: "وردي رومانسي" },
  { key: "from-sky-400 to-blue-600", label: "أزرق هادئ" },
  { key: "from-emerald-400 to-teal-600", label: "أخضر منعش" },
  { key: "from-violet-400 to-purple-600", label: "بنفسجي ملكي" },
  { key: "from-rose-400 to-red-600", label: "أحمر ناري" },
  { key: "from-lime-400 to-green-600", label: "ليموني حيوي" },
  { key: "from-teal-400 to-emerald-700", label: "تُركواز عميق" },
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

export default function AdminCategories() {
  const [list, setList] = useState(CATEGORIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [toast, setToast] = useState(null);

  const [cName, setCName] = useState("");
  const [cSlug, setCSlug] = useState("");
  const [cEmoji, setCEmoji] = useState("🎉");
  const [cGrad, setCGrad] = useState(GRADIENTS[0].key);
  const [cVisible, setCVisible] = useState(true);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (m) => setToast(m);

  const openAdd = () => {
    setEditingId(null);
    setCName(""); setCSlug(""); setCEmoji("🎉"); setCGrad(GRADIENTS[0].key); setCVisible(true);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setCName(c.name); setCSlug(c.slug); setCEmoji(c.emoji); setCGrad(c.grad); setCVisible(c.visible);
    setModalOpen(true);
  };

  const saveCat = () => {
    if (!cName.trim()) return showToast("اكتب اسم التصنيف ⚠️");
    if (!/^[a-z0-9-]+$/.test(cSlug)) return showToast("المعرف (slug) يجب أن يكون حروف إنجليزية صغيرة وأرقام وشرطات ⚠️");
    if (editingId) {
      setList(list.map((c) => (c.id === editingId ? { ...c, name: cName.trim(), slug: cSlug, emoji: cEmoji, grad: cGrad, visible: cVisible } : c)));
      showToast("تم تحديث التصنيف ✓");
    } else {
      setList([...list, { id: Date.now(), name: cName.trim(), slug: cSlug, emoji: cEmoji, grad: cGrad, products: 0, visible: cVisible }]);
      showToast("تمت إضافة التصنيف ✓");
    }
    setModalOpen(false);
  };

  const moveCat = (i, dir) => {
    setList((prev) => {
      const arr = [...prev];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return prev;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  };

  const doDelete = (id) => {
    const c = list.find((x) => x.id === id);
    setList(list.filter((x) => x.id !== id));
    setConfirmDel(null);
    showToast(`تم حذف تصنيف «${c ? c.name : ""}» 🗑️`);
  };

  const toggleVisible = (id) => setList(list.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));

  const visibleCount = list.filter((c) => c.visible).length;
  const totalProducts = list.reduce((s, c) => s + c.products, 0);

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div className="flex flex-wrap items-center justify-between gap-3" style={{ animation: "fadeUp .45s ease both" }}>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">التصنيفات 🗂️</h2>
          <p className="text-sm text-slate-500 mt-1">{list.length} تصنيف — {visibleCount} ظاهر للعملاء — {totalProducts} منتج موزعة عليها</p>
        </div>
        <button onClick={openAdd} className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white text-sm font-bold px-5 py-3 rounded-xl hover:opacity-90 transition shadow-sm">+ تصنيف جديد</button>
      </div>

      {/* الشبكة */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
        {list.map((c, i) => (
          <div key={c.id} className={`bg-white rounded-3xl border shadow-sm overflow-hidden transition hover:shadow-md ${c.visible ? "border-slate-200/70" : "border-dashed border-slate-300"}`} style={{ animation: `fadeUp .45s ease both ${i * 0.04}s` }}>
            <div className={`relative h-20 bg-gradient-to-tr ${c.grad} flex items-center justify-center`}>
              <span className="text-3xl">{c.emoji}</span>
              {!c.visible && <span className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />}
              <span className="absolute top-2 right-2 bg-white/90 text-[10px] font-extrabold text-slate-700 px-2 py-0.5 rounded-full">#{i + 1}</span>
            </div>
            <div className="p-4">
              <h3 className="font-extrabold text-slate-800">{c.name}</h3>
              <p className="text-[11px] text-slate-400 font-bold mt-0.5" dir="ltr">/store?category={c.slug}</p>
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-xs font-bold text-slate-500">{c.products} منتج</span>
                <Toggle on={c.visible} onChange={() => toggleVisible(c.id)} />
              </div>
              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-slate-100">
                <button onClick={() => moveCat(i, -1)} disabled={i === 0} aria-label="تقديم" className={`w-8 h-8 rounded-lg text-xs font-bold transition ${i === 0 ? "bg-slate-50 text-slate-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>▲</button>
                <button onClick={() => moveCat(i, 1)} disabled={i === list.length - 1} aria-label="تأخير" className={`w-8 h-8 rounded-lg text-xs font-bold transition ${i === list.length - 1 ? "bg-slate-50 text-slate-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>▼</button>
                <button onClick={() => openEdit(c)} className="flex-1 text-xs font-bold py-2 rounded-xl bg-violet-50 text-brand-primary hover:bg-violet-100 transition">✏️ تعديل</button>
                {confirmDel === c.id ? (
                  <button onClick={() => doDelete(c.id)} className="text-xs font-extrabold px-3 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition">تأكيد؟</button>
                ) : (
                  <button onClick={() => setConfirmDel(c.id)} aria-label="حذف" className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center text-sm transition">🗑️</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal الإضافة/التعديل */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "تعديل التصنيف" : "إضافة تصنيف جديد"}>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-[1fr_80px] gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">اسم التصنيف *</label>
              <input value={cName} onChange={(e) => setCName(e.target.value)} placeholder="مثال: مناسبات الشركات" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">الأيقونة</label>
              <input value={cEmoji} onChange={(e) => setCEmoji(e.target.value)} maxLength="2" className={`${inputCls} text-center text-xl`} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">المعرف بالإنجليزية (slug) *</label>
            <input dir="ltr" value={cSlug} onChange={(e) => setCSlug(e.target.value)} placeholder="corporate-events" className={`${inputCls} text-left`} />
            <p className="text-[11px] text-slate-400 mt-1.5">يُستخدم في الرابط: <span dir="ltr" className="font-bold">/store?category=…</span></p>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">التدرج اللوني للغلاف</label>
            <div className="grid grid-cols-4 gap-2">
              {GRADIENTS.map((g) => (
                <button key={g.key} type="button" onClick={() => setCGrad(g.key)} title={g.label} className={`h-10 rounded-xl bg-gradient-to-tr ${g.key} transition ${cGrad === g.key ? "ring-4 ring-brand-primary/50 scale-105" : "opacity-70 hover:opacity-100"}`} />
              ))}
            </div>
          </div>
          <label className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 cursor-pointer">
            <span className="text-sm font-bold text-slate-700">ظاهر للعملاء في صفحة التصنيفات</span>
            <Toggle on={cVisible} onChange={() => setCVisible(!cVisible)} />
          </label>
          <div className="flex gap-2 pt-1">
            <button onClick={saveCat} className="flex-1 bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-bold py-3 rounded-xl hover:opacity-90 transition">{editingId ? "حفظ التعديلات" : "إضافة التصنيف"}</button>
            <button onClick={() => setModalOpen(false)} className="px-6 bg-white border-2 border-slate-200 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-50 transition">إلغاء</button>
          </div>
        </div>
      </Modal>

      <Toast msg={toast} />
    </>
  );
}
