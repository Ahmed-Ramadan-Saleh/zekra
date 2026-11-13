import { useState, useEffect } from "react";

/* ============================================================
   RecipientExperience.jsx — استلام الهدية التفاعلية
   الصفحة اللي بيفتحها المُهدى إليه بعد ما يستلم الرابط أو QR
   المسار المقترح: /gift/:code
   المراحل: envelope (ظرف مغلق) ← opening (لحظة الفتح) ← content (المحتوى)
   ============================================================ */

/* ---------- بيانات تجريبية (هتيجي من API لاحقاً حسب كود الهدية في الرابط) ---------- */
const GIFT_DATA = {
  link: "https://bassma-thikra.com/g/noor-2026",
  templateName: "قالب عيد ميلاد نجمي",
  senderName: "سارة",
  recipientName: "نور",
  occasion: "عيد ميلاد 🎂",
  headline: "كل سنة وأنتِ أجمل حاجة في حياتي",
  message:
    "يا نور 💜\nكل سنة وانتِ طيبة يا أجمل مفاجأة عشتها في حياتي.\nالنهاردة مش بس عيد ميلادك.. ده اليوم اللي اتولدت فيه أجمل ضحكة أعرفها.\nجمعتلك هنا شوية ذكريات وكلام من قلبي، وأتمنى السنة الجديدة دي تكون بداية كل حاجة حلوة نفسك فيها.\nبحبك أوي، وكل سنة وانتِ بخير ✨",
  signature: "سارة",
  music: { title: "Happy Birthday — نسخة هادئة", duration: "2:35" },
  photos: [
    { emoji: "🎂", caption: "أول تورتة عملناها سوا 🥹", bg: "from-pink-400 via-rose-400 to-purple-500" },
    { emoji: "🌴", caption: "رحلة السخنة.. أحلى يوم صيف", bg: "from-amber-400 via-orange-400 to-rose-400" },
    { emoji: "☕", caption: "قهوة الصبح مع بعض ☀️", bg: "from-purple-400 via-violet-400 to-indigo-500" },
    { emoji: "🎉", caption: "ودي كانت بداية كل حاجة حلوة", bg: "from-rose-400 via-pink-500 to-fuchsia-500" },
  ],
  gifts: [
    { id: 1, emoji: "🎟️", name: "خصم 20%", desc: "على أي قالب جديد تعمله من المنصة", code: "NOOR20" },
    { id: 2, emoji: "💌", name: "رسالة سرية", desc: "رسالة من سارة هتوصلك لوحدها بعد ما تفتح هديتك", code: null },
    { id: 3, emoji: "🌟", name: "نجمة أمنيات", desc: "اقفل عينيك، تمنّ أمنية.. ودي نجمتك", code: null },
  ],
};

/* ---------- الحركات المخصصة ---------- */
const KEYFRAMES = `
  @keyframes floatY { 0%,100% { transform: translateY(0) rotate(-8deg); } 50% { transform: translateY(-22px) rotate(8deg); } }
  @keyframes twinkle { 0%,100% { opacity: .15; } 50% { opacity: .9; } }
  @keyframes eqBar { 0%,100% { transform: scaleY(.35); } 50% { transform: scaleY(1); } }
  @keyframes giftShake { 0%,100% { transform: rotate(0) scale(1); } 20% { transform: rotate(-10deg) scale(1.12); } 40% { transform: rotate(10deg) scale(1.12); } 60% { transform: rotate(-8deg) scale(1.12); } 80% { transform: rotate(8deg) scale(1.12); } }
  @keyframes ringPulse { 0% { transform: scale(1); opacity: .7; } 100% { transform: scale(2); opacity: 0; } }
  @keyframes heartBurst { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
  @keyframes riseIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
`;

/* ---------- أيقونات SVG مدمجة (بدون أي مكتبات خارجية) ---------- */
const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

/* ---------- نجوم الخلفية (مرحلة الظرف) ---------- */
const Stars = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 26 }).map((_, i) => (
      <span
        key={i}
        className="absolute w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full"
        style={{
          left: `${(i * 13.7) % 100}%`,
          top: `${(i * 29.3) % 100}%`,
          animation: `twinkle ${2 + (i % 4)}s ease-in-out ${(i % 6) * 0.4}s infinite`,
        }}
      />
    ))}
  </div>
);

