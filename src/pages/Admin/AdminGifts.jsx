import React, { useEffect, useState } from "react";

/* ============================================================
   AdminGifts.jsx — إدارة الهدايا الداخلية
   الهدايا التي تُفتح داخل تجربة المُهدى إليه
   (خروجة، سينما، كوبونات…) + Modal إضافة/تعديل + ربط بالقوالب
   ============================================================ */
/* ⭐ هذه الصفحة "محتوى فقط" — تُعرض داخل AdminLayout عبر <Outlet />
   القشرة (Sidebar + Topbar + العنوان) تأتي من الـLayout ولا تُستدعى هنا. */



const GIFTS = [
  { id: 1, name: "خروجة نقدية", emoji: "💸", type: "نقدية", desc: "مبلغ مالي يظهر داخل الهدية أثناء فتحها", templates: 12, active: true },
  { id: 2, name: "قسيمة سينما", emoji: "🎬", type: "قسيمة", desc: "تذكرة سينما لشخصين من دور العرض الشريكة", templates: 5, active: true },
  { id: 3, name: "خصم 20%", emoji: "🏷️", type: "كوبون", desc: "كوبون خصم على الطلب القادم للمستلم", templates: 18, active: true },
  { id: 4, name: "قسيمة قهوة", emoji: "☕", type: "قسيمة", desc: "مشروب مجاني من الكافيهات الشريكة", templates: 7, active: true },
  { id: 5, name: "رسالة صوتية", emoji: "🎙️", type: "رسالة", desc: "تسجيل صوتي يُشغَّل داخل الهدية", templates: 9, active: false },
  { id: 6, name: "هدية مفاجئة", emoji: "🎁", type: "أخرى", desc: "صورة مفاجئة تُفتح بعد إرسال رد الشكر", templates: 4, active: true },
];

const GIFT_TYPES = ["نقدية", "قسيمة", "كوبون", "رسالة", "أخرى"];

const TEMPLATE_OPTIONS = [
  "قالب عيد ميلاد — نجوم ذهبية",
  "قالب زفاف — روز جولد",
  "قالب تخرج — قبعة وفش",
  "دعوة زفاف — لافندر",
  "قالب عيد ميلاد — ديناصور",
  "استقبال مولود — نجمة صغيرة",
];

