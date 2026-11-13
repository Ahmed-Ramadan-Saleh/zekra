import React from "react";

/* ============================================================
   AdminHome.jsx — لوحة التحكم الرئيسية للإدارة (محتوى فقط)
   ------------------------------------------------------------
   ⭐ مع نمط AdminLayout كل صفحة إدارة تكون "محتوى فقط" —
   بدون Sidebar/Topbar وبدون dir="rtl"، لأن القشرة تُرسم مرة
   واحدة في AdminLayout عبر <Outlet /> لكل الصفحات.

   <Route path="/admin" element={<AdminLayout />}>
     <Route index element={<AdminHome />} />
   </Route>

   ⚠️ لا تستدعِ Sidebar أو Topbar هنا — وإلا ستظهر مرتين.
   إذا كنت تريد صفحة قائمة بذاتها بدون راوتر، استخدم النمط
   الموضح في أعلى ملف AdminLayout.jsx.

   المحتوى: KPI (مبيعات/طلبات/عملاء) + مخطط مبيعات أسبوعي + تنبيهات
   + الأكثر مبيعاً + توزيع حالات الطلبات + آخر الطلبات
   البيانات Mock تُستبدل بنداءات API لاحقاً
   ============================================================ */

const KPI = [
  { label: "إجمالي المبيعات", value: "48,250", unit: "ج.م", change: "+12.4%", up: true, emoji: "💰", grad: "from-violet-500 to-indigo-600" },
  { label: "الطلبات", value: "312", unit: "طلب", change: "+8.1%", up: true, emoji: "🧾", grad: "from-emerald-500 to-teal-600" },
  { label: "العملاء", value: "1,204", unit: "عميل", change: "+5.3%", up: true, emoji: "👥", grad: "from-pink-500 to-rose-600" },
  { label: "متوسط قيمة الطلب", value: "154", unit: "ج.م", change: "-2.1%", up: false, emoji: "📈", grad: "from-amber-500 to-orange-600" },
];

const WEEK_SALES = [
  { day: "السبت", value: 5200 },
  { day: "الأحد", value: 4100 },
  { day: "الاثنين", value: 6800 },
  { day: "الثلاثاء", value: 5900 },
  { day: "الأربعاء", value: 7400 },
  { day: "الخميس", value: 9200 },
  { day: "الجمعة", value: 4600 },
];
const WEEK_TOTAL = WEEK_SALES.reduce((s, w) => s + w.value, 0);
const MAX_SALE = Math.max(...WEEK_SALES.map((w) => w.value));

const STATUS_BREAKDOWN = [
  { label: "مدفوع ومكتمل", count: 203, pct: 65, cls: "bg-emerald-500" },
  { label: "مسودات قيد التخصيص", count: 62, pct: 20, cls: "bg-amber-500" },
  { label: "بانتظار الدفع", count: 31, pct: 10, cls: "bg-violet-500" },
  { label: "ملغي / مسترجع", count: 16, pct: 5, cls: "bg-slate-400" },
];

const TOP_PRODUCTS = [
  { name: "قالب عيد ميلاد — نجوم ذهبية", emoji: "🎂", sales: 86, revenue: 21500 },
  { name: "قالب زفاف — روز جولد", emoji: "💍", sales: 64, revenue: 22400 },
  { name: "قالب تخرج — قبعة وفش", emoji: "🎓", sales: 51, revenue: 10200 },
  { name: "دعوة زفاف — لافندر", emoji: "✉️", sales: 47, revenue: 7050 },
  { name: "قالب عيد ميلاد — ديناصور", emoji: "🦖", sales: 39, revenue: 9750 },
];
const MAX_SALES_P = Math.max(...TOP_PRODUCTS.map((p) => p.sales));

const LATEST_ORDERS = [
  { id: "ORD-2026-1042", customer: "أحمد محمود", product: "قالب عيد ميلاد — نجوم ذهبية", emoji: "🎂", total: 285, status: "delivered" },
  { id: "ORD-2026-1041", customer: "منى السيد", product: "رسالة حب — قلبان متجاوران", emoji: "❤️", total: 171, status: "paid" },
  { id: "ORD-2026-1040", customer: "خالد فؤاد", product: "قالب تخرج — قبعة وفش", emoji: "🎓", total: 228, status: "draft" },
  { id: "ORD-2026-1039", customer: "نور حسن", product: "دعوة زفاف — لافندر", emoji: "✉️", total: 171, status: "paid" },
  { id: "ORD-2026-1038", customer: "عمر ياسر", product: "قالب زفاف — روز جولد", emoji: "💍", total: 399, status: "delivered" },
];

const ORDER_LABEL = { delivered: "تم التسليم", paid: "مدفوع", draft: "مسودة" };
const ORDER_BADGE = {
  delivered: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  paid: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  draft: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
};

const ALERTS = [
  { emoji: "🧾", text: "3 طلبات بانتظار تأكيد الدفع", action: "مراجعة الطلبات", href: "/admin/orders" },
  { emoji: "🏷️", text: "كوبون EID50 وصل الحد الأقصى للاستخدام", action: "إدارة الكوبونات", href: "/admin/coupons" },
  { emoji: "📢", text: "بانر «تخفيضات نهاية الأسبوع» ينتهي غداً", action: "تحديث البانرات", href: "/admin/cms" },
];

const KEYFRAMES = `
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { 0% { transform: scale(.85); opacity: 0; } 70% { transform: scale(1.04); } 100% { transform: scale(1); opacity: 1; } }
`;

