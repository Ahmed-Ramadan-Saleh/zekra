import { useState } from "react";

/* ============================================================
   ContactUs.jsx — اتصل بنا
   المسار المقترح: /contact
   ============================================================ */

/* ---------- بيانات تجريبية ---------- */
const CHANNELS = [
  { icon: "💬", label: "واتساب", value: "+20 100 123 4567", action: "ابدأ محادثة", gradient: "from-emerald-400 to-green-600" },
  { icon: "📧", label: "البريد الإلكتروني", value: "support@bassma-thikra.com", action: "ابعت إيميل", gradient: "from-sky-400 to-blue-600" },
  { icon: "📞", label: "التليفون", value: "19845 — خدمة العملاء", action: "اتصل بينا", gradient: "from-purple-500 to-brand-secondary" },
  { icon: "⏰", label: "ساعات العمل", value: "من 9 ص لـ 6 م — السبت للخميس", action: "", gradient: "from-amber-400 to-orange-500" },
];

const SUBJECTS = ["استفسار عن منتج", "مشكلة في الدفع أو الطلب", "اقتراح أو ملاحظة", "شكوى", "طلب قالب مخصص", "أخرى"];

/* ---------- الحركات المخصصة ---------- */
const KEYFRAMES = `
  @keyframes riseIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

/* ---------- أيقونات SVG مدمجة (نفس مجموعة الفوتر) ---------- */
const FacebookIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.246-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

/* ============================================================
   الصفحة الرئيسية
   ============================================================ */
export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  /* التحقق من الحقول — نفس منطق صفحة الدفع */
  const validate = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = "اكتب اسمك (3 حروف على الأقل)";
    if (!form.email.includes("@") || !form.email.includes(".")) e.email = "اكتب بريد إلكتروني صحيح";
    const digits = form.phone.replace(/\D/g, "");
    if (digits && digits.length !== 11) e.phone = "لو هتكتب رقم: لازم يكون 11 رقم";
    if (!form.subject) e.subject = "اختار موضوع الرسالة";
    if (form.message.trim().length < 10) e.message = "اكتب رسالتك (10 حروف على الأقل)";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1500);
  };

  const inputCls = (err) =>
    `w-full rounded-xl border px-4 py-3 text-sm md:text-base outline-none transition-all placeholder-gray-300 ${
      err
        ? "border-red-300 focus:border-red-400 bg-red-50/50"
        : "border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-purple-100"
    }`;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pb-14">
      <style>{KEYFRAMES}</style>

      {/* ============ الهيرو ============ */}
      <section className="relative overflow-hidden bg-gradient-to-l from-brand-primary via-purple-700 to-brand-secondary text-white px-4 pt-12 pb-20">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-white/10" />

        <div className="relative z-10 max-w-3xl mx-auto text-center" style={{ animation: "riseIn 0.6s ease-out both" }}>
          <span className="text-5xl inline-block">💬</span>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold">تواصل معنا</h1>
          <p className="mt-3 text-white/80 max-w-lg mx-auto leading-relaxed">
            أي سؤال أو ملاحظة أو حتى فكرة قالب جديدة.. فريقنا مستني رسالتك وبيرد بسرعة
          </p>
        </div>
      </section>

      {/* ============ بطاقات التواصل السريع ============ */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-10" style={{ animation: "riseIn 0.6s ease-out 0.15s both" }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {CHANNELS.map((ch) => (
            <div key={ch.label} className="bg-white rounded-2xl p-4 md:p-5 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all">
              <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${ch.gradient} flex items-center justify-center text-2xl shadow-md`}>
                {ch.icon}
              </div>
              <h3 className="mt-3 font-extrabold text-gray-800 text-sm md:text-base">{ch.label}</h3>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">{ch.value}</p>
              {ch.action && (
                <button className="mt-3 text-brand-primary text-xs font-bold hover:underline">{ch.action} ←</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============ النموذج + المعلومات ============ */}
      <div className="max-w-6xl mx-auto px-4 mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6" style={{ animation: "riseIn 0.6s ease-out 0.25s both" }}>
        {/* نموذج الرسالة */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-lg p-6 md:p-8">
          {sent ? (
            /* حالة النجاح */
            <div className="text-center py-10" style={{ animation: "riseIn 0.5s ease-out both" }}>
              <span className="text-6xl">✅</span>
              <h3 className="mt-4 text-xl font-extrabold text-gray-800">وصلت رسالتك!</h3>
              <p className="text-gray-500 mt-2 text-sm md:text-base">
                هنتواصل معاك على <b className="text-gray-700">{form.email}</b> خلال 24 ساعة
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", phone: "", subject: "", message: "" });
                }}
                className="mt-6 px-6 py-2.5 rounded-xl border-2 border-brand-primary text-brand-primary font-bold text-sm hover:bg-brand-primary hover:text-white transition-all"
              >
                إرسال رسالة تانية
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h2 className="text-lg md:text-xl font-extrabold text-gray-800 flex items-center gap-2 mb-6">
                <span className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-lg">✉️</span>
                ابعتلنا رسالة
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* البريد */}
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

                {/* الهاتف (اختياري) */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    رقم الهاتف <span className="text-gray-300 font-normal">(اختياري)</span>
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value.replace(/[^\d]/g, ""))}
                    placeholder="01xxxxxxxxx"
                    className={inputCls(errors.phone)}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">⚠️ {errors.phone}</p>}
                </div>

                {/* الموضوع */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">الموضوع</label>
                  <select
                    value={form.subject}
                    onChange={(e) => set("subject", e.target.value)}
                    className={`${inputCls(errors.subject)} ${form.subject ? "text-gray-700" : "text-gray-300"}`}
                  >
                    <option value="">اختار الموضوع...</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.subject && <p className="text-red-500 text-xs mt-1">⚠️ {errors.subject}</p>}
                </div>
              </div>

              {/* الرسالة */}
              <div className="mt-4">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">رسالتك</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="اكتب رسالتك هنا بالتفصيل..."
                  className={`${inputCls(errors.message)} resize-none`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">⚠️ {errors.message}</p>}
              </div>

              {/* زر الإرسال */}
              <button
                type="submit"
                disabled={sending}
                className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-extrabold shadow-lg hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <SendIcon />
                    إرسال الرسالة
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* المعلومات الجانبية */}
        <div className="lg:col-span-2 space-y-4">
          {/* مقرنا */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-5">
            <h3 className="font-extrabold text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center">📍</span>
              مقرنا
            </h3>
            <p className="text-gray-500 text-sm mt-2.5 leading-relaxed">
              القاهرة، مصر — نقدم خدماتنا رقمياً 100% أونلاين، وبنوصل لكل محافظات مصر
            </p>
          </div>

          {/* سرعة الرد */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-100 shadow-md p-5">
            <h3 className="font-extrabold text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">⚡</span>
              سرعة الرد
            </h3>
            <p className="text-gray-500 text-sm mt-2.5 leading-relaxed">
              متوسط زمن الرد أقل من ساعتين في أوقات العمل — ورسائل الواتساب أسرع
            </p>
          </div>

          {/* السوشيال */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-5">
            <h3 className="font-extrabold text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-pink-100 flex items-center justify-center">🌐</span>
              تابعنا
            </h3>
            <div className="flex gap-3 mt-3.5">
              {[
                { icon: <FacebookIcon />, cls: "bg-[#1877F2]" },
                { icon: <InstagramIcon />, cls: "bg-gradient-to-br from-purple-500 to-pink-500" },
                { icon: <WhatsAppIcon />, cls: "bg-[#25D366]" },
                { icon: <TikTokIcon />, cls: "bg-gray-900" },
              ].map((s, i) => (
                <button
                  key={i}
                  className={`w-10 h-10 rounded-xl ${s.cls} text-white flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all`}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}