const TYPE_BADGE = {
  "نقدية": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "قسيمة": "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  "كوبون": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  "رسالة": "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  "أخرى": "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

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

/* ===== مفتاح تبديل ===== */
function Toggle({ on, onChange }) {
  return (
    <button type="button" onClick={onChange} role="switch" aria-checked={on} className={`relative w-12 h-7 rounded-full transition-colors duration-300 shrink-0 ${on ? "bg-gradient-to-l from-brand-primary to-brand-secondary" : "bg-slate-300"}`}>
      <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${on ? "left-1" : "right-1"}`} />
    </button>
  );
}

const inputCls = "w-full px-4 py-3 rounded-xl border-2 bg-slate-50 focus:bg-white outline-none transition text-sm font-medium border-slate-200 focus:border-brand-primary";

export default function AdminGifts() {
  const [list, setList] = useState(GIFTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [toast, setToast] = useState(null);

  /* بيانات النموذج */
  const [gName, setGName] = useState("");
  const [gEmoji, setGEmoji] = useState("🎁");
  const [gType, setGType] = useState(GIFT_TYPES[0]);
  const [gDesc, setGDesc] = useState("");
  const [gActive, setGActive] = useState(true);
  const [gTpls, setGTpls] = useState([]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (m) => setToast(m);

  const openAdd = () => {
    setEditingId(null);
    setGName(""); setGEmoji("🎁"); setGType(GIFT_TYPES[0]); setGDesc(""); setGActive(true); setGTpls([]);
    setModalOpen(true);
  };

  const openEdit = (g) => {
    setEditingId(g.id);
    setGName(g.name); setGEmoji(g.emoji); setGType(g.type); setGDesc(g.desc); setGActive(g.active); setGTpls([]);
    setModalOpen(true);
  };

  const saveGift = () => {
    if (!gName.trim()) return showToast("اكتب اسم الهدية أولاً ⚠️");
    if (editingId) {
      setList(list.map((g) => (g.id === editingId ? { ...g, name: gName.trim(), emoji: gEmoji, type: gType, desc: gDesc, active: gActive } : g)));
      showToast("تم تحديث الهدية ✓");
    } else {
      setList([{ id: Date.now(), name: gName.trim(), emoji: gEmoji, type: gType, desc: gDesc, templates: gTpls.length, active: gActive }, ...list]);
      showToast("تمت إضافة الهدية ✓");
    }
    setModalOpen(false);
  };

  const toggleActive = (id) => {
    setList(list.map((g) => (g.id === id ? { ...g, active: !g.active } : g)));
  };

  const doDelete = (id) => {
    const g = list.find((x) => x.id === id);
    setList(list.filter((x) => x.id !== id));
    setConfirmDel(null);
    showToast(`تم حذف «${g ? g.name : ""}» 🗑️`);
  };

  const activeCount = list.filter((g) => g.active).length;

  return (
    <>
      <style>{KEYFRAMES}</style>
      {/* الترويسة + الملخص */}
      <div className="flex flex-wrap items-center justify-between gap-3" style={{ animation: "fadeUp .45s ease both" }}>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">الهدايا الداخلية 🎁</h2>
          <p className="text-sm text-slate-500 mt-1">{list.length} هدية — منها {activeCount} نشطة وتظهر للعملاء</p>
        </div>
        <button onClick={openAdd} className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white text-sm font-bold px-5 py-3 rounded-xl hover:opacity-90 transition shadow-sm">+ إضافة هدية</button>
      </div>

      {/* الشبكة */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
        {list.map((g, i) => (
          <div key={g.id} className={`bg-white rounded-3xl border shadow-sm p-5 transition hover:shadow-md ${g.active ? "border-slate-200/70" : "border-dashed border-slate-300 opacity-80"}`} style={{ animation: `fadeUp .45s ease both ${i * 0.05}s` }}>
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-2xl">{g.emoji}</div>
              <Toggle on={g.active} onChange={() => toggleActive(g.id)} />
            </div>
            <h3 className="font-extrabold text-slate-800 mt-3">{g.name}</h3>
            <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full mt-1.5 ${TYPE_BADGE[g.type]}`}>{g.type}</span>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{g.desc}</p>
            <p className="text-[11px] text-slate-400 font-bold mt-3">🔗 مربوطة بـ {g.templates} قالب</p>
            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-100">
              <button onClick={() => openEdit(g)} className="flex-1 text-xs font-bold py-2.5 rounded-xl bg-violet-50 text-brand-primary hover:bg-violet-100 transition">✏️ تعديل</button>
              {confirmDel === g.id ? (
                <span className="flex-1 flex gap-1.5">
                  <button onClick={() => doDelete(g.id)} className="flex-1 text-xs font-extrabold py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition">تأكيد الحذف</button>
                  <button onClick={() => setConfirmDel(null)} className="text-xs font-bold px-3 py-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition">إلغاء</button>
                </span>
              ) : (
                <button onClick={() => setConfirmDel(g.id)} className="text-xs font-bold py-2.5 px-4 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition">🗑️</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal الإضافة/التعديل */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "تعديل الهدية" : "إضافة هدية جديدة"}>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-[1fr_80px] gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">اسم الهدية *</label>
              <input value={gName} onChange={(e) => setGName(e.target.value)} placeholder="مثال: قسيمة برجر" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">الأيقونة</label>
              <input value={gEmoji} onChange={(e) => setGEmoji(e.target.value)} maxLength="2" className={`${inputCls} text-center text-xl`} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">النوع</label>
            <select value={gType} onChange={(e) => setGType(e.target.value)} className={`${inputCls} cursor-pointer`}>
              {GIFT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">الوصف</label>
            <textarea rows="2" value={gDesc} onChange={(e) => setGDesc(e.target.value)} placeholder="وصف قصير يظهر داخل تجربة الهدية…" className={`${inputCls} resize-none`} />
          </div>
          {!editingId && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">القوالب المرتبطة</label>
              <div className="flex flex-wrap gap-2">
                {TEMPLATE_OPTIONS.map((t) => {
                  const on = gTpls.includes(t);
                  return (
                    <button key={t} type="button" onClick={() => setGTpls(on ? gTpls.filter((x) => x !== t) : [...gTpls, t])} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border-2 transition ${on ? "border-transparent bg-gradient-to-l from-brand-primary to-brand-secondary text-white" : "border-slate-200 text-slate-500 hover:border-brand-primary/50"}`}>
                      {on ? "✓ " : ""}{t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <label className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 cursor-pointer">
            <span className="text-sm font-bold text-slate-700">نشطة وتظهر للعملاء</span>
            <Toggle on={gActive} onChange={() => setGActive(!gActive)} />
          </label>
          <div className="flex gap-2 pt-1">
            <button onClick={saveGift} className="flex-1 bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-bold py-3 rounded-xl hover:opacity-90 transition">{editingId ? "حفظ التعديلات" : "إضافة الهدية"}</button>
            <button onClick={() => setModalOpen(false)} className="px-6 bg-white border-2 border-slate-200 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-50 transition">إلغاء</button>
          </div>
        </div>
      </Modal>

      <Toast msg={toast} />
    </>
  );
}
