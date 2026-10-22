import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Search, 
  HelpCircle, 
  CheckCircle2, 
  TrendingUp, 
  Globe, 
  FileText, 
  HeartHandshake, 
  MessageSquare, 
  ShieldAlert, 
  ChevronRight, 
  Bookmark, 
  ExternalLink 
} from "lucide-react";

interface KeywordCategory {
  title: string;
  description: string;
  icon: any;
  color: string;
  tags: string[];
}

export default function SeoHub() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    document.title = "الموسوعة العربية الكبرى للفضفضة، الصراحة، وأسرار الفتيات | Fadfada";
    
    // Add dynamically meta keywords to rank perfectly 
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", "فضفضة, فضفضة اونلاين, Fadfada, Fadfada online, Saraha, Sara7a, صراحة, فضفضة بصراحة, عالم المرأة, عالم النت, عالم الفتيات, اسرار النساء, اسرار الفتايات, حرية المرأة, بنات جميلات, بنات حرة, مجتمع متفتح, صارحني, رسائل غامضة, دردشة سرية, تفريغ مشاعر");
    }
  }, []);

  const CATEGORIES: KeywordCategory[] = [
    {
      title: "فضفضة وبوح وتفريغ نفسي (Fadfada & Venting)",
      description: "بوابة التعبير الصادق والتفريغ الفوري لكل ما يثقل الكاهل بدون خوف من الكشف أو التدخل الخارجي وسوء الأحكام.",
      icon: MessageSquare,
      color: "teal",
      tags: [
        "فضفضة", "فضفضة اونلاين", "Fadfada", "Fadfada online", "موقع فضفضة", "فضفه", "فضفضه", "تفريغ نفسي", "تفريغ القلق",
        "تفريغ الاكتئاب", "كلام في المجهول", "عابر سبيل", "متنفس سري", "كتابة الأسرار", "تشتت وهلع", "راحة البال", "رسائل غامضة"
      ]
    },
    {
      title: "صراحة وصارحني وصندوق الرسائل (Saraha & Honesty)",
      description: "المكاشفة التامة والرسائل السرية مجهولة الهوية لتلقي النقد البناء وصارح أصدقائك بآراء صادقة دون مجاملة.",
      icon: ShieldAlert,
      color: "indigo",
      tags: [
        "صراحة", "Saraha", "Sara7a", "صارحني", "صارحني بصراحة", "رسائل سرية", "مجهول هوية", "صندوق صراحة", "رابط صراحة",
        "رسالة غامضة", "تقييم سري", "نقد بناء", "كلام حقيقي", "صراحه", "تمت المصارحة", "رسايل حقيقية"
      ]
    },
    {
      title: "عالم الفتيات وأسرار النساء (Girls & Women World)",
      description: "مجلس الفتيات الخاص لتبادل ومناقشة قضايا التمكين والجمال والخصوصية والحديث عن المواقف الصعبة والمشورة الصادقة.",
      icon: Sparkles,
      color: "rose",
      tags: [
        "عالم المرأة", "عالم الفتيات", "اسرار النساء", "اسرار الفتايات", "حرية المرأة", "بنات حرة", "مجتمع متفتح",
        "بنات مصر", "بنات الخليج", "علاقات عاطفية", "دردشة فتيات", "صداقات نسائية", "تجميل وعناية", "صحة نفسية نسائية",
        "فكرة حرة", "تمكين المرأة العربية", "رأي سري"
      ]
    },
    {
      title: "عالم الإنترنت والمجتمعات العربية (Web & Arab Communities)",
      description: "الترابط الوطني عبر غرف الدردشة الفريدة لمختلف العواصم والبلدان والمدن العربية مع حماية وخصوصية تامة.",
      icon: Globe,
      color: "amber",
      tags: [
        "عالم النت", "مجتمع متفتح", "بنات جميلات", "فضفضة مصرية", "فضفضة سعودية", "تجمع بنات العراق", "حكايات الشام",
        "دعم أهل المغرب", "صالون تونس والأخوات", "دردشات الخليج الآمنة", "تنمية وعي الإنترنت", "إنترنت بخصوصية",
        "تسجيل مجهول", "الدردشة السريعة", "بوابات الجدارة"
      ]
    }
  ];

  const FREQUENT_QUESTIONS = [
    {
      q: "ما هو موقع فضفضة أونلاين fdfada.online وكيف يعمل؟",
      a: "منصة فضفضة أونلاين هي ملاذ وتجمع نسائي وعربي آمن بنسبة 100% يمنحكِ مطلق الحرية في تفريغ مخاوفكِ وقلقكِ ومشاعركِ، إما عبر خزانة الأسرار الفانية التي تختفي بياناتها بمجرد الخروج من المتصفح، أو عن طريق إنشاء حساب سري وتفعيل رابط الصراحة الخاص بكِ لاستقبال صارحني وتوجيه الرسائل المجهولة من الأصدقاء مع الحفاظ التام على أمانك النفسي وتوفير روتين للتنفس والمواساة الفورية بالذكاء الاصطناعي."
    },
    {
      q: "هل هويتي مكشوفة للآخرين عند إرسال رسائل صراحة أو كتابة بوح؟",
      a: "كافة الرسائل والخواطر والاعترافات المرسلة بشكل مجهول تمر عبر خوارزميات تشفير وإرسال غيابي بالكامل. لا نقوم بتسجيل أو تتبع عنوان الـ IP أو بيانات الأجهزة؛ بل يتم إيصال الكلمات والبوح للمستلمين بشكل صافٍ وخالٍ من أي بصمات إلكترونية لتضمني الخصوصية المطلقة والحرية التامة تحت ظلال fdfada.online."
    },
    {
      q: "كيف يمكنني استخدام منصة فضفضة وجني الكوينز وصندوق الدفع؟",
      a: "المنصة مجانية بالكامل للخدمات الأساسية. لمن تريد دعم المنصة أو ترويج حساباها والحصول على شارات العضوية الذهبية والماسية، وفرنا متجراً يسهل شحن الرصيد والترقية الآمنة عن طريق بوابة PayPal وسيلة الدفع العالمية الأكثر وثوقاً وأماناً والتي تضمن حماية الحسابات البنكية وحماية المستهلك على الإنترنت للفتيات والنساء بمصر وكافة الوطن العربي."
    },
    {
      q: "هل منصة فضفضة fdfada.online تدعم جميع الدول العربية وهواتف الأندرويد؟",
      a: "نعم وبشدة! تدعم المنصة تصفحاً مخصصاً لعضوات وزائرات مصر، السعودية، العراق، المغرب، الجزائر، تونس، وباقي الدول. كما نعمل على تجهيز وبناء النسخة التجريبية الأولى لتطبيق الأندرويد لكي تحصلي على إشعارات فورية لرسائلك وصندوق أسرارك المجهول مع حظر تقني تام للقطات الشاشة لحمايتكِ."
    },
    {
      q: "كيف تختلف فضفضة عن المواقع التقليدية مثل صراحة وصارحني وصراحة الدفينة؟",
      a: "تتميز فضفضة بمزيج شامل لا يتوفر لدى المنافسين؛ فلا تقتصر على رابط رسائل صماء، بل تشمل غرف دعم نفسي حية ومؤشر وجدان ذكي يقيم سلامتكِ الوجدانية ويرشح لكِ تمارين للتنفس الموجه (واحة السكينة)، مع صالونات دردشة نسائية آمنة وخالية من الحسابات المزيفة والمتطفلين بفضل الرقابة الصارمة للأدمن والمشرفات الموثوقات."
    }
  ];

  // Search filter implementation for keywords
  const filteredCategories = CATEGORIES.map(category => {
    const matchedTags = category.tags.filter(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase()) || 
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...category, tags: matchedTags };
  }).filter(c => searchQuery === "" || c.tags.length > 0 || c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const matchedQuestions = FREQUENT_QUESTIONS.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 text-right" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-indigo-950 via-slate-900 to-teal-950 text-white py-16 px-4 relative overflow-hidden">
        {/* Decorative designs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-85 h-85 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-4">
          <Link to="/" className="inline-flex items-center gap-1 text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all mb-4">
            <ChevronRight className="w-4 h-4" /> العودة للرئيسية
          </Link>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-l from-white via-slate-100 to-teal-200 bg-clip-text text-transparent">
             بوابة الكلمات والاتجاهات ومعجم الفضفضة العربي كلياً fdfada.online
          </h1>
          <p className="max-w-3xl mx-auto text-slate-300 text-xs md:text-sm leading-relaxed font-light">
            دليل الكلمات المفتاحية والمواضيع الأكثر بحثاً في مصر والوطن العربي حول: صراحة، فضفضة، أسرار الفتيات والنساء، ألعاب البوح ومصادر تتبع الراحة الوجدانية والدعم النفسي الخصوصي.
          </p>

          <div className="max-w-xl mx-auto pt-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center p-2">
              <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
              <input 
                type="text" 
                placeholder="ابحثي عن موضوع، كلمة مفتاحية، أو سؤال لحرية المرأة والصحة النفسية..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white outline-none border-none text-xs md:text-sm placeholder-slate-400 px-2 text-right"
                dir="rtl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Right Section: Directory Of Tags & Articles */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Quick Links For Dominant Interlocking Search Terms */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              أبرز الكلمات البحثية رواجاً ومحرك الفضفضة
            </h2>
            <p className="text-xs text-slate-500">تم تسجيل أكثر من 1,000,000 عملية بحث حول هذه القضايا في الوطن العربي:</p>
            
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-teal-50 text-teal-700 hover:bg-teal-100 px-3 py-1.5 rounded-full font-bold cursor-help">#موقع_فضفضة_بخصوصية</span>
              <span className="bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded-full font-bold cursor-help">#أسرار_فتيات_مصر</span>
              <span className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-full font-bold cursor-help">#دردشة_صراحة_الغيابية</span>
              <span className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-full font-bold cursor-help">#رابط_صارحني_الآمن</span>
              <span className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-full font-bold cursor-help">#مجتمعات_المرأة_العربية</span>
              <span className="bg-sky-50 text-sky-700 hover:bg-sky-100 px-3 py-1.5 rounded-full font-bold cursor-help">#أسرار_النساء_والعلاقات</span>
              <span className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded-full font-bold cursor-help">#Fadfada_Online_App</span>
            </div>
          </div>

          {/* Render Categories and Tags */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">تفاصيل وتصنيفات الكلمات المستهدفة والبحثية</h2>
            
            {filteredCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 text-indigo-600`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm md:text-base">{cat.title}</h3>
                      <p className="text-[11px] text-slate-500">{cat.description}</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 pt-3">
                    <h4 className="text-xs font-bold text-slate-700 mb-2">قائمة الكلمات والوسوم المعجمية المرتبطة:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.tags.map((tag, tIdx) => (
                        <span 
                          onClick={() => setSearchQuery(tag)}
                          key={tIdx} 
                          className="bg-slate-50 hover:bg-teal-50 hover:text-teal-750 text-slate-600 border border-slate-100 px-2 py-1 rounded-lg text-[10px] font-mono cursor-pointer transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredCategories.length === 0 && (
              <div className="text-center p-12 bg-white rounded-3xl text-slate-400 text-xs">لا توجد مواضيع أو أسرار مطابقة لبحثك في fdfada.online حالياً.</div>
            )}
          </div>

          {/* Comprehensive F.A.Q Section for search indexations */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              الأسئلة الشائعة والمعلومات التعريفية الدقيقة (SEO Friendly)
            </h2>

            <div className="space-y-4">
              {matchedQuestions.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2">
                  <h3 className="font-bold text-slate-800 text-sm flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    {faq.q}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed pl-4">
                    {faq.a}
                  </p>
                </div>
              ))}

              {matchedQuestions.length === 0 && (
                <div className="text-center p-12 bg-white rounded-3xl text-slate-400 text-xs"> لم نجد إجابة مطابقة لبحثك. تصفحي الموسوعة كاملة.</div>
              )}
            </div>
          </div>

        </div>

        {/* Left Section: Information Card & Direct Paths CTA */}
        <div className="space-y-6">
          
          {/* Main CTA platform card */}
          <div className="bg-gradient-to-br from-teal-900 to-indigo-950 text-white rounded-[2rem] p-6 shadow-lg space-y-6">
            <div>
              <span className="bg-white/10 text-teal-300 border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-bold">بوابة النشر الآمنة</span>
              <h3 className="text-lg font-black text-white mt-3">انضمي للمنصة كأول عضوة ببلدكِ الآن!</h3>
              <p className="text-slate-300 text-xs leading-relaxed mt-2">
                سجلي حضوركِ بخصوصية تامة، وأنشئي رابط الصراحة الخاص بكِ مجاناً لاستلام رسائل مجهولة والتمتع بالدعم النفسي.
              </p>
            </div>

            <div className="space-y-2.5">
              <Link 
                to="/register" 
                className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold text-center block transition-colors"
              >
                إنشاء حساب مجاني فوراً
              </Link>
              <Link 
                to="/venting" 
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold text-center block transition-colors"
              >
                فضفضة كزائرة أونلاين
              </Link>
            </div>

            <div className="border-t border-white/10 pt-4 text-[10px] text-slate-400 space-y-1.5">
              <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> لا يتطلب رقم هاتف</p>
              <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> محمي تماماً من المتطفلين</p>
              <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> نظام كوينز لشحن العضويات</p>
            </div>
          </div>

          {/*埃及 و الدول المتاحية الخاصة (Egypt and countries search maps list)*/}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-50 pb-2">سلطة الإنتشار الإقليمي بمصر والوطن العربي</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              تغطي شبكة <strong>موقع فضفضة</strong> fdfada.online كافة المحافظات والمدن العربية لتمكين الفتيات من التواصل ضمن بقعة جغرافية يسودها التفاهم والوعي التام:
            </p>

            <ul className="text-xs space-y-2 text-slate-600 max-h-56 overflow-y-auto pr-1">
              <li className="flex justify-between border-b border-slate-50 pb-1.5"><span>القاهرة والاسكندرية وباقي مصر</span> <span className="bg-teal-50 text-teal-700 px-1.5 rounded text-[10px] font-mono">Egypt</span></li>
              <li className="flex justify-between border-b border-slate-50 pb-1.5"><span>الرياض، جدة وبقية السعودية</span> <span className="bg-yellow-50 text-yellow-700 px-1.5 rounded text-[10px] font-mono">KSA</span></li>
              <li className="flex justify-between border-b border-slate-50 pb-1.5"><span>بغداد والموصل ومدن العراق</span> <span className="bg-rose-50 text-rose-700 px-1.5 rounded text-[10px] font-mono">Iraq</span></li>
              <li className="flex justify-between border-b border-slate-50 pb-1.5"><span>الدار البيضاء والرباط ومغربنا العربي</span> <span className="bg-indigo-50 text-indigo-700 px-1.5 rounded text-[10px] font-mono">Morocco</span></li>
              <li className="flex justify-between border-b border-slate-50 pb-1.5"><span>الجزائر ووهران وضواحيها</span> <span className="bg-emerald-50 text-emerald-700 px-1.5 rounded text-[10px] font-mono">Algeria</span></li>
              <li className="flex justify-between border-b border-slate-50 pb-1.5"><span>تونس الخضراء والمجتمعات النسائية</span> <span className="bg-purple-50 text-purple-700 px-1.5 rounded text-[10px] font-mono">Tunisia</span></li>
              <li className="flex justify-between border-b border-slate-50 pb-1.5"><span>الشام والأردن وفلسطين ولبنان وسوريا</span> <span className="bg-blue-50 text-blue-700 px-1.5 rounded text-[10px] font-mono">Levant</span></li>
              <li className="flex justify-between border-b border-slate-50 pb-1.5"><span>الخليج العربي، الكويت وقطر والامارات وعمان</span> <span className="bg-slate-100 text-slate-700 px-1.5 rounded text-[10px] font-mono">Gulf</span></li>
            </ul>
          </div>

          {/* Sitemap static file notice panel */}
          <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl text-xs text-indigo-800 space-y-3">
            <h4 className="font-bold flex items-center gap-1">
              <FileText className="w-4 h-4 text-indigo-600 animate-pulse" />
               ملفات النشر ومحركات البحث (Crawler Ready)
            </h4>
            <p className="leading-relaxed">
              لقد قمنا بتهيئة خادم التطبيق الخاص بـ fdfada.online لدعم توليد ملفات sitemap وملفات robots.txt تلقائياً لتسجيل فهرسة محركات البحث وبناء الجدارة الكاملة بالنتائج الأولى.
            </p>
            <div className="pt-2 text-right">
              <a 
                href="/sitemap.xml" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded shadow-sm hover:bg-indigo-700 text-[10px] inline-flex items-center gap-1 transition-colors"
              >
                <span>معاينة ملف الـ Sitemap 🔗</span>
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