/* ---------- بالونات وزخارف طايرة ---------- */
const FloatingDecor = () => {
  const items = ["🎈", "🎊", "✨", "💜", "🎀", "🌟"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-xl md:text-3xl opacity-30"
          style={{
            left: `${(i * 8.5 + 3) % 95}%`,
            top: `${(i * 37) % 90}%`,
            animation: `floatY ${5 + (i % 4)}s ease-in-out ${(i % 5) * 0.6}s infinite`,
          }}
        >
          {items[i % items.length]}
        </span>
      ))}
    </div>
  );
};

/* ============================================================
   الصفحة الرئيسية
   ============================================================ */
export default function RecipientExperience() {
  /* مراحل التجربة: envelope → opening → content */
  const [stage, setStage] = useState("envelope");
  const [musicOn, setMusicOn] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [openedGift, setOpenedGift] = useState(null); /* قفل الاختيار: id الهدية المختارة */
  const [shakingGift, setShakingGift] = useState(null); /* id الهدية أثناء الفتح */
  const [copiedCode, setCopiedCode] = useState(false);
  const [sentThanks, setSentThanks] = useState(false);
  const [burst, setBurst] = useState(false);

  /* عنوان التبويب */
  useEffect(() => {
    document.title = `هدية من ${GIFT_DATA.senderName} 🎁 | بصمة وذكرى`;
  }, []);

  /* فتح الظرف: الختم يختفي ← الفلاب يفتح ← الرسالة تطلع ← المحتوى */
  const openEnvelope = () => {
    if (stage !== "envelope") return;
    setBurst(true);
    setStage("opening");
    setTimeout(() => setStage("content"), 2400);
  };

  /* اختيار الهدية الواحدة + قفل الاختيار نهائياً */
  const chooseGift = (gift) => {
    if (openedGift !== null || shakingGift !== null) return;
    setShakingGift(gift.id);
    setTimeout(() => {
      setOpenedGift(gift.id);
      setShakingGift(null);
    }, 900);
  };

  /* نسخ كود الخصم */
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(GIFT_DATA.gifts[0].code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(false);
    }
  };

  /* تمرير تلقائي للصور داخل المحتوى */
  useEffect(() => {
    if (stage !== "content") return;
    const t = setInterval(() => {
      setPhotoIndex((p) => (p + 1) % GIFT_DATA.photos.length);
    }, 4500);
    return () => clearInterval(t);
  }, [stage]);

  const photo = GIFT_DATA.photos[photoIndex];
  const nextPhoto = () => setPhotoIndex((p) => (p + 1) % GIFT_DATA.photos.length);
  const prevPhoto = () => setPhotoIndex((p) => (p - 1 + GIFT_DATA.photos.length) % GIFT_DATA.photos.length);

  /* ==========================================================
     المرحلة 1 + 2: الظرف المغلق ولحظة الفتح
     ========================================================== */
  if (stage !== "content") {
    return (
      <div
        dir="rtl"
        className="min-h-screen relative bg-gradient-to-b from-[#1e1b4b] via-[#4c1d95] to-[#831843] flex flex-col items-center justify-center px-4 overflow-hidden"
        style={{ opacity: stage === "opening" ? 0 : 1, transition: "opacity 0.6s ease 1.7s" }}
      >
        <style>{KEYFRAMES}</style>
        <Stars />
        <FloatingDecor />

        {/* شعار المنصة */}
        <div className="absolute top-5 right-5 z-20 flex items-center gap-2 text-white/80 text-sm font-bold">
          <span className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">👣</span>
          بصمة وذكرى
        </div>

        {/* العنوان الترحيبي */}
        <div
          className={`relative z-10 text-center transition-all duration-500 ${stage === "opening" ? "opacity-0 -translate-y-4" : "opacity-100"}`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur text-white/90 text-sm border border-white/20">
            🎂 {GIFT_DATA.occasion}
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-snug">
            {GIFT_DATA.recipientName}.. عندك هدية جديدة!
          </h1>
          <p className="mt-3 text-white/70 text-lg">
            بعتلك{" "}
            <span className="text-white font-bold">{GIFT_DATA.senderName}</span>{" "}
            هدية من قلبها 💜
          </p>
        </div>

        {/* الظرف */}
        <div className="relative z-10 mt-8 md:mt-10">
          <div
            className={`absolute -bottom-10 inset-x-10 h-10 bg-black/40 blur-2xl rounded-full transition-opacity duration-1000 ${stage === "opening" ? "opacity-0" : "opacity-100"}`}
          />

          <button
            onClick={openEnvelope}
            className="group relative block w-[300px] h-[210px] md:w-[430px] md:h-[300px] focus:outline-none"
            aria-label="افتح الهدية"
          >
            <div
              className={`relative w-full h-full transition-transform duration-1000 ${stage === "opening" ? "scale-110" : "group-hover:scale-[1.03]"}`}
              style={{ perspective: "1000px" }}
            >
              {/* خلف الظرف */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-700 via-brand-primary to-brand-secondary shadow-2xl" />

              {/* الرسالة اللي بتطلع من الظرف */}
              <div
                className="absolute inset-x-5 top-5 bottom-5 z-10 bg-white rounded-xl shadow-xl p-4 flex flex-col justify-center gap-2"
                style={{
                  transform: stage === "envelope" ? "translateY(16px)" : "translateY(-150px) rotate(-3deg)",
                  transition: "transform 1s cubic-bezier(.34,1.3,.64,1)",
                  transitionDelay: stage === "envelope" ? "0ms" : "550ms",
                }}
              >
                <p className="text-[10px] md:text-xs text-gray-400 text-center">إلى: {GIFT_DATA.recipientName}</p>
                <p className="text-sm md:text-lg font-bold text-gray-800 text-center">{GIFT_DATA.headline}</p>
                <div className="h-1.5 w-2/3 mx-auto rounded bg-purple-100" />
                <div className="h-1.5 w-1/2 mx-auto rounded bg-purple-100" />
              </div>

              {/* الجيب الأمامي */}
              <div
                className="absolute inset-0 z-20 rounded-2xl"
                style={{
                  clipPath: "polygon(0 20%, 50% 64%, 100% 20%, 100% 100%, 0 100%)",
                  background: "linear-gradient(180deg, #8b5cf6 0%, #7c3aed 55%, #6d28d9 100%)",
                }}
              />

              {/* الفلاب العلوي — بيفتح لفوق */}
              <div
                className="absolute inset-x-0 top-0 h-[58%] z-30 origin-top"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background: "linear-gradient(180deg, #a78bfa 0%, #8b5cf6 100%)",
                  transform: stage === "envelope" ? "rotateX(0deg)" : "rotateX(-180deg)",
                  opacity: stage === "envelope" ? 1 : 0,
                  transition: "transform 0.7s ease, opacity 0.45s ease 0.3s",
                }}
              />

              {/* الختم الشمعي */}
              <div
                className={`absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 z-40 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg flex items-center justify-center text-2xl transition-all duration-500 ${stage === "opening" ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
              >
                💜
                {stage === "envelope" && (
                  <>
                    <span
                      className="absolute inset-0 rounded-full border-2 border-pink-300"
                      style={{ animation: "ringPulse 2s ease-out infinite" }}
                    />
                    <span
                      className="absolute inset-0 rounded-full border-2 border-pink-300"
                      style={{ animation: "ringPulse 2s ease-out 1s infinite" }}
                    />
                  </>
                )}
              </div>
            </div>
          </button>

          {/* وميض لحظة الفتح */}
          {burst && stage === "opening" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-6xl" style={{ animation: "heartBurst 0.9s ease-out forwards" }}>
                ✨
              </span>
            </div>
          )}
        </div>

        {/* تلميح الضغط */}
        <p
          className={`relative z-10 mt-10 text-white/80 text-sm md:text-base animate-pulse transition-opacity duration-500 ${stage === "opening" ? "opacity-0" : "opacity-100"}`}
        >
          اضغط على الظرف لفتح الهدية 👆
        </p>

        <p className="absolute bottom-4 z-10 text-white/40 text-xs">
          صُنعت هذه الهدية بحب على بصمة وذكرى
        </p>
      </div>
    );
  }

  /* ==========================================================
     المرحلة 3: المحتوى التفاعلي بعد فتح الظرف
     ========================================================== */
  return (
    <div dir="rtl" className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 pb-14">
      <style>{KEYFRAMES}</style>
      <FloatingDecor />

      {/* زر الموسيقى العائم */}
      <button
        onClick={() => setMusicOn(!musicOn)}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2.5 rounded-full bg-white shadow-lg border border-purple-100 hover:shadow-xl transition-all"
        title={musicOn ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
      >
        <span
          className={`w-8 h-8 rounded-full bg-gradient-to-l from-brand-primary to-brand-secondary flex items-center justify-center text-white text-sm ${musicOn ? "animate-pulse" : ""}`}
        >
          🎵
        </span>
        {musicOn && (
          <span className="flex items-end gap-[3px] h-4">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="w-[3px] h-4 rounded bg-brand-secondary origin-bottom"
                style={{ animation: `eqBar 0.7s ${i * 0.12}s ease-in-out infinite` }}
              />
            ))}
          </span>
        )}
      </button>
      {musicOn && (
        <div
          className="fixed top-[68px] left-4 z-50 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur text-white text-xs shadow-lg"
          style={{ animation: "riseIn 0.4s ease-out both" }}
        >
          🎧 {GIFT_DATA.music.title}
        </div>
      )}

      {/* الهيدر الخفيف */}
      <header className="relative z-10 flex items-center justify-between px-4 md:px-8 py-4">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-l from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-lg">
            👣
          </span>
          <span className="font-extrabold text-gray-800">
            بصمة <span className="text-brand-primary">وذكرى</span>
          </span>
        </div>
        <span className="ms-auto me-20 px-3 py-1.5 rounded-full bg-white shadow-sm border border-pink-100 text-sm text-gray-600">
          🎁 هدية من <b className="text-brand-primary">{GIFT_DATA.senderName}</b>
        </span>
      </header>

      {/* البطل: التهنئة الرئيسية */}
      <section className="relative z-10 text-center px-4 pt-6 pb-10" style={{ animation: "riseIn 0.7s ease-out both" }}>
        <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-l from-brand-primary to-brand-secondary text-white text-sm font-bold shadow-lg">
          🎂 {GIFT_DATA.occasion}
        </span>
        <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-gray-800 leading-snug">
          {GIFT_DATA.headline}{" "}
          <span className="bg-gradient-to-l from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            يا {GIFT_DATA.recipientName}
          </span>{" "}
          🎉
        </h1>
        <p className="mt-3 text-gray-500">فتحت الهدية بنجاح.. خلينا نبدأ الرحلة ✨</p>
      </section>

      {/* رسالة المُرسل */}
      <section className="relative z-10 max-w-2xl mx-auto px-4" style={{ animation: "riseIn 0.7s ease-out 0.15s both" }}>
        <div className="relative bg-white rounded-3xl shadow-xl p-6 md:p-9 border border-purple-50">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 rounded bg-amber-200/80 shadow-sm -rotate-2" />
          <h2 className="text-lg md:text-xl font-extrabold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-lg">💌</span>
            رسالة من {GIFT_DATA.senderName}
          </h2>
          <p className="whitespace-pre-line text-gray-600 leading-relaxed md:leading-loose text-[15px] md:text-base">
            {GIFT_DATA.message}
          </p>
          <p className="mt-6 text-left font-bold text-brand-primary">— {GIFT_DATA.signature} 💜</p>
        </div>
      </section>

      {/* معرض الصور */}
      <section className="relative z-10 max-w-2xl mx-auto px-4 mt-10" style={{ animation: "riseIn 0.7s ease-out 0.3s both" }}>
        <h2 className="text-lg md:text-xl font-extrabold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-lg">📸</span>
          لحظاتنا مع بعض
        </h2>

        <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] md:aspect-[16/10]">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${photo.bg} flex items-center justify-center transition-all duration-700`}
          >
            <span className="text-[90px] md:text-[130px] drop-shadow-lg" style={{ animation: "floatY 4s ease-in-out infinite" }}>
              {photo.emoji}
            </span>
          </div>

          {/* الكابشن */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-10">
            <p className="text-white font-bold text-sm md:text-base">{photo.caption}</p>
            <p className="text-white/70 text-xs mt-0.5">
              {photoIndex + 1} من {GIFT_DATA.photos.length}
            </p>
          </div>

          {/* أسهم التنقل */}
          <button
            onClick={prevPhoto}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-gray-700 shadow-lg hover:bg-white transition-all"
            title="السابق"
          >
            <ChevronRightIcon />
          </button>
          <button
            onClick={nextPhoto}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-gray-700 shadow-lg hover:bg-white transition-all"
            title="التالي"
          >
            <ChevronLeftIcon />
          </button>
        </div>

        {/* النقاط */}
        <div className="flex justify-center gap-2 mt-4">
          {GIFT_DATA.photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setPhotoIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === photoIndex
                  ? "w-7 bg-gradient-to-l from-brand-primary to-brand-secondary"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </section>

      {/* الهدايا — قفل الاختيار */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 mt-12" style={{ animation: "riseIn 0.7s ease-out 0.45s both" }}>
        <div className="text-center mb-6">
          <h2 className="text-lg md:text-xl font-extrabold text-gray-800 flex items-center justify-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg">🎁</span>
            مفاجأة أخيرة.. اختر هديتك!
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {openedGift === null
              ? "في 3 هدايا مستنية.. بس تقدر تفتح واحدة بس! اختر بحكمة 👀"
              : "اخترت هديتك.. واتقفلت الباقية 🔒"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          {GIFT_DATA.gifts.map((gift) => {
            const isChosen = openedGift === gift.id;
            const isLocked = openedGift !== null && !isChosen;
            const isShaking = shakingGift === gift.id;

            return (
              <div
                key={gift.id}
                role="button"
                tabIndex={0}
                onClick={() => chooseGift(gift)}
                className={`relative rounded-3xl p-5 transition-all duration-300 border ${
                  isChosen
                    ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 shadow-xl scale-[1.02]"
                    : isLocked
                    ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                    : "bg-white border-purple-100 shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                }`}
              >
                {/* شارة القفل / الاختيار */}
                {isLocked && (
                  <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-gray-200 text-gray-500 text-[11px] font-bold">
                    <LockIcon /> مقفولة
                  </span>
                )}
                {isChosen && (
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-amber-400 text-white text-[11px] font-bold">
                    اختيارك ✓
                  </span>
                )}

                <div className="flex flex-col items-center gap-3 py-2">
                  {/* علبة الهدية */}
                  <span
                    className={`text-6xl ${isChosen ? "" : "drop-shadow-md"}`}
                    style={
                      isShaking
                        ? { animation: "giftShake 0.9s ease-in-out" }
                        : isChosen
                        ? {}
                        : { animation: "floatY 3.5s ease-in-out infinite" }
                    }
                  >
                    {isShaking ? "🎁" : gift.emoji}
                  </span>

                  {isChosen ? (
                    /* محتوى الهدية بعد الفتح */
                    <div className="text-center w-full" style={{ animation: "riseIn 0.5s ease-out both" }}>
                      <p className="font-extrabold text-gray-800">{gift.name}</p>
                      <p className="text-gray-500 text-sm mt-1">{gift.desc}</p>
                      {gift.code && (
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <code className="px-3 py-1.5 rounded-lg bg-white border-2 border-dashed border-amber-400 font-bold text-amber-600 tracking-widest">
                            {gift.code}
                          </code>
                          <button
                            onClick={copyCode}
                            className="px-2.5 py-1.5 rounded-lg bg-gray-800 text-white text-xs flex items-center gap-1 hover:bg-black transition-colors"
                          >
                            <CopyIcon /> {copiedCode ? "تم ✓" : "نسخ"}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="font-bold text-gray-700">هدية #{gift.id}</p>
                      <p className="text-gray-400 text-xs mt-1">{isLocked ? "الفرصة الجاية 😅" : "اضغط للفتح"}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* رد الشكر */}
      <section className="relative z-10 max-w-2xl mx-auto px-4 mt-12 text-center" style={{ animation: "riseIn 0.7s ease-out 0.6s both" }}>
        {!sentThanks ? (
          <div className="bg-white/80 backdrop-blur rounded-3xl p-6 md:p-8 border border-pink-100 shadow-lg">
            <p className="text-gray-700 font-bold">{GIFT_DATA.senderName} هتفرح جداً لو عرفت رأيك 💜</p>
            <button
              onClick={() => setSentThanks(true)}
              className="mt-4 px-8 py-3.5 rounded-2xl bg-gradient-to-l from-brand-primary to-brand-secondary text-white font-extrabold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all"
            >
              ابعت شكر: بحبك أوي ❤️
            </button>
          </div>
        ) : (
          <div
            className="bg-gradient-to-l from-brand-primary to-brand-secondary rounded-3xl p-8 shadow-2xl text-white"
            style={{ animation: "heartBurst 0.8s ease-out both" }}
          >
            <span className="text-5xl">🥰</span>
            <p className="mt-3 font-extrabold text-lg">وصل الشكر لـ {GIFT_DATA.senderName}!</p>
            <p className="text-white/80 text-sm mt-1">هتوصله إشعار إنك فرحت بالهدية 💜</p>
          </div>
        )}
      </section>

      {/* دعوة لصناعة هدية */}
      <footer className="relative z-10 mt-14 text-center px-4">
        <p className="text-gray-400 text-sm">أُنشئت هذه الهدية بحب عبر</p>
        <p className="font-extrabold text-gray-700 mt-1">
          بصمة <span className="text-brand-primary">وذكرى</span> ✨
        </p>
        <button className="mt-4 px-6 py-3 rounded-2xl border-2 border-brand-primary text-brand-primary font-bold hover:bg-brand-primary hover:text-white transition-all">
          اعمل هديتك الخاصة هو كمان 🎁
        </button>
      </footer>
    </div>
  );
}