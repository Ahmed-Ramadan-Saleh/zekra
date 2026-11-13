import React, { useEffect, useMemo, useState } from "react";

/* ============================================================
   AdminCoupons.jsx — إدارة الكوبونات والخصومات
   إنشاء كوبونات (نسبة / مبلغ ثابت) + حد استخدام + مدة
   + نسخ الكود + تقدم الاستخدام + إيقاف/تشغيل
   ============================================================ */
/* ⭐ هذه الصفحة "محتوى فقط" — تُعرض داخل AdminLayout عبر <Outlet />
   القشرة (Sidebar + Topbar + العنوان) تأتي من الـLayout ولا تُستدعى هنا. */



const COUPONS = [
  { id: 1, code: "LOVE15", type: "percent", value: 15, used: 34, limit: 100, expires: "30 نوفمبر 2026", active: true, minOrder: 200 },
  { id: 2, code: "GRAD10", type: "percent", value: 10, used: 12, limit: 50, expires: "15 ديسمبر 2026", active: true, minOrder: 150 },
  { id: 3, code: "WELCOME", type: "fixed", value: 25, used: 87, limit: 200, expires: "لا ينتهي", active: true, minOrder: 100 },
  { id: 4, code: "EID50", type: "fixed", value: 50, used: 64, limit: 64, expires: "20 أكتوبر 2026", active: false, minOrder: 300 },
  { id: 5, code: "BIRTH8", type: "percent", value: 8, used: 21, limit: 80, expires: "31 ديسمبر 2026", active: true, minOrder: 0 },
];

const KEYFRAMES = `
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { 0% { transform: scale(.85); opacity: 0; } 70% { transform: scale(1.04); } 100% { transform: scale(1); opacity: 1; } }
`;

const CopyIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
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

