import React, { useState, useEffect } from "react";

export default function OrderSuccess() {
  const [copied, setCopied] = useState(false);
  const [confetti, setConfetti] = useState(true);

  // ===== بيانات الطلب =====
  const order = {
    orderId: "ORD-847291",
    productTitle: "رسالة عيد ميلاد سحرية",
    recipientName: "أحمد",
    totalPaid: 75,
    // الرابط النهائي الفريد للمنتج
    finalLink: "https://thekra-basma.com/gift/x7k9p2m4",
  };

  // QR Code مولد من الرابط (خدمة مجانية)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(order.finalLink)}`;

  // رسالة المشاركة
  const shareMessage = `🎁 عندي مفاجأة خاصة لك! افتح هذا الرابط: ${order.finalLink}`;

  // إخفاء الكونفيتي بعد 3 ثوانٍ
  useEffect(() => {
    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // ===== نسخ الرابط =====
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(order.finalLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("انسخ الرابط يدوياً: " + order.finalLink);
    }
  };

  // ===== أزرار المشاركة =====
  const shareButtons = [
    {
      name: "واتساب",
      color: "bg-[#25D366] hover:bg-[#1da851]",
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      url: `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
    },
    {
      name: "فيسبوك",
      color: "bg-[#1877F2] hover:bg-[#0d65d9]",
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(order.finalLink)}`,
    },
    {
      name: "تليجرام",
      color: "bg-[#0088cc] hover:bg-[#0077b3]",
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.03.01-.14-.065-.198-.074-.058-.184-.038-.263-.023-.112.023-1.898 1.206-5.36 3.548-.507.35-.962.52-1.371.51-.45-.008-1.317-.254-1.962-.463-.79-.257-1.417-.394-1.402-.83.03-.607.888-.92 1.81-1.446 5.03-2.903 6.735-3.83 7.393-3.862z"/>
        </svg>
      ),
      url: `https://t.me/share/url?url=${encodeURIComponent(order.finalLink)}&text=${encodeURIComponent("🎁 عندي مفاجأة خاصة لك!")}`,
    },
    {
      name: "إكس (تويتر)",
      color: "bg-black hover:bg-gray-800",
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700 font-sans relative overflow-hidden">

      {/* ===== تأثير الكونفيتي ===== */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-sm animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#F59E0B", "#EC4899", "#8B5CF6", "#10B981", "#3B82F6"][i % 5],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-10 relative z-20">

        {/* ===== رسالة النجاح ===== */}
        <div className="text-center mb-10 animate-fade-in">
          {/* أيقونة النجاح المتحركة */}
          <div className="w-24 h-24 mx-auto mb-5 relative">
            <div className="absolute inset-0 bg-green-400/30 rounded-full animate-ping"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            تم الدفع بنجاح! 🎉
          </h1>
          <p className="text-purple-200 max-w-md mx-auto leading-relaxed">
            مبروك! ذكرتك جاهزة الآن وتمت إزالة العلامة المائية. شارك الرابط مع <span className="font-bold text-white">{order.recipientName}</span> لاستلام المفاجأة.
          </p>
        </div>

        {/* ===== بطاقة الرابط النهائي ===== */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6 animate-fade-in">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-brand-primary rounded"></span>
            رابط المنتج النهائي
          </h2>

          {/* الرابط */}
          <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-2xl p-2 pr-4">
            <svg className="w-5 h-5 text-brand-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <input
              type="text"
              value={order.finalLink}
              readOnly
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none font-medium"
              dir="ltr"
              style={{ textAlign: "left" }}
            />
            <button
              onClick={copyLink}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-gradient-to-l from-brand-primary to-brand-secondary text-white hover:shadow-lg"
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  تم النسخ!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  نسخ الرابط
                </>
              )}
            </button>
          </div>

          {/* معلومات الرابط */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: "♾️", text: "رابط دائم" },
              { icon: "🔓", text: "بدون Watermark" },
              { icon: "📱", text: "يعمل على الجوال" },
            ].map((item, idx) => (
              <div key={idx} className="bg-purple-50 rounded-xl p-3 text-center">
                <div className="text-xl mb-1">{item.icon}</div>
                <p className="text-[11px] text-gray-600 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== QR Code + المشاركة ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* بطاقة QR Code */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 text-center animate-fade-in">
            <h2 className="font-bold text-gray-800 mb-1 flex items-center justify-center gap-2">
              <span className="w-1 h-5 bg-brand-secondary rounded"></span>
              رمز الاستجابة (QR)
            </h2>
            <p className="text-xs text-gray-500 mb-4">امسح الكود لفتح المفاجأة مباشرة</p>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 inline-block">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-40 h-40 rounded-xl bg-white p-2 shadow-md"
              />
            </div>
            
            <div className="flex gap-2 mt-4">
              <a
                href={qrCodeUrl}
                download="thikra-qr.png"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                تحميل QR
              </a>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                طباعة
              </button>
            </div>
          </div>

          {/* بطاقة المشاركة */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 animate-fade-in">
            <h2 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-accent rounded"></span>
              شارك المفاجأة الآن
            </h2>
            <p className="text-xs text-gray-500 mb-5">أرسل الرابط لـ {order.recipientName} عبر:</p>

            <div className="space-y-3">
              {shareButtons.map((btn, idx) => (
                <a
                  key={idx}
                  href={btn.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-3 ${btn.color} text-white p-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                >
                  {btn.icon}
                  <span>مشاركة عبر {btn.name}</span>
                  <svg className="w-4 h-4 mr-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14L21 3m0 0l-5.4 1L21 3l-1 5.4M21 3l-9.9 9.9" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 3l-1 5.4" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ===== تفاصيل الطلب ===== */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-6 border border-white/20 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-white">
            {[
              { label: "رقم الطلب", value: order.orderId },
              { label: "المنتج", value: order.productTitle },
              { label: "المستلم", value: order.recipientName },
              { label: "المبلغ المدفوع", value: `${order.totalPaid} ج.م` },
            ].map((item, idx) => (
              <div key={idx}>
                <p className="text-xs text-purple-200 mb-1">{item.label}</p>
                <p className="text-sm font-bold truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== الأزرار النهائية ===== */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in">
          <button className="flex-1 bg-white text-brand-primary py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            الذهاب لطلباتي
          </button>
          <button className="flex-1 bg-white/10 backdrop-blur-md border border-white/30 text-white py-4 rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            تصفح قوالب أخرى
          </button>
        </div>

        {/* ملاحظة */}
        <p className="text-center text-purple-200/60 text-xs mt-8">
          يمكنك دائماً الوصول لمنتجاتك من صفحة "طلباتي" في حسابك
        </p>
      </div>
    </div>
  );
}