import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Send, CheckCircle2, ShieldCheck, Heart, MapPin, BadgeHelp, MessageSquare } from "lucide-react";

export default function PublicProfile() {
  const { username } = useParams();
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [targetProfile, setTargetProfile] = useState<any>(null);

  const [inviteStatus, setInviteStatus] = useState("");
  const currentUserId = localStorage.getItem("userId");

  const handleSendChatRequest = async () => {
    if (!currentUserId) {
      alert("يرجى تسجيل الدخول أولاً لتتمكني من إرسال طلب محادثة سرية مرئية.");
      return;
    }
    if (localStorage.getItem("username") === username) {
      alert("لا يمكنك مراسلة نفسكِ.");
      return;
    }

    try {
      setInviteStatus("جاري إرسال الطلب...");
      const response = await fetch("/api/chats/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userA: currentUserId,
          usernameB: username
        })
      });

      const data = await response.json();
      if (response.ok) {
        setInviteStatus("تم تقديم طلب بدء المحادثة المباشرة! 💬");
      } else {
        alert(data.error || "فشل إرسال الدعوة");
        setInviteStatus("");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إرسال طلب المحادثة السري");
      setInviteStatus("");
    }
  };

  useEffect(() => {
    if (username) {
      document.title = `صارح @${username} | فضفضة أونلاين`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", `أرسل رسالة سرية مجهولة الهوية إلى ${username} بأمان تام وبدون كشف هويتك عبر منصة فضفضة أونلاين.`);
      }

      // Fetch recipient's customized profile layout details
      fetch(`/api/profile/${username}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTargetProfile(data);
          }
        })
        .catch(err => console.error("Error fetching target profile", err));
    }
  }, [username]);

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
      <div className="max-w-md mx-auto mt-12 md:mt-24 p-8 text-center bg-white rounded-[2.5rem] shadow-xl shadow-teal-500/10 border border-teal-100 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-teal-400 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/30 text-3xl">
          {targetProfile?.avatarEmoji || "🌸"}
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-3">تم إرسال رسالتك!</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">وصلت رسالتكِ كسرّ مَحميّ إلى صندوق <span className="font-bold text-teal-600" dir="ltr">@{username}</span> بشكل مجهول بالكامل.</p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => { setSent(false); setMessage(""); }}
            className="w-full bg-slate-50 text-slate-600 hover:bg-slate-100 font-bold py-4 rounded-2xl transition-all border border-slate-205 active:scale-95"
          >
            إرسال رسالة أخرى
          </button>
          
          <Link to="/register" className="w-full bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md active:scale-95 text-sm">
            <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
            أنشئي حسابكِ الخاص واستقبلي المصارحات!
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex flex-col justify-center max-w-lg mx-auto p-4 md:p-6 pb-20 md:pb-6 text-right">
      
      {/* Branding for the app */}
      <div className="text-center mb-6">
        <Link to="/" className="inline-block">
          <h1 className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600">
            فضفضة أونلاين
          </h1>
        </Link>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden text-right">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 text-center mb-8 flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-100 to-teal-150 justify-center mx-auto mb-5 border-4 border-white text-teal-600 rounded-[2rem] rotate-3 shadow-md flex items-center text-4xl font-black">
            {targetProfile?.avatarEmoji || "🌸"}
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-1 truncate px-4">
            {targetProfile?.displayName || username}
          </h1>
          <span className="text-xs font-mono text-slate-400 mb-3" dir="ltr">@{targetProfile?.username || username}</span>
          
          {targetProfile?.bio && (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-xs text-slate-500 max-w-xs italic leading-relaxed mb-4">
              " {targetProfile.bio} "
            </div>
          )}

          {targetProfile?.country && (
            <div className="flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-bold mb-4">
              <MapPin className="w-3.5 h-3.5" />
              <span>مساحة فضفضة: {targetProfile.country}</span>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-teal-650 bg-teal-50/70 w-fit mx-auto px-3.5 py-2 rounded-full border border-teal-100 mb-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 animate-pulse" />
            <span>رسائل مجهولة مشفرة ومحمية 105%</span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
            اكتبي رسالتكِ بكل أمان وعفوية.. لا يمكن لأحد معرفة اسمكِ، بريدكِ، أو أي معلومات عنكِ على الإطلاق.
          </p>

          <div className="mt-5 pt-5 border-t border-slate-50 w-full flex flex-col items-center gap-2">
            <button 
              onClick={handleSendChatRequest}
              disabled={!!inviteStatus}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 w-full max-w-xs"
            >
              <MessageSquare className="w-4 h-4" />
              {inviteStatus || "طلب بدء محادثة ثنائية (ظاهرة الهوية)"}
            </button>
            <span className="text-[9px] text-slate-400 text-center max-w-xs leading-tight">إذا وافقت، ستتمكنان من التحدث براحة عبر صندوق الوارد. سيظهر اسمكِ الحقيقي بطلب المحادثة.</span>
          </div>
        </div>

        {error && <div className="bg-rose-50 border border-rose-100 text-rose-600 font-bold p-4 rounded-2xl text-xs mb-6 flex items-center justify-center animate-in shake text-center">{error}</div>}

        <form onSubmit={handleSend} className="relative z-10 text-right">
          <div className="relative mb-6">
            <label className="sr-only">اكتب رسالتك</label>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-5 min-h-[160px] focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 resize-none text-slate-705 text-sm md:text-base transition-all shadow-inner placeholder:text-slate-400 text-right"
              placeholder="اكتبي هنا ما لم تستطيعي البوح به له وجهاً لوجه بالخفاء اللطيف..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            {/* Character count / visual indicator */}
            <div className="absolute bottom-4 left-4 text-[10px] font-mono px-2 py-1 rounded bg-white text-slate-400 shadow-sm border border-slate-100">
              {message.length} حرف
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="w-full bg-slate-900 text-white hover:bg-slate-800 font-extrabold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:scale-100 active:scale-95 shadow-lg shadow-slate-900/10 text-base"
          >
            {loading ? (
              "جاري الإرسال بخصوصية مطلقة..."
            ) : (
              <>
                <Send className="w-5 h-5 rtl:-scale-x-100 text-teal-400 animate-pulse" />
                <span>إرسال بصيغة مصارحة مجهولة</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
