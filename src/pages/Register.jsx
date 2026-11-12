import { useState } from "react";

/* ============================================================
   Register.jsx — إنشاء حساب جديد
   المسار المقترح: /register
   بعد النجاح هيتحوّل للرئيسية أو للطلب المعلّق (الربط بـ Router لاحقاً)
   ============================================================ */

/* ---------- الحركات المخصصة ---------- */
const KEYFRAMES = `
  @keyframes riseIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

/* ---------- أيقونات SVG مدمجة ---------- */
const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.242M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M21 21l-3.759-3.759" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 01-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0012 24z" />
    <path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 014.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a11.99 11.99 0 000 10.76l3.98-3.09z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

/* ============================================================
   الصفحة الرئيسية
   ============================================================ */
export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "", terms: false });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  /* قوة كلمة المرور: 0-3 */
  const score = [
    form.password.length >= 6,
    form.password.length >= 10,
    /\d/.test(form.password) && /[A-Za-z]/.test(form.password),
    /[^A-Za-z0-9\u0600-\u06FF]/.test(form.password),
  ].filter(Boolean).length;

  const strength =
    score >= 3
      ? { label: "قوية 💪", cls: "bg-emerald-500", width: "100%" }
      : score === 2
      ? { label: "متوسطة", cls: "bg-amber-500", width: "66%" }
      : form.password
      ? { label: "ضعيفة", cls: "bg-red-500", width: "33%" }
      : null;

  /* التحقق — نفس منطق صفحة الدفع */
  const validate = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = "اكتب اسمك (3 حروف على الأقل)";
    if (!form.email.includes("@") || !form.email.includes(".")) e.email = "اكتب بريد إلكتروني صحيح";
    if (form.phone.replace(/\D/g, "").length !== 11) e.phone = "الرقم لازم يكون 11 رقم (مثال: 010xxxxxxxx)";
    if (form.password.length < 6) e.password = "كلمة المرور 6 حروف على الأقل";
    if (!form.confirm || form.confirm !== form.password) e.confirm = "كلمة المرور مش متطابقة";
    if (!form.terms) e.terms = "لازم توافق على الشروط الأول";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1500);
  };

  const inputCls = (err) =>
    `w-full rounded-xl border px-4 py-3 text-sm md:text-base outline-none transition-all placeholder-gray-300 ${
      err
        ? "border-red-300 focus:border-red-400 bg-red-50/50"
        : "border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-purple-100"
    }`;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 flex items-center justify-center px-4 py-10 relative overflow-hidden"
    >
      <style>{KEYFRAMES}</style>

      {/* زخارف */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-purple-200/40" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-pink-200/40" />

      <div className="w-full max-w-md relative z-10">
        {/* الشعار */}
        <div className="text-center mb-6" style={{ animation: "riseIn 0.5s ease-out both" }}>
          <div className="inline-flex items-center gap-2">
            <span className="w-11 h-11 rounded-2xl bg-gradient-to-l from-brand-primary to-brand-secondary flex items-center justify-center text-white text-xl shadow-lg">
              👣
            </span>
            <span className="text-2xl font-extrabold text-gray-800">
              بصمة <span className="text-brand-primary">وذكرى</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">هدايا رقمية تبقى ذكرى</p>
        </div>

        {/* البطاقة */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8" style={{ animation: "riseIn 0.5s ease-out 0.15s both" }}>
          {done ? (
            /* ============ حالة النجاح ============ */
            <div className="text-center py-6" style={{ animation: "riseIn 0.5s ease-out both" }}>
              <span className="text-6xl">🎉</span>
              <h2 className="mt-4 text-2xl font-extrabold text-gray-800">حسابك جاهز!</h2>
              <p className="text-gray-500 mt-2">
                أهلاً بيك في بصمة وذكرى يا <b className="text-gray-700">{form.name.trim().split(" ")[0]}</b>
              </p>
              <button className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-extrabold shadow-lg hover:shadow-2xl transition-all">
                ابدأ التصفح 🚀
              </button>
            </div>
          ) : (
            /* ============ النموذج ============ */
            <>
              <h2 className="text-2xl font-extrabold text-gray-800">أنشئ حسابك ✨</h2>
              <p className="text-gray-400 text-sm mt-1">دقيقة واحدة وهتكون معانا</p>

              {/* السوشيال */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 font-bold text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <GoogleIcon /> Google
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#1877F2]/20 bg-[#1877F2]/5 text-[#1877F2] font-bold text-sm hover:bg-[#1877F2]/10 transition-colors">
                  <FacebookIcon /> فيسبوك
                </button>
              </div>

              {/* الفاصل */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-gray-300 text-xs font-bold">أو سجل بالبريد</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <form onSubmit={submit} className="space-y-4">
                {/* الاسم */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">الاسم الكامل</label>
                  <input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="مثال: أحمد محمد"
                    className={inputCls(errors.name)}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">⚠️ {errors.name}</p>}
                </div>

                {/* البريد + الهاتف */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">البريد الإلكتروني</label>
                    <input
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@example.com"
                      className={inputCls(errors.email)}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">⚠️ {errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">رقم الهاتف</label>
                    <input
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
                      placeholder="01xxxxxxxxx"
                      className={inputCls(errors.phone)}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">⚠️ {errors.phone}</p>}
                  </div>
                </div>

                {/* كلمة المرور */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">كلمة المرور</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      placeholder="6 حروف على الأقل"
                      className={`${inputCls(errors.password)} pl-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      title={showPass ? "إخفاء" : "إظهار"}
                    >
                      {showPass ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>

                  {/* شريط القوة */}
                  {strength && (
                    <div className="mt-2">
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${strength.cls}`} style={{ width: strength.width }} />
                      </div>
                      <p className="text-xs mt-1 text-gray-400">
                        قوة كلمة المرور: <b className="text-gray-600">{strength.label}</b>
                      </p>
                    </div>
                  )}
                  {errors.password && <p className="text-red-500 text-xs mt-1">⚠️ {errors.password}</p>}
                </div>

                {/* تأكيد كلمة المرور */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">تأكيد كلمة المرور</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirm}
                      onChange={(e) => set("confirm", e.target.value)}
                      placeholder="اكتبها تاني"
                      className={`${inputCls(errors.confirm)} pl-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      title={showConfirm ? "إخفاء" : "إظهار"}
                    >
                      {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {errors.confirm && <p className="text-red-500 text-xs mt-1">⚠️ {errors.confirm}</p>}
                </div>

                {/* الشروط */}
                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.terms}
                      onChange={(e) => set("terms", e.target.checked)}
                      className="mt-1 w-4 h-4 accent-purple-600"
                    />
                    <span className="text-sm text-gray-500 leading-relaxed">
                      أوافق على <span className="text-brand-primary font-bold">شروط الاستخدام</span> و
                      <span className="text-brand-primary font-bold"> سياسة الخصوصية</span>
                    </span>
                  </label>
                  {errors.terms && <p className="text-red-500 text-xs mt-1">⚠️ {errors.terms}</p>}
                </div>

                {/* زر التسجيل */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-extrabold shadow-lg hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      جاري إنشاء حسابك...
                    </>
                  ) : (
                    "إنشاء الحساب 🚀"
                  )}
                </button>
              </form>

              {/* دخول */}
              <p className="text-center text-sm text-gray-500 mt-5">
                عندك حساب بالفعل؟{" "}
                <button className="text-brand-primary font-bold hover:underline">سجل دخولك</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}