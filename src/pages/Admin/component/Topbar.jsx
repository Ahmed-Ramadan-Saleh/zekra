import React from "react";
import { OPEN_SIDEBAR } from "./Sidebar";

/* ============================================================
   Topbar.jsx — الشريط العلوي للوحة تحكم الإدارة (مكون مستقل)
   ------------------------------------------------------------
   الاستدعاء في أي صفحة إدارة:

     import Topbar from "./Topbar";

     <Topbar title="الطلبات" subtitle="متابعة الطلبات وحالة الدفع" notifications={5} />

   ملاحظات مهمة:
   1) زر القائمة ☰ يفتح درج Sidebar على الموبايل تلقائياً — يرسل
      الحدث المخصص OPEN_SIDEBAR الذي يستمع له Sidebar.
      لا تحتاج أي إعداد إضافي بين المكونين.

   2) ضع Topbar داخل لفافة <div className="lg:mr-64"> بعد استدعاء
      Sidebar حتى لا يتداخل المحتوى مع الشريط الجانبي الثابت:

        <div dir="rtl" className="min-h-screen bg-slate-100 text-slate-800">
          <Sidebar active="orders" />
          <div className="lg:mr-64 min-h-screen flex flex-col">
            <Topbar title="الطلبات" />
            <main className="p-4 sm:p-6 max-w-7xl w-full mx-auto">...</main>
          </div>
        </div>

   3) notifications: عدد الإشعارات غير المقروءة — تظهر كبشارة حمراء
      فوق الجرس فقط عندما يكون أكبر من صفر.
   ============================================================ */

/* ===== أيقونات SVG مدمجة ===== */
const BellIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const MenuIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export default function Topbar({ title = "", subtitle = "", notifications = 0 }) {
  /* فتح درج القائمة الجانبية على الموبايل — يستمع له Sidebar */
  const openDrawer = () => window.dispatchEvent(new Event(OPEN_SIDEBAR));

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={openDrawer} aria-label="القائمة" className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition shrink-0"><MenuIcon /></button>
          <div className="min-w-0">
            <h1 className="font-extrabold text-slate-800 text-sm sm:text-base truncate">{title}</h1>
            {subtitle ? <p className="text-[11px] text-slate-400 truncate hidden sm:block">{subtitle}</p> : null}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a href="/" target="_blank" rel="noreferrer" className="hidden md:inline-flex text-xs font-bold px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition">🌐 معاينة المتجر</a>
          <button aria-label="الإشعارات" className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition">
            <BellIcon />
            {notifications > 0 && <span className="absolute -top-1 -left-1 w-5 h-5 bg-brand-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">{notifications}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
