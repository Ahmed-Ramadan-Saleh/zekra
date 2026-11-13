import  { useState, useRef } from "react";

export default function CustomizationEngine() {
  // ===== التبويب النشط =====
  const [activeTab, setActiveTab] = useState("texts");
  const [showPreview, setShowPreview] = useState(false);

  // ===== بيانات التخصيص (Live Preview State) =====
  const [customization, setCustomization] = useState({
    name: "أحمد",
    message: "كل عام وأنت بخير! عيد ميلاد سعيد يا صديقي العزيز.",
    additionalText: "أتمنى لك سنة مليئة بالسعادة والنجاح.",
    textColor: "#FFFFFF",
    bgColor: "#7C3AED",
    fontFamily: "Cairo",
    images: [],
    music: "music_1",
    musicName: "أغنية عيد الميلاد",
    textAnimation: "fade",
    imageAnimation: "zoom",
    transition: "slide",
    gifts: [
      { id: 1, name: "خروجة", icon: "🎉", selected: true },
      { id: 2, name: "إكسسوار", icon: "🎁", selected: true },
      { id: 3, name: "سينما", icon: "🎬", selected: false },
    ],
  });

  const fileInputRef = useRef(null);

  // ===== التبويبات =====
  const tabs = [
    { id: "texts", name: "نصوص", icon: "✏️" },
    { id: "media", name: "وسائط", icon: "🖼️" },
    { id: "styles", name: "أنماط", icon: "🎨" },
    { id: "audio", name: "صوتيات", icon: "🎵" },
    { id: "effects", name: "مؤثرات", icon: "✨" },
    { id: "gifts", name: "هدايا", icon: "🎁" },
  ];

  // ===== خيارات الأنماط =====
  const colors = ["#7C3AED", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#1F2937", "#FFFFFF"];
  const fonts = ["Cairo", "Tajawal", "Amiri", "Almarai", "El Messiri"];

  // ===== خيارات الصوتيات =====
  const musicLibrary = [
    { id: "music_1", name: "أغنية عيد الميلاد", duration: "0:45" },
    { id: "music_2", name: "موسيقى رومانسية", duration: "1:20" },
    { id: "music_3", name: "موسيقى احتفالية", duration: "0:55" },
    { id: "music_4", name: "موسيقى هادئة", duration: "1:10" },
  ];

  // ===== خيارات المؤثرات =====
  const animations = [
    { id: "fade", name: "ظهور تدريجي" },
    { id: "zoom", name: "تكبير" },
    { id: "slide", name: "انزلاق" },
    { id: "bounce", name: "قفز" },
    { id: "rotate", name: "دوران" },
    { id: "flip", name: "انقلاب" },
  ];

  // ===== معالجة رفع الصور =====
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setCustomization((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 5),
    }));
  };

  const removeImage = (id) => {
    setCustomization((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== id),
    }));
  };

  const toggleGift = (id) => {
    setCustomization((prev) => ({
      ...prev,
      gifts: prev.gifts.map((g) => (g.id === id ? { ...g, selected: !g.selected } : g)),
    }));
  };

  const updateGiftName = (id, name) => {
    setCustomization((prev) => ({
      ...prev,
      gifts: prev.gifts.map((g) => (g.id === id ? { ...g, name } : g)),
    }));
  };

  const addGift = () => {
    const newId = Date.now();
    setCustomization((prev) => ({
      ...prev,
      gifts: [...prev.gifts, { id: newId, name: "هدية جديدة", icon: "🎁", selected: true }],
    }));
  };

  const removeGift = (id) => {
    setCustomization((prev) => ({
      ...prev,
      gifts: prev.gifts.filter((g) => g.id !== id),
    }));
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 flex flex-col font-sans">

      {/* ===== الشريط العلوي (Toolbar) ===== */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          {/* يمين: رجوع + اسم القالب */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-gray-800">رسالة عيد ميلاد سحرية</h1>
              <p className="text-xs text-gray-500">المسودة غير محفوظة</p>
            </div>
          </div>

           {/* وسط: التبويبات (سطح المكتب)  */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-100 rounded-full p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-white shadow text-brand-primary"
                    : "text-gray-600 hover:text-brand-primary"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>

          {/* <!-- يسار: الأزرار --> */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full text-sm font-medium transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              حفظ كمسودة
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 bg-gradient-to-l from-brand-primary to-brand-secondary text-white px-5 py-2 rounded-full text-sm font-bold hover:shadow-lg transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              معاينة نهائية
            </button>
          </div>
        </div>

        {/* التبويبات (موبايل) */}
        <nav className="lg:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1 ${
                activeTab === tab.id ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* ===== منطقة المعاينة المباشرة (Live Preview) ===== */}
        <main className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gray-200 overflow-auto">
          <div
            className="relative w-full max-w-md aspect-[3/4] rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6 transition-all duration-500"
            style={{ backgroundColor: customization.bgColor }}
          >
            {/* خلفية مزخرفة */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-20 -translate-x-20"></div>

            {/* المحتوى */}
            <div className="relative z-10 text-center space-y-4 w-full">
              <div className="text-5xl mb-2">🎂</div>
              <h2
                className="text-2xl font-extrabold"
                style={{ color: customization.textColor, fontFamily: customization.fontFamily }}
              >
                عيد ميلاد سعيد
              </h2>
              <h3
                className="text-xl font-bold"
                style={{ color: customization.textColor, fontFamily: customization.fontFamily }}
              >
                {customization.name} 🎉
              </h3>
              <p
                className="text-sm leading-relaxed opacity-90"
                style={{ color: customization.textColor, fontFamily: customization.fontFamily }}
              >
                {customization.message}
              </p>
              {customization.additionalText && (
                <p className="text-xs opacity-75" style={{ color: customization.textColor }}>
                  {customization.additionalText}
                </p>
              )}

              {/* الصور المرفوعة */}
              {customization.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {customization.images.slice(0, 3).map((img) => (
                    <img key={img.id} src={img.url} alt="" className="w-full h-16 object-cover rounded-lg border-2 border-white/30" />
                  ))}
                </div>
              )}

              {/* أيقونة الموسيقى */}
              {customization.music && (
                <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs mt-2" style={{ color: customization.textColor }}>
                  <span className="animate-pulse">🎵</span>
                  {customization.musicName}
                </div>
              )}

              {/* الهدايا */}
              {customization.gifts.filter((g) => g.selected).length > 0 && (
                <div className="flex justify-center gap-2 mt-4">
                  {customization.gifts.filter((g) => g.selected).map((gift) => (
                    <div key={gift.id} className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-xs" style={{ color: customization.textColor }}>
                      <div className="text-xl">{gift.icon}</div>
                      {gift.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* شعار Watermark للمعاينة */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/30">
              بصمة وذكرى - معاينة
            </div>
          </div>
        </main>

        {/* ===== الشريط الجانبي للأدوات (Sidebar) ===== */}
        <aside className="w-full lg:w-96 bg-white border-r border-gray-200 overflow-y-auto lg:h-[calc(100vh-65px)] lg:sticky lg:top-[65px]">
          <div className="p-5 space-y-5">
            
            {/* === تبويب النصوص === */}
            {activeTab === "texts" && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-5 bg-brand-primary rounded"></span>
                  النصوص
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم الشخص</label>
                  <input
                    type="text"
                    value={customization.name}
                    onChange={(e) => setCustomization({ ...customization, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl py-2.5 px-4 text-sm outline-none transition"
                    placeholder="اكتب الاسم..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الرسالة الرئيسية</label>
                  <textarea
                    value={customization.message}
                    onChange={(e) => setCustomization({ ...customization, message: e.target.value })}
                    rows="3"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl py-2.5 px-4 text-sm outline-none transition resize-none"
                    placeholder="اكتب رسالتك..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نص إضافي (اختياري)</label>
                  <textarea
                    value={customization.additionalText}
                    onChange={(e) => setCustomization({ ...customization, additionalText: e.target.value })}
                    rows="2"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl py-2.5 px-4 text-sm outline-none transition resize-none"
                    placeholder="اكتب نصاً إضافياً..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">لون النص</label>
                  <div className="flex flex-wrap gap-2">
                    {["#FFFFFF", "#FFD700", "#FF69B4", "#000000", "#FF0000", "#00FF00"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCustomization({ ...customization, textColor: c })}
                        className={`w-9 h-9 rounded-full border-2 transition ${
                          customization.textColor === c ? "border-brand-primary scale-110" : "border-gray-200"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الخط</label>
                  <select
                    value={customization.fontFamily}
                    onChange={(e) => setCustomization({ ...customization, fontFamily: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl py-2.5 px-4 text-sm outline-none transition"
                  >
                    {fonts.map((f) => (
                      <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* === تبويب الوسائط === */}
            {activeTab === "media" && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-5 bg-brand-primary rounded"></span>
                  الصور والفيديوهات
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رفع صور (حد أقصى 5)</label>
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="w-full border-2 border-dashed border-gray-300 hover:border-brand-primary hover:bg-purple-50 rounded-2xl p-8 text-center transition cursor-pointer group"
                  >
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📤</div>
                    <p className="text-sm font-medium text-gray-700">اضغط لرفع الصور</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG حتى 5MB</p>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* الصور المرفوعة */}
                {customization.images.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">الصور المرفوعة ({customization.images.length}/5):</p>
                    <div className="grid grid-cols-3 gap-2">
                      {customization.images.map((img) => (
                        <div key={img.id} className="relative group">
                          <img src={img.url} alt="" className="w-full h-20 object-cover rounded-lg" />
                          <button
                            onClick={() => removeImage(img.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-blue-700 flex items-start gap-2">
                    <span className="text-lg">💡</span>
                    نصيحة: استخدم صوراً عالية الجودة للحصول على أفضل نتيجة في المعاينة النهائية.
                  </p>
                </div>
              </div>
            )}

            {/* === تبويب الأنماط === */}
            {activeTab === "styles" && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-5 bg-brand-primary rounded"></span>
                  الأنماط والثيمات
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">لون الخلفية</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCustomization({ ...customization, bgColor: c })}
                        className={`h-12 rounded-xl border-2 transition ${
                          customization.bgColor === c ? "border-brand-primary scale-105 shadow-md" : "border-gray-200"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ثيمات جاهزة</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: "كلاسيكي", bg: "#7C3AED", text: "#FFFFFF" },
                      { name: "وردي", bg: "#EC4899", text: "#FFFFFF" },
                      { name: "ذهبي", bg: "#F59E0B", text: "#FFFFFF" },
                      { name: "أخضر", bg: "#10B981", text: "#FFFFFF" },
                      { name: "أزرق", bg: "#3B82F6", text: "#FFFFFF" },
                      { name: "داكن", bg: "#1F2937", text: "#FFD700" },
                    ].map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => setCustomization({ ...customization, bgColor: theme.bg, textColor: theme.text })}
                        className="rounded-xl p-3 text-white text-sm font-medium hover:scale-105 transition shadow-md"
                        style={{ backgroundColor: theme.bg, color: theme.text }}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === تبويب الصوتيات === */}
            {activeTab === "audio" && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-5 bg-brand-primary rounded"></span>
                  الصوتيات
                </h3>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">مكتبة الأغاني:</p>
                  {musicLibrary.map((song) => (
                    <button
                      key={song.id}
                      onClick={() => setCustomization({ ...customization, music: song.id, musicName: song.name })}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition ${
                        customization.music === song.id
                          ? "border-brand-primary bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${customization.music === song.id ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                          {customization.music === song.id ? "▶" : "🎵"}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-800">{song.name}</p>
                          <p className="text-xs text-gray-500">{song.duration}</p>
                        </div>
                      </div>
                      {customization.music === song.id && (
                        <span className="text-green-500 text-xl">✓</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500">أو ارفع أغنيتك الخاصة (MP3)</p>
                  <button className="mt-2 text-xs text-brand-primary font-semibold hover:underline">رفع ملف صوتي</button>
                </div>

                <button
                  onClick={() => setCustomization({ ...customization, music: null, musicName: null })}
                  className="w-full text-sm text-red-500 hover:bg-red-50 py-2 rounded-lg transition"
                >
                  إزالة الموسيقى
                </button>
              </div>
            )}

            {/* === تبويب المؤثرات === */}
            {activeTab === "effects" && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-1 h-5 bg-brand-primary rounded"></span>
                  المؤثرات والحركات
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">حركة ظهور النصوص</label>
                  <div className="grid grid-cols-2 gap-2">
                    {animations.map((anim) => (
                      <button
                        key={anim.id}
                        onClick={() => setCustomization({ ...customization, textAnimation: anim.id })}
                        className={`p-3 rounded-xl border-2 text-sm transition ${
                          customization.textAnimation === anim.id
                            ? "border-brand-primary bg-purple-50 text-brand-primary font-semibold"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {anim.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">حركة ظهور الصور</label>
                  <div className="grid grid-cols-2 gap-2">
                    {animations.map((anim) => (
                      <button
                        key={anim.id}
                        onClick={() => setCustomization({ ...customization, imageAnimation: anim.id })}
                        className={`p-3 rounded-xl border-2 text-sm transition ${
                          customization.imageAnimation === anim.id
                            ? "border-brand-secondary bg-pink-50 text-brand-secondary font-semibold"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {anim.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الانتقالات بين العناصر</label>
                  <div className="grid grid-cols-2 gap-2">
                    {animations.slice(0, 4).map((anim) => (
                      <button
                        key={anim.id}
                        onClick={() => setCustomization({ ...customization, transition: anim.id })}
                        className={`p-3 rounded-xl border-2 text-sm transition ${
                          customization.transition === anim.id
                            ? "border-brand-accent bg-amber-50 text-brand-accent font-semibold"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {anim.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* === تبويب الهدايا === */}
            {activeTab === "gifts" && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-1 h-5 bg-brand-primary rounded"></span>
                    الهدايا الداخلية
                  </h3>
                  <button
                    onClick={addGift}
                    className="text-xs bg-brand-primary text-white px-3 py-1.5 rounded-full hover:bg-purple-700 transition flex items-center gap-1"
                  >
                    <span>+</span> إضافة هدية
                  </button>
                </div>

                <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-xl">
                  💡 الهدايا المفعّلة ستظهر للمستلم ليختار منها هدية واحدة فقط.
                </p>

                <div className="space-y-3">
                  {customization.gifts.map((gift) => (
                    <div
                      key={gift.id}
                      className={`border-2 rounded-xl p-3 transition ${
                        gift.selected ? "border-brand-primary bg-purple-50" : "border-gray-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{gift.icon}</span>
                        <input
                          type="text"
                          value={gift.name}
                          onChange={(e) => updateGiftName(gift.id, e.target.value)}
                          className="flex-1 bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm outline-none focus:border-brand-primary"
                        />
                        <button
                          onClick={() => removeGift(gift.id)}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gift.selected}
                          onChange={() => toggleGift(gift.id)}
                          className="w-4 h-4 accent-brand-primary"
                        />
                        <span className="text-xs text-gray-600">تفعيل هذه الهدية</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ===== Modal المعاينة النهائية ===== */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">معاينة المنتج النهائي</h3>

            <div
              className="aspect-video rounded-2xl flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
              style={{ backgroundColor: customization.bgColor }}
            >
              <div className="relative z-10 space-y-2">
                <div className="text-4xl">🎂</div>
                <h2 className="text-xl font-bold" style={{ color: customization.textColor }}>
                  عيد ميلاد سعيد {customization.name}
                </h2>
                <p className="text-sm opacity-90" style={{ color: customization.textColor }}>
                  {customization.message}
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-white/20 text-3xl font-bold rotate-[-30deg]">بصمة وذكرى</div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                تعديل التخصيص
              </button>
              <button className="flex-1 bg-gradient-to-l from-brand-primary to-brand-secondary text-white py-3 rounded-xl font-bold hover:shadow-lg transition">
                انتقل للدفع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}