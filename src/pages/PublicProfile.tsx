import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Send, CheckCircle2, ShieldCheck, Heart } from "lucide-react";

export default function PublicProfile() {
  const { username } = useParams();
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/messages/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "المستخدم غير موجود أو حدث خطأ.");
      }
    } catch(e) {
      setError("حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.");
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="max-w-md mx-auto mt-12 md:mt-24 p-8 text-center bg-white rounded-[2rem] shadow-xl shadow-teal-500/10 border border-teal-100 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-teal-400 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-3">تم إرسال رسالتك!</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">وصلتك رسالتك كسر محكم إلى صندوق <span className="font-bold text-teal-600" dir="ltr">@{username}</span> بشكل مجهول بالكامل.</p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => { setSent(false); setMessage(""); }}
            className="w-full bg-slate-50 text-slate-600 hover:bg-slate-100 font-bold py-4 rounded-2xl transition-colors border border-slate-200"
          >
            إرسال رسالة أخرى
          </button>
          
          <Link to="/register" className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md">
            <Heart className="w-5 h-5" />
            قم بإنشاء حسابك الخاص واستقبل الرسائل!
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex flex-col justify-center max-w-lg mx-auto p-4 md:p-6 pb-20 md:pb-6">
      
      {/* Branding for the app */}
      <div className="text-center mb-6">
        <Link to="/" className="inline-block">
          <h1 className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600">
            فضفضة أونلاين
          </h1>
        </Link>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-100 to-teal-100 justify-center mx-auto mb-5 border-4 border-white text-indigo-600 rounded-[2rem] rotate-3 shadow-sm flex items-center text-3xl font-black uppercase">
            {username?.substring(0, 2)}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 truncate px-4" dir="ltr">@{username}</h1>
          
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 w-fit mx-auto px-3 py-1.5 rounded-full border border-emerald-100 mb-2 mt-4">
            <ShieldCheck className="w-4 h-4" />
            <span>رسائل مشفرة ومجهولة الهوية 100%</span>
          </div>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
            اكتب رسالتك بكل صراحة.. لن يتم كشف اسمك، أو موقعك، أو أي تفاصيل عنك.
          </p>
        </div>

        {error && <div className="bg-rose-50 border border-rose-100 text-rose-600 font-medium p-4 rounded-2xl text-sm mb-6 flex items-center justify-center animate-in shake">{error}</div>}

        <form onSubmit={handleSend} className="relative z-10">
          <div className="relative mb-6">
            <label className="sr-only">اكتب رسالتك</label>
            <textarea
              className="w-full bg-slate-50/80 backdrop-blur-sm border-2 border-slate-200 rounded-3xl p-5 min-h-[160px] focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 resize-none text-slate-700 text-base md:text-lg transition-all shadow-inner placeholder:text-slate-400"
              placeholder="اكتب هنا ما لم تستطع قوله له وجهاً لوجه..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            {/* Character count / visual indicator */}
            <div className="absolute bottom-4 left-4 text-xs font-semibold px-2 py-1 rounded bg-white text-slate-400 shadow-sm border border-slate-100">
              {message.length} حرف
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:scale-100 active:scale-95 shadow-md shadow-slate-900/10 text-lg"
          >
            {loading ? (
              "جاري التشفير والإرسال..."
            ) : (
              <>
                <Send className="w-6 h-6 rtl:-scale-x-100 text-teal-400" />
                <span>إرسال بصراحة و سرية</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
