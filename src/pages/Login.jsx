import { useState } from "react";

/* ============================================================
   Login.jsx — تسجيل الدخول
   المسار المقترح: /login
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
export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [forgotSent, setForgotSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  /* التحقق: البريد أو الهاتف */
  const validate = () => {
    const e = {};
    const id = form.identifier.trim();
    if (!id) e.identifier = "اكتب بريدك أو رقم هاتفك";
    else if (id.includes("@")) {
      if (!id.includes(".")) e.identifier = "البريد الإلكتروني مش صحيح";
    } else if (id.replace(/\D/g, "").length !== 11) {
      e.identifier = "لو هتدخل بالتليفون: 11 رقم (مثال: 010xxxxxxxx)";
    }
    if (form.password.length < 6) e.password = "كلمة المرور 6 حروف على الأقل";
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
    }, 1300);
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
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-pink-200/40" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-purple-200/40" />

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
        <div
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8"
          style={{ animation: "riseIn 0.5s ease-out 0.15s both" }}
        >
          {done ? (
            /* ============ حالة النجاح ============ */
            <div className="text-center py-6" style={{ animation: "riseIn 0.5s ease-out both" }}>
              <span className="text-6xl">👋</span>
              <h2 className="mt-4 text-2xl font-extrabold text-gray-800">أهلاً بعودتك!</h2>
              <p className="text-gray-500 mt-2">فرحنا إنك رجعت تاني 💜</p>
              <button className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-extrabold shadow-lg hover:shadow-2xl transition-all">
                ابدأ من حيث وقفت 🚀
              </button>
            </div>
          ) : (
            /* ============ النموذج ============ */
            <>
              <h2 className="text-2xl font-extrabold text-gray-800">تسجيل الدخول</h2>
              <p className="text-gray-400 text-sm mt-1">ادخل بحسابك وكمّل هديتك</p>

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
                {/* البريد / الهاتف */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">البريد الإلكتروني أو رقم الهاتف</label>
                  <input
                    value={form.identifier}
                    onChange={(e) => set("identifier", e.target.value)}
                    placeholder="you@example.com أو 01xxxxxxxxx"
                    className={inputCls(errors.identifier)}
                  />
                  {errors.identifier && <p className="text-red-500 text-xs mt-1">⚠️ {errors.identifier}</p>}
                </div>

                {/* كلمة المرور */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">كلمة المرور</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      placeholder="اكتب كلمة المرور"
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
                  {errors.password && <p className="text-red-500 text-xs mt-1">⚠️ {errors.password}</p>}
                </div>

                {/* تذكرني + نسيت كلمة المرور */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-500">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 accent-purple-600"
                    />
                    تذكرني
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotSent(true)}
                    className="text-brand-primary font-bold hover:underline"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>

                {/* إشعار استعادة كلمة المرور */}
                {forgotSent && (
                  <div className="rounded-xl bg-sky-50 border border-sky-100 px-4 py-3 text-sky-700 text-xs leading-relaxed" style={{ animation: "riseIn 0.4s ease-out both" }}>
                    ✉️ لو البريد/الرقم ده مسجل عندنا هيوصلك رابط استعادة كلمة المرور خلال دقايق — متنساش تشيك على الرسائل غير المرغوبة
                  </div>
                )}

                {/* زر الدخول */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-extrabold shadow-lg hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      جاري الدخول...
                    </>
                  ) : (
                    "تسجيل الدخول"
                  )}
                </button>
              </form>

              {/* إنشاء حساب */}
              <p className="text-center text-sm text-gray-500 mt-5">
                معندكش حساب؟{" "}
                <button className="text-brand-primary font-bold hover:underline">أنشئ حسابك الجديد</button>
              </p>
            </>
          )}
        </div>

        {/* للمتصفح الجديد */}
        <div
          className="mt-5 bg-white/60 backdrop-blur rounded-2xl p-4 text-center text-sm text-gray-500 border border-white shadow-sm"
          style={{ animation: "riseIn 0.5s ease-out 0.3s both" }}
        >
          عايز تستكشف الأول؟ 🎁{" "}
          <button className="text-brand-primary font-bold hover:underline">تصفح القوالب من غير حساب</button>
        </div>
      </div>
    </div>
  );
}