import React, { useEffect, useMemo, useState } from "react";

/* ============================================================
   AdminProducts.jsx — إدارة المنتجات والقوالب
   جدول المنتجات + بحث وفلاتر + إضافة/تعديل/تكرار/حذف (بتأكيد)
   ============================================================ */
/* ⭐ هذه الصفحة "محتوى فقط" — تُعرض داخل AdminLayout عبر <Outlet />
   القشرة (Sidebar + Topbar + العنوان) تأتي من الـLayout ولا تُستدعى هنا. */



const PRODUCTS = [
  { id: 1, name: "قالب عيد ميلاد — نجوم ذهبية", emoji: "🎂", category: "أعياد ميلاد", price: 250, sales: 86, status: "published", updatedAt: "10 نوفمبر 2026" },
  { id: 2, name: "قالب زفاف — روز جولد", emoji: "💍", category: "زواج", price: 350, sales: 64, status: "published", updatedAt: "8 نوفمبر 2026" },
  { id: 3, name: "قالب تخرج — قبعة وفش", emoji: "🎓", category: "تخرج", price: 200, sales: 51, status: "published", updatedAt: "5 نوفمبر 2026" },
  { id: 4, name: "دعوة زفاف — لافندر", emoji: "✉️", category: "دعوات", price: 150, sales: 47, status: "published", updatedAt: "3 نوفمبر 2026" },
  { id: 5, name: "قالب عيد ميلاد — ديناصور", emoji: "🦖", category: "أعياد ميلاد", price: 250, sales: 39, status: "published", updatedAt: "1 نوفمبر 2026" },
  { id: 6, name: "رسالة حب — قلبان متجاوران", emoji: "❤️", category: "رسائل حب", price: 150, sales: 28, status: "draft", updatedAt: "28 أكتوبر 2026" },
  { id: 7, name: "بطاقة شكر — شكراً من القلب", emoji: "🙏", category: "شكر وتقدير", price: 150, sales: 0, status: "draft", updatedAt: "25 أكتوبر 2026" },
  { id: 8, name: "استقبال مولود — نجمة صغيرة", emoji: "👶", category: "مولود جديد", price: 200, sales: 22, status: "published", updatedAt: "20 أكتوبر 2026" },
];

