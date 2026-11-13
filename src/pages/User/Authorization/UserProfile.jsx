import React, { useEffect, useState } from "react";

/* ============================================================
   UserProfile.jsx — بيانات الحساب
   تعديل الاسم والبريد والموبايل والمدينة + تغيير كلمة المرور
   (مع مؤشرات قوة حية) + تفضيلات الإشعارات + منطقة خطر
   ملاحظات:
   - تعمل بدون Header/Footer (مكونان مستقلان لديك مسبقاً)
   - البيانات Mock تُستبدل بنداءات API لاحقاً
   ============================================================ */

const USER = {
  name: "أحمد محمود",
  email: "ahmed.mahmoud@gmail.com",
  phone: "01001234567",
  city: "القاهرة",
  initials: "أم",
  memberSince: "مارس 2025",
  level: "عضو ذهبي",
  points: 340,
};

const CITIES = ["القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "أسيوط", "مدينة أخرى"];

const PASSWORD_RULES = [
  { key: "len", label: "8 أحرف على الأقل", test: (v) => v.length >= 8 },
  { key: "num", label: "يحتوي على رقم", test: (v) => /\d/.test(v) },
  { key: "special", label: "رمز خاص أو حرف كبير", test: (v) => /[^A-Za-z0-9]/.test(v) || /[A-Z]/.test(v) },
];

const PREF_ROWS = [
  { key: "orders", emoji: "📦", title: "تحديثات الطلبات", desc: "إشعار عند تغير حالة أي طلب أو تسليم رابط هدية" },
  { key: "offers", emoji: "🔥", title: "العروض والخصومات", desc: "كن أول من يعرف بخصومات المناسبات" },
  { key: "newsletter", emoji: "💌", title: "النشرة البريدية", desc: "أفكار هدايا ونصائح شهرية على بريدك" },
];

const NAV = [
  { key: "home", label: "الرئيسية", emoji: "🏠", href: "/dashboard" },
  { key: "orders", label: "طلباتي", emoji: "📦", href: "/dashboard/orders" },
  { key: "favorites", label: "المفضلة", emoji: "❤️", href: "/dashboard/favorites" },
  { key: "profile", label: "بيانات الحساب", emoji: "⚙️", href: "/dashboard/profile" },
];

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

const EyeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
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

/* ===== مفتاح تبديل (Toggle) ===== */
function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={on}
      className={`relative w-12 h-7 rounded-full transition-colors duration-300 shrink-0 ${on ? "bg-gradient-to-l from-brand-primary to-brand-secondary" : "bg-slate-300"}`}
    >
      <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${on ? "left-1" : "right-1"}`} />
    </button>
  );
}

export default function UserProfile() {
  /* بيانات الحساب */
  const [form, setForm] = useState({ name: USER.name, email: USER.email, phone: USER.phone, city: USER.city });
  const [errors, setErrors] = useState({});

  /* كلمة المرور */
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false });

  /* تفضيلات الإشعارات */
  const [prefs, setPrefs] = useState({ orders: true, offers: false, newsletter: true });

  /* إشعار + تأكيد الحذف */
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (msg) => setToast(msg);

  const inputCls = (hasError) => `w-full px-4 py-3 rounded-xl border-2 bg-slate-50 focus:bg-white outline-none transition text-sm font-medium ${hasError ? "border-rose-300 focus:border-rose-400" : "border-slate-200 focus:border-brand-primary"}`;

  /* حفظ البيانات الأساسية مع تحقق من الصحة */
  const validateInfo = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 3) e.name = "الاسم يجب أن يكون 3 أحرف على الأقل";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "صيغة البريد الإلكتروني غير صحيحة";
    if (!/^01[0125][0-9]{8}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "رقم موبايل مصري غير صحيح (مثال: 01001234567)";
    return e;
  };

  const saveInfo = (ev) => {
    ev.preventDefault();
    const e = validateInfo();
    setErrors(e);
    if (Object.keys(e).length === 0) showToast("تم حفظ بياناتك بنجاح ✓");
    else showToast("راجع الحقول المطلوبة ⚠️");
  };

  /* كلمة المرور */
  const allRulesOk = PASSWORD_RULES.every((r) => r.test(pwd.next));
  const isMatch = pwd.next.length > 0 && pwd.next === pwd.confirm;

  const savePwd = (ev) => {
    ev.preventDefault();
    if (!pwd.current) return showToast("أدخل كلمة المرور الحالية أولاً ⚠️");
    if (!allRulesOk) return showToast("كلمة المرور الجديدة لا تحقق كل الشروط ⚠️");
    if (!isMatch) return showToast("كلمتا المرور غير متطابقتين ⚠️");
    setPwd({ current: "", next: "", confirm: "" });
    showToast("تم تحديث كلمة المرور بنجاح ✓");
  };

  /* حذف الحساب (بتأكيد خطوتين) */
  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
    } else {
      setConfirmDelete(false);
      showToast("تم استلام طلب الحذف — سنراسلك على بريدك للتأكيد");
    }
  };

  /* حقل كلمة مرور مع زر إظهار/إخفاء */
  const pwdField = (key, label, placeholder) => (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={showPwd[key] ? "text" : "password"}
          value={pwd[key]}
          onChange={(e) => setPwd({ ...pwd, [key]: e.target.value })}
          placeholder={placeholder}
          className={`${inputCls(false)} pl-11`}
        />
        <button
          type="button"
          onClick={() => setShowPwd({ ...showPwd, [key]: !showPwd[key] })}
          aria-label={showPwd[key] ? "إخفاء" : "إظهار"}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
        >
          {showPwd[key] ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-800">
      <style>{KEYFRAMES}</style>
      <DashTopbar />
      <DashNav active="profile" />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* بطاقة الهوية */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white p-6 flex items-center gap-5 shadow-lg" style={{ animation: "fadeUp .5s ease both" }}>
          <div className="absolute -left-10 -bottom-14 w-44 h-44 bg-white/10 rounded-full" />
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur border-2 border-white/30 flex items-center justify-center text-3xl font-extrabold">{USER.initials}</div>
            <button aria-label="تغيير الصورة" className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-white text-brand-primary flex items-center justify-center shadow-lg hover:scale-110 transition">📷</button>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold">{USER.name}</h1>
            <p className="text-white/75 text-sm mt-0.5 truncate">{USER.email}</p>
            <div className="flex flex-wrap gap-2 mt-2.5">
              <span className="bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">✨ {USER.level}</span>
              <span className="bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">🏆 {USER.points} نقطة</span>
              <span className="bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">📅 عضو منذ {USER.memberSince}</span>
            </div>
          </div>
        </section>

        {/* البيانات الأساسية */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6" style={{ animation: "fadeUp .5s ease both .1s" }}>
          <h2 className="font-extrabold text-slate-800">👤 البيانات الأساسية</h2>
          <p className="text-xs text-slate-400 mt-1">تظهر هذه البيانات على فواتيرك ورسائلك</p>
          <form onSubmit={saveInfo} className="mt-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">الاسم الكامل</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="اكتب اسمك" className={inputCls(!!errors.name)} />
                {errors.name && <p className="text-xs text-rose-500 font-bold mt-1.5">⚠️ {errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">البريد الإلكتروني</label>
                <input dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="example@mail.com" className={`${inputCls(!!errors.email)} text-left`} />
                {errors.email && <p className="text-xs text-rose-500 font-bold mt-1.5">⚠️ {errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">رقم الموبايل</label>
                <input dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01xxxxxxxxx" className={`${inputCls(!!errors.phone)} text-left`} />
                {errors.phone && <p className="text-xs text-rose-500 font-bold mt-1.5">⚠️ {errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">المحافظة</label>
                <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={`${inputCls(false)} cursor-pointer`}>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition shadow-sm">حفظ التعديلات</button>
            </div>
          </form>
        </section>

        {/* كلمة المرور */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6" style={{ animation: "fadeUp .5s ease both .2s" }}>
          <h2 className="font-extrabold text-slate-800">🔒 تغيير كلمة المرور</h2>
          <p className="text-xs text-slate-400 mt-1">ننصح بكلمة مرور قوية لا تستخدمها في مواقع أخرى</p>
          <form onSubmit={savePwd} className="mt-5 space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              {pwdField("current", "كلمة المرور الحالية", "••••••••")}
              {pwdField("next", "كلمة المرور الجديدة", "8 أحرف على الأقل")}
              {pwdField("confirm", "تأكيد كلمة المرور", "أعد كتابتها")}
            </div>
            {/* مؤشرات قوة كلمة المرور الحية */}
            <ul className="grid sm:grid-cols-3 gap-2">
              {PASSWORD_RULES.map((r) => {
                const ok = r.test(pwd.next);
                return (
                  <li key={r.key} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition ${ok ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}>
                    <span>{ok ? "✓" : "○"}</span> {r.label}
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-end">
              <button type="submit" className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition shadow-sm">تحديث كلمة المرور</button>
            </div>
          </form>
        </section>

        {/* تفضيلات الإشعارات */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6" style={{ animation: "fadeUp .5s ease both .3s" }}>
          <h2 className="font-extrabold text-slate-800">🔔 تفضيلات الإشعارات</h2>
          <div className="divide-y divide-slate-100 mt-2">
            {PREF_ROWS.map((p) => (
              <div key={p.key} className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{p.emoji}</span>
                  <div>
                    <p className="font-bold text-slate-700 text-sm">{p.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{p.desc}</p>
                  </div>
                </div>
                <Toggle on={prefs[p.key]} onChange={() => setPrefs({ ...prefs, [p.key]: !prefs[p.key] })} />
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={() => showToast("تم حفظ تفضيلات الإشعارات ✓")} className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition shadow-sm">حفظ التفضيلات</button>
          </div>
        </section>

        {/* منطقة الخطر */}
        <section className="rounded-3xl border-2 border-rose-200 bg-rose-50/60 p-5 sm:p-6" style={{ animation: "fadeUp .5s ease both .4s" }}>
          <h2 className="font-extrabold text-rose-600">⚠️ منطقة الخطر</h2>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">حذف الحساب يعني فقدان كل طلباتك وروابط الهدايا نهائياً، ولا يمكن الرجوع عنه.</p>
          <button onClick={handleDelete} className={`mt-4 w-full sm:w-auto text-sm font-extrabold px-5 py-3 rounded-xl transition ${confirmDelete ? "bg-rose-600 text-white shadow-lg" : "bg-white text-rose-600 border-2 border-rose-300 hover:bg-rose-100"}`}>
            {confirmDelete ? "اضغط مرة أخرى للتأكيد النهائي" : "حذف الحساب نهائياً"}
          </button>
        </section>
      </main>

      {/* إشعار Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold whitespace-nowrap max-w-[90vw]" style={{ animation: "pop .3s ease both" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
