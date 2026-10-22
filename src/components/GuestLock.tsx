import { Link } from "react-router-dom";
import { Lock, Sparkles, UserPlus, LogIn, HeartPulse } from "lucide-react";
import Logo from "./Logo";

interface GuestLockProps {
  title: string;
  description: string;
  featureBadge?: string;
}

export default function GuestLock({ title, description, featureBadge = "خاص بالعضوات" }: GuestLockProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center rtl" dir="rtl">
      <div className="relative mb-8">
        {/* Animated background rings */}
        <div className="absolute inset-0 bg-plum/5 rounded-full blur-2xl -translate-y-2 animate-pulse"></div>
        <div className="relative w-24 h-24 rounded-[2rem] bg-white border border-slate-150 shadow-xl flex items-center justify-center text-plum">
          <Lock className="w-10 h-10 stroke-[1.5]" />
          <span className="absolute -top-1 -left-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-[10px] text-white animate-bounce">
            🗝️
          </span>
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 bg-plum/5 text-plum px-3.5 py-1.5 rounded-full text-xs font-black mb-4 border border-plum/10">
        <Sparkles className="w-3.5 h-3.5 text-rose-gold" />
        <span>{featureBadge} • فضفضة أونلاين</span>
      </div>

      <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight max-w-lg mb-4">
        {title}
      </h2>

      <p className="text-slate-500 leading-relaxed text-sm md:text-base max-w-xl mb-10 font-medium">
        {description}
      </p>

      {/* Main interactive call-to-actions */}
      <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link 
          to="/register"
          className="bg-plum hover:bg-velvet text-white font-extrabold text-sm p-4 rounded-2xl flex items-center justify-center gap-2.5 transition duration-300 shadow-md shadow-plum/10 hover:scale-[1.01] active:scale-[0.99] text-center"
        >
          <UserPlus className="w-4 h-4 text-rose-gold" />
          <span>إنشاء حساب مستقل آمن (مجاناً)</span>
        </Link>
        <Link 
          to="/login"
          className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-extrabold text-sm p-4 rounded-2xl flex items-center justify-center gap-2.5 transition duration-300 shadow-sm hover:scale-[1.01] active:scale-[0.99] text-center"
        >
          <LogIn className="w-4 h-4 text-plum" />
          <span>تسجيل الدخول للمنصة</span>
        </Link>
      </div>

      {/* Alternative: Talk to real person on WhatsApp directly */}
      <div className="mt-5 w-full max-w-md">
        <a
          href="https://wa.me/201131416213?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D9%81%D8%B6%D9%81%D8%B6%D8%A9%20%D9%88%D8%A7%D9%84%D8%AA%D8%AD%D8%AF%D8%AB%20%D9%85%D8%B9%20%D8%B4%D8%AE%D8%B5%20%D9%85%D8%B3%D8%AA%D9%85%D8%B9%20%D9%88%D9%85%D9%88%D8%AB%D9%88%D9%82%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%D9%8A%D8%A9%20%D8%AA%D8%A7%D9%85%D8%A9%20%F0%9F%8C%B8"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs p-3.5 rounded-2xl flex items-center justify-center gap-2 transition duration-300 shadow-md shadow-emerald-600/15 text-center w-full"
        >
          <span>تفضيل الفضفضة مع شخص حقيقي؟ تواصلي واتساب: 01131416213 💬</span>
        </a>
      </div>

      {/* Value prop sub-points */}
      <div className="mt-12 pt-8 border-t border-slate-200/60 w-full max-w-xl grid grid-cols-3 gap-4 text-center">
        <div>
          <span className="text-xl block mb-1">🛡️</span>
          <p className="text-[11px] font-black text-slate-800 leading-none">خصوصية تامة</p>
          <p className="text-[9px] text-slate-400 mt-1">تشفير كامل للرسائل</p>
        </div>
        <div>
          <span className="text-xl block mb-1">🌸</span>
          <p className="text-[11px] font-black text-slate-800 leading-none">مجتمع آمن</p>
          <p className="text-[9px] text-slate-400 mt-1">نسخة مفرزة للخصوصية</p>
        </div>
        <div>
          <span className="text-xl block mb-1">💎</span>
          <p className="text-[11px] font-black text-slate-800 leading-none">مزايا حصرية</p>
          <p className="text-[9px] text-slate-400 mt-1">صندوق صراحة مخصص</p>
        </div>
      </div>
    </div>
  );
}
