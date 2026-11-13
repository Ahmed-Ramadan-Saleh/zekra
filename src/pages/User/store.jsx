import  { useState, useMemo } from "react";

export default function Store() {
  // ===== الفلاتر النشطة =====
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedType, setSelectedType] = useState("الكل");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // ===== البيانات =====
  const categories = ["الكل", "أعياد الميلاد", "التهنئة", "الشكر", "رسائل حب", "دعوات", "تخرج", "زواج"];
  const types = ["الكل", "كارت تفاعلي", "فيديو", "رسالة", "دعوة"];

  const allTemplates = [
    { id: 1, title: "رسالة عيد ميلاد سحرية", price: 75, oldPrice: 120, rating: 4.9, category: "أعياد الميلاد", type: "رسالة", image: "https://via.placeholder.com/400x500/7C3AED/FFFFFF?text=Birthday", isVideo: false, isNew: false },
    { id: 2, title: "كارت تهنئة زفاف تفاعلي", price: 50, oldPrice: null, rating: 4.8, category: "زواج", type: "كارت تفاعلي", image: "https://via.placeholder.com/400x500/EC4899/FFFFFF?text=Wedding", isVideo: false, isNew: true },
    { id: 3, title: "ذكرياتنا معاً (فيديو)", price: 100, oldPrice: 150, rating: 5.0, category: "رسائل حب", type: "فيديو", image: "https://via.placeholder.com/400x500/F59E0B/FFFFFF?text=Memories", isVideo: true, isNew: false },
    { id: 4, title: "دعوة تخرج أنيقة", price: 30, oldPrice: null, rating: 4.7, category: "تخرج", type: "دعوة", image: "https://via.placeholder.com/400x500/10B981/FFFFFF?text=Graduation", isVideo: false, isNew: true },
    { id: 5, title: "رسالة شكر للمعلـم", price: 40, oldPrice: 60, rating: 4.6, category: "الشكر", type: "رسالة", image: "https://via.placeholder.com/400x500/6366F1/FFFFFF?text=Teacher", isVideo: false, isNew: true },
    { id: 6, title: "ذكريات طفولة سعيدة", price: 60, oldPrice: null, rating: 4.5, category: "رسائل حب", type: "فيديو", image: "https://via.placeholder.com/400x500/EC4899/FFFFFF?text=Childhood", isVideo: true, isNew: false },
    { id: 7, title: "عيد ميلاد سعيد", price: 55, oldPrice: 80, rating: 4.8, category: "أعياد الميلاد", type: "كارت تفاعلي", image: "https://via.placeholder.com/400x500/F59E0B/FFFFFF?text=Happy+Day", isVideo: false, isNew: false },
    { id: 8, title: "تهنئة مولود جديد", price: 45, oldPrice: null, rating: 4.9, category: "التهنئة", type: "كارت تفاعلي", image: "https://via.placeholder.com/400x500/10B981/FFFFFF?text=New+Born", isVideo: false, isNew: true },
    { id: 9, title: "دعوة زفاف فاخرة", price: 90, oldPrice: 130, rating: 5.0, category: "زواج", type: "دعوة", image: "https://via.placeholder.com/400x500/7C3AED/FFFFFF?text=Wedding+Invite", isVideo: false, isNew: false },
    { id: 10, title: "فيديو ذكريات حب", price: 120, oldPrice: null, rating: 4.7, category: "رسائل حب", type: "فيديو", image: "https://via.placeholder.com/400x500/EC4899/FFFFFF?text=Love", isVideo: true, isNew: false },
    { id: 11, title: "كارت شكر وتقدير", price: 35, oldPrice: 50, rating: 4.4, category: "الشكر", type: "كارت تفاعلي", image: "https://via.placeholder.com/400x500/6366F1/FFFFFF?text=Thanks", isVideo: false, isNew: false },
    { id: 12, title: "دعوة حفلة تخرج", price: 65, oldPrice: null, rating: 4.8, category: "تخرج", type: "دعوة", image: "https://via.placeholder.com/400x500/10B981/FFFFFF?text=Party", isVideo: false, isNew: true },
  ];

  // ===== نظام الفلترة والترتيب =====
  const filteredTemplates = useMemo(() => {
    let result = [...allTemplates];

    if (searchQuery) {
      result = result.filter((t) => t.title.includes(searchQuery));
    }
    if (selectedCategory !== "الكل") {
      result = result.filter((t) => t.category === selectedCategory);
    }
    if (selectedType !== "الكل") {
      result = result.filter((t) => t.type === selectedType);
    }
    result = result.filter((t) => t.price >= priceRange[0] && t.price <= priceRange[1]);

    if (sortBy === "newest") result.sort((a, b) => b.isNew - a.isNew);
    else if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [searchQuery, selectedCategory, selectedType, priceRange, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("الكل");
    setSelectedType("الكل");
    setPriceRange([0, 200]);
    setSearchQuery("");
    setSortBy("newest");
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans">

      {/* ===== عنوان الصفحة ===== */}
      <div className="bg-gradient-to-l from-brand-primary to-brand-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">متجر القوالب</h1>
          <p className="opacity-90">اختر قالبك المفضل وابدأ بصمة لا تُنسى</p>
        </div>
      </div>

      {/* ===== شريط البحث + الترتيب ===== */}
      <div className="sticky top-16 z-30 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* بحث */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن قالب..."
              className="w-full bg-gray-100 focus:bg-white border-2 border-transparent focus:border-brand-primary rounded-full py-2.5 pr-10 pl-4 text-sm outline-none transition"
            />
            <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* ترتيب */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="hidden sm:block bg-gray-100 border-2 border-transparent focus:border-brand-primary rounded-full py-2.5 px-4 text-sm outline-none cursor-pointer"
          >
            <option value="newest">الأحدث</option>
            <option value="price-low">السعر: الأقل أولاً</option>
            <option value="price-high">السعر: الأعلى أولاً</option>
            <option value="rating">الأعلى تقييماً</option>
          </select>

          {/* زر الفلاتر (موبايل) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-brand-primary text-white p-2.5 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* ===== الشريط الجانبي للفلاتر ===== */}
          <aside className={`${showFilters ? "fixed inset-0 z-40 bg-black/50" : "hidden"} lg:relative lg:block lg:bg-transparent lg:inset-auto lg:z-auto w-72 lg:w-64 flex-shrink-0`}>
            <div className={`${showFilters ? "fixed right-0 top-0 bottom-0 overflow-y-auto bg-white p-6 lg:relative lg:bg-transparent lg:p-0" : "lg:bg-transparent"} space-y-6`}>
              
              {/* رأس الفلاتر (موبايل) */}
              <div className="flex items-center justify-between lg:hidden">
                <h3 className="font-bold text-lg">الفلاتر</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* التصنيفات */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-brand-primary rounded"></span>
                  التصنيف
                </h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-right px-3 py-2 rounded-lg text-sm transition ${
                        selectedCategory === cat
                          ? "bg-brand-primary text-white font-semibold"
                          : "text-gray-600 hover:bg-purple-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* النوع */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-brand-secondary rounded"></span>
                  النوع
                </h4>
                <div className="space-y-2">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`block w-full text-right px-3 py-2 rounded-lg text-sm transition ${
                        selectedType === type
                          ? "bg-brand-secondary text-white font-semibold"
                          : "text-gray-600 hover:bg-pink-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* السعر */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-brand-accent rounded"></span>
                  السعر
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{priceRange[0]} ج.م</span>
                    <span>{priceRange[1]} ج.م</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-brand-primary"
                  />
                </div>
              </div>

              {/* إعادة تعيين */}
              <button
                onClick={resetFilters}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                إعادة تعيين الفلاتر
              </button>
            </div>
          </aside>

          {/* ===== شبكة المنتجات ===== */}
          <main className="flex-1">
            {/* عداد النتائج */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                عرض <span className="font-bold text-brand-primary">{filteredTemplates.length}</span> قالب
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sm:hidden bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm outline-none"
              >
                <option value="newest">الأحدث</option>
                <option value="price-low">الأرخص أولاً</option>
                <option value="price-high">الأغلى أولاً</option>
                <option value="rating">الأعلى تقييماً</option>
              </select>
            </div>

            {/* المنتجات */}
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد قوالب مطابقة</h3>
                <p className="text-gray-500 text-sm mb-4">جرّب تعديل الفلاتر للعثور على ما تبحث عنه</p>
                <button onClick={resetFilters} className="bg-brand-primary text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-purple-700 transition">
                  إعادة تعيين الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredTemplates.map((t) => (
                  <div key={t.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="relative h-56 md:h-72 overflow-hidden">
                      <img src={t.image} alt={t.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-white text-brand-primary px-5 py-2 rounded-full font-bold text-sm transform scale-90 group-hover:scale-100 transition-transform">
                          تخصيص القالب
                        </button>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1">
                        {t.isVideo && (
                          <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded font-bold">▶ فيديو</span>
                        )}
                        {t.isNew && (
                          <span className="bg-green-500 text-white text-[10px] px-2 py-1 rounded font-bold">جديد</span>
                        )}
                      </div>

                      {t.oldPrice && (
                        <span className="absolute top-3 left-3 bg-brand-accent text-white text-[10px] px-2 py-1 rounded font-bold">
                          خصم {Math.round((1 - t.price / t.oldPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <span className="text-[10px] text-brand-primary bg-purple-50 px-2 py-0.5 rounded-full">{t.category}</span>
                      <h4 className="font-bold text-gray-800 my-2 truncate">{t.title}</h4>
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
            )}
          </main>
        </div>
      </div>
    </div>
  );
}