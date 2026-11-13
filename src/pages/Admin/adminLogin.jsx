import { useEffect } from "react";

const BRAND = { name: "بصمة وذكرى", initial: "ب" };

const inputCls =
  "w-full px-4 py-3 rounded-xl border-2 bg-slate-50 focus:bg-white outline-none transition text-sm font-medium border-slate-200 focus:border-brand-primary";

export default function AdminLogin() {
  /* عنوان الصفحة — بدون مكتبات (بديل react-helmet-async) */
  useEffect(() => {
    document.title = "تسجيل دخول الإدارة — بصمة وذكرى";
  }, []);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-100 text-slate-800 flex flex-col lg:flex-row"
    >
      <style>{}</style>

      {/* لوحة العلامة التجارية — على اليمين في RTL (تختفي على الموبايل) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* توهجات زخرفية بألوان الهوية */}
        <div className="absolute w-72 h-72 bg-brand-primary/25 rounded-full blur-3xl top-0 right-0" />
        <div className="absolute w-56 h-56 bg-brand-secondary/20 rounded-full blur-3xl bottom-0 left-0" />
        {/* إيموجي عائمة */}

        <div
          className="relative z-10 text-center"
          style={{ animation: "fadeUp .5s ease both" }}
        >
          {/* الشعار */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
              {BRAND.initial}
            </div>
            <span className="text-3xl font-extrabold tracking-tight">
              {BRAND.name}
            </span>
          </div>

          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            بوابة الإدارة
          </h1>
          <p className="text-slate-400 text-lg max-w-sm mx-auto leading-relaxed"></p>

          <div className="flex justify-center gap-8 mt-12 text-center"></div>
        </div>
      </div>

      <div className="min-h-screen w-full lg:w-1/2 flex items-start lg:items-center justify-center py-12 px-6 lg:p-8 bg-slate-100">
        <div className="w-full max-w-md space-y-6">
          {/* شعار الموبايل */}
          <div
            className="lg:hidden text-center"
            style={{ animation: "fadeUp .45s ease both" }}
          >
            <div className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white font-extrabold">
                {BRAND.initial}
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-800">
                {BRAND.name}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500 font-bold">
              بوابة الإدارة
            </p>
          </div>

          {/* رجوع إلى المتجر */}
          <div className="hidden lg:block">
            <a
              href="/"
              className="text-xs font-bold text-slate-400 hover:text-brand-primary transition"
            >
              العودة إلى المتجر ←
            </a>
          </div>

          {/* الترويسة */}
          <div
            className="text-center lg:text-right"
            style={{ animation: "fadeUp .45s ease both .05s" }}
          >
            <h2 className="text-2xl font-extrabold text-slate-800">
              مرحباً بعودتك 👋
            </h2>
          </div>

          <form className="space-y-5">
            <div>
              <label
                className="block text-sm font-bold text-slate-700 mb-1.5"
                htmlFor="admin-email"
              >
                البريد الإلكتروني
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                dir="ltr"
                autoComplete="email"
                className={`${inputCls} text-left`}
                placeholder="admin@basma-thikra.com"
              />
            </div>

            {/* كلمة المرور */}
            <div>
              <label
                className="block text-sm font-bold text-slate-700 mb-1.5"
                htmlFor="admin-password"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  name="password"
                  autoComplete="current-password"
                  className={`${inputCls} pl-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 hover:text-brand-primary transition"
                ></button>
              </div>
            </div>

            {/* الخيارات */}
            <div className="flex items-center justify-between flex-wrap gap-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="remember-me"
                  className="w-4 h-4 rounded border-slate-300 accent-brand-primary cursor-pointer"
                />
                <span className="text-sm text-slate-500 group-hover:text-slate-700 font-medium transition">
                  تذكرني
                </span>
              </label>
              <a
                href="#"
                className="text-sm font-bold text-brand-secondary hover:opacity-80 transition"
              >
                نسيت كلمة المرور؟
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-extrabold text-sm hover:opacity-90 transition shadow-lg shadow-brand-primary/25 disabled:opacity-70 flex items-center justify-center gap-2"
            ></button>
          </form>

          {/* ملاحظة الأمان */}
          <div className="pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-400 font-bold flex items-center justify-center gap-2">
              اتصال محمي ومشفّر (SSL) — بوابة الإدارة © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
