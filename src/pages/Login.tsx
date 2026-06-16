import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebaseClient";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        localStorage.setItem("displayName", data.displayName || data.username);
        navigate("/dashboard");
      } else {
        setError(data.error || "خطأ في تسجيل الدخول");
      }
    } catch(e) {
      setError("حدث خطأ في الاتصال");
    }
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      // Use standard Firebase Google Auth popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Send user details to our backend to sync profiles!
      const res = await fetch("/api/auth/google/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: user.email, 
          name: user.displayName, 
          googleId: user.uid 
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userEmail", user.email || "");
        localStorage.setItem("displayName", data.displayName || name);
        if (data.age) localStorage.setItem("userAge", data.age);
        if (data.country) localStorage.setItem("userCountry", data.country);
        navigate("/dashboard");
      } else {
        setError(data.error || "فشل مزامنة الدخول من حساب جوجل");
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
          setError("تم إغلاق نافذة تسجيل الدخول.");
      } else {
          setError("فشل تسجيل الدخول بواسطة جوجل. الرجاء المحاولة مرة أخرى.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[2.2rem] border border-slate-100 shadow-xl shadow-slate-150/45 w-full max-w-md text-right">
        <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">تسجيل الدخول للفتيات</h1>
        <p className="text-slate-500 text-sm mb-6">ادخلي لحسابكِ الآمن لقراءة رسائل المصارحة المجهولة والتفاعل مع شقيقاتك.</p>

        {error && <div className="bg-rose-50 border border-rose-100 text-rose-600 font-semibold p-4 rounded-2xl text-xs mb-5 flex items-center justify-center text-center leading-relaxed">{error}</div>}

        <button 
          type="button"
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-2xl transition-all shadow-sm active:scale-95 text-sm mb-5 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.66l3.15-3.15C17.43 1.68 14.94 1 12 1 7.35 1 3.41 3.67 1.48 7.57l3.75 2.91c.9-2.7 3.4-4.44 6.77-4.44z"></path>
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.39-4.88 3.39-8.5z"></path>
            <path fill="#FBBC05" d="M5.23 10.48c-.23-.7-.36-1.45-.36-2.23s.13-1.53.36-2.23L1.48 3.11c-.96 1.93-1.48 4.14-1.48 6.5s.52 4.57 1.48 6.5l3.75-2.91z"></path>
            <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.66-2.84c-1.01.68-2.31 1.09-3.6 1.09-3.37 0-5.87-2.33-6.77-5.4l-3.75 2.91C3.41 20.33 7.35 23 12 23z"></path>
          </svg>
          <span>تسجيل الدخول بواسطة Google</span>
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="h-[1px] bg-slate-150 flex-1"></div>
          <span className="text-[10px] font-bold text-slate-400">أو مع اسم مستعار</span>
          <div className="h-[1px] bg-slate-150 flex-1"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-705 mb-1.5">اسم المستخدم المستعار</label>
            <input 
              type="text" 
              required
              placeholder="مثال: fatima_safe"
              value={username}
              onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              className="w-full border border-slate-200 rounded-2xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-left text-sm" 
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-705 mb-1.5">كلمة المرور</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-2xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm" 
            />
          </div>
          <button disabled={loading} type="submit" className="w-full bg-teal-600 text-white font-bold py-3.5 rounded-2xl hover:bg-teal-700 transition-colors mt-2 text-sm active:scale-95">
            {loading ? "جاري الدخول السري..." : "تسجيل الدخول"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          ليس لديك حساب؟ <Link to="/register" className="text-teal-600 font-bold hover:underline">أنشئ حساباً جديداً</Link>
        </p>
      </div>
    </div>
  );
}
