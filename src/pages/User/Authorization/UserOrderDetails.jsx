import React, { useState } from "react";

/* ============================================================
   UserOrderDetails.jsx — تفاصيل طلب
   مسار حالة الطلب (Timeline) + تفاصيل التخصيص + رابط الهدية
   مع QR ومشاركة واتساب + ملخص الدفع (ضريبة 14%) + دعم
   ملاحظات:
   - تعمل بدون Header/Footer (مكونان مستقلان لديك مسبقاً)
   - الطلب Mock ثابت — عند الربط اجلبه بـ API حسب id من الراوتر
   ============================================================ */

const ORDER = {
  id: "ORD-2026-1042",
  date: "8 نوفمبر 2026",
  status: "delivered",
  product: {
    name: "قالب عيد ميلاد — نجوم ذهبية",
    emoji: "🎂",
    grad: "from-amber-400 to-orange-500",
    category: "أعياد ميلاد",
    price: 250,
  },
  customization: {
    recipient: "سارة",
    occasion: "عيد ميلاد الـ 25",
    photos: "6 صور",
    music: "Happy Birthday — نسخة هادئة",
    message: "كل سنة وانتي طيبة يا سارة، ربنا يحققلك كل أحلامك ❤️",
    theme: "خلفية ليلية بنجوم متحركة",
  },
  payment: { method: "فيزا — تنتهي بـ 4242", paidAt: "8 نوفمبر 2026 — 2:32 م" },
  giftLink: "https://basmah-zikra.com/g/sara-bday25",
  stats: { views: 128, lastVisit: "اليوم — 3:40 م", thanks: true },
};

/* الحسابات المالية: الضريبة 14% والإجمالي */
const TAX = Math.round(ORDER.product.price * 0.14);
const TOTAL = ORDER.product.price + TAX;

const TIMELINE = [
  { title: "تم استلام الطلب", time: "8 نوفمبر — 2:30 م", note: "وصل طلبك بنجاح", done: true },
  { title: "تأكيد الدفع", time: "8 نوفمبر — 2:32 م", note: "فيزا •••• 4242", done: true },
  { title: "تخصيص القالب", time: "9 نوفمبر — 11:15 ص", note: "تم تجهيز الرسالة والصور والموسيقى", done: true },
  { title: "تسليم رابط الهدية", time: "10 نوفمبر — 9:00 ص", note: "الرابط جاهز للمشاركة مع سارة", done: true },
];

const CUSTOM_ROWS = [
  { label: "اسم المُهدى إليه", value: ORDER.customization.recipient, emoji: "🎁" },
  { label: "المناسبة", value: ORDER.customization.occasion, emoji: "🎉" },
  { label: "الصور المرفقة", value: ORDER.customization.photos, emoji: "🖼️" },
  { label: "الموسيقى", value: ORDER.customization.music, emoji: "🎵" },
  { label: "الخلفية", value: ORDER.customization.theme, emoji: "🌌" },
];

const USER = { initials: "أم", email: "ahmed.mahmoud@gmail.com" };

const NAV = [
  { key: "home", label: "الرئيسية", emoji: "🏠", href: "/dashboard" },
  { key: "orders", label: "طلباتي", emoji: "📦", href: "/dashboard/orders" },
  { key: "favorites", label: "المفضلة", emoji: "❤️", href: "/dashboard/favorites" },
  { key: "profile", label: "بيانات الحساب", emoji: "⚙️", href: "/dashboard/profile" },
];

const fmt = (n) => `${Number(n).toLocaleString("en-US")} ج.م`;

const KEYFRAMES = `
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { 0% { transform: scale(.85); opacity: 0; } 70% { transform: scale(1.04); } 100% { transform: scale(1); opacity: 1; } }
`;

/* ===== أيقونات SVG مدمجة ===== */
const BellIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ChevronIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CopyIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const LinkIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const DownloadIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

/* ===== القشرة الموحدة للوحة ===== */
function DashTopbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary text-white font-extrabold flex items-center justify-center shrink-0">{USER.initials}</div>
          <div className="min-w-0">
            <p className="font-extrabold text-slate-800 text-sm sm:text-base truncate">لوحة العميل</p>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate">{USER.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="الإشعارات" className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition">
            <BellIcon />
            <span className="absolute -top-1 -left-1 w-5 h-5 bg-brand-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">3</span>
          </button>
          <a href="/store" className="hidden sm:inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white text-sm font-bold hover:opacity-90 transition shadow-sm">🎨 قالب جديد</a>
        </div>
      </div>
    </header>
  );
}

