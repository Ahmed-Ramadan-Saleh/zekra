import React, { useEffect, useRef, useState } from "react";

/* ============================================================
   AdminFieldsBuilder.jsx — منشئ حقول التخصيص
   واجهة Drag & Drop لترتيب الحقول التي يملؤها العميل
   + إضافة/حذف حقول + مطلوب/اختياري + معاينة حية للنموذج
   ============================================================ */
/* ⭐ هذه الصفحة "محتوى فقط" — تُعرض داخل AdminLayout عبر <Outlet />
   القشرة (Sidebar + Topbar + العنوان) تأتي من الـLayout ولا تُستدعى هنا. */



const TEMPLATES = [
  { id: 1, name: "قالب عيد ميلاد — نجوم ذهبية", emoji: "🎂" },
  { id: 2, name: "قالب زفاف — روز جولد", emoji: "💍" },
  { id: 3, name: "قالب تخرج — قبعة وفش", emoji: "🎓" },
  { id: 4, name: "دعوة زفاف — لافندر", emoji: "✉️" },
];

const FIELD_TYPES = [
  { key: "text", label: "نص قصير", emoji: "🔤" },
  { key: "textarea", label: "نص طويل", emoji: "📃" },
  { key: "number", label: "رقم", emoji: "🔢" },
  { key: "date", label: "تاريخ", emoji: "📅" },
  { key: "photos", label: "صور", emoji: "🖼️" },
  { key: "select", label: "قائمة اختيار", emoji: "📋" },
  { key: "color", label: "لون", emoji: "🎨" },
  { key: "toggle", label: "تشغيل/إيقاف", emoji: "🔀" },
];

const typeMeta = (key) => FIELD_TYPES.find((t) => t.key === key) || FIELD_TYPES[0];

const DEFAULT_FIELDS = [
  { id: "f1", label: "اسم المُهدى إليه", type: "text", required: true },
  { id: "f2", label: "رسالة المُرسل", type: "textarea", required: true },
  { id: "f3", label: "صور المُهدى إليه", type: "photos", required: false },
  { id: "f4", label: "تشغيل الموسيقى تلقائياً", type: "toggle", required: false },
];

const PRESETS = {
  1: [
    { id: "f1", label: "اسم المُهدى إليه", type: "text", required: true },
    { id: "f2", label: "عمر المُهدى إليه", type: "number", required: false },
    { id: "f3", label: "رسالة المُرسل", type: "textarea", required: true },
    { id: "f4", label: "صور المُهدى إليه", type: "photos", required: false },
    { id: "f5", label: "لون الخلفية", type: "color", required: false },
  ],
  2: [
    { id: "f1", label: "أسماء العروسين", type: "text", required: true },
    { id: "f2", label: "تاريخ الزفاف", type: "date", required: true },
    { id: "f3", label: "رسالة العروسين", type: "textarea", required: true },
  ],
};

const KEYFRAMES = `
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { 0% { transform: scale(.85); opacity: 0; } 70% { transform: scale(1.04); } 100% { transform: scale(1); opacity: 1; } }
`;

const GripIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="9" cy="5" r="1.6" /><circle cx="15" cy="5" r="1.6" /><circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" /><circle cx="9" cy="19" r="1.6" /><circle cx="15" cy="19" r="1.6" />
  </svg>
);

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold whitespace-nowrap max-w-[90vw]" style={{ animation: "pop .3s ease both" }}>
      {msg}
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

