import { Outlet, useLocation } from "react-router-dom";
import Sidebar, { ADMIN_NAV } from "../component/Sidebar";
import Topbar from "../component/Topbar";


/** تاريخ اليوم بصيغة عربية بأرقام لاتينية (تتحدث تلقائياً كل يوم) */
const TODAY = new Intl.DateTimeFormat("ar-EG-u-nu-latn", { dateStyle: "long" }).format(new Date());

/** العنوان الفرعي لكل صفحة حسب مفتاح القائمة — عدّله كما تحب */
const SUBTITLES = {
  home: `نظرة عامة على أداء المنصة — ${TODAY}`,
  products: "إدارة القوالب والمنتجات الرقمية",
  "product-form": "إنشاء قالب جديد أو تعديل قالب موجود",
  fields: "بناء حقول التخصيص بالسحب والإفلات",
  gifts: "إدارة الهدايا الداخلية المرفقة بالطلبات",
  categories: "تصنيفات المناسبات والمنتجات",
  orders: "متابعة الطلبات وحالة الدفع",
  customers: "قاعدة العملاء وسجل المشتريات",
  cms: "البانرات والعروض وصفحة الرئيسية",
  coupons: "كوبونات الخصم ومدة صلاحيتها",
  settings: "بوابات الدفع والعلامة المائية ورموز QR",
  showcase: "معرض الأعمال المنفذة على المنصة",
};

export default function AdminLayout() {
  const { pathname } = useLocation();

  /* تحديد عنصر القائمة النشط من الرابط الحالي — أطول تطابق يفوز
     حتى يعمل /admin/products/new (نموذج المنتج) ولا يلتقطه /admin/products */
  const matches = ADMIN_NAV.filter((n) => pathname.startsWith(n.href));
  const current = matches.sort((a, b) => b.href.length - a.href.length)[0];
  const active = current ? current.key : "home";

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 text-slate-800">
      <Sidebar active={active} />

      {/* مزاحة بمقدار عرض الشريط الجانبي الثابت (w-64) على الشاشات الكبيرة */}
      <div className="lg:mr-64 min-h-screen flex flex-col">
        <Topbar
          title={current ? current.label : "لوحة تحكم الإدارة"}
          subtitle={SUBTITLES[active] || ""}
          notifications={5}
        />
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