export default function AdminCoupons() {
  const [list, setList] = useState(COUPONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState(null);

  const [cCode, setCCode] = useState("");
  const [cType, setCType] = useState("percent");
  const [cValue, setCValue] = useState("10");
  const [cMin, setCMin] = useState("0");
  const [cLimit, setCLimit] = useState("100");
  const [cExpires, setCExpires] = useState("31 ديسمبر 2026");
  const [cActive, setCActive] = useState(true);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (m) => setToast(m);

  const stats = useMemo(() => ({
    active: list.filter((c) => c.active).length,
    used: list.reduce((s, c) => s + c.used, 0),
    full: list.filter((c) => c.used >= c.limit).length,
  }), [list]);

  const openAdd = () => {
    setEditingId(null);
    setCCode(""); setCType("percent"); setCValue("10"); setCMin("0"); setCLimit("100"); setCExpires("31 ديسمبر 2026"); setCActive(true);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setCCode(c.code); setCType(c.type); setCValue(String(c.value)); setCMin(String(c.minOrder)); setCLimit(String(c.limit)); setCExpires(c.expires); setCActive(c.active);
    setModalOpen(true);
  };

  const saveCoupon = () => {
    const code = cCode.trim().toUpperCase();
    if (!/^[A-Z0-9]{3,15}$/.test(code)) return showToast("الكود: حروف إنجليزية كبيرة/أرقام (3-15) ⚠️");
    const val = parseFloat(cValue) || 0;
    if (val <= 0) return showToast("أدخل قيمة الخصم ⚠️");
    const payload = { code, type: cType, value: val, minOrder: parseFloat(cMin) || 0, limit: parseInt(cLimit, 10) || 0, expires: cExpires.trim() || "لا ينتهي", active: cActive };
    if (editingId) {
      setList(list.map((c) => (c.id === editingId ? { ...c, ...payload } : c)));
      showToast(`تم تحديث الكوبون ${code} ✓`);
    } else {
      setList([{ id: Date.now(), used: 0, ...payload }, ...list]);
      showToast(`تم إنشاء الكوبون ${code} ✓`);
    }
    setModalOpen(false);
  };

  const copyCode = (code, id) => {
    try { if (navigator.clipboard) navigator.clipboard.writeText(code); } catch (e) { /* تجاهل */ }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
    showToast(`تم نسخ الكود ${code} ✓`);
  };

  const toggleActive = (id) => setList(list.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));

  const doDelete = (id) => {
    const c = list.find((x) => x.id === id);
    setList(list.filter((x) => x.id !== id));
    setConfirmDel(null);
    showToast(`تم حذف الكوبون ${c ? c.code : ""} 🗑️`);
  };

  /* حالة الكوبون */
  const stateOf = (c) => {
    if (!c.active) return { label: "موقوف", cls: "bg-slate-100 text-slate-500 ring-1 ring-slate-200" };
    if (c.limit > 0 && c.used >= c.limit) return { label: "وصل الحد", cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" };
    return { label: "نشط", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" };
  };

  return (
    <>
      <style>{KEYFRAMES}</style>
      {/* الترويسة + الملخصات */}
      <div className="flex flex-wrap items-center justify-between gap-3" style={{ animation: "fadeUp .45s ease both" }}>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">الكوبونات 🏷️</h2>
          <p className="text-sm text-slate-500 mt-1">{list.length} كوبون — {stats.active} نشط — استُخدم {stats.used} مرة</p>
        </div>
        <button onClick={openAdd} className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white text-sm font-bold px-5 py-3 rounded-xl hover:opacity-90 transition shadow-sm">+ كوبون جديد</button>
      </div>

      {/* القائمة */}
      <div className="space-y-3 mt-5">
        {list.map((c, i) => {
          const st = stateOf(c);
          const pct = c.limit > 0 ? Math.min(100, Math.round((c.used / c.limit) * 100)) : 0;
          const copied = copiedId === c.id;
          return (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 sm:p-5" style={{ animation: `fadeUp .4s ease both ${i * 0.05}s` }}>
              <div className="flex flex-wrap items-center gap-3">
                {/* الكود + نسخ */}
                <button onClick={() => copyCode(c.code, c.id)} title="نسخ الكود" className={`flex items-center gap-2 font-extrabold text-sm px-4 py-2.5 rounded-xl border-2 border-dashed transition ${copied ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-300 bg-slate-50 text-slate-700 hover:border-brand-primary hover:text-brand-primary"}`} dir="ltr">
                  <CopyIcon className="w-4 h-4" /> {c.code}
                </button>

                {/* القيمة */}
                <span className="text-sm font-extrabold text-brand-secondary">
                  {c.type === "percent" ? `خصم ${c.value}%` : `خصم ${c.value} ج.م`}
                </span>
                <span className="text-xs text-slate-400 font-bold">{c.minOrder > 0 ? `حد أدنى ${c.minOrder} ج.م` : "بدون حد أدنى"}</span>

                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${st.cls}`}>{st.label}</span>

                <div className="flex items-center gap-1.5 mr-auto">
                  <button onClick={() => openEdit(c)} className="text-xs font-bold px-3.5 py-2 rounded-xl bg-violet-50 text-brand-primary hover:bg-violet-100 transition">✏️ تعديل</button>
                  {confirmDel === c.id ? (
                    <button onClick={() => doDelete(c.id)} className="text-xs font-extrabold px-3.5 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition">تأكيد؟</button>
                  ) : (
                    <button onClick={() => setConfirmDel(c.id)} className="text-xs font-bold px-3 py-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition">🗑️</button>
                  )}
                  <Toggle on={c.active} onChange={() => toggleActive(c.id)} />
                </div>
              </div>

              {/* الاستخدام والمدة */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3.5">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>الاستخدام: {c.used} / {c.limit > 0 ? c.limit : "∞"}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${pct >= 100 ? "bg-amber-500" : "bg-gradient-to-l from-brand-primary to-brand-secondary"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-bold whitespace-nowrap">⏳ ينتهي: {c.expires}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal الكوبون */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "تعديل الكوبون" : "إنشاء كوبون جديد"}>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">الكود *</label>
              <input dir="ltr" value={cCode} onChange={(e) => setCCode(e.target.value.toUpperCase())} placeholder="SUMMER20" className={`${inputCls} text-left tracking-wider font-bold`} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">نوع الخصم</label>
              <select value={cType} onChange={(e) => setCType(e.target.value)} className={`${inputCls} cursor-pointer`}>
                <option value="percent">نسبة مئوية %</option>
                <option value="fixed">مبلغ ثابت ج.م</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">قيمة الخصم *</label>
              <input type="number" min="1" value={cValue} onChange={(e) => setCValue(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">الحد الأدنى للطلب (ج.م)</label>
              <input type="number" min="0" value={cMin} onChange={(e) => setCMin(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">حد الاستخدام</label>
              <input type="number" min="1" value={cLimit} onChange={(e) => setCLimit(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">تاريخ الانتهاء</label>
              <input value={cExpires} onChange={(e) => setCExpires(e.target.value)} placeholder="اتركه فارغاً لعدم الانتهاء" className={inputCls} />
            </div>
          </div>
          <label className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 cursor-pointer">
            <span className="text-sm font-bold text-slate-700">نشط ويمكن استخدامه الآن</span>
            <Toggle on={cActive} onChange={() => setCActive(!cActive)} />
          </label>
          <div className="flex gap-2 pt-1">
            <button onClick={saveCoupon} className="flex-1 bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-bold py-3 rounded-xl hover:opacity-90 transition">{editingId ? "حفظ التعديلات" : "إنشاء الكوبون"}</button>
            <button onClick={() => setModalOpen(false)} className="px-6 bg-white border-2 border-slate-200 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-50 transition">إلغاء</button>
          </div>
        </div>
      </Modal>

      <Toast msg={toast} />
    </>
  );
}
