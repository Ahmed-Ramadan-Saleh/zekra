import React, { useEffect, useState } from "react";

/* ============================================================
   AdminSettings.jsx — إعدادات الموقع
   بوابات الدفع (Paymob / فوري / فودافون كاش / PayPal)
   + إعدادات Watermark + QR Code + إعدادات عامة (الضريبة…)
   ============================================================ */
/* ⭐ هذه الصفحة "محتوى فقط" — تُعرض داخل AdminLayout عبر <Outlet />
   القشرة (Sidebar + Topbar + العنوان) تأتي من الـLayout ولا تُستدعى هنا. */



const PAY_GATEWAYS = [
  { key: "paymob", name: "Paymob", emoji: "💳", desc: "بطاقات ائتمان ومحافظ إلكترونية", on: true },
  { key: "fawry", name: "فوري", emoji: "🏪", desc: "دفع نقدي من نقاط فوري", on: true },
  { key: "vodafone", name: "فودافون كاش", emoji: "📱", desc: "دفع مباشر من المحفظة", on: true },
  { key: "paypal", name: "PayPal", emoji: "🌍", desc: "للدفعات الدولية", on: false },
];

const WM_POSITIONS = [
  { key: "center", label: "المنتصف" },
  { key: "tr", label: "أعلى يمين" },
  { key: "tl", label: "أعلى يسار" },
  { key: "br", label: "أسفل يمين" },
  { key: "bl", label: "أسفل يسار" },
];

const POS_CLS = {
  center: "items-center justify-center",
  tr: "items-start justify-end p-3",
  tl: "items-start justify-start p-3",
  br: "items-end justify-end p-3",
  bl: "items-end justify-start p-3",
};

const KEYFRAMES = `
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { 0% { transform: scale(.85); opacity: 0; } 70% { transform: scale(1.04); } 100% { transform: scale(1); opacity: 1; } }
`;


