import { useState } from "react";
import { useParams } from "react-router-dom";
import { Send, UserRound, CheckCircle2 } from "lucide-react";

export default function PublicProfile() {
  const { username } = useParams();
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (e: React.FormEvent) => {
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
      <div className="max-w-md mx-auto mt-20 p-8 text-center bg-white rounded-3xl shadow-sm border border-slate-100">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">تم الإرسال بنجاح!</h2>
        <p className="text-slate-500">رسالتك المجهولة في طريقها إلى {username}</p>
        <button 
          onClick={() => { setSent(false); setMessage(""); }}
          className="mt-6 text-teal-600 text-sm font-semibold hover:underline"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-12 p-6">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
        <div className="w-20 h-20 bg-slate-50 justify-center mx-auto mb-4 border border-slate-100 text-slate-400 rounded-full flex items-center shadow-inner">
          <UserRound className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2" dir="ltr">صارح @{username}</h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">اكتب رسالتك بكل صراحة وحرية. رسالتك ستصله مجهولة الهوية تماماً ولن يعرف المرسل.</p>

        {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

        <form onSubmit={handleSend} className="text-start">
          <textarea
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none mb-4 text-slate-700"
            placeholder="اكتب رسالتك السرية هنا..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5 rtl:-scale-x-100" />
            {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
          </button>
        </form>
      </div>
    </div>
  );
}
