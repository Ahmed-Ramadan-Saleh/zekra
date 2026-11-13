import React, { useEffect, useState } from "react";

/* ============================================================
   AdminProductForm.jsx — إضافة / تعديل منتج
   نموذج متعدد الخطوات: الأساسيات ← الصور ← السعر ← التخصيص
   مع حساب حي للضريبة 14% وملخص السعر النهائي
   البيانات Mock — عند التعديل اجلب بيانات المنتج بـ API
   ============================================================ */
/* ⭐ هذه الصفحة "محتوى فقط" — تُعرض داخل AdminLayout عبر <Outlet />
   القشرة (Sidebar + Topbar + العنوان) تأتي من الـLayout ولا تُستدعى هنا. */



const STEPS = [
  { key: "basic", title: "الأساسيات", emoji: "📝" },
  { key: "media", title: "الصور", emoji: "🖼️" },
  { key: "pricing", title: "السعر", emoji: "💰" },
  { key: "custom", title: "التخصيص", emoji: "🧩" },
];

const CATEGORIES = ["أعياد ميلاد", "زواج", "تخرج", "مولود جديد", "دعوات", "رسائل حب", "شكر وتقدير", "مناسبات إسلامية"];

const IMAGE_POOL = [
  { emoji: "🎂", grad: "from-amber-400 to-orange-500" },
  { emoji: "💍", grad: "from-pink-400 to-rose-600" },
  { emoji: "🎓", grad: "from-sky-400 to-blue-600" },
  { emoji: "🎁", grad: "from-violet-400 to-purple-600" },
  { emoji: "✨", grad: "from-amber-300 to-yellow-500" },
  { emoji: "❤️", grad: "from-rose-400 to-red-600" },
];

const FIELD_LIBRARY = [
  { key: "recipient", label: "اسم المُهدى إليه", type: "نص قصير", emoji: "🎁" },
  { key: "message", label: "رسالة المُرسل", type: "نص طويل", emoji: "💌" },
  { key: "photos", label: "صور المُهدى إليه", type: "صور متعددة", emoji: "🖼️" },
  { key: "music", label: "الموسيقى المصاحبة", type: "قائمة اختيار", emoji: "🎵" },
  { key: "theme", label: "الخلفية / الثيم", type: "قائمة اختيار", emoji: "🌌" },
  { key: "date", label: "تاريخ المناسبة", type: "تاريخ", emoji: "📅" },
];

const GIFTS_LIST = [
  { key: "cash", label: "خروجة نقدية 💸" },
  { key: "cinema", label: "قسيمة سينما 🎬" },
  { key: "coupon20", label: "خصم 20% 🏷️" },
  { key: "coffee", label: "قسيمة قهوة ☕" },
  { key: "voice", label: "رسالة صوتية 🎙️" },
];

const KEYFRAMES = `
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { 0% { transform: scale(.85); opacity: 0; } 70% { transform: scale(1.04); } 100% { transform: scale(1); opacity: 1; } }
`;


function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold whitespace-nowrap max-w-[90vw]" style={{ animation: "pop .3s ease both" }}>
      {msg}
    </div>
  );
}