function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold whitespace-nowrap max-w-[90vw]" style={{ animation: "pop .3s ease both" }}>
      {msg}
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button type="button" onClick={onChange} role="switch" aria-checked={on} className={`relative w-12 h-7 rounded-full transition-colors duration-300 shrink-0 ${on ? "bg-gradient-to-l from-brand-primary to-brand-secondary" : "bg-slate-300"}`}>
      <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${on ? "left-1" : "right-1"}`} />
    </button>
  );
}

const inputCls = "w-full px-4 py-3 rounded-xl border-2 bg-slate-50 focus:bg-white outline-none transition text-sm font-medium border-slate-200 focus:border-brand-primary";

export default function AdminSettings() {
  const [toast, setToast] = useState(null);

  /* بوابات الدفع */
  const [gateways, setGateways] = useState(PAY_GATEWAYS);
  const [gatewayKeys, setGatewayKeys] = useState({
    paymob: { apiKey: "pk_live_••••••••7841", secret: "sk_live_••••••••4242" },
    fawry: { apiKey: "FW-••••••••9012", secret: "" },
    vodafone: { wallet: "010XXXXXXXX" },
  });

  /* Watermark */
  const [wmOn, setWmOn] = useState(true);
  const [wmText, setWmText] = useState("بصمة وذكرى");
  const [wmOpacity, setWmOpacity] = useState(40);
  const [wmPos, setWmPos] = useState("center");

  /* QR */
  const [qrOn, setQrOn] = useState(true);
  const [qrSize, setQrSize] = useState("256");
  const [qrLogo, setQrLogo] = useState(true);
  const [qrColor, setQrColor] = useState("#0f172a");

  /* إعدادات عامة */
  const [siteName, setSiteName] = useState("بصمة وذكرى");
  const [supportEmail, setSupportEmail] = useState("support@basmah-zikra.com");
  const [supportWhats, setSupportWhats] = useState("+20 100 123 4567");
  const [currency, setCurrency] = useState("EGP");
  const [taxRate, setTaxRate] = useState("14");
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (m) => setToast(m);

  const toggleGateway = (key) => setGateways(gateways.map((g) => (g.key === key ? { ...g, on: !g.on } : g)));

  const saveGateways = () => {
    const activeCount = gateways.filter((g) => g.on).length;
    if (activeCount === 0) return showToast("يجب تفعيل بوابة دفع واحدة على الأقل ⚠️");
    showToast(`تم حفظ إعدادات بوابات الدفع (${activeCount} مفعّلة) ✓`);
  };

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div className="max-w-4xl mx-auto space-y-5">
        {/* بوابات الدفع */}
        <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5 sm:p-6" style={{ animation: "fadeUp .45s ease both" }}>
          <h2 className="font-extrabold text-slate-800">💳 بوابات الدفع</h2>
          <p className="text-xs text-slate-400 mt-1">فعّل الطرق المتاحة للعملاء — تظهر تلقائياً في صفحة الدفع</p>
          <div className="space-y-3 mt-4">
            {gateways.map((g) => (
              <div key={g.key} className={`rounded-2xl border-2 p-4 transition ${g.on ? "border-slate-200 bg-white" : "border-dashed border-slate-200 bg-slate-50/50"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">{g.emoji}</span>
                    <div className="min-w-0">
                      <p className="font-extrabold text-slate-700 text-sm">{g.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{g.desc}</p>
                    </div>
                  </div>
                  <Toggle on={g.on} onChange={() => toggleGateway(g.key)} />
                </div>
                {g.on && (
                  <div className="grid sm:grid-cols-2 gap-3 mt-3.5">
                    <input
                      dir="ltr"
                      value={gatewayKeys[g.key] ? gatewayKeys[g.key].apiKey || gatewayKeys[g.key].wallet || "" : ""}
                      onChange={(e) => setGatewayKeys({ ...gatewayKeys, [g.key]: { ...gatewayKeys[g.key], [g.key === "vodafone" ? "wallet" : "apiKey"]: e.target.value } })}
                      placeholder={g.key === "vodafone" ? "رقم المحفظة" : "Public / API Key"}
                      className={`${inputCls} text-left text-xs`}
                    />
                    {g.key !== "vodafone" && (
                      <input
                        dir="ltr"
                        type="password"
                        value={gatewayKeys[g.key] ? gatewayKeys[g.key].secret || "" : ""}
                        onChange={(e) => setGatewayKeys({ ...gatewayKeys, [g.key]: { ...gatewayKeys[g.key], secret: e.target.value } })}
                        placeholder="Secret Key"
                        className={`${inputCls} text-left text-xs`}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={saveGateways} className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition shadow-sm">حفظ البوابات</button>
          </div>
        </section>

        {/* Watermark */}
        <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5 sm:p-6" style={{ animation: "fadeUp .45s ease both .1s" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-800">🖼️ العلامة المائية (Watermark)</h2>
            <Toggle on={wmOn} onChange={() => setWmOn(!wmOn)} />
          </div>
          <p className="text-xs text-slate-400 mt-1">تُطبع على المعاينات قبل الدفع لحماية القوالب</p>
          {wmOn && (
            <div className="mt-4 grid lg:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">نص العلامة</label>
                  <input value={wmText} onChange={(e) => setWmText(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">الشفافية: {wmOpacity}%</label>
                  <input type="range" min="10" max="100" value={wmOpacity} onChange={(e) => setWmOpacity(parseInt(e.target.value, 10))} className="w-full accent-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">الموضع</label>
                  <div className="flex flex-wrap gap-2">
                    {WM_POSITIONS.map((p) => (
                      <button key={p.key} onClick={() => setWmPos(p.key)} className={`text-xs font-bold px-3 py-2 rounded-xl transition ${wmPos === p.key ? "bg-gradient-to-l from-brand-primary to-brand-secondary text-white" : "bg-slate-100 text-slate-500 hover:text-brand-primary"}`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* معاينة حية */}
              <div>
                <p className="text-xs font-bold text-slate-400 mb-1.5">معاينة حية</p>
                <div className="relative h-40 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">🎂</div>
                  <div className={`absolute inset-0 flex ${POS_CLS[wmPos]} pointer-events-none`}>
                    <span className="text-white font-extrabold text-sm" style={{ opacity: wmOpacity / 100 }}>{wmText || "بصمة وذكرى"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <button onClick={() => showToast("تم حفظ إعدادات العلامة المائية ✓")} className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition shadow-sm">حفظ الإعدادات</button>
          </div>
        </section>

        {/* QR Code */}
        <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5 sm:p-6" style={{ animation: "fadeUp .45s ease both .2s" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-800">📱 كود QR للهدايا</h2>
            <Toggle on={qrOn} onChange={() => setQrOn(!qrOn)} />
          </div>
          <p className="text-xs text-slate-400 mt-1">يُولَّد تلقائياً لكل رابط هدية ليتصفح المُهدى إليه بسهولة</p>
          {qrOn && (
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">حجم الصورة المُصدَّرة</label>
                <select value={qrSize} onChange={(e) => setQrSize(e.target.value)} className={`${inputCls} cursor-pointer`}>
                  <option value="128">صغير — 128px</option>
                  <option value="256">متوسط — 256px</option>
                  <option value="512">كبير — 512px</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">لون الكود</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="w-12 h-11 rounded-lg border border-slate-200 cursor-pointer bg-white" />
                  <span className="text-sm font-bold text-slate-500" dir="ltr">{qrColor}</span>
                </div>
              </div>
              <label className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 cursor-pointer sm:col-span-2">
                <span className="text-sm font-bold text-slate-700">تضمين شعار «بصمة وذكرى» في منتصف الكود</span>
                <Toggle on={qrLogo} onChange={() => setQrLogo(!qrLogo)} />
              </label>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <button onClick={() => showToast("تم حفظ إعدادات QR Code ✓")} className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition shadow-sm">حفظ الإعدادات</button>
          </div>
        </section>

        {/* إعدادات عامة */}
        <section className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5 sm:p-6" style={{ animation: "fadeUp .45s ease both .3s" }}>
          <h2 className="font-extrabold text-slate-800">⚙️ إعدادات عامة</h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">اسم الموقع</label>
              <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">بريد الدعم</label>
              <input dir="ltr" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className={`${inputCls} text-left`} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">واتساب الدعم</label>
              <input dir="ltr" value={supportWhats} onChange={(e) => setSupportWhats(e.target.value)} className={`${inputCls} text-left`} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">العملة</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={`${inputCls} cursor-pointer`}>
                <option value="EGP">جنيه مصري (ج.م)</option>
                <option value="USD">دولار أمريكي ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">نسبة الضريبة %</label>
              <input type="number" min="0" max="100" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className={inputCls} />
              <p className="text-[11px] text-slate-400 mt-1.5">تُطبق تلقائياً على كل الفواتير (حالياً 14%)</p>
            </div>
            <label className="flex items-center justify-between bg-rose-50 rounded-xl px-4 py-3 cursor-pointer border border-rose-100 self-end">
              <span className="text-sm font-bold text-rose-600">🔧 وضع الصيانة (إخفاء المتجر)</span>
              <Toggle on={maintenance} onChange={() => setMaintenance(!maintenance)} />
            </label>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => showToast("تم حفظ الإعدادات العامة ✓")} className="bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition shadow-sm">حفظ الإعدادات</button>
          </div>
        </section>
      </div>

      <Toast msg={toast} />
    </>
  );
}
