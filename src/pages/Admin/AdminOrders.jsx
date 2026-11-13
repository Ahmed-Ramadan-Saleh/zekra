import React, { useEffect, useMemo, useState } from "react";

/* ============================================================
   AdminOrders.jsx — إدارة الطلبات
   كل الطلبات + حالة الدفع + حالة الطلب + فلاتر وبحث
   + Modal تفاصيل بإجراءات إدارية (تأكيد الدفع / تسليم الرابط)
   ============================================================ */
/* ⭐ هذه الصفحة "محتوى فقط" — تُعرض داخل AdminLayout عبر <Outlet />
   القشرة (Sidebar + Topbar + العنوان) تأتي من الـLayout ولا تُستدعى هنا. */



const ORDERS = [
  { id: "ORD-2026-1042", customer: "أحمد محمود", product: "قالب عيد ميلاد — نجوم ذهبية", emoji: "🎂", date: "10 نوفمبر 2026", total: 285, pay: "paid", status: "delivered" },
  { id: "ORD-2026-1041", customer: "منى السيد", product: "رسالة حب — قلبان متجاوران", emoji: "❤️", date: "9 نوفمبر 2026", total: 171, pay: "paid", status: "paid" },
  { id: "ORD-2026-1040", customer: "خالد فؤاد", product: "قالب تخرج — قبعة وفش", emoji: "🎓", date: "9 نوفمبر 2026", total: 228, pay: "pending", status: "draft" },
  { id: "ORD-2026-1039", customer: "نور حسن", product: "دعوة زفاف — لافندر", emoji: "✉️", date: "5 نوفمبر 2026", total: 171, pay: "paid", status: "paid" },
  { id: "ORD-2026-1038", customer: "عمر ياسر", product: "قالب زفاف — روز جولد", emoji: "💍", date: "4 نوفمبر 2026", total: 399, pay: "paid", status: "delivered" },
  { id: "ORD-2026-1037", customer: "سلمى طارق", product: "قالب عيد ميلاد — ديناصور", emoji: "🦖", date: "3 نوفمبر 2026", total: 285, pay: "paid", status: "paid" },
  { id: "ORD-2026-1036", customer: "يوسف عادل", product: "قالب تخرج — قبعة وفش", emoji: "🎓", date: "1 نوفمبر 2026", total: 228, pay: "pending", status: "draft" },
  { id: "ORD-2026-1035", customer: "هدى سمير", product: "استقبال مولود — نجمة صغيرة", emoji: "👶", date: "30 أكتوبر 2026", total: 228, pay: "paid", status: "paid" },
  { id: "ORD-2026-1034", customer: "كريم رمزي", product: "بطاقة شكر — شكراً من القلب", emoji: "🙏", date: "28 أكتوبر 2026", total: 171, pay: "refunded", status: "canceled" },
  { id: "ORD-2026-1033", customer: "لمى أشرف", product: "دعوة حفل خطوبة — لمعة ذهبية", emoji: "✨", date: "26 أكتوبر 2026", total: 171, pay: "paid", status: "paid" },
];

const PAY_LABEL = { paid: "✓ مدفوع", pending: "بانتظار الدفع", refunded: "مسترجع" };
const PAY_BADGE = {
  paid: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  refunded: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};