function DashNav({ active }) {
  return (
    <nav className="sticky top-16 z-30 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-2 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {NAV.map((n) => {
            const isActive = n.key === active;
            return (
              <a key={n.key} href={n.href} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition ${isActive ? "bg-gradient-to-l from-brand-primary to-brand-secondary text-white shadow-sm" : "text-slate-500 hover:text-brand-primary hover:bg-violet-50"}`}>
                <span>{n.emoji}</span> {n.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/* ===== نمط QR توضيحي ثابت (يُستبدل بمكتبة QR حقيقية عند الربط) ===== */
const QR_MATRIX = (() => {
  const n = 21;
  const m = [];
  let seed = 1042;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const inFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  for (let r = 0; r < n; r++) {
    m[r] = [];
    for (let c = 0; c < n; c++) {
      if (inFinder(r, c)) {
        const rr = r < 7 ? r : r - (n - 7);
        const cc = c < 7 ? c : c - (n - 7);
        const ring = Math.max(Math.abs(rr - 3), Math.abs(cc - 3));
        m[r][c] = ring === 2 ? 0 : 1;
      } else {
        m[r][c] = rand() > 0.52 ? 1 : 0;
      }
    }
  }
  return m;
})();

function QRBox() {
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-100 p-3 inline-block shadow-sm">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(21, 7px)" }}>
        {QR_MATRIX.flatMap((row, r) =>
          row.map((v, c) => (
            <span key={`${r}-${c}`} style={{ width: 7, height: 7, backgroundColor: v ? "#0f172a" : "#ffffff" }} />
          ))
        )}
      </div>
      <p className="text-center text-[10px] font-bold text-slate-400 mt-2">امسح الكود لفتح الهدية</p>
    </div>
  );
}

export default function UserOrderDetails() {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    try { if (navigator.clipboard) navigator.clipboard.writeText(ORDER.giftLink); } catch (e) { /* تجاهل */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waHref = "https://wa.me/?text=" + encodeURIComponent("هدية خاصة بانتظارك من أحمد 🎁 " + ORDER.giftLink);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-800">
      <style>{KEYFRAMES}</style>
      <DashTopbar />
      <DashNav active="orders" />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* مسار التنقل */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium flex-wrap" style={{ animation: "fadeUp .5s ease both" }}>
          <a href="/dashboard" className="hover:text-brand-primary transition">لوحة العميل</a>
          <ChevronIcon className="w-3.5 h-3.5" />
          <a href="/dashboard/orders" className="hover:text-brand-primary transition">طلباتي</a>
          <ChevronIcon className="w-3.5 h-3.5" />
          <span className="text-slate-600 font-bold" dir="ltr">{ORDER.id}</span>
        </nav>

        {/* ترويسة الطلب */}
        <section className="rounded-3xl bg-white border border-slate-100 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ animation: "fadeUp .5s ease both .05s" }}>
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${ORDER.product.grad} flex items-center justify-center text-4xl shrink-0`}>{ORDER.product.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-800">{ORDER.product.name}</h1>
              <span className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 text-[11px] font-bold px-2.5 py-1 rounded-full">✓ تم التسليم</span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">رقم الطلب <span dir="ltr" className="font-bold">{ORDER.id}</span> • أُنشئ في {ORDER.date} • التصنيف: {ORDER.product.category}</p>
          </div>
          <button className="text-sm font-bold px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition shrink-0">🧾 الفاتورة</button>
        </section>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* العمود الرئيسي */}
          <div className="lg:col-span-2 space-y-5">
            {/* مسار حالة الطلب */}
            <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6" style={{ animation: "fadeUp .5s ease both .1s" }}>
              <h2 className="font-extrabold text-slate-800">🚚 مسار الطلب</h2>
              <ol className="mt-5">
                {TIMELINE.map((s, i) => (
                  <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < TIMELINE.length - 1 && <span className="absolute top-10 right-[19px] bottom-0 w-0.5 bg-slate-200" />}
                    <span className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${s.done ? "bg-gradient-to-tr from-brand-primary to-brand-secondary text-white shadow-md" : "bg-slate-100 text-slate-400"}`}>
                      {s.done ? <CheckIcon className="w-5 h-5" /> : <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />}
                    </span>
                    <div className={`flex-1 rounded-xl p-3.5 ${s.done ? "bg-slate-50" : "bg-white border border-dashed border-slate-200"}`}>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="font-bold text-slate-800 text-sm">{s.title}</p>
                        <span className="text-[11px] text-slate-400 font-medium">{s.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{s.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* تفاصيل التخصيص */}
            <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6" style={{ animation: "fadeUp .5s ease both .15s" }}>
              <h2 className="font-extrabold text-slate-800">🎨 تفاصيل التخصيص</h2>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {CUSTOM_ROWS.map((r) => (
                  <div key={r.label} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                    <span className="text-xl">{r.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 font-bold">{r.label}</p>
                      <p className="text-sm font-bold text-slate-700 truncate">{r.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-[11px] font-bold text-amber-600">💌 رسالة المُرسل</p>
                <p className="text-sm text-slate-700 font-medium mt-1 leading-relaxed">«{ORDER.customization.message}»</p>
              </div>
            </section>

            {/* رابط الهدية + QR */}
            <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6" style={{ animation: "fadeUp .5s ease both .2s" }}>
              <h2 className="font-extrabold text-slate-800">🔗 رابط الهدية</h2>
              <div className="flex flex-col md:flex-row gap-5 mt-4 items-start">
                <QRBox />
                <div className="flex-1 w-full space-y-3">
                  <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <span className="text-brand-primary shrink-0"><LinkIcon /></span>
                    <span dir="ltr" className="text-sm font-bold text-slate-700 truncate flex-1">{ORDER.giftLink}</span>
                    <button onClick={copyLink} className={`shrink-0 text-xs font-extrabold px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${copied ? "bg-emerald-100 text-emerald-700" : "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20"}`}>
                      {copied ? "تم النسخ ✓" : (<><CopyIcon /> نسخ</>)}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-lg font-extrabold text-slate-800">{ORDER.stats.views}</p>
                      <p className="text-[10px] text-slate-400 font-bold">👁️ مشاهدة</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-xs font-extrabold text-slate-700 pt-1">{ORDER.stats.lastVisit}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">آخر زيارة</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-lg font-extrabold text-emerald-600">✓</p>
                      <p className="text-[10px] text-slate-400 font-bold">وصل رد الشكر</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a href={waHref} target="_blank" rel="noreferrer" className="flex-1 min-w-[130px] text-center text-sm font-bold px-4 py-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition">مشاركة على واتساب</a>
                    <a href="#" className="flex-1 min-w-[130px] text-center text-sm font-bold px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition flex items-center justify-center gap-1.5"><DownloadIcon /> تحميل QR</a>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* العمود الجانبي */}
          <div className="space-y-5">
            {/* ملخص الدفع */}
            <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6 h-fit" style={{ animation: "fadeUp .5s ease both .25s" }}>
              <h2 className="font-extrabold text-slate-800">🧾 ملخص الدفع</h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">سعر القالب</dt>
                  <dd className="font-bold text-slate-700">{fmt(ORDER.product.price)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">الضريبة (14%)</dt>
                  <dd className="font-bold text-slate-700">{fmt(TAX)}</dd>
                </div>
                <div className="border-t border-dashed border-slate-200 pt-3 flex items-center justify-between">
                  <dt className="font-extrabold text-slate-800">الإجمالي المدفوع</dt>
                  <dd className="font-extrabold text-brand-primary text-lg">{fmt(TOTAL)}</dd>
                </div>
              </dl>
              <div className="mt-4 bg-slate-50 rounded-xl p-3.5 space-y-2.5 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">طريقة الدفع</span>
                  <span className="font-bold text-slate-700">💳 {ORDER.payment.method}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">حالة الدفع</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full text-xs">✓ مدفوع بنجاح</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">تاريخ الدفع</span>
                  <span className="font-bold text-slate-700 text-xs">{ORDER.payment.paidAt}</span>
                </div>
              </div>
              <button className="w-full mt-4 text-sm font-bold py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 hover:border-brand-primary/50 hover:text-brand-primary transition flex items-center justify-center gap-1.5">
                <DownloadIcon /> تحميل الفاتورة PDF
              </button>
            </section>

            {/* المساعدة */}
            <section className="bg-gradient-to-br from-slate-50 to-violet-50 rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6" style={{ animation: "fadeUp .5s ease both .3s" }}>
              <h2 className="font-extrabold text-slate-800">💬 تحتاج مساعدة في هذا الطلب؟</h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">يمكنك تعديل القالب مجاناً خلال 48 ساعة من لحظة التسليم.</p>
              <div className="flex flex-wrap gap-2 mt-3.5">
                <a href="#" className="text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white hover:opacity-90 transition">محادثة فورية</a>
                <a href="mailto:support@basmah-zikra.com" className="text-xs font-bold px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-brand-primary/50 transition">بريد الدعم</a>
                <a href="#" className="text-xs font-bold px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-brand-primary/50 transition">واتساب</a>
              </div>
            </section>
          </div>
        </div>

        {/* الإجراءات الرئيسية */}
        <section className="flex flex-col sm:flex-row gap-3" style={{ animation: "fadeUp .5s ease both .35s" }}>
          <a href={ORDER.giftLink} className="flex-1 text-center bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-extrabold py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg">🔗 فتح رابط الهدية</a>
          <a href="#" className="flex-1 text-center bg-white border-2 border-slate-200 text-slate-700 font-extrabold py-3.5 rounded-2xl hover:border-brand-primary/50 hover:text-brand-primary transition">👁️ معاينة القالب</a>
        </section>
      </main>
    </div>
  );
}