export default function AdminProductForm() {
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState(null);

  /* الخطوة 1: الأساسيات */
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [emoji, setEmoji] = useState("🎁");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("draft");
  const [nameError, setNameError] = useState(false);

  /* الخطوة 2: الصور */
  const [images, setImages] = useState([IMAGE_POOL[0], IMAGE_POOL[1]]);

  /* الخطوة 3: السعر */
  const [price, setPrice] = useState("250");
  const [discount, setDiscount] = useState("0");

  /* الخطوة 4: التخصيص */
  const [fields, setFields] = useState(["recipient", "message", "photos"]);
  const [gifts, setGifts] = useState(["cash"]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  /* حسابات السعر الحية */
  const priceNum = parseFloat(price) || 0;
  const discNum = Math.min(100, Math.max(0, parseFloat(discount) || 0));
  const afterDiscount = Math.round(priceNum * (1 - discNum / 100));
  const tax = Math.round(afterDiscount * 0.14);
  const finalPrice = afterDiscount + tax;

  const goNext = () => {
    if (step === 0) {
      if (!name.trim() || name.trim().length < 3) {
        setNameError(true);
        setToast("اكتب اسم القالب (3 أحرف على الأقل) ⚠️");
        return;
      }
      setNameError(false);
    }
    if (step < STEPS.length - 1) setStep(step + 1);
    else setToast("تم حفظ المنتج بنجاح ✓ (تجريبي — اربطه بالـ API)");
  };

  const toggleFrom = (arr, setArr, key) => {
    setArr(arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key]);
  };

  const chipCls = (on) => `text-xs font-bold px-3.5 py-2 rounded-xl border-2 transition cursor-pointer ${on ? "border-transparent bg-gradient-to-l from-brand-primary to-brand-secondary text-white shadow-sm" : "border-slate-200 bg-white text-slate-500 hover:border-brand-primary/50"}`;

  const inputCls = (hasError) => `w-full px-4 py-3 rounded-xl border-2 bg-slate-50 focus:bg-white outline-none transition text-sm font-medium ${hasError ? "border-rose-300 focus:border-rose-400" : "border-slate-200 focus:border-brand-primary"}`;

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div className="max-w-3xl mx-auto">
        {/* مؤشر الخطوات */}
        <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5 sm:p-6" style={{ animation: "fadeUp .45s ease both" }}>
          <ol className="flex items-center">
            {STEPS.map((s, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <li key={s.key} className="flex items-center flex-1 last:flex-none">
                  <button onClick={() => i < step && setStep(i)} className={`flex items-center gap-2 ${i < step ? "cursor-pointer" : "cursor-default"}`}>
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold transition shrink-0 ${done ? "bg-gradient-to-tr from-brand-primary to-brand-secondary text-white" : current ? "bg-white text-brand-primary ring-2 ring-brand-primary" : "bg-slate-100 text-slate-400"}`}>
                      {done ? "✓" : i + 1}
                    </span>
                    <span className={`text-xs font-bold hidden sm:block whitespace-nowrap ${current ? "text-brand-primary" : done ? "text-slate-600" : "text-slate-400"}`}>{s.emoji} {s.title}</span>
                  </button>
                  {i < STEPS.length - 1 && <span className={`flex-1 h-0.5 mx-2 rounded transition ${done ? "bg-brand-primary" : "bg-slate-200"}`} />}
                </li>
              );
            })}
          </ol>
        </section>

        {/* محتوى الخطوة */}
        <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5 sm:p-6 mt-5" style={{ animation: "pop .3s ease both" }}>
          {/* الخطوة 1 */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-extrabold text-slate-800">📝 المعلومات الأساسية</h2>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">اسم القالب *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: قالب عيد ميلاد — نجوم ذهبية" className={inputCls(nameError)} />
                {nameError && <p className="text-xs text-rose-500 font-bold mt-1.5">⚠️ الاسم مطلوب (3 أحرف على الأقل)</p>}
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">التصنيف</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputCls(false)} cursor-pointer`}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">أيقونة القالب</label>
                  <input value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength="2" className={`${inputCls(false)} text-center text-xl`} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">حالة النشر</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputCls(false)} cursor-pointer`}>
                    <option value="draft">مسودة</option>
                    <option value="published">منشور</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">وصف القالب</label>
                <textarea rows="3" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="وصف قصير يظهر للعميل في صفحة القالب…" className={inputCls(false) + " resize-none"} />
              </div>
            </div>
          )}

          {/* الخطوة 2 */}
          {step === 1 && (
            <div>
              <h2 className="font-extrabold text-slate-800">🖼️ صور ومعاينات القالب</h2>
              <p className="text-xs text-slate-400 mt-1">أضف صور المعاينة — الصورة الأولى هي الغلاف الرئيسي</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {images.map((img, i) => (
                  <div key={i} className={`relative h-28 rounded-2xl bg-gradient-to-tr ${img.grad} flex items-center justify-center`}>
                    <span className="text-4xl">{img.emoji}</span>
                    {i === 0 && <span className="absolute top-2 right-2 bg-white/90 text-[10px] font-extrabold text-slate-700 px-2 py-0.5 rounded-full">الغلاف</span>}
                    <button onClick={() => setImages(images.filter((_, x) => x !== i))} aria-label="حذف الصورة" className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 text-rose-500 flex items-center justify-center text-xs hover:bg-white transition shadow">✕</button>
                  </div>
                ))}
                <button onClick={() => setImages([...images, IMAGE_POOL[images.length % IMAGE_POOL.length]])} className="h-28 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-brand-primary hover:text-brand-primary transition flex flex-col items-center justify-center gap-1">
                  <span className="text-2xl">＋</span>
                  <span className="text-xs font-bold">إضافة صورة</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 bg-slate-50 rounded-xl p-3 mt-4 leading-relaxed">💡 هنا معاينة تجريبية بالإيموجي — عند الربط سيُستبدل برفع صور حقيقية مع سحب وإفلات ومعالجة تغيير الحجم تلقائياً.</p>
            </div>
          )}

          {/* الخطوة 3 */}
          {step === 2 && (
            <div>
              <h2 className="font-extrabold text-slate-800">💰 السعر والخصم</h2>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">السعر الأساسي (ج.م) *</label>
                  <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls(false)} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">نسبة الخصم (0 — 100)</label>
                  <input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} className={inputCls(false)} />
                </div>
              </div>
              {/* ملخص حي */}
              <div className="mt-5 bg-gradient-to-l from-brand-primary to-brand-secondary rounded-2xl p-5 text-white">
                <p className="text-xs font-bold text-white/70">السعر النهائي الذي سيدفعه العميل</p>
                <p className="text-3xl font-extrabold mt-1">{finalPrice.toLocaleString("en-US")} ج.م</p>
                <dl className="mt-4 space-y-1.5 text-sm bg-white/10 rounded-xl p-3.5">
                  <div className="flex justify-between"><dt>السعر قبل الخصم</dt><dd className={discNum > 0 ? "line-through text-white/60" : ""}>{priceNum.toLocaleString("en-US")} ج.م</dd></div>
                  <div className="flex justify-between"><dt>قيمة الخصم ({discNum}%)</dt><dd>-{(priceNum - afterDiscount).toLocaleString("en-US")} ج.م</dd></div>
                  <div className="flex justify-between"><dt>الضريبة (14%)</dt><dd>+{tax.toLocaleString("en-US")} ج.م</dd></div>
                  <div className="border-t border-white/20 pt-2 flex justify-between font-extrabold"><dt>الإجمالي</dt><dd>{finalPrice.toLocaleString("en-US")} ج.م</dd></div>
                </dl>
              </div>
            </div>
          )}

          {/* الخطوة 4 */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-extrabold text-slate-800">🧩 حقول التخصيص والهدايا</h2>
                <p className="text-xs text-slate-400 mt-1">اختر ما سيعبّئه العميل عند شراء هذا القالب</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-2">مكتبة الحقول</p>
                <div className="flex flex-wrap gap-2">
                  {FIELD_LIBRARY.map((f) => (
                    <button key={f.key} onClick={() => toggleFrom(fields, setFields, f.key)} className={chipCls(fields.includes(f.key))}>
                      {f.emoji} {f.label} <span className="opacity-70">({f.type})</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 mb-2">الهدايا الداخلية المرتبطة 🎁</p>
                <div className="flex flex-wrap gap-2">
                  {GIFTS_LIST.map((g) => (
                    <button key={g.key} onClick={() => toggleFrom(gifts, setGifts, g.key)} className={chipCls(gifts.includes(g.key))}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              <a href="/admin/fields" className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline">لضبط ترتيب الحقول وخصائصها بالسحب والإفلات ← منشئ حقول التخصيص</a>
            </div>
          )}
        </section>

        {/* أزرار التنقل */}
        <div className="flex items-center justify-between gap-3 mt-5">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className={`text-sm font-bold px-6 py-3 rounded-xl transition ${step === 0 ? "bg-white border border-slate-200 text-slate-300 cursor-not-allowed" : "bg-white border-2 border-slate-200 text-slate-600 hover:border-brand-primary/50"}`}>
            → السابق
          </button>
          <button onClick={goNext} className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white text-sm font-bold px-8 py-3 rounded-xl hover:opacity-90 transition shadow-lg">
            {step === STEPS.length - 1 ? "💾 حفظ المنتج" : "التالي ←"}
          </button>
        </div>
      </div>

      <Toast msg={toast} />
    </>
  );
}