const STATUS_LABEL = { delivered: "تم التسليم", paid: "قيد التجهيز", draft: "مسودة", canceled: "ملغي" };
const STATUS_BADGE = {
  delivered: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  paid: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  draft: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  canceled: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

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

export default function AdminOrders() {
  const [list, setList] = useState(ORDERS);
  const [statusFilter, setStatusFilter] = useState("all");
  const [payFilter, setPayFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (m) => setToast(m);

  const counts = useMemo(() => ({
    all: list.length,
    pendingPay: list.filter((o) => o.pay === "pending").length,
    readyShip: list.filter((o) => o.status === "paid").length,
    delivered: list.filter((o) => o.status === "delivered").length,
  }), [list]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((o) => {
      const okS = statusFilter === "all" || o.status === statusFilter;
      const okP = payFilter === "all" || o.pay === payFilter;
      const okQ = !q || o.id.toLowerCase().includes(q) || o.customer.includes(query.trim()) || o.product.includes(query.trim());
      return okS && okP && okQ;
    });
  }, [list, statusFilter, payFilter, query]);

  /* إجراءات إدارية حقيقية على الـ Mock */
  const confirmPayment = (id) => {
    setList(list.map((o) => (o.id === id ? { ...o, pay: "paid", status: o.status === "draft" ? "paid" : o.status } : o)));
    setDetail(null);
    showToast("تم تأكيد الدفع — الطلب الآن قيد التجهيز ✓");
  };

  const deliverGift = (id) => {
    setList(list.map((o) => (o.id === id ? { ...o, status: "delivered" } : o)));
    setDetail(null);
    showToast("تم تسليم رابط الهدية للعميل ✓");
  };

  const STATUS_TABS = [
    { key: "all", label: "الكل" },
    { key: "paid", label: "قيد التجهيز" },
    { key: "delivered", label: "تم التسليم" },
    { key: "draft", label: "مسودات" },
    { key: "canceled", label: "ملغي" },
  ];

  return (
    <>
      <style>{KEYFRAMES}</style>
      {/* ملخصات سريعة */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ animation: "fadeUp .45s ease both" }}>
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-slate-800">{counts.all}</p>
          <p className="text-xs text-slate-400 font-bold mt-0.5">آخر الطلبات المعروضة</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-amber-500">{counts.pendingPay}</p>
          <p className="text-xs text-slate-400 font-bold mt-0.5">بانتظار الدفع</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-violet-600">{counts.readyShip}</p>
          <p className="text-xs text-slate-400 font-bold mt-0.5">جاهزة للتسليم</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-emerald-600">{counts.delivered}</p>
          <p className="text-xs text-slate-400 font-bold mt-0.5">تم التسليم</p>
        </div>
      </div>

      {/* البحث والفلاتر */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 mt-5 space-y-3" style={{ animation: "fadeUp .45s ease both .1s" }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث برقم الطلب أو اسم العميل أو القالب…" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-sm font-medium outline-none focus:border-brand-primary transition" />
          </div>
          <select value={payFilter} onChange={(e) => setPayFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-brand-primary cursor-pointer">
            <option value="all">كل حالات الدفع</option>
            <option value="paid">مدفوع</option>
            <option value="pending">بانتظار الدفع</option>
            <option value="refunded">مسترجع</option>
          </select>
        </div>
        <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {STATUS_TABS.map((t) => (
            <button key={t.key} onClick={() => setStatusFilter(t.key)} className={`text-xs font-bold px-3.5 py-2 rounded-lg whitespace-nowrap transition ${statusFilter === t.key ? "bg-gradient-to-l from-brand-primary to-brand-secondary text-white shadow-sm" : "bg-slate-50 text-slate-500 hover:text-brand-primary"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* جدول الطلبات */}
      <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm mt-5 overflow-hidden" style={{ animation: "fadeUp .45s ease both .15s" }}>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="text-right text-[11px] text-slate-400 font-bold bg-slate-50">
                <th className="px-5 py-3">رقم الطلب</th>
                <th className="px-5 py-3">العميل</th>
                <th className="px-5 py-3">القالب</th>
                <th className="px-5 py-3">التاريخ</th>
                <th className="px-5 py-3">الإجمالي</th>
                <th className="px-5 py-3">الدفع</th>
                <th className="px-5 py-3">الحالة</th>
                <th className="px-5 py-3">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5 font-bold text-slate-700" dir="ltr">{o.id}</td>
                  <td className="px-5 py-3.5 text-slate-600">{o.customer}</td>
                  <td className="px-5 py-3.5 text-slate-600">{o.emoji} {o.product}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">{o.date}</td>
                  <td className="px-5 py-3.5 font-extrabold text-slate-700 whitespace-nowrap">{o.total} ج.م</td>
                  <td className="px-5 py-3.5"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${PAY_BADGE[o.pay]}`}>{PAY_LABEL[o.pay]}</span></td>
                  <td className="px-5 py-3.5"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_BADGE[o.status]}`}>{STATUS_LABEL[o.status]}</span></td>
                  <td className="px-5 py-3.5"><button onClick={() => setDetail(o)} className="text-xs font-bold text-brand-primary hover:underline whitespace-nowrap">تفاصيل</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* كروت — موبايل */}
        <div className="md:hidden divide-y divide-slate-100">
          {filtered.map((o) => (
            <button key={o.id} onClick={() => setDetail(o)} className="w-full text-right p-4 hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-lg shrink-0">{o.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-700 text-sm truncate">{o.customer}</p>
                  <p className="text-[11px] text-slate-400" dir="ltr">{o.id}</p>
                </div>
                <div className="text-left shrink-0">
                  <p className="text-sm font-extrabold text-slate-700">{o.total} ج.م</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PAY_BADGE[o.pay]}`}>{PAY_LABEL[o.pay]}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <span className="text-4xl">🔍</span>
            <p className="font-extrabold text-slate-600 mt-3">لا توجد طلبات مطابقة</p>
            <button onClick={() => { setQuery(""); setStatusFilter("all"); setPayFilter("all"); }} className="mt-3 text-sm font-bold text-brand-primary hover:underline">مسح البحث والفلاتر</button>
          </div>
        )}
      </section>

      {/* Modal تفاصيل الطلب */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail ? `تفاصيل الطلب ${detail.id}` : ""}>
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-3xl">{detail.emoji}</div>
              <div className="min-w-0">
                <p className="font-extrabold text-slate-800 text-sm">{detail.product}</p>
                <p className="text-xs text-slate-400 mt-0.5">{detail.date}</p>
              </div>
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">العميل</dt><dd className="font-bold text-slate-700">{detail.customer}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">الإجمالي (شامل الضريبة 14%)</dt><dd className="font-extrabold text-brand-primary">{detail.total} ج.م</dd></div>
              <div className="flex justify-between items-center"><dt className="text-slate-500">حالة الدفع</dt><dd><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${PAY_BADGE[detail.pay]}`}>{PAY_LABEL[detail.pay]}</span></dd></div>
              <div className="flex justify-between items-center"><dt className="text-slate-500">حالة الطلب</dt><dd><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_BADGE[detail.status]}`}>{STATUS_LABEL[detail.status]}</span></dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">رابط الهدية</dt><dd className="font-bold text-slate-700">{detail.status === "delivered" ? "🔗 تم إنشاؤه ومُسليم" : "⏳ يُنشأ بعد التجهيز"}</dd></div>
            </dl>
            <div className="flex flex-col gap-2 pt-2">
              {detail.pay !== "paid" && detail.pay === "pending" && (
                <button onClick={() => confirmPayment(detail.id)} className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-bold py-3 rounded-xl hover:opacity-90 transition">✓ تأكيد استلام الدفع</button>
              )}
              {detail.pay === "paid" && detail.status !== "delivered" && (
                <button onClick={() => deliverGift(detail.id)} className="bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition">🔗 تسليم رابط الهدية للعميل</button>
              )}
              <button onClick={() => setDetail(null)} className="bg-white border-2 border-slate-200 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-50 transition">إغلاق</button>
            </div>
          </div>
        )}
      </Modal>

      <Toast msg={toast} />
    </>
  );
}
