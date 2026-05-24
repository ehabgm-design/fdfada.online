import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if(username.length < 3) {
      setError("اسم المستخدم يجب أن يكون 3 أحرف على الأقل");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", username);
        navigate("/dashboard");
      } else {
        setError(data.error === "Username taken" ? "اسم المستخدم مستخدم مسبقاً، اختر اسماً آخر" : "خطأ غير معروف");
      }
    } catch(e) {
      setError("حدث خطأ في الاتصال");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm w-full max-w-sm relative">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">حساب جديد</h1>
        <p className="text-slate-500 text-sm mb-6">أنشئ حسابك وابدأ في استقبال الرسائل المجهولة من أصدقائك بضغطة واحدة.</p>

        {error && <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">اسم المستخدم (يستخدم في رابطك)</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="مثال: ahmed_99"
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-left" 
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e=>setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
            />
          </div>
          <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors mt-2">
            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          لديك حساب بالفعل؟ <Link to="/login" className="text-indigo-600 font-bold hover:underline">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}
