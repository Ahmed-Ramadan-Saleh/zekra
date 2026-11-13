import React, { useState, useEffect } from "react";

/** اسم الحدث المخصص لفتح درج القائمة على الموبايل (يُرسله Topbar) */
export const OPEN_SIDEBAR = "admin:open-sidebar";

/** بيانات المدير الحالي — Mock */
export const ADMIN_USER = {
  name: "كريم عبد الله",
  initials: "كأ",
  role: "مدير المنصة",
};

/** عناصر القائمة الجانبية — صفحات لوحة الإدارة */
export const ADMIN_NAV = [
  { key: "home", label: "الرئيسية", emoji: "📊", href: "/admin" },
  {
    key: "products",
    label: "المنتجات والقوالب",
    emoji: "🛍️",
    href: "/admin/products",
  },
  {
    key: "product-form",
    label: "إضافة / تعديل منتج",
    emoji: "📝",
    href: "/admin/productForm",
  },
  { key: "fields", label: "حقول التخصيص", emoji: "🧩", href: "/admin/fields" },
  {
    key: "gifts",
    label: "الهدايا الداخلية",
    emoji: "🎁",
    href: "/admin/gifts",
  },
  {
    key: "categories",
    label: "التصنيفات",
    emoji: "🗂️",
    href: "/admin/categories",
  },
  { key: "orders", label: "الطلبات", emoji: "🧾", href: "/admin/orders" },
  { key: "customers", label: "العملاء", emoji: "👥", href: "/admin/customers" },
  { key: "cms", label: "المحتوى التسويقي", emoji: "📢", href: "/admin/cms" },
  { key: "coupons", label: "الكوبونات", emoji: "🏷️", href: "/admin/coupons" },
  {
    key: "settings",
    label: "إعدادات الموقع",
    emoji: "⚙️",
    href: "/admin/settings",
  },
];

const KEYFRAMES = `
@keyframes sidebarSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
`;

/* ===== أيقونة SVG مدمجة ===== */
const LogoutIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function Sidebar({ active = "home" }) {
  const [drawer, setDrawer] = useState(false);

  /* فتح الدرج عند استقبال الحدث القادم من Topbar (زر القائمة ☰) */
  useEffect(() => {
    const open = () => setDrawer(true);
    window.addEventListener(OPEN_SIDEBAR, open);
    return () => window.removeEventListener(OPEN_SIDEBAR, open);
  }, []);

  /* إغلاق الدرج بزر Escape */
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e) => {
      if (e.key === "Escape") setDrawer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer]);

  /* قفل تمرير الصفحة خلف الدرج أثناء فتحه */
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const navLinks = (onLink) =>
    ADMIN_NAV.map((n) => {
      const isActive = n.key === active;
      return (
        <a
          key={n.key}
          href={n.href}
          onClick={onLink}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition ${isActive ? "bg-gradient-to-l from-brand-primary to-brand-secondary text-white shadow-lg" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
        >
          <span className="text-base w-5 text-center">{n.emoji}</span>
          <span className="flex-1 truncate">{n.label}</span>
          {n.key === "orders" && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
              12
            </span>
          )}
        </a>
      );
    });

  return (
    <>
      {/* الشريط الجانبي — سطح المكتب */}
      <aside className="hidden lg:flex fixed inset-y-0 right-0 w-64 bg-slate-900 flex-col z-40">
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/10 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-extrabold">
            ب
          </div>
          <div className="min-w-0">
            <p className="text-white font-extrabold text-sm truncate">
              بصمة وذكرى
            </p>
            <p className="text-[10px] text-slate-400">لوحة تحكم الإدارة</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navLinks()}
        </nav>
        <div className="p-3 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary text-white text-xs font-extrabold flex items-center justify-center">
              {ADMIN_USER.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-bold truncate">
                {ADMIN_USER.name}
              </p>
              <p className="text-slate-400 text-[10px]">{ADMIN_USER.role}</p>
            </div>
            <button
              aria-label="تسجيل الخروج"
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </aside>

      {/* القائمة الجانبية — موبايل (Drawer) */}
      {drawer && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setDrawer(false)}
          />
          <aside
            className="absolute inset-y-0 right-0 w-72 max-w-[85vw] bg-slate-900 flex flex-col shadow-2xl"
            style={{ animation: "sidebarSlideIn .25s ease both" }}
          >
            <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-extrabold">
                  ب
                </div>
                <p className="text-white font-extrabold text-sm">
                  لوحة الإدارة
                </p>
              </div>
              <button
                onClick={() => setDrawer(false)}
                aria-label="إغلاق"
                className="w-9 h-9 rounded-xl text-slate-300 hover:bg-white/10 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {navLinks(() => setDrawer(false))}
            </nav>
            <div className="p-3 border-t border-white/10 shrink-0">
              <div className="flex items-center gap-2.5 px-2 py-1.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary text-white text-xs font-extrabold flex items-center justify-center">
                  {ADMIN_USER.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold truncate">
                    {ADMIN_USER.name}
                  </p>
                  <p className="text-slate-400 text-[10px]">
                    {ADMIN_USER.role}
                  </p>
                </div>
                <button
                  aria-label="تسجيل الخروج"
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition"
                >
                  <LogoutIcon />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
