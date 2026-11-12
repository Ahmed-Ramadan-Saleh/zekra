import { useState, useEffect } from "react";


export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // ===== البيانات (يمكن استبدالها بـ API لاحقاً) =====
  const banners = [
    {
      title: "اصنع ذكرى لا تُنسى",
      subtitle: "هدايا رقمية تفاعلية تلامس القلوب",
      cta: "استكشف المتجر",
      bg: "from-brand-primary to-brand-secondary",
    },
    {
      title: "خصومات تصل إلى 50%",
      subtitle: "على أحدث قوالب أعياد الميلاد",
      cta: "تسوق الآن",
      bg: "from-amber-500 to-red-500",
    },
  ];

  const categories = [
    { name: "أعياد الميلاد", icon: "🎂", color: "bg-pink-50 text-pink-600 hover:bg-pink-100" },
    { name: "التهنئة", icon: "🎉", color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
    { name: "الشكر", icon: "🙏", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
    { name: "رسائل حب", icon: "💖", color: "bg-red-50 text-red-600 hover:bg-red-100" },
    { name: "دعوات", icon: "✉️", color: "bg-green-50 text-green-600 hover:bg-green-100" },
    { name: "فيديوهات", icon: "🎬", color: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" },
  ];

  const featuredTemplates = [
    { id: 1, title: "رسالة عيد ميلاد سحرية", price: 75, oldPrice: 120, rating: 4.9, image: "https://via.placeholder.com/400x500/7C3AED/FFFFFF?text=Birthday", isVideo: false },
    { id: 2, title: "كارت تهنئة زفاف تفاعلي", price: 50, oldPrice: null, rating: 4.8, image: "https://via.placeholder.com/400x500/EC4899/FFFFFF?text=Wedding", isVideo: true },
    { id: 3, title: "ذكرياتنا معاً (فيديو)", price: 100, oldPrice: 150, rating: 5.0, image: "https://via.placeholder.com/400x500/F59E0B/FFFFFF?text=Memories", isVideo: true },
    { id: 4, title: "دعوة تخرج أنيقة", price: 30, oldPrice: null, rating: 4.7, image: "https://via.placeholder.com/400x500/10B981/FFFFFF?text=Graduation", isVideo: false },
  ];

  const newTemplates = [
    { id: 5, title: "رسالة شكر للمعلـم", price: 40, image: "https://via.placeholder.com/400x500/6366F1/FFFFFF?text=Teacher" },
    { id: 6, title: "ذكريات طفولة", price: 60, image: "https://via.placeholder.com/400x500/EC4899/FFFFFF?text=Childhood" },
    { id: 7, title: "عيد ميلاد سعيد", price: 55, image: "https://via.placeholder.com/400x500/F59E0B/FFFFFF?text=Happy+Day" },
    { id: 8, title: "تهنئة مولود", price: 45, image: "https://via.placeholder.com/400x500/10B981/FFFFFF?text=New+Born" },
  ];

  const showcaseWorks = [
    { title: "مفاجأة سارة", image: "https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=Surprise" },
    { title: "شكراً أمي", image: "https://via.placeholder.com/600x400/EC4899/FFFFFF?text=Thanks+Mom" },
    { title: "ذكرى زواج سعيدة", image: "https://via.placeholder.com/600x400/F59E0B/FFFFFF?text=Anniversary" },
  ];

  // تبديل تلقائي للبانر كل 5 ثوانٍ
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans">



      {/* ===== 1. HERO BANNER ===== */}
      <section className="relative h-[400px] md:h-[520px] overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${banners[currentSlide].bg} transition-all duration-700`}>
          {/* زخارف خلفية */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

          <div className="h-full flex items-center justify-center text-center text-white px-4">
            <div className="space-y-6 max-w-2xl animate-fade-in">
              <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg leading-tight">
                {banners[currentSlide].title}
              </h2>
              <p className="text-lg md:text-xl opacity-90">{banners[currentSlide].subtitle}</p>
              <button className="bg-white text-brand-primary px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform duration-300">
                {banners[currentSlide].cta}
              </button>
            </div>
          </div>
        </div>

        {/* نقاط التنقل */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ===== 2. CATEGORIES ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800">تصفح حسب المناسبة</h3>
          <p className="text-gray-500 mt-2 text-sm">اختر المناسبة وابدأ بإنشاء ذكرى لا تُنسى</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center gap-2 p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer ${cat.color}`}
            >
              <div className="text-3xl">{cat.icon}</div>
              <span className="text-sm font-semibold">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 3. FEATURED TEMPLATES ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">قوالب مميزة ✨</h3>
            <p className="text-gray-500 text-sm mt-1">أبرز القوالب الأكثر طلباً</p>
          </div>
          <a href="#" className="text-brand-primary font-semibold hover:underline text-sm flex items-center gap-1 group">
            عرض الكل
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredTemplates.map((t) => (
            <div key={t.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative h-56 md:h-72 overflow-hidden">
                <img src={t.image} alt={t.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white text-brand-primary px-5 py-2 rounded-full font-bold text-sm transform scale-90 group-hover:scale-100 transition-transform">
                    تخصيص القالب
                  </button>
                </div>
                {t.isVideo && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] px-2 py-1 rounded font-bold">▶ فيديو</span>
                )}
                {t.oldPrice && (
                  <span className="absolute top-3 right-3 bg-brand-accent text-white text-[10px] px-2 py-1 rounded font-bold">
                    خصم {Math.round((1 - t.price / t.oldPrice) * 100)}%
                  </span>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-800 mb-2 truncate">{t.title}</h4>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-primary font-bold">{t.price} ج.م</span>
                    {t.oldPrice && <span className="text-gray-400 line-through text-xs">{t.oldPrice}</span>}
                  </div>
                  <span className="text-amber-400 text-xs">⭐ {t.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 4. DEALS BANNER ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <div className="bg-gradient-to-l from-brand-primary to-brand-secondary rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-white/10 rounded-full"></div>

          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-extrabold mb-2">عروض تنتهي قريباً ⏳</h3>
            <p className="opacity-90 mb-6 text-sm">احصل على أجمل القوالب بأسعار لا تُقاوم</p>

            <div className="flex justify-center gap-3 md:gap-4 mb-6">
              {[
                { v: "12", l: "ساعة" },
                { v: "45", l: "دقيقة" },
                { v: "30", l: "ثانية" },
              ].map((t, idx) => (
                <div key={idx} className="bg-white/20 backdrop-blur-sm p-3 rounded-xl w-16 md:w-20">
                  <div className="text-2xl md:text-3xl font-extrabold">{t.v}</div>
                  <div className="text-xs opacity-80">{t.l}</div>
                </div>
              ))}
            </div>

            <button className="bg-white text-brand-primary px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform duration-300">
              تسوق العروض
            </button>
          </div>
        </div>
      </section>

      {/* ===== 5. NEW ARRIVALS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">أحدث القوالب 🆕</h3>
            <p className="text-gray-500 text-sm mt-1">أضفنا للتو قوالب جديدة بانتظارك</p>
          </div>
          <a href="#" className="text-brand-primary font-semibold hover:underline text-sm flex items-center gap-1 group">
            عرض الكل
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newTemplates.map((t) => (
            <div key={t.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative h-56 md:h-72 overflow-hidden">
                <img src={t.image} alt={t.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] px-2 py-1 rounded font-bold">جديد</span>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white text-brand-primary px-5 py-2 rounded-full font-bold text-sm transform scale-90 group-hover:scale-100 transition-transform">
                    تخصيص القالب
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-800 mb-2 truncate">{t.title}</h4>
                <span className="text-brand-primary font-bold">{t.price} ج.م</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 6. SHOWCASE ===== */}
      <section className="bg-white py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">شاهد الذكريات التي صنعناها 🎬</h3>
            <p className="text-gray-500 mt-2 text-sm">أعمال حقيقية أبهرت أحبائهم</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {showcaseWorks.map((w, idx) => (
              <div key={idx} className="relative group rounded-2xl overflow-hidden shadow-md h-64 cursor-pointer">
                <img src={w.image} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h4 className="text-lg font-bold">{w.title}</h4>
                    <button className="mt-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                      <span>▶</span> تشغيل الفيديو
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}