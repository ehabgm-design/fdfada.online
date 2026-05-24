import { Routes, Route, Link, useLocation } from "react-router-dom";
import { HeartHandshake, MessageSquareHeart, HeartPulse, Ear, Users, MailOpen, ShieldAlert } from "lucide-react";
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
import { cn } from "./lib/utils";

export default function App() {
  const location = useLocation();

  const navItems = [
    { name: "الرئيسية", path: "/", icon: HeartHandshake },
    { name: "خزانة الأسرار", path: "/venting", icon: MessageSquareHeart },
    { name: "مؤشر الوجدان", path: "/mood", icon: HeartPulse },
    { name: "متنفس السكينة", path: "/relax", icon: Ear },
    { name: "رسائل مجهولة", path: "/dashboard", icon: MailOpen },
    { name: "مجتمع الفتيات", path: "/community", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row rtl">
      {/* Sidebar Navigation */}
      <nav className="fixed bottom-0 w-full md:relative md:w-64 bg-white border-t md:border-t-0 md:border-l border-slate-200 z-50 md:h-screen flex flex-col justify-between shrink-0 shadow-sm md:shadow-none overflow-y-auto">
        <div>
          <div className="hidden md:flex items-center gap-3 p-6 mb-2 mt-2">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-800">فضفضة أونلاين</h1>
              <p className="text-xs text-slate-500">مساحتك الآمنة للبوح</p>
            </div>
          </div>
          
          <ul className="flex md:flex-col justify-around md:justify-start p-2 md:p-3 gap-1 md:gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === '/dashboard' && (location.pathname === '/login' || location.pathname === '/register'));
              return (
                <li key={item.path} className="flex-1 md:flex-none">
                  <Link
                    to={item.path}
                    className={cn(
                      "flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-teal-50 text-teal-700 font-semibold" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive ? "stroke-2" : "stroke-[1.5]")} />
                    <span className="text-[10px] md:text-sm">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Admin Link at the bottom corner for desktop */}
        <div className="hidden md:block p-4 mt-auto border-t border-slate-100">
          <Link to="/admin" className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-700 transition-colors">
            <ShieldAlert className="w-4 h-4" />
            <span>لوحة الإدارة</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-50 relative pb-20 md:pb-0 h-screen overflow-y-auto w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venting" element={<Venting />} />
          <Route path="/mood" element={<MoodHub />} />
          <Route path="/relax" element={<Relaxation />} />
          <Route path="/community" element={<Community />} />
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