export default function AdminFieldsBuilder() {
  const [tplId, setTplId] = useState(1);
  const [fields, setFields] = useState(PRESETS[1] || DEFAULT_FIELDS);
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState("text");
  const [newRequired, setNewRequired] = useState(false);
  const [dragOver, setDragOver] = useState(null);
  const [toast, setToast] = useState(null);
  const dragIndex = useRef(null);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (m) => setToast(m);

  const changeTemplate = (id) => {
    setTplId(id);
    setFields(PRESETS[id] || DEFAULT_FIELDS);
    showToast(`تم تحميل حقول: ${TEMPLATES.find((t) => t.id === id).name}`);
  };

  /* السحب والإفلات */
  const onDragStart = (i) => (e) => {
    dragIndex.current = i;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (i) => (e) => {
    e.preventDefault();
    if (dragOver !== i) setDragOver(i);
  };
  const onDrop = (i) => (e) => {
    e.preventDefault();
    const from = dragIndex.current;
    if (from !== null && from !== i) move(from, i);
    dragIndex.current = null;
    setDragOver(null);
  };
  const onDragEnd = () => {
    dragIndex.current = null;
    setDragOver(null);
  };

  /* نقل عنصر (يُستخدم أيضاً كأزرار بديلة للموبايل) */
  const move = (from, to) => {
    setFields((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const arr = [...prev];
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return arr;
    });
  };

  const addField = () => {
    if (!newLabel.trim()) {
      showToast("اكتب عنوان الحقل أولاً ⚠️");
      return;
    }
    setFields([...fields, { id: `f${Date.now()}`, label: newLabel.trim(), type: newType, required: newRequired }]);
    setNewLabel("");
    setNewRequired(false);
    showToast("تمت إضافة الحقل ✓");
  };

  const removeField = (id) => {
    setFields(fields.filter((f) => f.id !== id));
    showToast("تم حذف الحقل 🗑️");
  };

  const saveAll = () => showToast(`تم حفظ ${fields.length} حقول للقالب بنجاح ✓ (تجريبي)`);

  const inputCls = "w-full px-4 py-3 rounded-xl border-2 bg-slate-50 focus:bg-white outline-none transition text-sm font-medium border-slate-200 focus:border-brand-primary";

  /* معاينة حقل حسب نوعه */
  const PreviewField = ({ f }) => {
    const meta = typeMeta(f.type);
    if (f.type === "textarea") return <textarea rows="2" disabled placeholder={f.label} className={`${inputCls} resize-none opacity-70`} />;
    if (f.type === "photos") return <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center text-xs font-bold text-slate-400 bg-slate-50">📷 {f.label} — ارفع الصور هنا</div>;
    if (f.type === "select") return <select disabled className={`${inputCls} opacity-70 cursor-not-allowed`}><option>{f.label}</option><option>الخيار الأول</option><option>الخيار الثاني</option></select>;
    if (f.type === "color") return <div className="flex items-center gap-2"><input type="color" disabled className="w-12 h-10 rounded-lg border border-slate-200 cursor-not-allowed" /><span className="text-xs font-bold text-slate-400">{f.label}</span></div>;
    if (f.type === "toggle") return <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5"><span className="text-xs font-bold text-slate-400">{f.label}</span><Toggle on={false} onChange={() => {}} /></div>;
    return <input type={f.type} disabled placeholder={f.label} className={`${inputCls} opacity-70`} />;
  };

  const requiredCount = fields.filter((f) => f.required).length;

  return (
    <>
      <style>{KEYFRAMES}</style>
      {/* اختيار القالب */}
      <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5" style={{ animation: "fadeUp .45s ease both" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => changeTemplate(t.id)} className={`text-xs font-bold px-3.5 py-2 rounded-xl transition ${tplId === t.id ? "bg-gradient-to-l from-brand-primary to-brand-secondary text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:text-brand-primary"}`}>
                {t.emoji} {t.name}
              </button>
            ))}
          </div>
          <button onClick={saveAll} className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition shadow-sm">💾 حفظ الترتيب</button>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-5 mt-5">
        {/* عمود البناء */}
        <div className="lg:col-span-2 space-y-5">
          {/* إضافة حقل */}
          <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5" style={{ animation: "fadeUp .45s ease both .1s" }}>
            <h2 className="font-extrabold text-slate-800">➕ إضافة حقل جديد</h2>
            <div className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-3 mt-3 items-end">
              <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="عنوان الحقل — مثال: اسم الحيوان الأليف" className={inputCls} />
              <select value={newType} onChange={(e) => setNewType(e.target.value)} className={`${inputCls} cursor-pointer sm:w-44`}>
                {FIELD_TYPES.map((t) => <option key={t.key} value={t.key}>{t.emoji} {t.label}</option>)}
              </select>
              <button onClick={() => setNewRequired(!newRequired)} className={`text-xs font-bold px-3 py-3 rounded-xl border-2 transition ${newRequired ? "border-rose-300 bg-rose-50 text-rose-600" : "border-slate-200 bg-white text-slate-400"}`}>
                {newRequired ? "★ مطلوب" : "☆ اختياري"}
              </button>
              <button onClick={addField} className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white text-sm font-bold px-5 py-3 rounded-xl hover:opacity-90 transition">إضافة</button>
            </div>
          </section>

          {/* قائمة الحقول (سحب وإفلات) */}
          <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5" style={{ animation: "fadeUp .45s ease both .15s" }}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-extrabold text-slate-800">🧩 حقول القالب ({fields.length})</h2>
              <p className="text-[11px] text-slate-400 font-bold">{requiredCount} مطلوب • {fields.length - requiredCount} اختياري — اسحب المقابض ⋮⋮ لإعادة الترتيب</p>
            </div>
            <ul className="mt-4 space-y-3">
              {fields.map((f, i) => {
                const meta = typeMeta(f.type);
                return (
                  <li
                    key={f.id}
                    draggable
                    onDragStart={onDragStart(i)}
                    onDragOver={onDragOver(i)}
                    onDrop={onDrop(i)}
                    onDragEnd={onDragEnd}
                    className={`flex items-center gap-3 bg-white rounded-2xl border-2 p-3.5 transition ${dragOver === i ? "border-brand-primary shadow-lg" : "border-slate-200"}`}
                  >
                    <span className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-brand-primary shrink-0" title="اسحب لإعادة الترتيب"><GripIcon /></span>
                    <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">{meta.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-700 text-sm truncate">{f.label}</p>
                      <p className="text-[11px] text-slate-400">{meta.label} {f.required && <span className="text-rose-500 font-extrabold">• مطلوب</span>}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="تحريك لأعلى" className={`w-8 h-8 rounded-lg text-xs font-bold transition ${i === 0 ? "bg-slate-50 text-slate-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>▲</button>
                      <button onClick={() => move(i, i + 1)} disabled={i === fields.length - 1} aria-label="تحريك لأسفل" className={`w-8 h-8 rounded-lg text-xs font-bold transition ${i === fields.length - 1 ? "bg-slate-50 text-slate-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>▼</button>
                      <button onClick={() => removeField(f.id)} aria-label="حذف الحقل" className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center text-sm transition">🗑️</button>
                    </div>
                  </li>
                );
              })}
              {fields.length === 0 && (
                <li className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-sm font-bold text-slate-400">لم تُضف حقول بعد — أضف حقلك الأول من الأعلى 👆</li>
              )}
            </ul>
          </section>
        </div>

        {/* معاينة حية */}
        <div className="space-y-5">
          <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5 lg:sticky lg:top-20" style={{ animation: "fadeUp .45s ease both .2s" }}>
            <h2 className="font-extrabold text-slate-800">👁️ معاينة نموذج العميل</h2>
            <p className="text-[11px] text-slate-400 mt-1">تعكس الترتيب والإعدادات الحالية</p>
            <div className="space-y-3 mt-4">
              {fields.map((f) => <PreviewField key={f.id} f={f} />)}
              {fields.length === 0 && <p className="text-xs text-slate-400 text-center py-4">لا توجد حقول للمعاينة</p>}
            </div>
            <button className="w-full mt-4 bg-gradient-to-l from-brand-primary to-brand-secondary text-white text-sm font-bold py-3 rounded-xl opacity-80 cursor-default">إرسال التخصيص (معاينة)</button>
          </section>
        </div>
      </div>

      <Toast msg={toast} />
    </>
  );
}
