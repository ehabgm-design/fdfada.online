import React, { useState } from "react";
import { 
  MessageCircle, 
  Phone, 
  Check, 
  Copy, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  X, 
  ExternalLink,
  Lock,
  Headphones,
  UserCheck
} from "lucide-react";

export const WHATSAPP_NUMBER = "01131416213";
export const WHATSAPP_INTL_NUMBER = "+201131416213";
export const WHATSAPP_MESSAGE = "السلام عليكم، أود الفضفضة والتحدث مع شخص مستمع وموثوق من فضفضة أونلاين بخصوصية وسرية تامة 🌸";

export const getWhatsAppUrl = (customMsg?: string) => {
  const text = encodeURIComponent(customMsg || WHATSAPP_MESSAGE);
  return `https://wa.me/201131416213?text=${text}`;
};

/**
 * WhatsApp SVG Icon for pristine brand appearance
 */
export function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M12.031 2C6.496 2 2 6.496 2 12.031c0 1.968.568 3.805 1.554 5.364L2 22l4.743-1.524A9.97 9.97 0 0012.031 22C17.566 22 22 17.504 22 12.031 22 6.496 17.566 2 12.031 2zm5.727 14.156c-.237.669-1.378 1.282-1.921 1.341-.51.056-1.157.08-3.328-.817-2.613-1.079-4.298-3.727-4.428-3.901-.13-.174-1.06-1.411-1.06-2.69 0-1.28.67-1.91.908-2.17.237-.26.518-.326.69-.326.173 0 .346.002.497.01.162.008.38-.061.593.45.22.529.748 1.828.813 1.96.066.132.11.287.022.46-.088.173-.132.28-.264.432-.132.152-.278.34-.397.457-.132.13-.27.272-.116.536.154.264.685 1.127 1.47 1.826 1.01.899 1.86 1.178 2.124 1.31.264.132.418.11.573-.066.154-.176.66-.77.836-1.034.176-.264.352-.22.593-.132.242.088 1.538.725 1.802.857.264.132.44.198.506.308.066.11.066.638-.171 1.307z"/>
    </svg>
  );
}

/**
 * Dedicated Interactive Dialog for WhatsApp Venting
 */
export function WhatsAppModal({ 
  isOpen, 
  onClose,
  topic = "فضفضة خاصة مع شخص حقيقي"
}: { 
  isOpen: boolean; 
  onClose: () => void;
  topic?: string;
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(WHATSAPP_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm rtl text-right animate-in fade-in duration-200"
      dir="rtl"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-150 relative space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Visual Icon */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm">
            <WhatsAppIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100/70 text-emerald-800 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>مستمعة حقيقية وموثوقة متاحة 🌸</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">فضفضي مع شخص حقيقي</h3>
          </div>
        </div>

        {/* Reassuring Explanation */}
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          لو محتاجة إنسانة حقيقية تسمعك وتفهم وجعك باهتمام وبدون أي أحكام أو قيود وبسرية تامة 100%.. تواصلي معنا مباشرة عبر الواتساب.
        </p>

        {/* Confidentiality Badges */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>خصوصية وسرية مطلقة 100% لكل ما تقولينه.</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>محادثة مشفرة تماماً عبر تطبيق واتساب.</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Heart className="w-4 h-4 text-rose-500 shrink-0" />
            <span>استماع إنساني ومواساة قلبية دافئة بدون لوم.</span>
          </div>
        </div>

        {/* WhatsApp Phone Card with Copy Button */}
        <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-emerald-800 block">رقم الواتساب المباشر للفضفضة:</span>
              <span className="text-lg font-black text-slate-900 tracking-wider font-mono dir-ltr inline-block">
                {WHATSAPP_NUMBER}
              </span>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition active:scale-95 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>نسخ الرقم</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <a
            href={getWhatsAppUrl(`مرحباً بكِ، أود الفضفضة والتحدث معكِ حول: ${topic}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition shadow-lg shadow-emerald-600/20 active:scale-[0.99] text-center"
          >
            <WhatsAppIcon className="w-5 h-5" />
            <span>فتح محادثة الواتساب الآن 💬</span>
            <ExternalLink className="w-4 h-4 rtl:-scale-x-100 opacity-80" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 text-xs font-bold text-slate-400 hover:text-slate-600 text-center transition"
          >
            إغلاق ومتابعة التصفح
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Floating Quick Action Button on every screen
 */
export function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 group" dir="rtl">
        {/* Friendly Hover/Presence Tooltip */}
        <div 
          onClick={() => setIsOpen(true)}
          className="hidden sm:flex items-center gap-2 bg-white/95 text-slate-800 text-xs font-black py-2.5 px-4 rounded-2xl shadow-xl border border-slate-200/80 cursor-pointer hover:bg-emerald-50 transition transform group-hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>تفضفضي مع شخص حقيقي؟ تواصلي واتساب 💬</span>
        </div>

        {/* Pulsing Emerald Floating Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-600/30 transition-all duration-300 transform hover:scale-110 active:scale-95 group focus:outline-none"
          title="تحدثي مع شخص حقيقي عبر الواتساب"
          aria-label="تحدثي مع شخص حقيقي عبر الواتساب"
        >
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-25"></span>
          <WhatsAppIcon className="w-7 h-7 md:w-8 md:h-8 relative z-10" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-white">
            1
          </span>
        </button>
      </div>

      <WhatsAppModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        topic="فضفضة خاصة وسريعة مع مستمعة"
      />
    </>
  );
}

/**
 * Reusable Card for embedding in pages (Venting, Home, MoodHub, Relaxation, etc.)
 */
export function WhatsAppVentCard({
  title = "عاوزة تفضفضي مع شخص حقيقي يسمعك؟ 💬",
  description = "إذا كنتِ تفضلين التحدث والفضفضة مع شخص حقيقي ومستمعة موثوقة بدلاً من الروبوت وبسرية تامة، يمكنكِ مراسلتنا مباشرة على الواتساب.",
  badge = "خدمة الفضفضة الإنسانية المباشرة",
  compact = false
}: {
  title?: string;
  description?: string;
  badge?: string;
  compact?: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(WHATSAPP_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (compact) {
    return (
      <>
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-right shadow-sm" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <WhatsAppIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-black text-slate-800">{title}</h4>
              <p className="text-[11px] text-slate-600">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm whitespace-nowrap"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>واتساب: {WHATSAPP_NUMBER}</span>
            </a>
          </div>
        </div>
        <WhatsAppModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="w-full bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/30 rounded-3xl p-6 md:p-8 border border-emerald-200/80 shadow-md relative overflow-hidden text-right" dir="rtl">
        {/* Decorative corner glow */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl -translate-x-12 -translate-y-12"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-900 px-3 py-1 rounded-full text-xs font-black border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>{badge}</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
              {title}
            </h3>

            <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500 font-bold">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>سرية تامة 100%</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>مستمعة متفهمة بدون أحكام</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>تشفير واتساب المباشر</span>
              </span>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition shadow-lg shadow-emerald-600/20 hover:scale-[1.01] active:scale-[0.99] text-center"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>تحدثي معنا عبر واتساب الآن</span>
            </a>

            <div className="flex items-center justify-between gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200">
              <span className="text-xs font-mono font-bold text-slate-800 dir-ltr">
                {WHATSAPP_NUMBER}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
