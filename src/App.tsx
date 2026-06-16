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
  Unlock, 
  LogOut, 
  User, 
  Sparkles,
  ArrowLeft
} from "lucide-react";
import Home from "./pages/Home";
import Venting from "./pages/Venting";
import MoodHub from "./pages/MoodHub";
import Relaxation from "./pages/Relaxation";
import Community from "./pages/Community";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import PublicProfile from "./pages/PublicProfile";
import Members from "./pages/Members";
import { cn } from "./lib/utils";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarEmoji, setAvatarEmoji] = useState<string>("🌸");
  const [userCountry, setUserCountry] = useState<string>("🗺️");

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setUsername(localStorage.getItem("username"));
    setDisplayName(localStorage.getItem("displayName"));
    setUserEmail(localStorage.getItem("userEmail"));
    setAvatarEmoji(localStorage.getItem("userAvatarEmoji") || "🌸");
    setUserCountry(localStorage.getItem("userCountry") || "الوطن العربي");
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

  const isUserAdmin = userEmail && userEmail.toLowerCase() === "ehabgm200@gmail.com";

  const navItems = [
    { name: "الرئيسية", path: "/", icon: HeartHandshake, guestFriendly: true },
    { name: "خزانة الأسرار", path: "/venting", icon: MessageSquareHeart, guestFriendly: true },
    { name: "مؤشر الوجدان", path: "/mood", icon: HeartPulse, guestFriendly: true },
    { name: "متنفس السكينة", path: "/relax", icon: Ear, guestFriendly: true },
    { name: "رسائل مجهولة", path: "/dashboard", icon: MailOpen, guestFriendly: false },
    { name: "مجتمع الفتيات", path: "/community", icon: Users, guestFriendly: true },
    { name: "دليل العضوات", path: "/members", icon: Users, guestFriendly: false },
  ];

  const COUNTRY_FLAGS: { [key: string]: string } = {
    "مصر": "🇪🇬",
    "السعودية": "🇸🇦",
    "المغرب": "🇲🇦",
    "الجزائر": "🇩🇿",
    "العراق": "🇮🇶",
    "تونس": "🇹🇳",
    "سوريا ولبنان": "🇸🇾",
    "الأردن وفلسطين": "🇯🇴",
    "اليمن والسودان": "🇾🇪",
    "الخليج العربي العام": "🇦🇪",
    "الوطن العربي": "🗺️"
  };

  const getFlag = (countryName: string) => {
    return COUNTRY_FLAGS[countryName] || "🗺️";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col rtl text-right">
      
      {/* Top Premium Sticky Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-50 shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo/Brand on the right */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-500/20">
                  <HeartHandshake className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-base md:text-lg text-slate-900 block leading-tight">فضفضة أونلاين</span>
                  <span className="text-[9px] md:text-[10px] text-teal-600 font-extrabold tracking-wide block">بوابة البوح الآمن والدعم النفسي 🌸🗝️</span>
                </div>
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
                      "flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-200 font-bold text-xs whitespace-nowrap",
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
              
              {/* Special Admin Link */}
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/u/:username" element={<PublicProfile />} />
        </Routes>
      </main>
    </div>
  );
}

