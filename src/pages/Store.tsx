import { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, Gift, Heart, ShieldAlert, Star, Award, HeartHandshake } from "lucide-react";
import GuestLock from "../components/GuestLock";
import { getWhatsAppUrl, WhatsAppIcon, WHATSAPP_NUMBER } from "../components/WhatsAppSupport";

export default function Store() {
  const [userId, setUserId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [userCoins, setUserCoins] = useState<number>(100);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    const storedCoins = localStorage.getItem("userCoins");
    if (storedCoins) {
      setUserCoins(parseInt(storedCoins, 10) || 100);
    }
  }, []);

  const handleClaimGift = (packName: string, coinsAdded: number) => {
    const newCoins = userCoins + coinsAdded;
    setUserCoins(newCoins);
    localStorage.setItem("userCoins", newCoins.toString());
    setSuccessMsg(`🎁 مبروك! حصلتِ على "${packName}" وتمت إضافة ${coinsAdded} كوينز مجانية إلى محفظتك في فضفضة أونلاين 🌸`);
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const FREE_PACKS = [
    { 
      id: "gift_welcome", 
      name: "هدية البداية والترحيب 🌸", 
      coins: 50, 
      desc: "احصلي فوراً على 50 كوينز هدية مجانية لتشجيعكِ على إرسال أول رسالة صراحة ومشاركة مشاعركِ بأمان.",
      icon: Sparkles,
      color: "rose"
    },
    { 
      id: "gift_support", 
      name: "وسام الدعم والسكينة النفسية 🤍", 
      coins: 100, 
      desc: "رصيد إضافي مجاني مخصص لتعزيز صندوق صراحة الخاص بكِ والتفاعل مع رسائل الصديقات.",
      icon: Heart,
      color: "teal"
    },
    { 
      id: "gift_vip", 
      name: "الباقة المجانية الشاملة (دائمة) 👑", 
      coins: 250, 
      desc: "عضوية مفتوحة ومجانية تماماً بالكامل طوال فترة استخدامك للمنصة ودون أي رسوم أو اشتراكات.",
      icon: Award,
      color: "amber"
    }
  ];

  if (!userId) {
    return (
      <GuestLock 
        title="متجر المنصة المجاني • هدايا ومساعدات العضوات 💎"
        description="جميع خدمات ومنصة فضفضة أونلاين مجانية بالكامل 100%. سجلي دخولكِ للحصول على رصيدكِ المجاني من الكوينز وهدايا الدعم النفسي وصندوق الصراحة."
        featureBadge="متجر المنصة المجاني"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 font-sans rtl text-right" dir="rtl">
      <div className="mb-10">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-black px-3.5 py-1.5 rounded-full mb-3 border border-emerald-200">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>منصة مجانية بالكامل 100% • بدون أي رسوم أو باقات مدفوعة 🌸</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center justify-end gap-2 mb-2">
          متجر المنصة المجاني والهدايا الوجدانية <Gift className="text-teal-600" />
        </h1>
        <p className="text-slate-600 text-sm">
          رصيدك الحالي في المحفظة المجانية: <strong className="text-teal-700 font-mono text-base">{userCoins} كوينز مجانية</strong> 💎
        </p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold text-center flex items-center justify-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {FREE_PACKS.map(pack => {
          const Icon = pack.icon;
          return (
            <div key={pack.id} className="p-6 rounded-3xl border-2 border-slate-100 hover:border-teal-500 bg-white shadow-sm flex flex-col justify-between transition-all group">
              <div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2 text-base">{pack.name}</h3>
                <p className="text-2xl font-black text-teal-700 font-mono mb-3">+{pack.coins} كوينز مجانية</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">{pack.desc}</p>
              </div>

              <button 
                onClick={() => handleClaimGift(pack.name, pack.coins)}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs transition duration-300 shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>استلام الهدية المجانية الآن 🎁</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Direct WhatsApp Venting Box in Store */}
      <div className="bg-gradient-to-l from-emerald-900 via-teal-950 text-white rounded-[2.5rem] p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-right flex-1">
          <span className="bg-white/10 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>خدمة الاستماع الفوري عبر الواتساب</span>
          </span>
          <h3 className="text-xl font-black">بحاجة إلى التحدث مع شخص حقيقي بصورة فورية ومجانية؟</h3>
          <p className="text-xs text-slate-200 leading-relaxed">
            منصتنا مجانية تماماً لخدمة البنات والنساء في الوطن العربي. تواصل معنا مباشرة عبر الواتساب على الرقم <strong className="text-emerald-400 font-mono dir-ltr">{WHATSAPP_NUMBER}</strong> لنكون معك في كل لحظة ضيق أو احتياج للدعم.
          </p>
        </div>
        <a 
          href={getWhatsAppUrl("مرحباً، أود التحدث مع مستمع حقيقي والفضفضة عبر الواتساب 🌸")}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 py-4 rounded-2xl shadow-md transition flex items-center gap-2 shrink-0 whitespace-nowrap"
        >
          <WhatsAppIcon className="w-4 h-4" />
          <span>تواصل عبر الواتساب 💬</span>
        </a>
      </div>

    </div>
  );
}
