import React, { useState } from "react";

export default function Checkout() {
  // ===== حالة الخطوات =====
  const [step, setStep] = useState(1); // 1: البيانات, 2: الدفع

  // ===== بيانات العميل =====
  const [customerData, setCustomerData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // ===== وسيلة الدفع المختارة =====
  const [paymentMethod, setPaymentMethod] = useState(null);

  // ===== الكوبون =====
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // ===== حالة المعالجة =====
  const [isProcessing, setIsProcessing] = useState(false);

  // ===== بيانات المنتج =====
  const product = {
    title: "رسالة عيد ميلاد سحرية",
    category: "أعياد الميلاد",
    price: 75,
    oldPrice: 120,
    orderId: "ORD-847291",
  };

  // ===== بوابات الدفع المصرية =====
  const paymentGateways = [
    { id: "vodafone", name: "Vodafone Cash", desc: "ادفع عبر محفظة فودافون كاش", color: "bg-red-600", icon: "📱", badge: "الأكثر استخداماً" },
    { id: "card", name: "بطاقة بنكية", desc: "Visa / Mastercard", color: "bg-blue-600", icon: "💳", badge: null },
    { id: "paymob", name: "Paymob", desc: "بوابة دفع إلكتروني آمنة", color: "bg-indigo-600", icon: "🔒", badge: null },
    { id: "fawry", name: "Fawry", desc: "ادفع من أقرب منفذ فوري", color: "bg-yellow-500", icon: "🏪", badge: null },
  ];

  // ===== حساب الأسعار =====
  const subtotal = product.price;
  const couponDiscount = couponApplied ? Math.round(subtotal * (discountPercent / 100)) : 0;
  const afterCoupon = subtotal - couponDiscount;
  const tax = Math.round(afterCoupon * 0.14);
  const total = afterCoupon + tax;

  // ===== تطبيق الكوبون =====
  const applyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("أدخل كود الخصم أولاً");
      return;
    }
    // محاكاة التحقق من الكوبون (سيتم استبدالها بـ API لاحقاً)
    const validCoupons = { "THIKRA10": 10, "WELCOME20": 20, "BASMA50": 50 };
    const code = couponCode.toUpperCase();
    
    if (validCoupons[code]) {
      setDiscountPercent(validCoupons[code]);
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("كود الخصم غير صحيح أو منتهي الصلاحية");
      setCouponApplied(false);
      setDiscountPercent(0);
    }
  };

  // ===== التحقق من صحة البيانات =====
  const validateForm = () => {
    if (!customerData.fullName.trim()) return "الاسم مطلوب";
    if (!customerData.email.includes("@")) return "البريد الإلكتروني غير صحيح";
    if (customerData.phone.length < 11) return "رقم الموبايل يجب أن يكون 11 رقم";
    return null;
  };

  const handleContinue = () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }
    setStep(2);
  };

  const handlePay = () => {
    if (!paymentMethod) {
      alert("اختر وسيلة الدفع أولاً");
      return;
    }
    setIsProcessing(true);
    // محاكاة عملية الدفع (سيتم استبدالها بـ API لاحقاً)
    setTimeout(() => {
      setIsProcessing(false);
      alert("تم الدفع بنجاح! سيتم تحويلك لصفحة استلام المنتج.");
    }, 2000);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans pb-16">

      {/* ===== شريط الخطوات ===== */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {/* خطوة 1 */}
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-brand-primary" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                step > 1 ? "bg-green-500 text-white" : step === 1 ? "bg-brand-primary text-white" : "bg-gray-200"
              }`}>
                {step > 1 ? "✓" : "1"}
              </div>
              <span className="text-sm font-medium hidden sm:block">بيانات العميل</span>
            </div>
            
            <div className={`w-8 sm:w-16 h-0.5 transition ${step >= 2 ? "bg-brand-primary" : "bg-gray-200"}`}></div>
            
            {/* خطوة 2 */}
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-brand-primary" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                step === 2 ? "bg-brand-primary text-white" : "bg-gray-200"
              }`}>
                2
              </div>
              <span className="text-sm font-medium hidden sm:block">الدفع</span>
            </div>
            
            <div className={`w-8 sm:w-16 h-0.5 bg-gray-200`}></div>
            
            {/* خطوة 3 */}
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-200">
                3
              </div>
              <span className="text-sm font-medium hidden sm:block">الاستلام</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ===== العمود الرئيسي (النماذج) ===== */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ===== الخطوة 1: بيانات العميل ===== */}
            {step === 1 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm animate-fade-in">
                <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <span className="w-1 h-6 bg-brand-primary rounded"></span>
                  بيانات العميل
                </h2>
                <p className="text-sm text-gray-500 mb-6">سيتم استخدام هذه البيانات لإرسال رابط المنتج النهائي</p>

                <div className="space-y-5">
                  {/* الاسم */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الكامل <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerData.fullName}
                        onChange={(e) => setCustomerData({ ...customerData, fullName: e.target.value })}
                        className="w-full bg-gray-50 border-2 border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl py-3 pr-11 pl-4 text-sm outline-none transition"
                        placeholder="مثال: أحمد محمد"
                      />
                      <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* البريد الإلكتروني */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={customerData.email}
                        onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                        className="w-full bg-gray-50 border-2 border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl py-3 pr-11 pl-4 text-sm outline-none transition"
                        placeholder="example@email.com"
                        dir="ltr"
                        style={{ textAlign: "left" }}
                      />
                      <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* رقم الموبايل */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الموبايل <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                        className="w-full bg-gray-50 border-2 border-gray-200 focus:border-brand-primary focus:bg-white rounded-xl py-3 pr-11 pl-4 text-sm outline-none transition"
                        placeholder="01xxxxxxxxx"
                        dir="ltr"
                        style={{ textAlign: "left" }}
                      />
                      <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">مطلوب لتأكيد الدفع عبر Vodafone Cash والفوري</p>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full mt-6 bg-gradient-to-l from-brand-primary to-brand-secondary text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
                >
                  متابعة إلى الدفع
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            )}

            {/* ===== الخطوة 2: وسائل الدفع + الكوبون ===== */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                
                {/* ملخص بيانات العميل */}
                <div className="bg-white rounded-3xl p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{customerData.fullName}</p>
                        <p className="text-xs text-gray-500">{customerData.email} • {customerData.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-brand-primary font-semibold hover:underline"
                    >
                      تعديل
                    </button>
                  </div>
                </div>

                {/* الكوبون */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-brand-accent rounded"></span>
                    كود الخصم
                  </h3>
                  
                  {!couponApplied ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                        className="flex-1 bg-gray-50 border-2 border-gray-200 focus:border-brand-accent focus:bg-white rounded-xl py-3 px-4 text-sm outline-none transition uppercase"
                        placeholder="أدخل كود الخصم"
                      />
                      <button
                        onClick={applyCoupon}
                        className="bg-gray-900 text-white px-6 rounded-xl text-sm font-bold hover:bg-gray-800 transition"
                      >
                        تطبيق
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-green-800 text-sm">تم تطبيق الخصم!</p>
                          <p className="text-xs text-green-600">كود {couponCode.toUpperCase()} - خصم {discountPercent}%</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setCouponApplied(false); setCouponCode(""); setDiscountPercent(0); }}
                        className="text-xs text-red-500 font-semibold hover:underline"
                      >
                        إزالة
                      </button>
                    </div>
                  )}
                  
                  {couponError && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {couponError}
                    </p>
                  )}
                </div>

                {/* وسائل الدفع */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-brand-secondary rounded"></span>
                    اختر وسيلة الدفع
                  </h3>
                  
                  <div className="space-y-3">
                    {paymentGateways.map((gateway) => (
                      <button
                        key={gateway.id}
                        onClick={() => setPaymentMethod(gateway.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-right ${
                          paymentMethod === gateway.id
                            ? "border-brand-primary bg-purple-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {/* الأيقونة */}
                        <div className={`w-12 h-12 ${gateway.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                          {gateway.icon}
                        </div>
                        
                        {/* المعلومات */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-800 text-sm">{gateway.name}</span>
                            {gateway.badge && (
                              <span className="bg-brand-accent text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                {gateway.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{gateway.desc}</p>
                        </div>
                        
                        {/* مؤشر الاختيار */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                          paymentMethod === gateway.id ? "border-brand-primary bg-brand-primary" : "border-gray-300"
                        }`}>
                          {paymentMethod === gateway.id && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* حقول إضافية حسب وسيلة الدفع */}
                  {paymentMethod === "vodafone" && (
                    <div className="mt-4 bg-red-50 rounded-xl p-4 animate-fade-in">
                      <p className="text-xs text-red-700 font-medium mb-2">سيتم تحويلك لتأكيد الدفع عبر تطبيق Vodafone Cash على الرقم:</p>
                      <p className="text-sm font-bold text-red-800" dir="ltr" style={{ textAlign: "right" }}>{customerData.phone}</p>
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <div className="mt-4 bg-blue-50 rounded-xl p-4 space-y-3 animate-fade-in">
                      <input
                        type="text"
                        placeholder="رقم البطاقة (16 رقم)"
                        className="w-full bg-white border border-blue-200 rounded-lg py-2.5 px-3 text-sm outline-none"
                        dir="ltr"
                        style={{ textAlign: "left" }}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="تاريخ الانتهاء MM/YY"
                          className="bg-white border border-blue-200 rounded-lg py-2.5 px-3 text-sm outline-none"
                          dir="ltr"
                          style={{ textAlign: "left" }}
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="bg-white border border-blue-200 rounded-lg py-2.5 px-3 text-sm outline-none"
                          dir="ltr"
                          style={{ textAlign: "left" }}
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "fawry" && (
                    <div className="mt-4 bg-yellow-50 rounded-xl p-4 animate-fade-in">
                      <p className="text-xs text-yellow-700">
                        سيتم توليد كود فوري بعد تأكيد الطلب. ادفع من أي منفذ فوري خلال 48 ساعة.
                      </p>
                    </div>
                  )}
                </div>

                {/* زر الدفع */}
                <button
                  onClick={handlePay}
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-l from-brand-primary to-brand-secondary hover:shadow-xl hover:scale-[1.01]"
                  } text-white`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري معالجة الدفع...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      ادفع الآن {total} ج.م
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ===== العمود الجانبي: ملخص الطلب ===== */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24">
              
              <h2 className="text-lg font-bold text-gray-800 mb-4 pb-4 border-b border-gray-100">
                ملخص الطلب
              </h2>

              {/* المنتج */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center text-2xl">
                  🎂
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm truncate">{product.title}</h3>
                  <p className="text-xs text-gray-500">{product.category}</p>
                  <p className="text-xs text-gray-400 mt-0.5">طلب رقم: {product.orderId}</p>
                </div>
              </div>

              {/* التسعير */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">سعر القالب</span>
                  <span className="text-gray-800 font-medium">{subtotal} ج.م</span>
                </div>
                
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>خصم الكوبون ({discountPercent}%)</span>
                    <span className="font-bold">-{couponDiscount} ج.م</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">ضريبة القيمة المضافة (14%)</span>
                  <span className="text-gray-800 font-medium">{tax} ج.م</span>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">الإجمالي</span>
                    <span className="text-2xl font-extrabold text-brand-primary">{total} ج.م</span>
                  </div>
                </div>
              </div>

              {/* مميزات */}
              <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                {[
                  { icon: "⚡", text: "تسليم فوري بعد الدفع" },
                  { icon: "🔗", text: "رابط خاص للمنتج" },
                  { icon: "📱", text: "QR Code مجاني" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* الأمان */}
              <div className="mt-5 bg-green-50 rounded-xl p-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-xs text-green-700">جميع المعاملات محمية ومشفّرة بتقنية SSL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}