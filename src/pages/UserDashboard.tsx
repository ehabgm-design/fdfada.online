import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Mail, LogOut, Check } from "lucide-react";

export default function UserDashboard() {
  const [messages, setMessages] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetch(`/api/messages/${userId}`)
      .then(res => res.json())
      .then(data => setMessages(data.messages || []));
  }, [userId, navigate]);

  const copyLink = () => {
    const link = `${window.location.origin}/u/${username}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <h1 className="text-2xl font-bold text-slate-800">أهلاً بك، {username}</h1>
          <p className="text-slate-500">هنا تصلك الرسائل المجهولة من أصدقائك أو متابعيك</p>
        </div>
        <button onClick={logout} className="text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors border border-transparent hover:border-rose-100">
          <LogOut className="w-4 h-4" /> تسجيل خروج
        </button>
      </div>

      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-3xl p-6 md:p-8 text-white mb-10 shadow-lg">
        <h2 className="text-xl font-bold mb-2">رابطك الخاص للاستقبال</h2>
        <p className="text-teal-50 mb-6 text-sm opacity-90">انسخ هذا الرابط وشاركه لتستقبل رسائل مجهولة بكل حرية!</p>
        <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl p-2 max-w-lg shadow-inner">
          <input 
            type="text" 
            readOnly 
            value={`${window.location.origin}/u/${username}`} 
            className="bg-transparent text-white w-full px-3 focus:outline-none placeholder-white/50 rtl:text-right font-mono text-sm"
          />
          <button 
            onClick={copyLink}
            className="bg-white text-teal-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-teal-50 transition-colors shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "تم النسخ" : "نسخ"}
          </button>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Mail className="w-6 h-6 text-teal-500" /> صندوق الرسائل ({messages.length})
        </h3>
        
        {messages.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
              <Mail className="w-10 h-10" />
            </div>
            <p className="text-slate-600 font-semibold mb-2">صندوقك فارغ حالياً.</p>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">روّج لرابطك على منصات التواصل واختبر قوة الصراحة المجهولة!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {messages.map(msg => (
              <div key={msg.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group hover:shadow-md transition-all hover:border-teal-100">
                <p className="text-slate-700 leading-relaxed mb-6 whitespace-pre-wrap">{msg.message}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50 pt-3 font-medium">
                  <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-500">رسالة مجهولة</span>
                  <span>{new Date(msg.createdAt).toLocaleDateString("ar-EG")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
