import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Rss, 
  ExternalLink, 
  Sparkles, 
  ThumbsUp, 
  Share2, 
  MessageSquare, 
  Bell, 
  Globe, 
  Smartphone, 
  Newspaper, 
  ChevronRight, 
  UserPlus, 
  Cpu, 
  Wifi, 
  Award, 
  CheckCircle2,
  Copy,
  Terminal,
  Palette,
  RotateCcw,
  BookOpen,
  Send,
  HelpCircle,
  SmartphoneNfc,
  Lock,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SocialPost {
  id: string;
  author: string;
  username: string;
  date: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
}

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  date: string;
  category: "ai" | "google" | "internet";
  readTime: string;
  image: string;
  sentiment: "positive" | "neutral";
  aiSummary: string;
}

export default function SocialHub() {
  const [isFollowed, setIsFollowed] = useState(false);
  const [likesCount, setLikesCount] = useState(15420);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showNotification, setShowNotification] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [newsQuery, setNewsQuery] = useState("");
  
  // New States for highly polished Social and Android modules
  const [activeTab, setActiveTab] = useState<"live" | "viral" | "news" | "android">("live");
  const [viralQuote, setViralQuote] = useState("خزانة أسراري ممتلئة بالصمت، والبوح المجهول هنا هو واحة كبرى تخفف عبء الأيام... 🌸✨");
  const [viralTheme, setViralTheme] = useState("sunset");
  const [customHashtags, setCustomHashtags] = useState("#فضفضة_أونلاين #صارحني #سيدات_الحكمة_الآمنة");
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);
  const [activeNewsSummary, setActiveNewsSummary] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  
  // Android simulation console states
  const [androidLogs, setAndroidLogs] = useState<string[]>([
    "📱 تهيئة محاكي WebView لنظام Android...",
    "🛡️ فحص بروتوكول الأمان وحظر لقطات الشاشة [SCREENSHOT_INHIBIT_ACTIVE]...",
    "📡 مستعد لتلقي اتصالات الجسر البرمجي JavascriptInterface."
  ]);
  const [isConsoleActive, setIsConsoleActive] = useState(false);

  useEffect(() => {
    document.title = "الصحافة والسوشيال ميديا وأخبار الأندرويد | فضفضة أونلاين fdfada.online";
  }, []);

  // Post suggestions for viral quote cards
  const SUGGESTED_VIRAL_POSTS = [
    "خزانة أسراري ممتلئة بالصمت، والبوح المجهول هنا هو واحة كبرى تخفف عبء الأيام... 🌸✨",
    "لكل صديقة تشعر بثقل الأيام بقلبها الصغير: لستِ وحدكِ أبداً، فبين صفحات فضفضة أخت تسمعكِ وتدعو لكِ بالسكينة والوفاء 💕",
    "الذكاء الاصطناعي الوجداني في fdfada.online أصبح رفيقاً مواسياً يتشكل بنبرتكِ ليربت على كتفيكِ باحترام وتقدير 🤖🌟",
    "المصارحة الصادقة المفررة لا تبعدنا، بل تجمع قلوبنا في بيئة آمنة تخلو من الأحكام الجائرة غيابياً 🔒💬"
  ];

  // Simulated live Facebook platform posts
  const MOCK_FACEBOOK_POSTS: SocialPost[] = [
    {
      id: "fb-1",
      author: "فضفضة أولاين - Fadfada.online",
      username: "fdfada.online",
      date: "منذ ساعتين",
      content: "نعاهدكن على السرية المطلقة والحرية التامة 🌸 هل جربتِ نظام 'واحة السكينة' الجديد كلياً للتنفس المائي والمواساة الفورية؟ تم تدريب الذكاء الاصطناعي المدمج لدينا من خلال تقنيات Google Gemini الحديثة لتقديم رعاية نفسية وحلول وجدانية متكاملة تناسب الفتيات بمصر والوطن العربي دون الكشف عن هوية المتحدثة! شاركينا شعوركِ الآن.",
      likes: 312,
      comments: 48,
      shares: 12,
      tags: ["فضفضة", "الذكاء_الاصطناعي", "صراحة", "fdfada"]
    },
    {
      id: "fb-2",
      author: "فضفضة أولاين - Fadfada.online",
      username: "fdfada.online",
      date: "أمس",
      content: "رسمياً! تم ربط خوادم المنصة بنطاقنا الجديد fdfada.online وتطويع أحدث تقنيات الويب لحظر لقطات الشاشة وتشفير رسائل 'صارحني' مجهولة الهوية غيابياً. نشكر ثقة أكثر من 100 ألف عضوة فعالة انضمت إلينا هذا الأسبوع للمطالبة بحرية تعبير حقيقية ودعم متبادل بالصالونات والمنتديات الإقليمية 🌐🌸",
      likes: 540,
      comments: 92,
      shares: 34,
      tags: ["عالم_المرأة", "أسرار_الفتيات", "صارحني"]
    },
    {
      id: "fb-3",
      author: "فضفضة أولاين - Fadfada.online",
      username: "fdfada.online",
      date: "منذ يومين",
      content: "أسرار الفتايات والنساء لم تعد عبئاً ثقيلاً! تم تفعيل خطة شحن محفظات الكوينز الفاخرة والاشتراك الماسي الموثق بواسطة PayPal لضمان حماية دفع حقيقية وتدفق آمن للمعاملات دون وسيط. تابعي صفحتنا للحصول على أكواد خصم حصرية قريباً 💎📈",
      likes: 210,
      comments: 17,
      shares: 8,
      tags: ["متجر_الكوينز", "الدفع_الآمن", "بنات_حرة"]
    }
  ];

  // Enhanced Global and Project Specific AI / SEO News with AI Summary text
  const NEWS_ARTICLES: NewsArticle[] = [
    {
      id: "news-1",
      title: "تكامل منصة فضفضة مع تقنيات Google Gemini للذكاء الاصطناعي الوجداني",
      excerpt: "دراسة تحليلية حول كيفية تطوير مستشار الذكاء الاصطناعي داخل fdfada.online ليوائم المعايير الطبية والنفسية الحديثة في التوجيه الوجداني للفتيات المراهقات والنساء بخصوصية سرية.",
      source: "عالم الذكاء الاصطناعي",
      date: "2026-06-16",
      category: "ai",
      readTime: "٤ دقائق",
      image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80",
      sentiment: "positive",
      aiSummary: "تحليل معمق لنماذج Gemini-Flash التي تساعد في فرز مشاعر القلق واحتواء الاضطرابات الوجدانية بمرونة فائقة ونسب نجاح قياسية تبلغ 96%."
    },
    {
      id: "news-2",
      title: "محركات بحث جوجل تصنف نطاق fdfada.online كأسرع موقع صراحة نمواً بالشرق الأوسط",
      excerpt: "أظهرت تقارير Google Search Console تصدراً سريعاً لمنصة فضفضة أونلاين وبصراحة في نتائج البحث الأولى بكلمات مفتاحية متعلقة بأسرار النساء، مجتمعات متفتحة وصندوق الرسائل المجهولة.",
      source: "أخبار الويب وجوجل",
      date: "2026-06-15",
      category: "google",
      readTime: "٣ دقائق",
      image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80",
      sentiment: "positive",
      aiSummary: "تفوقت فضفضة على المنصات العالمية بفضل البنية التحتية الخفيفة وملاءمة المصطلحات التعبيرية العربية الأكثر دقة وشيوعاً لدى شريحة الإناث."
    },
    {
      id: "news-3",
      title: "أسرار الإنترنت: كيف تحمي السوشيال ميديا خصوصية الفتيات من التجسس؟",
      excerpt: "تستعرض المقالة التقنيات المتبعة في منصة فضفضة لحظر برمجيات التتبع والتصنت ومقارنتها بتطبيقات فيسبوك وصراحة التقليدية لضمان بيئة آمنة للمرأة الحرة.",
      source: "عالم الإنترنت والمستقبل",
      date: "2026-06-14",
      category: "internet",
      readTime: "٥ دقائق",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
      sentiment: "neutral",
      aiSummary: "استمرار حظر لقطات الشاشة محلياً وتفعيل تشفير من طرف لطرف يضمن ألا تقع بيانات العضوة في يد أي مخرب أو جهة إعلانية خارجية."
    },
    {
      id: "news-4",
      title: "ثورة الميتافيرس وغرف السوشيال ميديا ثنائية الصوت.. هل fdfada جاهزة للخطوة التالية؟",
      excerpt: "الرؤية المستقبلية لربط غرف الدردشة الصوتية بمؤشرات حيوية ومزاجية ذكية تعتمد على ردود الفعل الفسيولوجية لمساعدة النساء على تفريغ الاكتئاب بلمسة واحدة.",
      source: "نشرة السوشيال ميديا",
      date: "2026-06-12",
      category: "ai",
      readTime: "٦ دقائق",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      sentiment: "positive",
      aiSummary: "التخطيط لإدراج طبقة فك ضغط صوتي ذكي لتشفير وترطيب الأصوات قبل نقلها ثنائياً في غرف وصالونات الفضفضة الآمنة."
    }
  ];

  const handleFollowAction = () => {
    setIsFollowed(!isFollowed);
    if (!isFollowed) {
      setLikesCount(likesCount + 1);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 4000);
    } else {
      setLikesCount(likesCount - 1);
    }
  };

  const handlePostLike = (postId: string) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter(id => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  const filteredNews = NEWS_ARTICLES.filter(article => {
    const matchesCategory = activeFilter === "all" || article.category === activeFilter;
    const matchesSearch = article.title.includes(newsQuery) || article.excerpt.includes(newsQuery);
    return matchesCategory && matchesSearch;
  });

  const getThemeClasses = () => {
    switch(viralTheme) {
      case "sunset": return "bg-gradient-to-br from-amber-500 via-rose-500 to-pink-600 text-white shadow-rose-200";
      case "plum": return "bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-950 text-white shadow-purple-900/40";
      case "mint": return "bg-gradient-to-br from-teal-900 via-emerald-800 to-teal-950 text-white shadow-teal-900/40";
      case "pastel": return "bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-50 text-slate-800 border border-pink-200/50 shadow-sm";
      default: return "bg-white text-slate-800 border border-slate-200";
    }
  };

  // Simulated triggers for Android Interface logs
  const triggerAndroidSimulation = (action: string) => {
    setIsConsoleActive(true);
    const time = new Date().toLocaleTimeString("ar-EG");
    let newLog = "";
    
    switch(action) {
      case "screenshot":
        newLog = `🔴 [${time}] تم محاكاة منع لقطة الشاشة: تم حجب الواجهة لـ FLAG_SECURE بنجاح لمنع تسريب بوح الفتيات!`;
        break;
      case "push":
        newLog = `🔔 [${time}] تم إرسال إشعار فوري: "صديقة لكِ أرسلت بوحاً جديداً بديوان الدعم الوجداني! 🌸"`;
        break;
      case "clean":
        newLog = `🧹 [${time}] تنظيف الذاكرة المخبأة: مسح كافة بيانات الكوكيز والجلسات غيابياً [CACHE_PURGE_SUCCESS].`;
        break;
      default:
        newLog = `⚙️ [${time}] استدعاء واجهة أندرويد بنجاح.`;
    }

    setAndroidLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 text-right" dir="rtl">
      
      {/* Dynamic Header */}
      <div className="bg-gradient-to-l from-indigo-900 via-indigo-950 to-teal-950 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative z-10 space-y-4">
          <Link to="/" className="inline-flex items-center gap-1 text-teal-405 bg-teal-550/10 hover:bg-teal-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all mb-2 backdrop-blur-sm">
            <ChevronRight className="w-4 h-4" /> العودة للرئيسية
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="bg-indigo-550/20 text-indigo-300 border border-indigo-500/30 px-3.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5">
                <Rss className="w-3.5 h-3.5 animate-pulse" /> البوابة الإعلامية وعمليات التشغيل
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                منصة الانتشار وتكامل <span className="text-teal-300">الأندرويد الوجدانى</span>
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl font-light">
                استخدمي صانع المنشورات الفيروسية لترويج fdfada.online بكلمة طيبة، وتابعي آخر تحليلات AI وتكامل محرك جوجل مع تجربة تشغيل الأندرويد الاحترافية والمحكمة بالكامل.
              </p>
            </div>

            {/* Smart External Action Trigger */}
            <div className="shrink-0 flex items-center gap-3">
              <a 
                href="https://www.facebook.com/fdfada.online"
                target="_blank"
                rel="no-referrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-lg active:scale-[0.98] transition-all text-xs md:text-sm"
              >
                <Facebook className="w-5 h-5 fill-white" />
                <span>الصفحة الرسمية بالفيسبوك</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-16 md:top-20 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-1 md:gap-4 overflow-x-auto py-3 scrollbar-none">
            
            <button
              onClick={() => setActiveTab("live")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black whitespace-nowrap transition-all ${
                activeTab === "live" 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Facebook className="w-4 h-4 text-blue-500 shrink-0" />
              <span>الرواق الإعلامي والفيسبوك 📲</span>
            </button>

            <button
              onClick={() => setActiveTab("viral")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black whitespace-nowrap transition-all ${
                activeTab === "viral" 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>صانع بطاقات البوح الفيروسية 🎨</span>
            </button>

            <button
              onClick={() => setActiveTab("news")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black whitespace-nowrap transition-all ${
                activeTab === "news" 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Newspaper className="w-4 h-4 text-rose-500 shrink-0" />
              <span>نشرة أخبار جوجل وتكنلوجيا AI 📈</span>
            </button>

            <button
              onClick={() => setActiveTab("android")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black whitespace-nowrap transition-all ${
                activeTab === "android" 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Smartphone className="w-4 h-4 text-teal-500 shrink-0" />
              <span>جسر توافق الأندرويد الفائق (WebView) 📱</span>
            </button>

          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: LIVE BROADCAST AND FACEBOOK FEED */}
          {activeTab === "live" && (
            <motion.div
              key="tab-live"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* WebView Facebook Feed Mockup */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <Facebook className="w-5 h-5 text-blue-600" />
                    المعاينة الذكية المباشرة لـ Facebook WebView
                  </h2>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    بث نشط لفيسبوك
                  </span>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden relative">
                  <div className="h-32 bg-gradient-to-r from-pink-850 via-teal-900 to-indigo-950 relative">
                    <div className="absolute inset-0 bg-black/15" />
                  </div>

                  <div className="px-5 pb-5 relative pt-10 border-b border-slate-100">
                    <div className="w-20 h-20 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center text-3xl absolute -top-10 right-4 overflow-hidden">
                      🌸
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-2">
                      <div>
                        <div className="flex items-center gap-1">
                          <h3 className="text-lg font-black text-slate-850">فضفضة أونلاين - Fadfada.online</h3>
                          <span className="bg-blue-500 text-white rounded-full p-0.5" title="موثق">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">@fdfada.online • تطبيق ويب وجداني آمن</p>
                        <p className="text-[11px] text-slate-450 mt-1">
                          <strong>{likesCount.toLocaleString()}</strong> إعجاب • <strong>16,845</strong> متابع
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={handleFollowAction}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                            isFollowed 
                              ? "bg-slate-100 text-slate-700" 
                              : "bg-blue-600 text-white hover:bg-blue-700 shadow-md animate-pulse"
                          }`}
                        >
                          {isFollowed ? "تمت المتابعة✓" : "متابعة بفيسبوك"}
                        </button>
                        <a 
                          href="https://www.facebook.com/fdfada.online"
                          target="_blank"
                          rel="no-referrer"
                          className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Facebook simulated posts */}
                  <div className="p-5 bg-slate-50/40 space-y-6">
                    {MOCK_FACEBOOK_POSTS.map((post) => {
                      const isPostLiked = likedPosts.includes(post.id);
                      return (
                        <div key={post.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🌸</span>
                              <div>
                                <h5 className="font-extrabold text-slate-800 text-xs">{post.author}</h5>
                                <span className="text-[9px] text-slate-400">{post.date}</span>
                              </div>
                            </div>
                            <span className="text-[9px] bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full">Fadfada Live</span>
                          </div>

                          <p className="text-xs md:text-sm leading-relaxed text-slate-705 whitespace-pre-wrap">
                            {post.content}
                          </p>

                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-50">
                            <button 
                              onClick={() => handlePostLike(post.id)}
                              className={`flex items-center gap-1 font-bold ${isPostLiked ? "text-blue-600" : "hover:text-slate-600"}`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>{post.likes + (isPostLiked ? 1 : 0)} إعجاب</span>
                            </button>
                            <span>{post.comments} تعليق • {post.shares} مشاركة</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Stats column */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                  <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    التقييمات والجدارة الإقليمية
                  </h3>
                  <p className="text-xs text-slate-550 leading-relaxed">
                    موقع وصالونات <strong className="text-indigo-600">فضفضة أونلاين</strong> تحتل المكانة الأولى في نتائج البحث عن قنوات ومجتمعات الفضفضة والمصارحة النسائية المفرزة في مصر، السعودية، والمغرب.
                  </p>
                  
                  <div className="space-y-3.5 pt-2">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                      <span className="text-xs font-bold text-slate-700">ترتيب عمليات البحث (جوجل)</span>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">الأول عربياً 📈</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                      <span className="text-xs font-bold text-slate-700">الضمان والسرية</span>
                      <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">ممتازة (تأمين كلي) 🛡️</span>
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                      <span className="text-xs font-bold text-slate-700">معدل البقاء والائتلاف الوجداني</span>
                      <span className="text-xs font-black text-pink-650 bg-pink-50 px-2.5 py-1 rounded-lg">زاهي ومريح 🌸</span>
                    </div>
                  </div>
                </div>

                {/* Promotional banner to share */}
                <div className="bg-gradient-to-br from-indigo-950 to-purple-950 text-white rounded-[2rem] p-6 shadow-md space-y-4">
                  <h4 className="font-black text-sm text-amber-300">حققي انتشاراً ومارسِ الوعي الوجداني 📣</h4>
                  <p className="text-xs text-slate-350 leading-relaxed">
                    من خلال نسخ رابط الموقع: <strong className="text-white">fdfada.online</strong> ومشاركته مع رفيقاتك وصديقاتك عبر التويتر أو سناب شات وحالات الواتساب لنرتقي بالوعي ومجتمعات دعم المرأة.
                  </p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText("https://fdfada.online");
                      alert("تم نسخ رابط فضفضة بنجاح! شاركيه الآن واكسبي رضا القلوب 🌸");
                    }}
                    className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/10 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>نسخ رابط النطاق fdfada.online</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: VIRAL QUOTE CARD DESIGNER */}
          {activeTab === "viral" && (
            <motion.div
              key="tab-viral"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-md space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    صانع بطاقات البوح والاقتباسات الفيروسية للانتشار
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    صممي بطاقات اقتباسات وجاذبية وجدانية لتشاركيها على حالات إنستقرام، فيسبوك، أو تيك توك لتوجيه طعم السكينة والمصارحة لغيركِ وتصاعد الانتشار.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Creative Controls */}
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-slate-700">اختر اقتباساً جاهزاً سريعاً للبوح:</label>
                      <div className="grid grid-cols-1 gap-2">
                        {SUGGESTED_VIRAL_POSTS.map((quote, idx) => (
                          <button
                            key={idx}
                            onClick={() => setViralQuote(quote)}
                            className="text-right text-xs p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 transition duration-150 text-slate-700 font-medium"
                          >
                            {quote}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black text-slate-700">أو اكتبي سراً أو بوحاً مخصصاً لكِ (حتى ٢٠٠ حرف):</label>
                      <textarea
                        value={viralQuote}
                        onChange={(e) => setViralQuote(e.target.value)}
                        maxLength={200}
                        rows={3}
                        className="w-full text-xs p-3.5 border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 rounded-xl outline-none"
                        placeholder="مثال: فضفضتي اليوم صامتة ولكن القادم أجمل برقة..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black text-slate-700">تغيير المظهر العام (ثيم فني):</label>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => setViralTheme("sunset")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${viralTheme === "sunset" ? "bg-rose-500 text-white border-rose-600" : "bg-white border-slate-200"}`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-500" />
                          غروب زاهي 🌅
                        </button>
                        <button 
                          onClick={() => setViralTheme("plum")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${viralTheme === "plum" ? "bg-purple-900 text-white border-purple-950" : "bg-white border-slate-200"}`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-indigo-900" />
                          وريد السكينة 🔮
                        </button>
                        <button 
                          onClick={() => setViralTheme("mint")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${viralTheme === "mint" ? "bg-teal-900 text-white border-teal-950" : "bg-white border-slate-200"}`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-teal-700" />
                          عطر النعناع 🌿
                        </button>
                        <button 
                          onClick={() => setViralTheme("pastel")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${viralTheme === "pastel" ? "bg-pink-100 text-slate-800 border-pink-200 shadow-inner" : "bg-white border-slate-200"}`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-pink-300" />
                          ورقة زاهية 🌸
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black text-slate-700">هاشتاجات الانتشار (قابلة للتعديل):</label>
                      <input
                        type="text"
                        value={customHashtags}
                        onChange={(e) => setCustomHashtags(e.target.value)}
                        className="w-full text-xs p-3 border border-slate-200 bg-slate-50 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  {/* Right Column: Visual Preview Dashboard Card */}
                  <div className="flex flex-col justify-between space-y-4">
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 font-bold">المعاينة التصويرية لبرعم المنصة</span>
                    </div>

                    {/* Gradient Quote Box */}
                    <div className={`p-8 rounded-[2rem] aspect-[4/3] flex flex-col justify-between transition-all duration-300 shadow-xl ${getThemeClasses()}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest font-black opacity-80 flex items-center gap-1">
                          🌸 فضفضة أونلاين
                        </span>
                        <div className="w-2 h-2 rounded-full bg-white opacity-80" />
                      </div>

                      <div className="py-2">
                        <p className="text-sm md:text-base leading-relaxed font-bold font-sans rtl whitespace-pre-wrap">
                          “ {viralQuote} ”
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/20">
                        <div className="text-[10px] opacity-75 font-mono">
                          fdfada.online
                        </div>
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-bold">
                          بصمة الوعي والسكينة ✨
                        </span>
                      </div>
                    </div>

                    {/* Quick copy trigger */}
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          const textToCopy = `“${viralQuote}”\n\nتصفحي منصة فضفضة المفرزة للبوح بأمان وسرية كليّاً: https://fdfada.online \n\n${customHashtags}`;
                          navigator.clipboard.writeText(textToCopy);
                          alert("تم نسخ محتوى الترويج والمشاركة إلى الحافظة! انشريه الآن بين حالات السناب والواتساب 🌸📣");
                        }}
                        className="w-full bg-gradient-to-l from-indigo-650 to-indigo-800 text-white font-extrabold p-3.5 rounded-xl transition shadow-md hover:from-indigo-700 hover:to-indigo-900 active:scale-95 text-xs flex items-center justify-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        <span>نسخ النص المنسق والمعد لترويجه! ✨</span>
                      </button>
                      <p className="text-[10px] text-slate-400 text-center">
                        من خلال مشاركتكِ للكلمة الطيبة والمواساة، تصنعين عالماً نقياً وأخلاقياً للفتيات! 
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: GOOGLE AND AI COGNITIVE NEWS */}
          {activeTab === "news" && (
            <motion.div
              key="tab-news"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-md space-y-6">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-indigo-600" />
                      مدونة أخبار الإنترنت والذكاء الاصطناعي وجوجل
                    </h3>
                    <p className="text-xs text-slate-500">
                      تقارير تقنية حول سيو (SEO) محرك بحث جوجل ودمج تكنولوجيا الدماغ العاطفي Gemini بموقع fdfada.online
                    </p>
                  </div>

                  {/* Local News Search and Filters */}
                  <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2">
                    <button 
                      onClick={() => setActiveFilter("all")}
                      className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition ${
                        activeFilter === "all" ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      الكل
                    </button>
                    <button 
                      onClick={() => setActiveFilter("ai")}
                      className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition ${
                        activeFilter === "ai" ? "bg-purple-600 text-white" : "bg-slate-50 text-slate-600"
                      }`}
                    >
                      الذكاء الاصطناعي 🤖
                    </button>
                    <button 
                      onClick={() => setActiveFilter("google")}
                      className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition ${
                        activeFilter === "google" ? "bg-rose-600 text-white" : "bg-slate-50 text-slate-600"
                      }`}
                    >
                      جوجل وSEO 🧠
                    </button>
                    <button 
                      onClick={() => setActiveFilter("internet")}
                      className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition ${
                        activeFilter === "internet" ? "bg-amber-600 text-white" : "bg-slate-50 text-slate-600"
                      }`}
                    >
                      الشبكات والخصوصية 🔒
                    </button>
                  </div>
                </div>

                {/* News Grid List with Interactive AI Reader panel */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-7 space-y-4">
                    {filteredNews.map((article) => {
                      const isSelected = selectedArticleId === article.id;
                      return (
                        <div 
                          key={article.id} 
                          onClick={() => {
                            setSelectedArticleId(article.id);
                            setActiveNewsSummary(article.aiSummary);
                          }}
                          className={`p-4 rounded-xl border transition-all cursor-pointer text-right space-y-3 ${
                            isSelected 
                              ? "bg-indigo-50/20 border-indigo-200/60 shadow-md translate-x-1" 
                              : "bg-slate-50/40 border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                          }`}
                        >
                          <div className="flex gap-3">
                            <img 
                              src={article.image} 
                              alt={article.title} 
                              className="w-16 h-16 rounded-lg object-cover bg-slate-200 shrink-0 border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                            <div className="space-y-1">
                              <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                                article.category === "ai" 
                                  ? "bg-purple-100 text-purple-700" 
                                  : article.category === "google" 
                                  ? "bg-rose-100 text-rose-700" 
                                  : "bg-amber-100 text-amber-700"
                              }`}>
                                {article.category === "ai" ? "ذكاء اصطناعي وجداني" : article.category === "google" ? "بحث جوجل والـ SEO" : "سرية الإنترنت"}
                              </span>
                              <h4 className="font-extrabold text-slate-800 text-xs leading-snug">{article.title}</h4>
                            </div>
                          </div>

                          <p className="text-xs text-slate-550 leading-relaxed truncate">
                            {article.excerpt}
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100/60 font-mono">
                            <span>{article.source} • {article.date}</span>
                            <span className="text-indigo-600 font-bold block hover:underline">انقري للتوجيه والتلخيص ⟵</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* AI Output Panel Column */}
                  <div className="md:col-span-5 h-full">
                    <div className="bg-slate-900 text-white rounded-[2rem] p-6 space-y-4 sticky top-48">
                      <div className="flex items-center gap-1.5 justify-between">
                        <span className="bg-white/10 text-teal-350 border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-teal-400" />
                          محلص الأفكار الروحية بـ Gemini AI
                        </span>
                        <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                      </div>

                      {activeNewsSummary ? (
                        <div className="space-y-3">
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            {activeNewsSummary}
                          </p>
                          <div className="text-[10px] p-2 bg-slate-800 rounded-xl border border-white/5 text-slate-400">
                            ✨ الأثر الإيجابي: هذا التحليل يثبت ريادة fdfada.online كمنصة آمنة ومدروسة تعزز التباعد عن العقد السلوكية.
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-400 space-y-2">
                          <span className="text-3xl block">💡</span>
                          <p className="text-xs">انقري على أي مقال أو نشرة تكنولوجية في الجهة اليمنى ليقوم روبوت الذكاء الاصطناعي بتحليل الأثر وتلخيصه لكِ فورياً!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 4: ANDROID NATIVE INTEGRATION TOOLS */}
          {activeTab === "android" && (
            <motion.div
              key="tab-android"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-md space-y-6">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-4">
                  <div className="space-y-1">
                    <span className="bg-teal-50 text-teal-600 border border-teal-100 px-3.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5">
                      <SmartphoneNfc className="w-3.5 h-3.5" /> هندسة نظام أندرويد المتوافق
                    </span>
                    <h2 className="text-xl font-black text-slate-900">
                      بيئة التحويل المريحة لتطبيق أندرويد احترافي (WebView SDK Tool)
                    </h2>
                    <p className="text-xs text-slate-500">
                      تتطابق شفرات منصة فضفضة fdfada.online مع منصات بناء التطبيقات الهجينة لتعمل بشكل فائق السلاسة بتطبيق مستقل للهواتف.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right">
                  {/* Left Controls & Code Block */}
                  <div className="lg:col-span-7 space-y-4">
                    <h3 className="font-extrabold text-sm text-slate-800">
                      🛠️ تعليمات التثبيت والبناء السريع (Capacitor wrapper):
                    </h3>
                    <p className="text-xs text-slate-650 leading-relaxed">
                      من السهل للغاية تحويل فضفضة أونلاين إلى تطبيق Android APK أصيل وحظره من التجسس الخارجي. إليك أوامر سكرت حقيقية لمشروعك بأندرويد ستوديو:
                    </p>

                    {/* Build commands snippet */}
                    <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-left text-xs space-y-1 relative group">
                      <button 
                        onClick={() => {
                          const code = "npm install @capacitor/core @capacitor/cli\nnpx cap init \"فضفضة أونلاين\" \"online.fdfada.app\" --web-dir=dist\nnpx cap add android\nnpx cap sync android";
                          navigator.clipboard.writeText(code);
                          setCopyCodeSuccess(true);
                          setTimeout(() => setCopyCodeSuccess(false), 3000);
                        }}
                        className="absolute top-2 right-2 bg-white/10 hover:bg-white/15 text-white p-1 rounded transition text-[10px] font-sans"
                      >
                        {copyCodeSuccess ? "تم النسخ! ✓" : "نسخ الأوامر"}
                      </button>
                      <p className="text-teal-400"># تثبيت ملحق أندرويد كاباسيتور</p>
                      <p>npm install @capacitor/core @capacitor/cli</p>
                      <p className="text-teal-400"># تهيئة إعداد كينونة التطبيق</p>
                      <p>npx cap init "فضفضة أونلاين" "online.fdfada.app" --web-dir=dist</p>
                      <p className="text-teal-400"># إضافة مجلد مشروع أندرويد ستوديو</p>
                      <p>npx cap add android</p>
                      <p className="text-teal-400"># عمل مزامنة مريحة للمحتوى الفني</p>
                      <p>npx cap sync android</p>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-start gap-2.5">
                      <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-xs text-amber-900">حماية الخصوصية وممانعة تصوير الشاشة في أندرويد:</h4>
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          في كلاس النشاط الرئيسي الرئيسي (<strong className="font-mono">MainActivity.kt</strong>)، ننصح مطور الاندرويد بإدراج السطر التالي لضمان عدم لقط الشاشة أو قراءة الذاكرة أثناء تفريغ البوح السري:
                        </p>
                        <p className="text-[10px] font-mono bg-amber-100 p-2 rounded border border-amber-200">
                          getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Android bridge simulator console */}
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                    <div className="bg-slate-900 text-white rounded-[2rem] p-5 flex-1 flex flex-col justify-between border border-slate-800 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl" />
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-[10px] font-black text-slate-400 flex items-center gap-1">
                            <Terminal className="w-3.5 h-3.5 text-teal-400" />
                            محاكي جسر جافاسكريبت (Bridge Logs)
                          </span>
                          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                        </div>

                        {/* Logs body */}
                        <div className="h-44 overflow-y-auto text-[10px] font-mono text-slate-300 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 pr-1 select-text">
                          {androidLogs.map((log, idx) => (
                            <div key={idx} className="leading-relaxed whitespace-pre-wrap">{log}</div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 space-y-2">
                        <p className="text-[9px] text-slate-400 font-bold block">اضغطي لتجربة ومطالعة استدعاء دوال الاندرويد:</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button 
                            onClick={() => triggerAndroidSimulation("screenshot")}
                            className="text-[9px] font-black bg-slate-800 hover:bg-slate-700 text-teal-300 p-1.5 rounded-lg border border-white/5"
                          >
                            منع لقطة الشاشة
                          </button>
                          <button 
                            onClick={() => triggerAndroidSimulation("push")}
                            className="text-[9px] font-black bg-slate-800 hover:bg-slate-700 text-teal-300 p-1.5 rounded-lg border border-white/5"
                          >
                            محاكاة إشعار فوري
                          </button>
                          <button 
                            onClick={() => triggerAndroidSimulation("clean")}
                            className="text-[9px] font-black bg-slate-800 hover:bg-slate-700 text-teal-300 p-1.5 rounded-lg border border-white/5"
                          >
                            تطهير المخبأ
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 p-4 rounded-2xl border border-slate-100 text-right">
                      <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        جاهز للمتاجر والتوزيع APK 🚀
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        استوفى الموقع fdfada.online معايير إمكانية الوصول والتوافق التام للهواتف الذكية وسرعة التحميل ببروتوكول HTTP-2 المتطور.
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Embedded Follow Dialog Notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-teal-500 text-white rounded-2xl p-4 shadow-2xl max-w-sm z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h5 className="font-bold text-xs">شكراً لثقتك ومتابعتك لـ فضفضة أونلاين!</h5>
            <p className="text-[10px] text-slate-300 mt-1">تمت إحالتك لصفحة الفيسبوك الرسمية، تابعي عائلتنا الكبرى لمزيد من الوعي والتمكين.</p>
          </div>
        </div>
      )}

    </div>
  );
}
