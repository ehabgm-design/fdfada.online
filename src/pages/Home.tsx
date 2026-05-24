import { Link } from "react-router-dom";
import { MessageSquareHeart, HeartPulse, Ear, Users, ArrowLeft } from "lucide-react";

export default function Home() {
  const cards = [
    {
      title: "خزانة الأسرار",
      description: "غرفة فضفضة مجهولة بالكامل. اكتبي ما يزعجك وتلقي الدعم والاحتواء بدون أحكام أو تسجيل دخول. بمجرد خروجك، تتبخر الجلسة.",
      icon: MessageSquareHeart,
      bg: "bg-rose-50",
      color: "text-rose-600",
      link: "/venting"
    },
    {
      title: "مؤشر الوجدان",
      description: "هل تشعرين بالحزن، القلق، أو الضغط؟ حددي شعورك الآن لنعطيكِ جرعة مواساة فورية وروتين سريع لتهدئتك.",
      icon: HeartPulse,
      bg: "bg-indigo-50",
      color: "text-indigo-600",
      link: "/mood"
    },
    {
      title: "متنفس السكينة",
      description: "غرفة الاسترخاء والتأمل. تمرين التنفس الموجه لتهدئة القلق ونوبات الهلع، مع أصوات طبيعية لطرد الأفكار السلبية.",
      icon: Ear,
      bg: "bg-teal-50",
      color: "text-teal-600",
      link: "/relax"
    },
    {
      title: "مجتمع الفتيات",
      description: "صالون آمن وموثق للتعارف الراقي المخصص للفتيات فقط. يحتاج اشتراكاً وموافقة لضمان الخصوصية ومنع المتطفلين.",
      icon: Users,
      bg: "bg-amber-50",
      color: "text-amber-600",
      link: "/community"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12">
      <div className="mb-12 mt-8 text-center md:text-start">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">أهلاً بكِ في مساحتك الآمنة</h1>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          نحن هنا لنستمع إليكِ. لا نحكم عليكِ، ولا نطلب منكِ كشف هويتك. 
          ملاذك السري للحصول على الاحتواء النفسي والهدوء الوجداني الذي تستحقينه.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.link} to={card.link} className="block group">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col items-start relative overflow-hidden">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${card.bg} ${card.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-3">{card.title}</h2>
                <p className="text-slate-500 leading-relaxed text-sm md:text-base flex-1">
                  {card.description}
                </p>
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-400 group-hover:text-slate-800 transition-colors">
                  <span>الدخول الآن</span>
                  <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
