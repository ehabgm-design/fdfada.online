import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../components/Logo";
import { 
  WhatsAppVentCard, 
  WhatsAppIcon, 
  WHATSAPP_NUMBER, 
  getWhatsAppUrl 
} from "../components/WhatsAppSupport";
import { 
  MessageSquareHeart, 
  HeartPulse, 
  Ear, 
  Users, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Smartphone, 
  Lock, 
  UserPlus, 
  MapPin, 
  CheckCircle, 
  Compass, 
  ArrowRight,
  Shield,
  HeartHandshake
} from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    document.title = "فضفضة أونلاين - منصة البوح والرسائل السرية والدعم النفسي";
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");
    const storedDisplayName = localStorage.getItem("displayName");

    if (storedUserId) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setDisplayName(storedDisplayName);
    }
  }, []);

  const features = [
    {
      title: "خزانة الأسرار",
      description: "صندوق البوح الفوري الفاني المحمي تمامًا. اكتبي سرك أو ما يثقل قلبك بكل حرية، ودعي آلامك تتبخر بمجرد إغلاق المتصفح دون كشف هويتك.",
      icon: MessageSquareHeart,
      bg: "bg-rose-gold/5",
      color: "text-rose-gold",
      link: "/venting",
      badge: "دخول زوار فوري"
    },
    {
      title: "مؤشر الوجدان",
      description: "هل تشعرين بالضيق، القلق أو التشتت؟ حددي حالتك الشعورية الحالية وسيقوم رفيقك التفاعلي بمواساتك فورياً وترشيح روتين استرخاء داعم لكِ.",
      icon: HeartPulse,
      bg: "bg-plum/5",
      color: "text-plum",
      link: "/mood",
      badge: "تنمية وجدانية"
    },
    {
      title: "متنفس السكينة",
      description: "واحة استرجاع الأنفاس والهدوء التام. تمرين التنفس الموجه بأمواج بصرية ناعمة مصممة علمياً لتخفيف آثار نوبات الهلع والقلق اليومي.",
      icon: Ear,
      bg: "bg-velvet/5",
      color: "text-velvet",
      link: "/relax",
      badge: "دعم مهدئ"
    },
    {
      title: "مجتمع الفتيات والوطن العربي",
      description: "صالون آمن ومحمي يسمح لكِ باختيار دولتك الحالية أو التنقل لمجتمعات أخرى ومشاركة المنشورات والتعليقات وعرض علم بلدك الأصلي.",
      icon: Users,
      bg: "bg-rose-gold/10",
      color: "text-rose-gold font-bold",
      link: "/community",
      badge: "تفاعل اجتماعي نسائي"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm via-white to-warm font-sans pb-16">
      
      {/* Premium Hero Banner Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:py-24 text-right px-4 max-w-6xl mx-auto">
        {/* Soft background decor blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-b from-rose-gold/10 to-plum/5 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-4 left-4 w-72 h-72 bg-plum/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-plum/5 text-plum px-4 py-1.5 rounded-full text-xs font-black shadow-sm border border-plum/10 animate-pulse">
              <Sparkles className="w-4 h-4 text-rose-gold" />
              <span>ديوان العرب الآمن للبوح والمصارحة المفرزة للرجال والنساء 🌸🛡️</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              أهلاً بكم في <span className="text-plum">فضفضة أونلاين</span> - ديوان البوح المفرز المحمي للفضفضة والائتلاف
            </h1>

            <p className="text-slate-600 font-medium leading-relaxed max-w-2xl text-base md:text-md">
              هل تجد صعوبة في التعبير عما يقلقك خوفاً من الأحكام أو التطفل؟ في منصة <strong className="text-plum">فضفضة أونلاين</strong>، نقدم مجتمعات محافظة ومفرزة: ديوان خاص للزاهرات (النساء)، ومجلس خاص للفرسان (الرجال)، وساحات مشتركة محكومة بنظام كوينزات ذكي لضمان منتهى الجدية والأمان وحمايتكم من أي متطفل.
            </p>

            <div className="border-r-4 border-rose-gold/80 pr-4 py-2 bg-warm rounded-l-2xl">
              <p className="text-xs font-bold text-slate-700">
                🔒 خصوصية مطلقة بأمان تام: إمكانية الفضفضة المجهولة دون حساب لتتبخر بياناتك، أو إنشاء حساب وتخليد صداقات حقيقية بدعم كوينزات المحطة التفاعلية.
              </p>
            </div>

            {/* Quick Authentication Actions Callout based on status */}
            <div className="flex flex-wrap gap-4 pt-4">
              {isLoggedIn ? (
                <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white/80 p-5 rounded-3xl border border-plum/10 shadow-sm">
                  <div className="flex items-center gap-3 flex-row-reverse text-right flex-1">
                    <span className="text-3xl">🌸</span>
                    <div>
                      <h4 className="text-sm font-black text-slate-800">أهلاً بك مجدداً في الرواق الشعوري، {displayName || `@${username}`}!</h4>
                      <p className="text-xs text-slate-500">حسابك مشفر ومحمي برقم سري. تصفح مجالس الفضفضة أو تفقد كوينزاتك وجديد الصندوق.</p>
                    </div>
                  </div>
                  <Link 
                    to="/dashboard"
                    className="bg-plum hover:bg-velvet text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition duration-300 shadow-md active:scale-95"
                  >
                    <span>الدخول للوحة التحكم والمصارحة 💬</span>
                    <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                </div>
              ) : (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link 
                    to="/register"
                    className="bg-plum hover:bg-velvet text-white font-black text-sm p-4 rounded-2.5xl flex items-center justify-center gap-2.5 transition duration-300 shadow-md shadow-plum/10 active:scale-95 text-center"
                  >
                    <UserPlus className="w-5 h-5 text-rose-gold animate-bounce" />
                    <span>إنشاء حساب مستقل آمن (مجاناً)</span>
                  </Link>
                  <Link 
                    to="/login"
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-sm p-4 rounded-2.5xl flex items-center justify-center gap-2.5 transition duration-300 shadow-sm text-center"
                  >
                    <Lock className="w-4 h-4 text-plum" />
                    <span>تسجيل الدخول لديوان المصارحة</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 w-full max-w-md space-y-6">
            {/* Visual Logo badge with official branding design */}
            <Logo size="xl" variant="badge" className="shadow-2xl border-rose-gold/20 hover:scale-[1.01] transition-all" />
            
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-slate-150 shadow-sm text-right space-y-3">
              <div className="flex items-center justify-between border-b border-warm pb-2">
                <span className="text-[10px] font-black text-rose-gold bg-rose-gold/10 px-2 py-0.5 rounded-full">
                  نظام الأمان والتشغيل والكوينزات
                </span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                تم دمج الهوية الوجدانية والموقع fdfada.online لتجسيد مفاهيم الاحترام والبوح السليم المفرز للرجال والنساء في الوطن العربي كأول منصة تضمن عفاف المجتمع ونقاوة التواصل الروحي.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explicit Guide: Visitors & Accounts explanation */}
      <section className="bg-white border-y border-slate-100 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-black text-plum mb-3">
              كيفية استخدام ديوان فضفضة العربي؟
            </h2>
            <p className="text-slate-550 text-sm font-semibold">
              مرحباً بكم من زوار وعضوات محترمين. تهدف منصتنا لتأمين رغباتكم بالخصوصية من خلال خيارين للتحكم بهويتكم بكل سهولة:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
            {/* Guide Visitor */}
            <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-plum/5 text-plum rounded-2xl flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2">1. الدخول السريع كزائر مجهول</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  إذا كنت ترغب بالبوح الفوري دون الحصول على حساب، يمكنك الذهاب لـ <strong>خزانة الأسرار</strong>، أو تحديد حالتك الشعورية بـ <strong>مؤشر الوجدان</strong> دون تسجيل. تختفي وتتبخر بيانات مشاركتك بمجرد المغادرة كلياً.
                </p>
              </div>
              <Link 
                to="/venting" 
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-plum bg-plum/5 hover:bg-plum/10 px-4 py-3 rounded-xl transition duration-300"
              >
                <span>البدء بالبوح كـ زائر الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            {/* Guide Registered member */}
            <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-plum/5 text-purple-700 rounded-2xl flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2">2. إنشاء حساب مشفر</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  الحصول على عضوية آمنة يمنحك <strong>رابط مصارحة وصندوق بوح خاص لتلقي الرسائل المشفرة والمجهولة</strong> من أصدقائك، والانضمام لديوان ومجالس الفضفضة التفاعلية والتواصل بميزة الكوينز والدردشة الثنائية المباشرة.
                </p>
              </div>
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-plum bg-plum/5 hover:bg-plum/10 px-4 py-3 rounded-xl transition duration-300"
              >
                <span>إنشاء حساب عضوية آمنة</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            {/* Guide Real Person WhatsApp Venting */}
            <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-200/70 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <WhatsAppIcon className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full mb-2">
                  <span>جديد • مستمعة حقيقية 🌸</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">3. فضفضي مع شخص حقيقي (واتساب)</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  لو محتاجة إنسانة حقيقية تسمعك وتفهمك بصدق وأمان كامل وبدون أحكام أو تسجيل بيانات، يمكنكِ التواصل مباشرة مع فريق الاستماع عبر الواتساب على الرقم: <strong className="text-emerald-800 font-mono dir-ltr inline-block">{WHATSAPP_NUMBER}</strong>
                </p>
              </div>
              <a 
                href={getWhatsAppUrl("مرحباً بكِ، أود الفضفضة والتحدث مع شخص مستمع وموثوق عبر الواتساب 🌸")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-3 rounded-xl transition duration-300 shadow-sm"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>تحدثي معنا واتساب 💬</span>
              </a>
            </div>
          </div>

          {/* Featured Large WhatsApp Venting Card */}
          <div className="mt-12">
            <WhatsAppVentCard 
              title="محتاجة تفضفضي مع شخص حقيقي يسمعك ويفهمك؟ 💬"
              description="إذا كنتِ تعانين من همّ يثقل صدرك وتفضلين التحدث مع إنسانة مستمعة وموثوقة بدلاً من الذكاء الاصطناعي، نحن متواجدون من أجلك بسرية وأمان تام عبر الواتساب على مدار الساعة."
              badge="خدمة الاستماع والفضفضة الحقيقية عبر الواتساب"
            />
          </div>
        </div>
      </section>

      {/* Main Core Features Navigation Grid */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-bold bg-gradient-to-l from-slate-900 via-indigo-950 to-rose-600 bg-clip-text text-transparent mb-3">
            الأدوات والخدمات المتوفرة في المنصة
          </h2>
          <p className="text-slate-500 text-sm">
            تم تصميم كل ركن في تطبيق فضفضة أونلاين ليلبي مشاعر المرأة ويحثها على الطمأنينة والأمل بمساعدة أدوات تكنولوجية متقدمة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col items-start relative overflow-hidden group">
                <span className="absolute top-4 left-4 text-[10px] bg-slate-50 text-slate-400 font-bold px-3 py-1 rounded-full group-hover:bg-slate-100 transition-colors">
                  {item.badge}
                </span>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${item.bg} ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-xs md:text-sm flex-1 mb-6">
                  {item.description}
                </p>
                <Link 
                  to={item.link} 
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-slate-800 transition-colors pt-2"
                >
                  <span>دخول الغرفة الآن</span>
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Android Native App Promo Section - "Coming Soon" */}
      <section className="px-4 max-w-5xl mx-auto mb-20">
        <div className="bg-gradient-to-l from-indigo-800 via-indigo-900 to-indigo-950 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center gap-8 shadow-xl">
          {/* Subtle background items */}
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-2xl"></div>
          
          <div className="flex-1 space-y-6 text-right">
            <span className="inline-flex items-center gap-1 bg-white/10 text-rose-300 px-3.5 py-1.5 rounded-full text-[11px] font-black tracking-wider border border-white/5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>انتظروا قريباً تطبيق الأندرويد! 🌟</span>
            </span>

            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
              تطبيق فضفضة أونلاين على الهواتف الذكية بنظام الأندرويد
            </h3>

            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              نعمل الآن بكامل طاقتنا لتطوير وإصدار النسخة الأولى من <strong>تطبيق فضفضة أونلاين للأندرويد</strong>. سيشتمل التطبيق على مزايا قوية فريدة مثل الإشعارات اللحظية لأقوى الصداقات، استهلاك اقتصادي للبيانات، ممانعة لقطات الشاشة للحفاظ على سرية البوح، وبصمة حماية لحمايته من المتطفلين.
            </p>

            <ul className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-200">
              <li className="flex items-center gap-2 flex-row-reverse justify-end">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>إشعارات فورية للرسائل 📥</span>
              </li>
              <li className="flex items-center gap-2 flex-row-reverse justify-end">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>أمان ببصمة الإصبع والوجه 🔐</span>
              </li>
              <li className="flex items-center gap-2 flex-row-reverse justify-end">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>حظر لقطات الشاشة لحمايتك 🚫</span>
              </li>
              <li className="flex items-center gap-2 flex-row-reverse justify-end">
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>أداء سريع واستهلاك بطارية أقل ⚡</span>
              </li>
            </ul>

            <div className="pt-4 flex flex-wrap gap-4 items-center justify-end">
              <span className="text-[11px] bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-slate-400 font-bold shrink-0">
                 جاري التطوير والتجريب الداخلي APK...
              </span>
            </div>
          </div>

          <div className="w-48 h-48 md:w-60 md:h-60 shrink-0 bg-white/5 border border-white/10 rounded-3xl flex flex-col justify-between p-6 relative overflow-hidden backdrop-blur-sm shadow-inner">
            <div className="flex justify-between items-center bg-white/10 p-2 rounded-2xl">
              <span className="text-[10px] font-black text-rose-300">Fadfada App v1.0</span>
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
            </div>
            
            <div className="text-center space-y-2 my-auto">
              <span className="text-3xl">🌸</span>
              <p className="text-xs font-black">فضفضة أونلاين</p>
              <p className="text-[9px] text-slate-400 font-mono">Android Release Preview</p>
            </div>

            <div className="text-center py-2 bg-gradient-to-r from-teal-500/80 to-teal-600/80 rounded-xl text-[10px] font-bold text-white shadow-sm">
              قريباً على متجر Google Play! 🚀
            </div>
          </div>
        </div>
      </section>

      {/* SEO & Search Engine Safe Space section for "فضفضة اون لاين" and "موقع فضفضه" */}
      <section className="bg-slate-100/50 py-16 px-4 border-t border-slate-200/50 text-right">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-lg font-black text-slate-800 flex items-center justify-end gap-2">
            <span>لماذا تحتل منصة "فضفضة أونلاين" مراكز متقدمة؟ 📈</span>
          </h2>
          
          <p className="text-xs text-slate-600 leading-relaxed">
            البحث عن كلمة <strong>فضفضة</strong> أو <strong>فضفضة أونلاين</strong> في الدول العربية يعكس دائمًا رغبة الفتيات والسيدات في الوصول لمجتمعات مصونة ومحترمة ومريحة للبال تمامًا. منصة فضفضة توظّف أحدث معايير الويب الفائقة السرعة لتوفير تجربة تشغيل محسَّنة وخفة تمنحكِ أقصى درجات الراحة النفسية.
          </p>

          <p className="text-xs text-slate-600 leading-relaxed">
            ندعم بالمنصة جميع المدن والعواصم العربية: من <strong>مصر</strong>، <strong>السعودية</strong>، <strong>المغرب</strong>، <strong>الجزائر</strong>، <strong>تونس</strong>، <strong>العراق</strong>، وبقية الخليج والشام. نتيح لكِ التنقل السريع بين مجتمعات الدول مع عرض علم بلدك لنعزز التقارب والتفاهم والتعاون في سياق يراعي عاداتنا وتقاليدنا الراقية.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
              <span className="text-xl">⚡</span>
              <h4 className="text-xs font-bold text-slate-800 mt-2">تحسين السرعة</h4>
              <p className="text-[10px] text-slate-500 mt-1">تصفح خفيف وموفر للبيانات</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
              <span className="text-xl">👩‍💻</span>
              <h4 className="text-xs font-bold text-slate-800 mt-2">بنات فقط</h4>
              <p className="text-[10px] text-slate-500 mt-1">خصوصية نسائية معتمدة</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
              <span className="text-xl">🛡️</span>
              <h4 className="text-xs font-bold text-slate-800 mt-2">حقوق مجهولة</h4>
              <p className="text-[10px] text-slate-500 mt-1">لا تتبع أو تخزين لملفات تعريفية رديئة</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
              <span className="text-xl">🌸</span>
              <h4 className="text-xs font-bold text-slate-800 mt-2">شقيقة لدعمكِ</h4>
              <p className="text-[10px] text-slate-500 mt-1">نظام رفيقات ودليل معتمد</p>
            </div>
          </div>

          {/* Social and AI News Redirection Block */}
          <div className="bg-gradient-to-br from-indigo-950 to-teal-950 text-white rounded-[2rem] p-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden text-right" dir="rtl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
            <div className="space-y-3 relative z-10 flex-1">
              <span className="bg-white/10 text-teal-300 border border-white/10 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5">
                📣 تحديثات السوشيال ميديا وتكنولوجيا الذكاء الاصطناعي
              </span>
              <h3 className="text-xl md:text-2xl font-black">تابعي عائلتنا الكبرى عبر فايسبوك وقنوات الإنترنت 🌸</h3>
              <p className="text-[11px] text-slate-200 leading-relaxed max-w-2xl">
                شاركي بقوات الانتشار الإقليمي، وتابعي آخر الأخبار والتقارير الصحفية حول دمج منصة وموقع فضفضة مع تقنيات Google للبحث والذكاء الاصطناعي الوجداني Gemini. تفقدي منشورات فيسبوك التفاعلية وقرّري بنفسك تفاصيل التمكين والدعم.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row items-stretch gap-3 relative z-10 w-full md:w-auto">
              <Link 
                to="/social-news" 
                className="bg-white text-indigo-950 hover:bg-slate-50 font-black text-xs px-6 py-4 rounded-xl text-center shadow-md transition whitespace-nowrap"
              >
                المعبر الإخباري وبث الفيسبوك ⟵
              </Link>
              <a 
                href="https://www.facebook.com/fdfada.online" 
                target="_blank" 
                rel="no-referrer"
                className="bg-teal-500 hover:bg-teal-600 text-white font-black text-xs px-6 py-4 rounded-xl text-center shadow-md transition flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>صفحتنا المباشرة: fdfada.online 🔗</span>
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
