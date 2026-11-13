import  { useState } from "react";

export default function ProductDetails() {
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // ===== بيانات القالب =====
  const template = {
    title: "رسالة عيد ميلاد سحرية",
    category: "أعياد الميلاد",
    type: "رسالة تفاعلية",
    price: 75,
    oldPrice: 120,
    rating: 4.9,
    reviews: 124,
    sales: 340,
    description:
      "قالب تفاعلي ساحر لعيد الميلاد، يحتوي على ظرف يُفتح بالضغط، رسالة متحركة، مع تشغيل أغنية، وعرض للصور بطريقة سينمائية. اجعل عيد ميلاد من تحب تجربة لا تُنسى.",
    images: [
      "https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Preview+1",
      "https://via.placeholder.com/800x600/EC4899/FFFFFF?text=Preview+2",
      "https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Preview+3",
      "https://via.placeholder.com/800x600/10B981/FFFFFF?text=Preview+4",
    ],
    video: "https://via.placeholder.com/800x600/1F2937/FFFFFF?text=Demo+Video",
    features: [
      { icon: "✏️", text: "كتابة الاسم والرسالة" },
      { icon: "🖼️", text: "رفع حتى 5 صور" },
      { icon: "🎵", text: "اختيار أغنية من المكتبة" },
      { icon: "🎨", text: "تغيير الألوان والثيمات" },
      { icon: "✨", text: "مؤثرات وحركات متعددة" },
      { icon: "🎁", text: "إضافة هدايا اختيارية" },
    ],
  };

  // ===== القوالب المشابهة =====
  const relatedTemplates = [
    { id: 1, title: "كارت تهنئة زفاف تفاعلي", price: 50, image: "https://via.placeholder.com/400x500/EC4899/FFFFFF?text=Wedding" },
    { id: 2, title: "ذكرياتنا معاً (فيديو)", price: 100, image: "https://via.placeholder.com/400x500/F59E0B/FFFFFF?text=Memories" },
    { id: 3, title: "عيد ميلاد سعيد", price: 55, image: "https://via.placeholder.com/400x500/7C3AED/FFFFFF?text=Happy+Day" },
    { id: 4, title: "دعوة تخرج أنيقة", price: 30, image: "https://via.placeholder.com/400x500/10B981/FFFFFF?text=Graduation" },
  ];

  const discount = Math.round((1 - template.price / template.oldPrice) * 100);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans pb-12">

      {/* ===== مسار التنقل (Breadcrumb) ===== */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <a href="#" className="hover:text-brand-primary transition">الرئيسية</a>
            <span>/</span>
            <a href="#" className="hover:text-brand-primary transition">المتجر</a>
            <span>/</span>
            <a href="#" className="hover:text-brand-primary transition">{template.category}</a>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate">{template.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ===== القسم الرئيسي: معرض الوسائط + المعلومات ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* === معرض الوسائط === */}
          <div className="space-y-4">
            {/* الصورة الكبيرة / الفيديو */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg aspect-[4/3] group">
              {showVideo ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 relative">
                  <img src={template.video} alt="Demo Video" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center animate-pulse-slow">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowVideo(false)}
                    className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-black/70 transition"
                  >
                    ← العودة للصور
                  </button>
                </div>
              ) : (
                <>
                  <img 
                    src={template.images[activeImage]} 
                    alt={template.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  {/* شارة الخصم */}
                  {discount > 0 && (
                    <span className="absolute top-4 right-4 bg-brand-accent text-white text-sm px-3 py-1.5 rounded-full font-bold shadow-lg">
                      خصم {discount}%
                    </span>
                  )}
                  {/* زر عرض الفيديو */}
                  <button 
                    onClick={() => setShowVideo(true)}
                    className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-black/80 transition flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    شاهد الفيديو التجريبي
                  </button>
                </>
              )}
            </div>

            {/* الصور المصغرة */}
            <div className="grid grid-cols-4 gap-3">
              {template.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => { setActiveImage(idx); setShowVideo(false); }}
                  className={`relative rounded-xl overflow-hidden aspect-square transition-all duration-300 ${
                    activeImage === idx && !showVideo
                      ? "ring-2 ring-brand-primary ring-offset-2 scale-95"
                      : "hover:ring-2 hover:ring-gray-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* === معلومات القالب === */}
          <div className="space-y-6">
            
            {/* العنوان والتصنيف */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-brand-primary bg-purple-50 px-3 py-1 rounded-full font-semibold">{template.category}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{template.type}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-3">{template.title}</h1>
              
              {/* التقييم والمبيعات */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-amber-400">⭐</span>
                  <span className="font-bold text-gray-800">{template.rating}</span>
                  <span className="text-gray-500">({template.reviews} تقييم)</span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>{template.sales} عملية بيع</span>
                </div>
              </div>
            </div>

            {/* السعر */}
            <div className="bg-gradient-to-l from-purple-50 to-pink-50 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl font-extrabold text-brand-primary">{template.price} ج.م</span>
                {template.oldPrice && (
                  <span className="text-lg text-gray-400 line-through">{template.oldPrice} ج.م</span>
                )}
                {discount > 0 && (
                  <span className="bg-brand-accent text-white text-xs px-2 py-1 rounded-full font-bold">
                    وفّر {template.oldPrice - template.price} ج.م
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">شامل جميع المميزات، بدون رسوم إضافية</p>
            </div>

            {/* الوصف */}
            <div>
              <h3 className="font-bold text-gray-800 mb-2">📋 وصف القالب</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{template.description}</p>
            </div>

            {/* ملخص التخصيص */}
            <div className="bg-white border-2 border-purple-100 rounded-2xl p-5">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-brand-primary rounded"></span>
                ماذا يمكنك تخصيصه؟
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {template.features.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-purple-50/50 rounded-xl p-3 hover:bg-purple-50 transition">
                    <span className="text-2xl">{f.icon}</span>
                    <span className="text-sm text-gray-700 font-medium">{f.text}</span>
                    <svg className="w-4 h-4 text-green-500 mr-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-gradient-to-l from-brand-primary to-brand-secondary text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                تخصيص القالب الآن
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                  isFavorite
                    ? "bg-pink-50 border-pink-300 text-pink-500"
                    : "bg-white border-gray-200 text-gray-400 hover:border-pink-300 hover:text-pink-500"
                }`}
              >
                <svg className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* ضمانات */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              {[
                { icon: "⚡", text: "تسليم فوري" },
                { icon: "🔒", text: "دفع آمن" },
                { icon: "♾️", text: "تعديل بلا حدود" },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-xs text-gray-600 font-medium">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== القوالب المشابهة ===== */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">قوالب مشابهة 🔥</h3>
              <p className="text-gray-500 text-sm mt-1">قد تعجبك هذه القوالب أيضاً</p>
            </div>
            <a href="#" className="text-brand-primary font-semibold hover:underline text-sm flex items-center gap-1 group">
              عرض الكل
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedTemplates.map((t) => (
              <div key={t.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 md:h-64 overflow-hidden">
                  <img src={t.image} alt={t.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white text-brand-primary px-4 py-2 rounded-full font-bold text-xs transform scale-90 group-hover:scale-100 transition-transform">
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-800 mb-2 truncate text-sm">{t.title}</h4>
                  <span className="text-brand-primary font-bold">{t.price} ج.م</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}