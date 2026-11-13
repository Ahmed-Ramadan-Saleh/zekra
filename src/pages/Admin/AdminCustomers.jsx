import React, { useEffect, useMemo, useState } from "react";

/* ============================================================
   AdminCustomers.jsx — إدارة العملاء
   بيانات العملاء + بحث وترتيب + سجل المشتريات في Modal
   ============================================================ */
/* ⭐ هذه الصفحة "محتوى فقط" — تُعرض داخل AdminLayout عبر <Outlet />
   القشرة (Sidebar + Topbar + العنوان) تأتي من الـLayout ولا تُستدعى هنا. */



const CUSTOMERS = [
  { id: 1, name: "أحمد محمود", email: "ahmed.mahmoud@gmail.com", phone: "01001234567", city: "القاهرة", orders: 6, spent: 1254, joined: "مارس 2025", active: true },
  { id: 2, name: "نور حسن", email: "nour.hassan@gmail.com", phone: "01122334455", city: "القاهرة", orders: 4, spent: 813, joined: "يناير 2026", active: true },
  { id: 3, name: "هدى سمير", email: "hoda.samir@yahoo.com", phone: "01277889900", city: "طنطا", orders: 5, spent: 1096, joined: "فبراير 2025", active: true },
  { id: 4, name: "منى السيد", email: "mona.elsayed@gmail.com", phone: "01055667788", city: "الإسكندرية", orders: 3, spent: 456, joined: "يوليو 2025", active: true },
  { id: 5, name: "عمر ياسر", email: "omar.yasser@outlook.com", phone: "01544332211", city: "المنصورة", orders: 2, spent: 399, joined: "سبتمبر 2026", active: true },
  { id: 6, name: "خالد فؤاد", email: "khaled.fouad@gmail.com", phone: "01199887766", city: "الجيزة", orders: 2, spent: 228, joined: "أكتوبر 2026", active: true },
  { id: 7, name: "سلمى طارق", email: "salma.tarek@gmail.com", phone: "01234567890", city: "القاهرة", orders: 1, spent: 285, joined: "نوفمبر 2026", active: true },
  { id: 8, name: "كريم رمزي", email: "karim.ramzy@yahoo.com", phone: "01011223344", city: "أسيوط", orders: 1, spent: 0, joined: "نوفمبر 2026", active: false },
];

/* آخر مشتريات مبسطة لكل عميل (تجريبي) */
const RECENT = {
  1: [
    { id: "ORD-2026-1042", emoji: "🎂", product: "قالب عيد ميلاد — نجوم ذهبية", total: 285, date: "10 نوفمبر" },
    { id: "ORD-2026-1036", emoji: "🎓", product: "قالب تخرج — قبعة وفش", total: 228, date: "1 نوفمبر" },
    { id: "ORD-2026-1039", emoji: "✉️", product: "دعوة زفاف — لافندر", total: 171, date: "5 نوفمبر" },
  ],
  2: [
    { id: "ORD-2026-1039", emoji: "✉️", product: "دعوة زفاف — لافندر", total: 171, date: "5 نوفمبر" },
    { id: "ORD-2026-1033", emoji: "✨", product: "دعوة حفل خطوبة — لمعة ذهبية", total: 171, date: "26 أكتوبر" },
  ],
  3: [
    { id: "ORD-2026-1035", emoji: "👶", product: "استقبال مولود — نجمة صغيرة", total: 228, date: "30 أكتوبر" },
  ],
  4: [
    { id: "ORD-2026-1041", emoji: "❤️", product: "رسالة حب — قلبان متجاوران", total: 171, date: "9 نوفمبر" },
  ],
  5: [
    { id: "ORD-2026-1038", emoji: "💍", product: "قالب زفاف — روز جولد", total: 399, date: "4 نوفمبر" },
  ],
  6: [
    { id: "ORD-2026-1040", emoji: "🎓", product: "قالب تخرج — قبعة وفش", total: 228, date: "9 نوفمبر" },
  ],
  7: [
    { id: "ORD-2026-1037", emoji: "🦖", product: "قالب عيد ميلاد — ديناصور", total: 285, date: "3 نوفمبر" },
  ],
  8: [],
};

