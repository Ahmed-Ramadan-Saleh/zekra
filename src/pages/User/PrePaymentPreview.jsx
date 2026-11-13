import React, { useState, useEffect } from "react";

export default function PrePaymentPreview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0); // 0: ظرف مغلق, 1: مفتوح
  const [copied, setCopied] = useState(false);

  // ===== بيانات المنتج المخصص (تأتي من الصفحة السابقة) =====
  const product = {
    title: "رسالة عيد ميلاد سحرية",
    category: "أعياد الميلاد",
    price: 75,
    oldPrice: 120,
    templateId: "tpl_001",
    orderId: "ORD-" + Date.now().toString().slice(-6),
  };

  // ===== ملخص التخصيصات التي تمت =====
  const customizationSummary = [
    { icon: "✏️", label: "اسم الشخص", value: "أحمد" },
    { icon: "💌", label: "الرسالة", value: "كل عام وأنت بخير! عيد ميلاد سعيد يا صديقي العزيز." },
    { icon: "📝", label: "نص إضافي", value: "أتمنى لك سنة مليئة بالسعادة والنجاح." },
    { icon: "🎨", label: "لون الخلفية", value: "بنفسجي", color: "#7C3AED" },
    { icon: "🔤", label: "الخط", value: "Cairo" },
    { icon: "🖼️", label: "الصور المرفوعة", value: "3 صور" },
    { icon: "🎵", label: "الأغنية", value: "أغنية عيد الميلاد (0:45)" },
    { icon: "✨", label: "مؤثر النصوص", value: "ظهور تدريجي" },
    { icon: "🎬", label: "مؤثر الصور", value: "تكبير" },
    { icon: "🎁", label: "الهدايا المفعّلة", value: "خروجة، إكسسوار" },
  ];

  // ===== حساب السعر =====
  const subtotal = product.price;
  const discount = product.oldPrice - product.price;
  const tax = Math.round(subtotal * 0.14); // 14% ضريبة
  const total = subtotal + tax;

  // فتح الظرف تلقائياً بعد ثانيتين
  useEffect(() => {
    if (isPlaying && step === 0) {
      const timer = setTimeout(() => setStep(1), 1500);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, step]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(product.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 font-sans">

      {/* ===== الشريط العلوي ===== */}
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/10 rounded-full transition">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div>
              <h1 className="text-sm font-bold text-white">معاينة المنتج قبل الدفع</h1>
              <p className="text-xs text-gray-400">رقم الطلب: {product.orderId}</p>
            </div>
          </div>
          <button
            onClick={copyOrderId}
            className="text-xs text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                تم النسخ
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                نسخ رقم الطلب
              </>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ===== تنبيه Watermark ===== */}
        <div className="bg-amber-500/20 border border-amber-500/40 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="text-2xl">⚠️</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-300">هذه معاينة محمية بعلامة مائية</p>
            <p className="text-xs text-amber-200/80">ستتم إزالة العلامة المائية تلقائياً بعد إتمام عملية الدفع.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* ===== العمود الأيمن: المعاينة التفاعلية (3/5) ===== */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* المعاينة التفاعلية */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-brand-secondary rounded"></span>
                  المعاينة التفاعلية
                </h2>
                <button
                  onClick={() => { setIsPlaying(!isPlaying); setStep(0); }}
                  className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white px-4 py-2 rounded-full text-sm font-bold hover:shadow-lg transition flex items-center gap-2"
                >
                  {isPlaying ? (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                      إيقاف
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      تشغيل المعاينة
                    </>
                  )}
                </button>
              </div>

              {/* شاشة المعاينة */}
              <div className="relative aspect-[3/4] max-w-sm mx-auto bg-gradient-to-br from-brand-primary to-brand-secondary rounded-3xl overflow-hidden shadow-2xl">
                
                {/* خلفية مزخرفة */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-20 -translate-x-20"></div>

                {/* الحالة 1: ظرف مغلق */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6 animate-fade-in">
                    <div className="text-6xl mb-4 animate-bounce">✉️</div>
                    <h3 className="text-xl font-bold mb-2">اضغط للتشغيل</h3>
                    <p className="text-sm opacity-80">شاهد كيف سيستلم أحباؤك الهدية</p>
                  </div>
                )}

                {/* الحالة 2: فتح الظرف */}
                {isPlaying && step === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-6xl animate-fade-in">
                    <div className="animate-ping">✉️</div>
                  </div>
                )}

                {/* الحالة 3: المحتوى المكشوف */}
                {isPlaying && step === 1 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6 animate-fade-in">
                    <div className="text-5xl mb-3">🎂</div>
                    <h2 className="text-2xl font-extrabold mb-2">عيد ميلاد سعيد</h2>
                    <h3 className="text-xl font-bold mb-3">أحمد 🎉</h3>
                    <p className="text-sm leading-relaxed opacity-90 mb-4">
                      كل عام وأنت بخير! عيد ميلاد سعيد يا صديقي العزيز.
                    </p>
                    <p className="text-xs opacity-75 mb-4">
                      أتمنى لك سنة مليئة بالسعادة والنجاح.
                    </p>

                    {/* الصور */}
                    <div className="grid grid-cols-3 gap-2 mb-4 w-full">
                      <div className="aspect-square bg-white/20 rounded-lg flex items-center justify-center text-2xl">📷</div>
                      <div className="aspect-square bg-white/20 rounded-lg flex items-center justify-center text-2xl">📷</div>
                      <div className="aspect-square bg-white/20 rounded-lg flex items-center justify-center text-2xl">📷</div>
                    </div>

                    {/* الموسيقى */}
                    <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs mb-3">
                      <span className="animate-pulse">🎵</span>
                      أغنية عيد الميلاد
                    </div>

                    {/* الهدايا */}
                    <div className="flex justify-center gap-2">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-xs">
                        <div className="text-xl">🎉</div>
                        خروجة
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-xs">
                        <div className="text-xl">🎁</div>
                        إكسسوار
                      </div>
                    </div>
                  </div>
                )}

                {/* Watermark - يظهر دائماً */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="text-white/15 text-4xl font-extrabold rotate-[-30deg] tracking-wider">
                    بصمة وذكرى
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white/60 text-[10px] px-2 py-1 rounded">
                  معاينة محمية
                </div>
              </div>

              {/* مؤشرات المعاينة */}
              <div className="flex items-center justify-center gap-4 mt-4">
                {["الظرف", "الرسالة", "الصور", "الهدايا"].map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition ${isPlaying && step >= (idx > 0 ? 1 : 0) ? "bg-green-400" : "bg-gray-500"}`}></div>
                    <span className={`text-xs ${isPlaying && step >= (idx > 0 ? 1 : 0) ? "text-green-400" : "text-gray-500"}`}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ملخص التخصيصات */}
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-brand-primary rounded"></span>
                ملخص التخصيصات
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {customizationSummary.map((item, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-xs text-gray-400">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white font-medium truncate flex-1">{item.value}</p>
                      {item.color && (
                        <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: item.color }}></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== العمود الأيسر: ملخص الطلب (2/5) ===== */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 shadow-2xl sticky top-20">
              
              {/* رأس الملخص */}
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">ملخص الطلب</h2>
                  <p className="text-xs text-gray-500">{product.orderId}</p>
                </div>
              </div>

              {/* معلومات المنتج */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-2xl">
                  🎂
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm truncate">{product.title}</h3>
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <p className="text-xs text-brand-primary font-semibold mt-1">قالب تفاعلي</p>
                </div>
              </div>

              {/* تفاصيل التسعير */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">السعر الأصلي</span>
                  <span className="text-gray-400 line-through">{product.oldPrice} ج.م</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">السعر بعد الخصم</span>
                  <span className="text-brand-primary font-bold">{product.price} ج.م</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ضريبة القيمة المضافة (14%)</span>
                  <span className="text-gray-800">{tax} ج.م</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>وفّرت</span>
                  <span className="font-bold">{discount} ج.م</span>
                </div>
              </div>

              {/* الإجمالي */}
              <div className="bg-gradient-to-l from-purple-50 to-pink-50 rounded-2xl p-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">الإجمالي المطلوب دفعه</span>
                  <span className="text-2xl font-extrabold text-brand-primary">{total} ج.م</span>
                </div>
              </div>

              {/* مميزات الطلب */}
              <div className="space-y-2 mb-5">
                {[
                  { icon: "⚡", text: "تسليم فوري بعد الدفع" },
                  { icon: "🔗", text: "رابط خاص ومميز للمشاركة" },
                  { icon: "📱", text: "QR Code للوصول السريع" },
                  { icon: "♾️", text: "وصول دائم للمنتج" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* الأزرار */}
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-l from-brand-primary to-brand-secondary text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  انتقل للدفع الآن
                </button>
                <button className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  تعديل التخصيص
                </button>
              </div>

              {/* ضمان الأمان */}
              <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-gray-100">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-xs text-gray-500">دفع آمن ومشفّر 100%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}