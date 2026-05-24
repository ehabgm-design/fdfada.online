import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Mail, LogOut, Check, Share2, Trash2 } from "lucide-react";

export default function UserDashboard() {
  const [messages, setMessages] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const fetchMessages = () => {
    if (!userId) return;
    fetch(`/api/messages/${userId}`)
      .then(res => res.json())
      .then(data => setMessages(data.messages || []));
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchMessages();
  }, [userId, navigate]);

  const profileLink = `${window.location.origin}/u/${username}`;

  const copyLink = () => {
    navigator.clipboard.writeText(profileLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'صارحني - رسائل مجهولة',
          text: `اكتب لي رسالة مجهولة بكل صراحة! أعدك أنني لن أعرف هويتك 🤫 أرسل لي عبر هذا الرابط:`,
          url: profileLink,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      copyLink(); // fallback
    }
  };

  const deleteMessage = async (msgId: string) => {
    if(confirm("هل أنت متأكد من حذف هذه الرسالة؟")) {
      await fetch(`/api/messages/${msgId}`, { method: "DELETE" });
      fetchMessages();
    }
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/login");
  };

  if (!username) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">أهلاً بك، @{username}</h1>
          <p className="text-slate-500 flex items-center gap-1 mt-1 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> حالة الحساب: نشط وجاهز للاستقبال
          </p>
        </div>
        <button onClick={logout} className="text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl border-2 border-transparent hover:border-rose-100 flex items-center gap-2 text-sm transition-all font-semibold shadow-sm bg-white">
          <LogOut className="w-4 h-4 rtl:rotate-180" /> تسجيل خروج
        </button>
      </div>

      <div className="bg-gradient-to-tr from-indigo-600 via-teal-600 to-emerald-500 rounded-3xl p-8 md:p-10 text-white mb-10 shadow-xl relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="flex-1 text-center md:text-start">
            <h2 className="text-3xl font-black mb-3">شارك رابطك الآن!</h2>
            <p className="text-emerald-50 mb-8 max-w-md leading-relaxed text-sm md:text-base opacity-90 mx-auto md:mx-0">
              انسخ الرابط وشاركه في حالات الواتساب، ستوريهات انستجرام وفيسبوك، وشاهد أصدقائك يصارحونك بمشاعرهم وأراءهم الحقيقية بشكل مجهول وآمن!
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex flex-1 items-center bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-inner">
                <input 
                  type="text" 
                  readOnly 
                  value={profileLink} 
                  className="bg-transparent text-white w-full px-3 focus:outline-none rtl:text-right font-mono text-sm tracking-tight"
                  dir="ltr"
                />
              </div>
              <div className="flex gap-2 shrink-0 justify-center">
                <button 
                  onClick={copyLink}
                  className="bg-white/20 hover:bg-white text-white hover:text-teal-700 backdrop-blur-md px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? "تم النسخ!" : "نسخ الرابط"}
                </button>
                <button 
                  onClick={shareNative}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
                >
                  <Share2 className="w-5 h-5" />
                  مشاركة فورية
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Mail className="w-6 h-6 text-indigo-500" /> صندوق المصارحة
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{messages.length}</span>
          </h3>
        </div>
        
        {messages.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-[2rem] rotate-3 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 -rotate-3" />
            </div>
            <h4 className="text-xl text-slate-700 font-bold mb-2">الصندوق فارغ تماماً</h4>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
              قم بنسخ رابطك الخاص ومشاركته مع الأصدقاء وعلى منصات التواصل لاستقبال رسائل مجهولة مفاجئة!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {messages.map(msg => (
              <div key={msg.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group hover:shadow-lg transition-all hover:border-indigo-100 flex flex-col">
                <button 
                  onClick={() => deleteMessage(msg.id)}
                  className="absolute top-4 left-4 p-2 bg-slate-50 text-slate-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-rose-100 hover:text-rose-500 transition-all scale-95 group-hover:scale-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex-1">
                  <p className="text-slate-700 text-base leading-relaxed mb-6 whitespace-pre-wrap">{msg.message}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-3 font-medium mt-auto">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100 text-slate-500">
                    <span className="w-3 h-3 rounded-full bg-indigo-400"></span> رسالة مجهولة
                  </span>
                  <span>{new Date(msg.createdAt).toLocaleString("ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