const STATUS_META = {
  published: { label: "منشور", badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  draft: { label: "مسودة", badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
};

const TOTAL_IN_STORE = 42; // إجمالي منتجات المتجر (يُجلب من API)

const KEYFRAMES = `
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { 0% { transform: scale(.85); opacity: 0; } 70% { transform: scale(1.04); } 100% { transform: scale(1); opacity: 1; } }
`;

const SearchIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
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

export default function AdminProducts() {
  const [list, setList] = useState(PRODUCTS);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [confirmDel, setConfirmDel] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const cats = useMemo(() => [...new Set(PRODUCTS.map((p) => p.category))], []);

  const filtered = useMemo(() => {
    const q = query.trim();
    return list.filter((p) => {
      const okQ = !q || p.name.includes(q);
      const okC = cat === "all" || p.category === cat;
      const okS = status === "all" || p.status === status;
      return okQ && okC && okS;
    });
  }, [list, query, cat, status]);

  const stats = useMemo(() => ({
    published: list.filter((p) => p.status === "published").length,
    draft: list.filter((p) => p.status === "draft").length,
  }), [list]);

  const showToast = (m) => setToast(m);

  const duplicate = (p) => {
    setList((prev) => [{ ...p, id: Date.now(), name: `${p.name} (نسخة)`, status: "draft", sales: 0 }, ...prev]);
    showToast(`تم تكرار «${p.name}» كمسودة ✓`);
  };

  const doDelete = (id) => {
    const p = list.find((x) => x.id === id);
    setList((prev) => prev.filter((x) => x.id !== id));
    setConfirmDel(null);
    showToast(`تم حذف «${p ? p.name : ""}» 🗑️`);
  };

  /* أزرار الإجراءات لكل صف/كارت */
  const Actions = ({ p }) => (
    <div className="flex items-center gap-1.5">
      <a href={`/admin/products/${p.id}/edit`} title="تعديل" className="w-8 h-8 rounded-lg bg-violet-50 text-brand-primary hover:bg-violet-100 flex items-center justify-center transition">✏️</a>
      <button onClick={() => duplicate(p)} title="تكرار كمسودة" className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition">⧉</button>
      {confirmDel === p.id ? (
        <span className="flex items-center gap-1">
          <button onClick={() => doDelete(p.id)} className="text-[11px] font-extrabold px-2.5 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition">تأكيد</button>
          <button onClick={() => setConfirmDel(null)} className="text-[11px] font-bold px-2 py-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition">إلغاء</button>
        </span>
      ) : (
        <button onClick={() => setConfirmDel(p.id)} title="حذف" className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition">🗑️</button>
      )}
    </div>
  );

  return (
    <>
      <style>{KEYFRAMES}</style>
      {/* الترويسة + زر الإضافة */}
      <div className="flex flex-wrap items-center justify-between gap-3" style={{ animation: "fadeUp .45s ease both" }}>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">المنتجات والقوالب 🛍️</h2>
          <p className="text-sm text-slate-500 mt-1">يُعرض {list.length} منتج من إجمالي {TOTAL_IN_STORE} في المتجر</p>
        </div>
        <a href="/admin/products/new" className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white text-sm font-bold px-5 py-3 rounded-xl hover:opacity-90 transition shadow-sm">+ منتج جديد</a>
      </div>

      {/* ملخصات */}
      <div className="grid grid-cols-3 gap-3 mt-5" style={{ animation: "fadeUp .45s ease both .1s" }}>
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-slate-800">{list.length}</p>
          <p className="text-xs text-slate-400 font-bold mt-0.5">إجمالي المعروض</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-emerald-600">{stats.published}</p>
          <p className="text-xs text-slate-400 font-bold mt-0.5">منشور</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-amber-500">{stats.draft}</p>
          <p className="text-xs text-slate-400 font-bold mt-0.5">مسودة</p>
        </div>
      </div>

      {/* البحث والفلاتر */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 mt-5 flex flex-col sm:flex-row gap-3" style={{ animation: "fadeUp .45s ease both .15s" }}>
        <div className="relative flex-1">
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث باسم القالب…" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-sm font-medium outline-none focus:border-brand-primary transition" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-brand-primary cursor-pointer">
          <option value="all">كل التصنيفات</option>
          {cats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
          {[["all", "الكل"], ["published", "منشور"], ["draft", "مسودة"]].map(([k, l]) => (
            <button key={k} onClick={() => setStatus(k)} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${status === k ? "bg-gradient-to-l from-brand-primary to-brand-secondary text-white" : "text-slate-500 hover:text-brand-primary"}`}>{l}</button>
          ))}
        </div>
      </div>

      {/* جدول — سطح المكتب */}
      <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm mt-5 overflow-hidden" style={{ animation: "fadeUp .45s ease both .2s" }}>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-right text-[11px] text-slate-400 font-bold bg-slate-50">
                <th className="px-5 py-3">المنتج</th>
                <th className="px-5 py-3">التصنيف</th>
                <th className="px-5 py-3">السعر</th>
                <th className="px-5 py-3">المبيعات</th>
                <th className="px-5 py-3">الحالة</th>
                <th className="px-5 py-3">آخر تحديث</th>
                <th className="px-5 py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-xl shrink-0">{p.emoji}</div>
                      <span className="font-bold text-slate-700">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{p.category}</td>
                  <td className="px-5 py-3.5 font-extrabold text-slate-700 whitespace-nowrap">{p.price} ج.م</td>
                  <td className="px-5 py-3.5 text-slate-500">{p.sales}</td>
                  <td className="px-5 py-3.5"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_META[p.status].badge}`}>{STATUS_META[p.status].label}</span></td>
                  <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">{p.updatedAt}</td>
                  <td className="px-5 py-3.5"><Actions p={p} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* كروت — موبايل */}
        <div className="md:hidden divide-y divide-slate-100">
          {filtered.map((p) => (
            <div key={p.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-xl shrink-0">{p.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-700 text-sm">{p.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{p.category} • {p.updatedAt}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm font-extrabold text-slate-700">{p.price} ج.م</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_META[p.status].badge}`}>{STATUS_META[p.status].label}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3"><Actions p={p} /></div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <span className="text-4xl">🔍</span>
            <p className="font-extrabold text-slate-600 mt-3">لا توجد منتجات مطابقة</p>
            <button onClick={() => { setQuery(""); setCat("all"); setStatus("all"); }} className="mt-3 text-sm font-bold text-brand-primary hover:underline">مسح البحث والفلاتر</button>
          </div>
        )}
      </section>

      {/* ترقيم الصفحات (تجريبي) */}
      <div className="flex items-center justify-center gap-1.5 mt-5" style={{ animation: "fadeUp .45s ease both .25s" }}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button key={n} className={`w-9 h-9 rounded-xl text-sm font-bold transition ${n === 1 ? "bg-gradient-to-l from-brand-primary to-brand-secondary text-white shadow-sm" : "bg-white border border-slate-200 text-slate-500 hover:border-brand-primary/50"}`}>{n}</button>
        ))}
        <span className="text-xs text-slate-400 font-bold mr-2">صفحة 1 من 6 — ترقيم تجريبي</span>
      </div>

      <Toast msg={toast} />
    </>
  );
}
