import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  HeartHandshake, 
  MessageSquareHeart, 
  HeartPulse, 
  Ear, 
  Users, 
  MailOpen, 
  ShieldAlert, 
  Lock, 
  User, 
  Sparkles,
  Shield
} from "lucide-react";
import Home from "./pages/Home";
import Venting from "./pages/Venting";
import Logo from "./components/Logo";
import MoodHub from "./pages/MoodHub";
import Relaxation from "./pages/Relaxation";
import Community from "./pages/Community";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import PublicProfile from "./pages/PublicProfile";
import Members from "./pages/Members";
import Store from "./pages/Store";
import SeoHub from "./pages/SeoHub";
import SocialHub from "./pages/SocialHub";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { cn } from "./lib/utils";
import { WhatsAppFloatingButton, WhatsAppIcon, WHATSAPP_NUMBER, getWhatsAppUrl } from "./components/WhatsAppSupport";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarEmoji, setAvatarEmoji] = useState<string>("🌸");

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setUsername(localStorage.getItem("username"));
    setDisplayName(localStorage.getItem("displayName"));
    setUserEmail(localStorage.getItem("userEmail"));
    setAvatarEmoji(localStorage.getItem("userAvatarEmoji") || "🌸");
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("displayName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userCountry");
    localStorage.removeItem("userAvatarEmoji");
    
    setUserId(null);
    setUsername(null);
    setDisplayName(null);
    setUserEmail(null);
    
    navigate("/");
  };

  const isUserAdmin = userEmail && ["ehabgm200@gmail.com", "ehabgm20000@gmail.com", "ehabgm2000@gmail.com"].includes(userEmail.toLowerCase());

  // Organized navigation items separating public/internet/AI features from private member & admin features
  const navItems = [
    { name: "الرئيسية", path: "/", icon: HeartHandshake, guestFriendly: true, category: "public" },
    { name: "خزانة الأسرار", path: "/venting", icon: MessageSquareHeart, guestFriendly: true, category: "public" },
    { name: "مؤشر الوجدان", path: "/mood", icon: HeartPulse, guestFriendly: true, category: "public" },
    { name: "متنفس السكينة", path: "/relax", icon: Ear, guestFriendly: true, category: "public" },
    { name: "مجتمع الفتيات", path: "/community", icon: Users, guestFriendly: true, category: "public" },
    { name: "متجر المنصة المجاني", path: "/store", icon: Sparkles, guestFriendly: true, category: "public" },
    { name: "رسائل مجهولة", path: "/dashboard", icon: MailOpen, guestFriendly: false, category: "member" },
    { name: "دليل العضوات", path: "/members", icon: Users, guestFriendly: false, category: "member" },
    { name: "سياسة الخصوصية", path: "/privacy", icon: Shield, guestFriendly: true, category: "public" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col rtl text-right">
      
      {/* Top Premium Sticky Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-50 shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo/Brand on the right (fdfada.online Brand Identity) */}
            <div className="flex items-center gap-3">
              <Link to="/">
                <Logo size="sm" variant="horizontal" />
              </Link>
            </div>

            {/* Horizontal Navigation Middle Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path === '/dashboard' && (location.pathname === '/login' || location.pathname === '/register'));
                const isLockedForGuest = !userId && !item.guestFriendly;

                return (
                  <Link
                    key={`header-nav-${item.path}-${idx}`}
                    to={isLockedForGuest ? "/login" : item.path}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 font-bold text-xs whitespace-nowrap",
                      isActive 
                        ? "bg-slate-900 text-white shadow-sm" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                    {isLockedForGuest && <Lock className="w-3 h-3 text-amber-500" />}
                  </Link>
                );
              })}
              
              {/* Special WhatsApp Live Venting Button */}
              <a 
                href={getWhatsAppUrl("مرحباً، أود الفضفضة والتحدث مع شخص مستمع وموثوق عبر الواتساب 🌸")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:scale-105 active:scale-95 whitespace-nowrap"
                title="فضفضي مع شخص حقيقي عبر الواتساب 01131416213"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0" />
                <span>فضفضي مع شخص 💬</span>
              </a>

              {/* Special Admin Link - Visible only to admin */}
              {isUserAdmin && (
                <Link 
                  to="/admin" 
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-colors bg-amber-500 text-white hover:bg-amber-600 shadow-sm"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>لوحة الإدارة 👑</span>
                </Link>
              )}
            </nav>

            {/* User Profile / Access Section */}
            <div className="flex items-center gap-2">
              {userId ? (
                /* Logged In */
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-1 px-2.5 rounded-full md:rounded-2xl md:p-1.5 md:px-3">
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="text-xl md:text-2xl shrink-0">{avatarEmoji}</span>
                    <div className="text-right hidden sm:block">
                      <p className="text-[11px] md:text-xs font-black text-slate-800 leading-none">
                        {displayName || `@${username}`}
                      </p>
                    </div>
                  </div>

                  <span className="h-5 w-px bg-slate-200 hidden sm:block mx-1"></span>

                  <div className="flex items-center gap-1">
                    <Link 
                      to="/dashboard"
                      className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-xl transition text-xs font-bold"
                      title="الملف الشخصي والرسائل"
                    >
                      <User className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-xl transition flex items-center justify-center font-bold text-xs gap-1"
                      title="تسجيل الخروج الآمن"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span className="hidden md:inline font-extrabold text-[11px]">خروج</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Guest */
                <div className="flex items-center gap-1.5">
                  <Link 
                    to="/login"
                    className="text-slate-700 hover:bg-slate-100 font-extrabold text-xs px-3.5 py-2 rounded-xl transition duration-150"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link 
                    to="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition duration-150 shadow-md shadow-indigo-600/15 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>انضمام للمجتمع 🌸</span>
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Horizontal tabs scrollable for mobile */}
        <div className="lg:hidden border-t border-slate-100 bg-slate-50/70 py-2.5 overflow-x-auto scrollbar-none scroll-smooth">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1.5">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === '/dashboard' && (location.pathname === '/login' || location.pathname === '/register'));
              const isLockedForGuest = !userId && !item.guestFriendly;

              return (
                <Link
                  key={`scroll-nav-${item.path}-${idx}`}
                  to={isLockedForGuest ? "/login" : item.path}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-150 font-bold text-[11px] whitespace-nowrap shrink-0",
                    isActive 
                      ? "bg-slate-900 text-white shadow-sm" 
                      : "text-slate-600 bg-white border border-slate-100 hover:bg-slate-50"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.name}</span>
                  {isLockedForGuest && <Lock className="w-2.5 h-2.5 text-amber-500" />}
                </Link>
              );
            })}
            
            {/* Special Mobile WhatsApp Venting Button */}
            <a 
              href={getWhatsAppUrl("مرحباً، أود الفضفضة والتحدث مع شخص مستمع وموثوق عبر الواتساب 🌸")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-2 rounded-xl text-[11px] font-black shrink-0 shadow-sm"
              title="فضفضي مع شخص حقيقي عبر الواتساب"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>فضفضي مع شخص 💬</span>
            </a>

            {/* Special Mobile Admin Link */}
            {isUserAdmin && (
              <Link 
                to="/admin" 
                className="flex items-center gap-1 bg-amber-500 text-white px-3 py-2 rounded-xl text-[11px] font-black shrink-0 shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>الإدارة 👑</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow bg-slate-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venting" element={<Venting />} />
          <Route path="/mood" element={<MoodHub />} />
          <Route path="/relax" element={<Relaxation />} />
          <Route path="/community" element={<Community />} />
          <Route path="/members" element={<Members />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/store" element={<Store />} />
          <Route path="/topics-trends" element={<SeoHub />} />
          <Route path="/social-news" element={<SocialHub />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/u/:username" element={<PublicProfile />} />
        </Routes>
      </main>

      {/* Global WhatsApp Floating Button for Instant Real Person Venting */}
      <WhatsAppFloatingButton />

      {/* Persistent SEO & Content Footer representing fdfada.online */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800 text-right" dir="rtl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo size="xs" variant="horizontal" inverted={true} />
            <p className="text-xs leading-relaxed text-slate-400">
              أول منصة تواصل وتفريغ نفسي غيابية مع رسائل صراحة مجهولة مخصصة للفتيات والنساء بالوطن العربي بخصوصية تامة 🛡️
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-300 block mb-1">فضفضة مباشرة مع شخص حقيقي:</span>
              <a 
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-2 rounded-xl transition shadow-sm"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>واتساب: {WHATSAPP_NUMBER}</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs mb-3">خرائط وروابط المنصة</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/venting" className="hover:text-white transition-colors">خزانة الأسرار والبوح للزوار</Link></li>
              <li><Link to="/mood" className="hover:text-white transition-colors">مؤشر الوجدان والمواساة</Link></li>
              <li><Link to="/relax" className="hover:text-white transition-colors">واحة السكينة والتنفس الموجه</Link></li>
              <li><Link to="/community" className="hover:text-white transition-colors">مجتمعات وصالونات الدول العربية</Link></li>
              <li><Link to="/social-news" className="text-blue-400 hover:text-white font-bold transition-colors">تابعونا فيسبوك ومجلة الأخبار 📣</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs mb-3">خدمات مجانية وأقسام</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/store" className="hover:text-white transition-colors">متجر الكوينز والهدايا المجاني</Link></li>
              <li><Link to="/members" className="hover:text-white transition-colors">دليل العضوات والرفيقات</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">تفعيل صندوق صراحة مجاني</Link></li>
              <li><Link to="/privacy" className="text-teal-400 hover:text-white font-bold transition-colors">سياسة الخصوصية وحماية البيانات 🛡️</Link></li>
              <li><Link to="/topics-trends" className="text-teal-400 hover:text-white font-bold transition-colors">موسوعة الصراحة والاتجاهات الـ SEO 📈</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-xs mb-3">بيانات النشر والتوثيق</h4>
            <p className="text-xs leading-relaxed text-slate-400 mb-2">
              نطاقنا المعتمد والرسمي هو: <strong className="text-teal-400">www.fdfada.online</strong>
            </p>
            <p className="text-xs leading-relaxed text-slate-400 mb-2">
              للفضفضة مع شخص حقيقي وسرية تامة: <strong className="text-emerald-400 font-mono dir-ltr inline-block">{WHATSAPP_NUMBER}</strong>
            </p>
            <p className="text-[10px] text-slate-500">
              جميع الحقوق محفوظة لمنصة فضفضة أونلاين © 2026. آمن، سري، ومحمي بالكامل ببروتوكولات الأمان.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Missing LogOut import if needed
import { LogOut } from "lucide-react";