const initialsOf = (name) => name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("");

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

export default function AdminCustomers() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("joined");
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (m) => setToast(m);

  const filtered = useMemo(() => {
    const q = query.trim();
    let arr = CUSTOMERS.filter((c) => !q || c.name.includes(q) || c.email.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q));
    if (sort === "spent") arr = [...arr].sort((a, b) => b.spent - a.spent);
    if (sort === "orders") arr = [...arr].sort((a, b) => b.orders - a.orders);
    return arr;
  }, [query, sort]);

  const stats = useMemo(() => ({
    total: 1204,
    newThisMonth: 87,
    active: CUSTOMERS.filter((c) => c.active).length,
    topSpent: Math.max(...CUSTOMERS.map((c) => c.spent)),
  }), []);

  return (
    <>
      <style>{KEYFRAMES}</style>
      {/* ملخصات */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ animation: "fadeUp .45s ease both" }}>
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-slate-800">{stats.total.toLocaleString("en-US")}</p>
          <p className="text-xs text-slate-400 font-bold mt-0.5">إجمالي عملاء المنصة</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-emerald-600">+{stats.newThisMonth}</p>
          <p className="text-xs text-slate-400 font-bold mt-0.5">عميل جديد هذا الشهر</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-violet-600">{stats.active}</p>
          <p className="text-xs text-slate-400 font-bold mt-0.5">حسابات نشطة (في العينة)</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 text-center">
          <p className="text-2xl font-extrabold text-brand-secondary">{stats.topSpent.toLocaleString("en-US")} ج.م</p>
          <p className="text-xs text-slate-400 font-bold mt-0.5">أعلى إنفاق فردي</p>
        </div>
      </div>

      {/* البحث والترتيب */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 mt-5 flex flex-col sm:flex-row gap-3" style={{ animation: "fadeUp .45s ease both .1s" }}>
        <div className="relative flex-1">
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث بالاسم أو البريد أو الموبايل…" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-sm font-medium outline-none focus:border-brand-primary transition" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-brand-primary cursor-pointer">
          <option value="joined">الأحدث انضماماً</option>
          <option value="spent">الأكثر إنفاقاً</option>
          <option value="orders">الأكثر طلبات</option>
        </select>
      </div>

      {/* جدول العملاء */}
      <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm mt-5 overflow-hidden" style={{ animation: "fadeUp .45s ease both .15s" }}>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-right text-[11px] text-slate-400 font-bold bg-slate-50">
                <th className="px-5 py-3">العميل</th>
                <th className="px-5 py-3">الموبايل</th>
                <th className="px-5 py-3">المدينة</th>
                <th className="px-5 py-3">الطلبات</th>
                <th className="px-5 py-3">إجمالي الإنفاق</th>
                <th className="px-5 py-3">انضم</th>
                <th className="px-5 py-3">الحالة</th>
                <th className="px-5 py-3">سجل المشتريات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary text-white text-xs font-extrabold flex items-center justify-center shrink-0">{initialsOf(c.name)}</div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-700 whitespace-nowrap">{c.name}</p>
                        <p className="text-[11px] text-slate-400 truncate" dir="ltr">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500" dir="ltr">{c.phone}</td>
                  <td className="px-5 py-3.5 text-slate-500">{c.city}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-700">{c.orders}</td>
                  <td className="px-5 py-3.5 font-extrabold text-slate-700 whitespace-nowrap">{c.spent.toLocaleString("en-US")} ج.م</td>
                  <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">{c.joined}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${c.active ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"}`}>
                      {c.active ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5"><button onClick={() => setDetail(c)} className="text-xs font-bold text-brand-primary hover:underline whitespace-nowrap">عرض السجل</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* كروت — موبايل */}
        <div className="md:hidden divide-y divide-slate-100">
          {filtered.map((c) => (
            <button key={c.id} onClick={() => setDetail(c)} className="w-full text-right p-4 hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary text-white text-xs font-extrabold flex items-center justify-center shrink-0">{initialsOf(c.name)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-700 text-sm">{c.name}</p>
                  <p className="text-[11px] text-slate-400 truncate" dir="ltr">{c.email}</p>
                </div>
                <div className="text-left shrink-0">
                  <p className="text-sm font-extrabold text-slate-700">{c.spent.toLocaleString("en-US")} ج.م</p>
                  <p className="text-[11px] text-slate-400">{c.orders} طلبات</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <span className="text-4xl">🔍</span>
            <p className="font-extrabold text-slate-600 mt-3">لا يوجد عملاء مطابقون</p>
            <button onClick={() => setQuery("")} className="mt-3 text-sm font-bold text-brand-primary hover:underline">مسح البحث</button>
          </div>
        )}
      </section>

      <p className="text-[11px] text-slate-400 font-bold mt-3" style={{ animation: "fadeUp .45s ease both .2s" }}>
        💡 يعرض هذا الجدول عينة من أحدث العملاء من إجمالي {stats.total.toLocaleString("en-US")} عميل
      </p>

      {/* Modal سجل المشتريات */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail ? `سجل المشتريات — ${detail.name}` : ""}>
        {detail && (
          <div className="space-y-4">
            {/* ملخص العميل */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-lg font-extrabold text-slate-800">{detail.orders}</p>
                <p className="text-[10px] text-slate-400 font-bold">طلب</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-lg font-extrabold text-brand-primary">{detail.spent.toLocaleString("en-US")}</p>
                <p className="text-[10px] text-slate-400 font-bold">إجمالي الإنفاق (ج.م)</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-lg font-extrabold text-slate-800">{detail.orders > 0 ? Math.round(detail.spent / detail.orders) : 0}</p>
                <p className="text-[10px] text-slate-400 font-bold">متوسط الطلب (ج.م)</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">البريد</span><span className="font-bold text-slate-700" dir="ltr">{detail.email}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">الموبايل</span><span className="font-bold text-slate-700" dir="ltr">{detail.phone}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">المدينة</span><span className="font-bold text-slate-700">{detail.city}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">تاريخ الانضمام</span><span className="font-bold text-slate-700">{detail.joined}</span></div>
            </div>
            {/* آخر الطلبات */}
            <div>
              <p className="text-sm font-bold text-slate-700 mb-2">🧾 آخر الطلبات</p>
              {RECENT[detail.id] && RECENT[detail.id].length > 0 ? (
                <ul className="space-y-2">
                  {RECENT[detail.id].map((o) => (
                    <li key={o.id} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3">
                      <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-lg shrink-0">{o.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-700 truncate">{o.product}</p>
                        <p className="text-[10px] text-slate-400"><span dir="ltr">{o.id}</span> • {o.date}</p>
                      </div>
                      <span className="text-xs font-extrabold text-slate-700 whitespace-nowrap">{o.total} ج.م</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs font-bold text-slate-400">
                  {detail.spent === 0 ? "لم يُكمل هذا العميل أي طلب مدفوع بعد" : "لا توجد طلبات حديثة معروضة"}
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => showToast("تم إرسال رسالة ترحيبية تجريبية للعميل ✓")} className="flex-1 bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-bold py-3 rounded-xl hover:opacity-90 transition">✉️ مراسلة العميل</button>
              <button onClick={() => setDetail(null)} className="px-6 bg-white border-2 border-slate-200 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-50 transition">إغلاق</button>
            </div>
          </div>
        )}
      </Modal>

      <Toast msg={toast} />
    </>
  );
}