export default function AdminHome() {
  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* بطاقات KPI */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {KPI.map((k, i) => (
          <div key={k.label} className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 sm:p-5 hover:shadow-md transition" style={{ animation: `fadeUp .45s ease both ${i * 0.06}s` }}>
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${k.grad} flex items-center justify-center text-xl shadow-sm`}>{k.emoji}</div>
              <span className={`text-[11px] font-extrabold px-2 py-1 rounded-full ${k.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>{k.up ? "▲" : "▼"} {k.change}</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-3">{k.value} <span className="text-xs font-bold text-slate-400">{k.unit}</span></p>
            <p className="text-sm text-slate-500 font-medium mt-0.5">{k.label}</p>
          </div>
        ))}
      </section>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-5 mt-5">
        {/* مخطط مبيعات الأسبوع */}
        <section className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5 sm:p-6" style={{ animation: "fadeUp .45s ease both .25s" }}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-extrabold text-slate-800">📊 مبيعات الأسبوع</h2>
              <p className="text-xs text-slate-400 mt-0.5">إجمالي الأسبوع: <b className="text-brand-primary">{WEEK_TOTAL.toLocaleString("en-US")} ج.م</b></p>
            </div>
            <span className="text-[11px] font-bold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg">آخر 7 أيام</span>
          </div>
          <div className="flex items-end justify-between gap-2 sm:gap-3 mt-6 h-44">
            {WEEK_SALES.map((w) => (
              <div key={w.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-extrabold text-slate-500 opacity-0 group-hover:opacity-100 transition">{w.value.toLocaleString("en-US")}</span>
                <div className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-brand-primary to-brand-secondary hover:opacity-80 transition cursor-pointer" style={{ height: `${Math.round((w.value / MAX_SALE) * 100)}%` }} title={`${w.day}: ${w.value.toLocaleString("en-US")} ج.م`} />
                <span className="text-[10px] sm:text-xs text-slate-400 font-bold">{w.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* مطلوب انتباهك */}
        <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5 sm:p-6" style={{ animation: "fadeUp .45s ease both .3s" }}>
          <h2 className="font-extrabold text-slate-800">🔔 مطلوب انتباهك</h2>
          <ul className="mt-4 space-y-3">
            {ALERTS.map((a) => (
              <li key={a.text} className="flex items-start gap-3 bg-slate-50 rounded-xl p-3.5">
                <span className="text-xl">{a.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">{a.text}</p>
                  <a href={a.href} className="text-xs font-bold text-brand-primary hover:underline mt-1 inline-block">{a.action} ←</a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-5 mt-5">
        {/* الأكثر مبيعاً */}
        <section className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5 sm:p-6" style={{ animation: "fadeUp .45s ease both .35s" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-800">🏆 الأكثر مبيعاً هذا الشهر</h2>
            <a href="/admin/products" className="text-xs font-bold text-brand-primary hover:underline">كل المنتجات ←</a>
          </div>
          <ul className="mt-4 space-y-3">
            {TOP_PRODUCTS.map((p, i) => (
              <li key={p.name} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-xs font-extrabold text-slate-500 flex items-center justify-center shrink-0">{i + 1}</span>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-xl shrink-0">{p.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-700 truncate">{p.name}</p>
                    <p className="text-xs font-extrabold text-slate-500 whitespace-nowrap">{p.sales} مبيعة</p>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-l from-brand-primary to-brand-secondary" style={{ width: `${Math.round((p.sales / MAX_SALES_P) * 100)}%` }} />
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 whitespace-nowrap hidden sm:block">{p.revenue.toLocaleString("en-US")} ج.م</span>
              </li>
            ))}
          </ul>
        </section>

        {/* توزيع حالات الطلبات */}
        <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5 sm:p-6" style={{ animation: "fadeUp .45s ease both .4s" }}>
          <h2 className="font-extrabold text-slate-800">🧾 حالات الطلبات</h2>
          <ul className="mt-5 space-y-4">
            {STATUS_BREAKDOWN.map((s) => (
              <li key={s.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-600">{s.label}</span>
                  <span className="font-extrabold text-slate-700">{s.count} <span className="text-[10px] text-slate-400 font-bold">({s.pct}%)</span></span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div className={`h-full rounded-full ${s.cls}`} style={{ width: `${s.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* آخر الطلبات */}
      <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm mt-5 overflow-hidden" style={{ animation: "fadeUp .45s ease both .45s" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-extrabold text-slate-800">🕐 آخر الطلبات</h2>
          <a href="/admin/orders" className="text-xs font-bold text-brand-primary hover:underline">كل الطلبات ←</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-right text-[11px] text-slate-400 font-bold bg-slate-50">
                <th className="px-5 py-3">رقم الطلب</th>
                <th className="px-5 py-3">العميل</th>
                <th className="px-5 py-3">القالب</th>
                <th className="px-5 py-3">الإجمالي</th>
                <th className="px-5 py-3">الحالة</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {LATEST_ORDERS.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5 font-bold text-slate-700" dir="ltr">{o.id}</td>
                  <td className="px-5 py-3.5 text-slate-600">{o.customer}</td>
                  <td className="px-5 py-3.5 text-slate-600">{o.emoji} {o.product}</td>
                  <td className="px-5 py-3.5 font-extrabold text-slate-700 whitespace-nowrap">{o.total} ج.م</td>
                  <td className="px-5 py-3.5"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${ORDER_BADGE[o.status]}`}>{ORDER_LABEL[o.status]}</span></td>
                  <td className="px-5 py-3.5"><a href="/admin/orders" className="text-xs font-bold text-brand-primary hover:underline whitespace-nowrap">تفاصيل</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
