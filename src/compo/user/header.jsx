import React, { useState, useEffect } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "#" },
    { name: "المتجر", href: "#" },
    { name: "التصنيفات", href: "#" },
    { name: "حسابي", href: "#" },
  ];

  return (
    <header
      dir="rtl"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-lg py-2"
          : "bg-white py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* ===== 1. الشعار ===== */}
          <a href="#" className="flex items-center gap-2 flex-shrink-0 group">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">✨</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-brand-primary to-brand-secondary group-hover:from-brand-secondary group-hover:to-brand-primary transition-all duration-500">
              بصمة وذكرى
            </h1>
          </a>

          {/* ===== 2. شريط البحث (Desktop) ===== */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="ابحث عن قالب..."
                className="w-full bg-gray-100 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-full py-2.5 pr-11 pl-4 text-sm outline-none transition-all duration-300 focus:shadow-md"
              />
              <svg
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-primary transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* ===== 3. روابط التنقل (Desktop) ===== */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="relative text-gray-600 hover:text-brand-primary font-medium text-sm transition-colors duration-300 group py-1"
              >
                {link.name}
                <span className="absolute -bottom-0.5 right-0 w-0 h-0.5 bg-gradient-to-l from-brand-primary to-brand-secondary group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          {/* ===== 4. الأيقونات ===== */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* زر البحث (Mobile) */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2.5 text-gray-500 hover:text-brand-primary hover:bg-purple-50 rounded-full transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* المفضلة */}
            <button className="hidden sm:flex p-2.5 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-all duration-300 relative group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 bg-brand-secondary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse-slow">
                3
              </span>
            </button>

            {/* السلة */}
            <button className="p-2.5 text-gray-500 hover:text-brand-primary hover:bg-purple-50 rounded-full transition-all duration-300 relative group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse-slow">
                2
              </span>
            </button>

            {/* زر القائمة (Mobile) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 text-gray-500 hover:text-brand-primary hover:bg-purple-50 rounded-full transition-all duration-300"
            >
              <div className="w-5 h-5 relative flex items-center justify-center">
                <span className={`absolute h-0.5 w-5 bg-current transform transition-all duration-300 ${menuOpen ? 'rotate-45' : '-translate-y-1.5'}`}></span>
                <span className={`absolute h-0.5 w-5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute h-0.5 w-5 bg-current transform transition-all duration-300 ${menuOpen ? '-rotate-45' : 'translate-y-1.5'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* ===== شريط البحث (Mobile) ===== */}
        {searchOpen && (
          <div className="md:hidden mt-3 animate-slide-down">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن قالب..."
                className="w-full bg-gray-100 border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-full py-2.5 pr-11 pl-4 text-sm outline-none transition-all duration-300"
                autoFocus
              />
              <svg
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* ===== القائمة المنسدلة (Mobile) ===== */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 mt-2 px-4 py-3 space-y-1 animate-slide-down shadow-lg">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 px-4 text-gray-600 hover:bg-gradient-to-l hover:from-purple-50 hover:to-pink-50 hover:text-brand-primary rounded-xl font-medium text-sm transition-all duration-300"
            >
              {link.name}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}