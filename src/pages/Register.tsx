import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebaseClient";
import { parseResponseJson } from "../lib/utils";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("18 - 25 سنة (شابة يافعة)");
  const [country, setCountry] = useState("مصر");
  const [gender, setGender] = useState<"female" | "male">("female");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: any) => {
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
        body: JSON.stringify({ username, password, age, country, gender })
      });
      const data = await parseResponseJson(res);
      if (res.ok) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", username);
        localStorage.setItem("displayName", username);
        localStorage.setItem("userAge", age);
        localStorage.setItem("userCountry", country);
        localStorage.setItem("userGender", data.gender || gender);
        navigate("/dashboard");
      } else {
        setError(data.error === "Username taken" ? "اسم المستخدم مستخدم مسبقاً، اختر اسماً آخر" : "خطأ غير معروف");
      }
    } catch(e: any) {
      setError(e.message || "حدث خطأ في الاتصال");
    }
    setLoading(false);
  };

  const registerWithGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const res = await fetch("/api/auth/google/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: user.email, 
          name: user.displayName, 
          googleId: user.uid 
        })
      });
      
      const data = await parseResponseJson(res);
      if (res.ok) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userEmail", user.email || "");
        localStorage.setItem("displayName", data.displayName || name);
        if (data.age) localStorage.setItem("userAge", data.age);
        if (data.country) localStorage.setItem("userCountry", data.country);
        localStorage.setItem("userGender", data.gender || "female");
        navigate("/dashboard");
      } else {
        setError(data.error || "فشل التسجيل والتزامن بواسطة جوجل");
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
          setError("تم إغلاق نافذة التسجيل.");
      } else {
          setError("فشل التسجيل. الرجاء المحاولة مرة أخرى.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[2.2rem] border border-slate-100 shadow-xl shadow-slate-150/45 w-full max-w-md relative">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">حساب جديد وآمن</h1>
        <p className="text-slate-500 text-sm mb-6">أنشئ حسابكِ الخاص والسرّي بالكامل، لتحددي عمرك وبلدك ومجتمعكِ المناسب.</p>

        {error && <div className="bg-rose-50 border border-rose-100 text-rose-600 font-semibold p-4 rounded-2xl text-xs mb-5 flex items-center justify-center text-center leading-relaxed">{error}</div>}

        <button 
          type="button"
          onClick={registerWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-2xl transition-all shadow-sm active:scale-95 text-sm mb-5 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.66l3.15-3.15C17.43 1.68 14.94 1 12 1 7.35 1 3.41 3.67 1.48 7.57l3.75 2.91c.9-2.7 3.4-4.44 6.77-4.44z"></path>
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.39-4.88 3.39-8.5z"></path>
            <path fill="#FBBC05" d="M5.23 10.48c-.23-.7-.36-1.45-.36-2.23s.13-1.53.36-2.23L1.48 3.11c-.96 1.93-1.48 4.14-1.48 6.5s.52 4.57 1.48 6.5l3.75-2.91z"></path>
            <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.66-2.84c-1.01.68-2.31 1.09-3.6 1.09-3.37 0-5.87-2.33-6.77-5.4l-3.75 2.91C3.41 20.33 7.35 23 12 23z"></path>
          </svg>
          <span>تسجيل مجاني سريع بـ Google</span>
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="h-[1px] bg-slate-150 flex-1"></div>
          <span className="text-[10px] font-bold text-slate-400">أو مع اسم مستعار</span>
          <div className="h-[1px] bg-slate-150 flex-1"></div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 font-sans text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">المجتمع والديوان المفرز هويتياً 🛡️🌸</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                  gender === "female"
                    ? "border-rose-gold bg-plum text-white shadow-md scale-[1.02]"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="text-xl">🌸</span>
                <span className="text-[11px] font-black">ديوان الزاهرات (إناث)</span>
              </button>
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                  gender === "male"
                    ? "border-rose-gold bg-plum text-white shadow-md scale-[1.02]"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="text-xl">🛡️</span>
                <span className="text-[11px] font-black">مجلس الفرسان (ذكور)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم المستخدم (مستعار / باللاتينية)</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="مثال: yasmin_safe"
              className="w-full border border-slate-200 rounded-2xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum text-left text-sm" 
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-705 mb-1.5">كلمة المرور السرية</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-2xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum text-sm" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-705 mb-1.5 font-sans">الفئة العمرية</label>
              <select 
                value={age}
                onChange={e=>setAge(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum text-xs"
              >
                <option value="تحت 18 سنة (فتاة مراهقة)">تحت 18 سنة (فتاة مراهقة)</option>
                <option value="18 - 25 سنة (شابة يافعة)">18 - 25 سنة (شابة يافعة)</option>
                <option value="26 - 40 سنة (سيدة ناضجة)">26 - 40 سنة (سيدة ناضجة)</option>
                <option value="فوق 40 سنة (سيدة حكيمة)">فوق 40 سنة (سيدة حكيمة)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-705 mb-1.5 font-sans">بلد المجتمع الرئيسي</label>
              <select 
                value={country}
                onChange={e=>setCountry(e.target.value)}
                className="w-full border border-slate-200 rounded-2xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum text-xs"
              >
                <option value="مصر">مصر 🇪🇬</option>
                <option value="السعودية">السعودية 🇸🇦</option>
                <option value="المغرب">المغرب 🇲🇦</option>
                <option value="الجزائر">الجزائر 🇩🇿</option>
                <option value="العراق">العراق 🇮🇶</option>
                <option value="تونس">تونس 🇹🇳</option>
                <option value="سوريا ولبنان">سوريا ولبنان 🇸🇾🇱🇧</option>
                <option value="الأردن وفلسطين">الأردن وفلسطين 🇯🇴🇵🇸</option>
                <option value="اليمن والسودان">اليمن والسودان 🇾🇪🇸🇩</option>
                <option value="الخليج العربي العام">الخليج العربي العام 🇦🇪🇶🇦🇰🇼</option>
                <option value="الوطن العربي">الوطن العربي العام 🗺️</option>
              </select>
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-plum text-white font-bold py-3.5 rounded-2xl hover:bg-velvet transition-colors mt-4 text-sm active:scale-95 shadow-md shadow-plum/10">
            {loading ? "جاري إنشاء حسابك السري..." : "إنشاء الحساب والانضمام السري"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          لديك حساب بالفعل؟ <Link to="/login" className="text-plum font-bold hover:underline">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}
