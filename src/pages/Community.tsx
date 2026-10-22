import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Send, Heart, Loader2, Tag, Globe, MessageSquare, Reply, Lock, Sparkles, X, ShieldAlert, Coins } from "lucide-react";
import { cn } from "../lib/utils";
import GuestLock from "../components/GuestLock";

const CATEGORIES = ["عام", "دعم نفسي", "علاقات", "فضفضة حرة", "اكتئاب وحزن"];
const COUNTRIES = [
  { name: "الكل", label: "كل البلدان 🌐" },
  { name: "مصر", label: "مصر 🇪🇬" },
  { name: "السعودية", label: "السعودية 🇸🇦" },
  { name: "المغرب", label: "المغرب 🇲🇦" },
  { name: "الجزائر", label: "الجزائر 🇩🇿" },
  { name: "العراق", label: "العراق 🇮🇶" },
  { name: "تونس", label: "تونس 🇹🇳" },
  { name: "سوريا ولبنان", label: "سوريا ولبنان 🇸🇾" },
  { name: "الأردن وفلسطين", label: "الأردن وفلسطين 🇯🇴" },
  { name: "اليمن والسودان", label: "اليمن والسودان 🇾🇪" },
  { name: "الخليج العربي العام", label: "الخليج العربي 🇦🇪" },
  { name: "الوطن العربي", label: "الوطن العربي 🗺️" }
];

const COUNTRY_FLAGS: { [key: string]: string } = {
  "مصر": "🇪🇬",
  "السعودية": "🇸🇦",
  "المغرب": "🇲🇦",
  "الجزائر": "🇩🇿",
  "العراق": "🇮🇶",
  "تونس": "🇹🇳",
  "سوريا ولبنان": "🇸🇾",
  "الأردن وفلسطين": "🇯🇴",
  "اليمن والسودان": "🇾🇪",
  "الخليج العربي العام": "🇦🇪",
  "الوطن العربي": "🗺️",
  "العالم العربي": "🗺️"
};

const getFlag = (countryName: string) => {
  if (!countryName) return "🗺️";
  return COUNTRY_FLAGS[countryName] || "🗺️";
};

export default function Community() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("عام");
  const [selectedCountry, setSelectedCountry] = useState("مصر");
  
  const [filterCategory, setFilterCategory] = useState("الكل");
  const [filterCountry, setFilterCountry] = useState("الكل");
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [inviteStatus, setInviteStatus] = useState<{[key: string]: string}>({});
  const [commentText, setCommentText] = useState<{[key: string]: string}>({});
  const [commentingId, setCommentingId] = useState<string | null>(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalReason, setAuthModalReason] = useState("");

  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");
  const [hasReported, setHasReported] = useState<{[key: string]: boolean}>({});
  const [registeredUpgrade, setRegisteredUpgrade] = useState(false);

  // New states for parallel communities & coins
  const [activeCommunity, setActiveCommunity] = useState<"female" | "male" | "unisex">("female");
  const [userCoins, setUserCoins] = useState<number>(10);
  const [userGender, setUserGender] = useState<string>("female");

  const currentUsername = localStorage.getItem("username");
  const currentUserId = localStorage.getItem("userId");

  // Fetch full user profile to always sync gender and coins balance beautifully 
  const fetchUserProfile = async () => {
    if (currentUserId) {
      try {
        const res = await fetch(`/api/profile/${currentUserId}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setUserCoins(data.coins !== undefined ? data.coins : 10);
          setUserGender(data.gender || "female");
          localStorage.setItem("userGender", data.gender || "female");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const fetchPosts = async (quiet = false) => {
    if (!quiet) setFetching(true);
    try {
      const res = await fetch(`/api/community/posts?country=${filterCountry}&category=${filterCategory}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchPosts();
    // Auto-poll for real-time posts and comments
    const interval = setInterval(() => {
      fetchPosts(true);
      fetchUserProfile();
    }, 5000);
    return () => clearInterval(interval);
  }, [filterCategory, filterCountry]);

  useEffect(() => {
    const savedCountry = localStorage.getItem("userCountry");
    if (savedCountry) {
      setSelectedCountry(savedCountry);
    }
    const savedGender = localStorage.getItem("userGender") as "female" | "male" | null;
    if (savedGender) {
      setActiveCommunity(savedGender);
      setUserGender(savedGender);
    }
  }, []);

  const loggedInUserCountry = localStorage.getItem("userCountry") || "مصر"; 
  const isForeignRoom = filterCountry !== "الكل" && filterCountry !== loggedInUserCountry;

  // Filter posts to show only those belonging to the active community tab
  const postsByActiveCommunity = posts.filter(p => {
    const pGender = p.gender || "female";
    return pGender === activeCommunity;
  });

  const displayedPosts = [...postsByActiveCommunity].sort((a, b) => {
    if (sortBy === "popular") {
      const scoreA = (a.likes || 0) + (a.comments?.length || 0);
      const scoreB = (b.likes || 0) + (b.comments?.length || 0);
      return scoreB - scoreA;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Native coin deduction API handler
  const deductCoins = async (amount: number) => {
    if (!currentUserId) return false;
    try {
      const res = await fetch("/api/payments/deduct-coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, amount })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUserCoins(data.coins);
        return true;
      }
    } catch (err) {
      console.error("Coin deduction error:", err);
    }
    return false;
  };

  const handlePost = async (e: any) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    if (!currentUserId) {
      setAuthModalReason("لتتمكني من كتابة منشوركِ السري، يُرجى تسجيل الدخول أو إنشاء حسابكِ الآمن 🌸");
      setShowAuthModal(true);
      return;
    }

    // Determine post creation coin cost
    let cost = 0;
    if (userGender === "female") {
      if (activeCommunity === "male" || activeCommunity === "unisex") cost = 2;
    } else {
      // male user
      if (activeCommunity === "female") cost = 5; // Entry into women's space costs more to prevent spam
      if (activeCommunity === "unisex") cost = 2;
    }

    if (cost > 0) {
      if (userCoins < cost) {
        alert(`عذراً! رصيدك غير كافي. تكلفة المشاركة في هذا الرواق هي ${cost} كوينز، بينما رصيدك الحالي هو ${userCoins} كوينز. يرجى زيارة متجر المنصة لشحن حسابك 💰`);
        return;
      }
      const descTab = activeCommunity === "female" ? "ديوان الزاهرات المخصص للإناث" : activeCommunity === "male" ? "مجلس الفرسان المخصص للذكور" : "برزخ التلاقي الوجداني المشترك";
      const confirmMsg = userGender === "female" 
        ? `تنبيه: لقد اخترتِ البوح في "${descTab}". هذا الفضاء يتطلب خصم ${cost} كوينز من رصيدكِ. هل تودين الاستمرار بالاقتطاع والنشر؟`
        : `تنبيه: لقد اخترت البوح في "${descTab}". هذا الفضاء يتطلب خصم ${cost} كوينز من رصيدك. هل تود الاستمرار بالاقتطاع والنشر؟`;
      
      const okay = window.confirm(confirmMsg);
      if (!okay) return;

      const deducted = await deductCoins(cost);
      if (!deducted) {
        alert("حدث خطأ أثناء اقتطاع العملات، يرجى المحاولة لاحقاً!");
        return;
      }
    }

    setLoading(true);
    try {
      await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content: newPost, 
          author: authorName.trim() || currentUsername || "زائرة مجهولة", 
          category: selectedCategory,
          country: selectedCountry,
          gender: activeCommunity
        })
      });
      setNewPost("");
      fetchPosts(true);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleLike = async (postId: string) => {
    if (!currentUserId) {
      setAuthModalReason("لتسجيل إعجابكِ بالمنشورات ومشاركات شقيقاتكِ، يرجى تسجيل الدخول أو إنشاء حساب 💖");
      setShowAuthModal(true);
      return;
    }
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p));
    try {
      await fetch(`/api/community/posts/${postId}/like`, { method: "POST" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleComment = async (postId: string) => {
    if (!currentUserId) {
      setAuthModalReason("لكتابة تعليقات ومساندة شقيقاتكِ بالرأي والمشورة، يرجى تسجيل الدخول أو إنشاء حساب 🌸");
      setShowAuthModal(true);
      return;
    }
    const text = commentText[postId];
    if (!text?.trim()) return;

    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    const postGenderType = targetPost.gender || "female";
    
    // Determine commenting cost 
    let cost = 0;
    if (userGender === "female") {
      if (postGenderType === "male") cost = 1;
      if (postGenderType === "unisex") cost = 1;
    } else {
      // male user
      if (postGenderType === "female") cost = 3; // Comments on women posts by men cost 3 coins
      if (postGenderType === "unisex") cost = 1;
    }

    if (cost > 0) {
      if (userCoins < cost) {
        alert(`عذراً! رصيدكِ غير كافي. تكلفة المشاركة بالتعليق في هذا الرواق هي ${cost} كوينز، ورصيدك الحالي هو ${userCoins} كوينز. يرجى التوجه لمتجر المنصة 💰`);
        return;
      }
      const confirmComment = `تنبيه: المشاركة بالتعليق في هذا الفضاء المغاير تتطلب اقتطاع ${cost} كوينز من رصيدك. هل تود الاستمرار؟`;
      const okay = window.confirm(confirmComment);
      if (!okay) return;

      const deducted = await deductCoins(cost);
      if (!deducted) {
        alert("حدث خطأ أثناء اقتطاع الكوينز، يرجى المحاولة لاحقاً.");
        return;
      }
    }

    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, authorName: currentUsername || "زائرة مجهولة" })
      });
      if (response.ok) {
        setCommentText({ ...commentText, [postId]: "" });
        fetchPosts(true); // real-time refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendChatRequest = async (targetUsername: string, postId: string) => {
    if (!currentUserId) {
      setAuthModalReason("لبدء دردشة سرية مجهولة وبناء ذكريات وصداقات مع العضوات، يرجى تسجيل الدخول أو إنشاء حساب 🔐✨");
      setShowAuthModal(true);
      return;
    }
    if (targetUsername === "زائرة مجهولة") {
      alert("هذا المنشور تم نشره بهوية مجهولة بالكامل لحماية الخصوصية. لا يمكن مراسلته.");
      return;
    }
    if (targetUsername === currentUsername) {
      alert("لا يمكنك مراسلة نفسكِ.");
      return;
    }

    try {
      setInviteStatus(prev => ({ ...prev, [postId]: "جاري الإرسال..." }));
      const response = await fetch("/api/chats/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userA: currentUserId,
          usernameB: targetUsername
        })
      });

      const data = await response.json();
      if (response.ok) {
        setInviteStatus(prev => ({ ...prev, [postId]: "تم إرسال دعوة المحادثة! 💬" }));
        setTimeout(() => {
          setInviteStatus(prev => {
            const copy = { ...prev };
            delete copy[postId];
            return copy;
          });
        }, 5000);
      } else {
        alert(data.error || "فشل إرسال الدعوة");
        setInviteStatus(prev => ({ ...prev, [postId]: "" }));
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إرسال طلب المحادثة السري");
      setInviteStatus(prev => ({ ...prev, [postId]: "" }));
    }
  };

  if (!currentUserId) {
    return (
      <GuestLock 
        title="مجلس الفضفضة وديوان العرب المحمي 🌸"
        description="هنا تتبادل العضوات الهموم والقصص الملهمة بخصوصية تامة وتحت رعاية مفرزة للخصوصية والأخوة الصادقة. سجلي دخولكِ لتصفح ديوان الزاهرات ومشاركة المنشورات مع شقيقاتكِ."
        featureBadge="ديوان العرب المغلق"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 flex flex-col h-screen md:h-auto font-sans">
      
      {/* Wallet Status & Main Title Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm text-right shrink-0">
        <div className="flex items-center gap-3 bg-plum/5 p-4 rounded-2xl border border-plum/10 self-stretch md:self-auto justify-between flex-row-reverse">
          <div className="w-10 h-10 bg-plum text-white rounded-xl flex items-center justify-center shadow-md">
            <Coins className="w-5 h-5 text-rose-gold animate-bounce" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-bold">الرصيد المتاح للبوح المزدوج</div>
            <div className="text-md font-black text-plum flex items-center gap-1.5 justify-end">
              <span>{userCoins} كوينز</span>
              <span className="text-xs text-rose-gold font-bold bg-rose-gold/10 px-2 py-0.5 rounded-full">محفظة آمنة</span>
            </div>
          </div>
          <Link to="/store" className="bg-plum hover:bg-velvet text-white text-[11px] font-black px-3 py-1.5 rounded-lg shadow-sm transition active:scale-95 mr-2">
            شحن 💰
          </Link>
        </div>

        <div className="text-center md:text-right">
          <h1 className="text-2xl font-black text-slate-800 mb-1 flex items-center gap-2 justify-center md:justify-end">
            <span className="text-plum">مجتمعات وديوان العرب</span>
            <Users className="w-6 h-6 text-rose-gold" />
          </h1>
          <p className="text-slate-550 text-xs font-semibold">مساحات مفرزة ومحافظة للبوح الذكي، اللقاء السليم، والدعم المتبادل بخصوصية تامة.</p>
        </div>
      </div>

      {/* Parallel Communities Chambers Selection Tabler */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/80 rounded-[1.8rem] mb-6 shadow-inner shrink-0 text-center">
        <button
          onClick={() => setActiveCommunity("female")}
          className={cn(
            "py-3.5 px-1 rounded-2xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1",
            activeCommunity === "female"
              ? "bg-white text-plum shadow-md scale-[1.02] border-b-2 border-rose-gold"
              : "text-slate-600 hover:bg-white/40"
          )}
        >
          <span className="text-lg">🌸</span>
          <span className="font-bold text-[11px]">ديوان الزاهرات</span>
          <span className="text-[9px] text-slate-400 font-medium">للنساء والفتيات {userGender === "male" ? "(بدخول 5💰)" : "(مجاني)"}</span>
        </button>

        <button
          onClick={() => setActiveCommunity("unisex")}
          className={cn(
            "py-3.5 px-1 rounded-2xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1",
            activeCommunity === "unisex"
              ? "bg-white text-plum shadow-md scale-[1.02] border-b-2 border-rose-gold"
              : "text-slate-600 hover:bg-white/40"
          )}
        >
          <span className="text-lg">🗺️</span>
          <span className="font-bold text-[11px]">التلاقي الوجداني</span>
          <span className="text-[9px] text-slate-400 font-medium">للجميع (مشاركة بـ 2💰)</span>
        </button>

        <button
          onClick={() => setActiveCommunity("male")}
          className={cn(
            "py-3.5 px-1 rounded-2xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1",
            activeCommunity === "male"
              ? "bg-white text-plum shadow-md scale-[1.02] border-b-2 border-rose-gold"
              : "text-slate-600 hover:bg-white/40"
          )}
        >
          <span className="text-lg">🛡️</span>
          <span className="font-bold text-[11px]">مجلس الفرسان</span>
          <span className="text-[9px] text-slate-400 font-medium">للرجال والشباب {userGender === "female" ? "(بدخول 2💰)" : "(مجاني)"}</span>
        </button>
      </div>

      {/* Write Post Section / Guest Invitation Banner */}
      {!currentUserId ? (
        <div className="bg-gradient-to-tr from-plum/10 via-rose-gold/5 to-velvet/10 border border-plum/10 p-6 rounded-3xl shadow-sm mb-6 relative z-10 text-right animate-in fade-in">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-4">
            <div className="space-y-1 flex-1">
              <h2 className="text-md font-black text-slate-800 flex items-center gap-1.5 justify-end">
                <span>تفريغ المشاعر والتواصل يتطلب حساباً سرياً آمنـاً 🌸🛡️</span>
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                أهلاً بك في منصتنا! بصفتك زائراً مجهولاً، يمكنك تصفح المنشورات بكل حرية ومراقبة مواضيع الفضفضة.
                ولكن، لتتمكن من كتابة منشورك الخاص، التعليق، التفاعل، والتواصل مع من تحب في المجتمعات المغلقة والمفتوحة وبميزة العملات الخاصة، يُرجى تسجيل الدخول أو إنشاء حسابك الآمن مجاناً تماماً في ثوانٍ معدودة دون طلب بيانات معقدة!
              </p>
            </div>
            <div className="bg-white/80 p-2 rounded-2xl border border-slate-100 flex items-center gap-1 shrink-0 self-end md:self-start">
              <span className="text-[10px] font-black text-slate-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-gold animate-pulse" />
                هوية مشفرة آمنة
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 justify-end border-t border-slate-200/30 pt-4">
            <Link 
              to="/login" 
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-extrabold text-xs px-5 py-2.5 rounded-xl transition active:scale-95 shadow-sm"
            >
              تسجيل دخول 🚪
            </Link>
            <Link 
              to="/register" 
              className="bg-plum hover:bg-velvet text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-plum/10 transition active:scale-95"
            >
              إنشاء حساب سري مجاناً 🌸🛡️
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-6 shrink-0 relative z-10 text-right">
          <form onSubmit={handlePost}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                النشر الحالي موجه إلى: <strong className="text-plum">{activeCommunity === "female" ? "ديوان الزاهرات 🌸" : activeCommunity === "male" ? "مجلس الفرسان 🛡️" : "برزخ التلاقي الوجداني ✨"}</strong>
              </span>
              <span className="text-[10px] text-rose-gold font-bold">
                تكلفة النشر بهذا الديوان: {userGender === activeCommunity ? "تحت بيئتك (مجاني ✨)" : activeCommunity === "unisex" ? "ساحة مشتركة (2 كوينز 💰)" : "ثنائي مغاير (اقتطاع كوينز)"}
              </span>
            </div>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              disabled={loading}
              placeholder={activeCommunity === "female" ? "اكتبي رسالة دعم، استشارة بخصوصية مطلقة لترد عليك شقيقاتك ناصحات..." : "اكتب فضفضة، تحدي أو سؤال في هذا المجلس الآمن لتفاعل صادق..."}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum text-slate-700 transition-all text-sm mb-3"
            ></textarea>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-500 font-bold flex items-center gap-1"><Tag className="w-3 h-3" /> التسمية:</span>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-3 py-1 text-xs font-bold rounded-full border transition-all",
                      selectedCategory === cat ? "bg-plum/5 border-plum/30 text-plum font-black" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> الغرفة:</span>
                <select
                  value={selectedCountry}
                  onChange={e => setSelectedCountry(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 focus:outline-none"
                >
                  {COUNTRIES.filter(c => c.name !== "الكل").map(c => (
                    <option key={c.name} value={c.name}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-slate-50 pt-3">
              <input 
                type="text" 
                placeholder="اسم مستعار فخم، أو دعه فارغاً للمجهولية" 
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                className="bg-transparent border-b border-slate-200 py-2 px-1 text-sm focus:outline-none focus:border-plum text-slate-600 w-48 text-right"
              />
              <button 
                type="submit" 
                disabled={loading || !newPost.trim()}
                className="bg-plum text-white px-6 py-2.5 rounded-xl font-extrabold flex items-center gap-2 hover:bg-velvet transition-colors disabled:opacity-50 text-xs shadow-md shadow-plum/20 active:scale-95"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 rtl:-scale-x-100" /> نشر في الرواق</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Unified Filters: Double selection tabs */}
      <div className="space-y-4 mb-6 text-right bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative z-15">
        {/* Country filters row */}
        <div>
          <span className="text-xs font-extrabold text-slate-400 block mb-2 flex items-center justify-end gap-1">
            <span>تصفية المجتمعات حسب الدول:</span>
            <Globe className="w-3.5 h-3.5 text-slate-400" />
          </span>
          <div className="flex overflow-x-auto pb-2 gap-1.5 snap-x scrollbar-none">
            {COUNTRIES.map(c => (
              <button
                key={`filter-country-${c.name}`}
                onClick={() => setFilterCountry(c.name)}
                className={cn(
                  "shrink-0 px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-all snap-start flex items-center gap-1.5",
                  filterCountry === c.name 
                    ? "bg-plum border-plum text-white shadow-md active:scale-95" 
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                )}
              >
                <span>{c.label}</span>
                {c.name !== "الكل" && c.name !== loggedInUserCountry && <Lock className="w-2.5 h-2.5 text-rose-gold opacity-60" />}
              </button>
            ))}
          </div>
        </div>

        {/* Categories row */}
        <div>
          <span className="text-xs font-extrabold text-slate-400 block mb-2 flex items-center justify-end gap-1">
            <span>تصفية حسب الموضوع:</span>
            <Tag className="w-3.5 h-3.5 text-slate-400" />
          </span>
          <div className="flex overflow-x-auto pb-2 gap-1.5 snap-x scrollbar-none">
            <button
              onClick={() => setFilterCategory("الكل")}
              className={cn(
                "shrink-0 px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all snap-start",
                filterCategory === "الكل" ? "bg-plum border-plum text-white shadow-md font-extrabold" : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
              )}
            >
              كل المواضيع 🌸
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={`filter-cat-${cat}`}
                onClick={() => setFilterCategory(cat)}
                className={cn(
                  "shrink-0 px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all snap-start",
                  filterCategory === cat ? "bg-plum border-plum text-white shadow-md font-extrabold" : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sorting options block */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-2">
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl">
            <button
              onClick={() => setSortBy("latest")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-black transition-all",
                sortBy === "latest" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              الأحدث أولاً ⏰
            </button>
            <button
              onClick={() => setSortBy("popular")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1",
                sortBy === "popular" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Heart className="w-3 h-3 text-rose-500 animate-pulse fill-rose-500" />
              <span>الأكثر حباً وتفاعلاً ✨</span>
            </button>
          </div>
          <span className="text-xs font-extrabold text-slate-500">ترتيب الفضفضة والبوح:</span>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4 pb-20 md:pb-0 text-right">
        {fetching ? (
          <div className="flex justify-center p-12 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : isForeignRoom ? (
          <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 text-center border-t-4 border-rose-gold shadow-2xl space-y-6 max-w-xl mx-auto my-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-gradient-to-tr from-rose-gold to-plum rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg shadow-plum/20">
              <Lock className="w-8 h-8 animate-pulse text-white" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-rose-gold flex items-center justify-center gap-2">
                <span>مغلق للعضويات الممتازة فقط 💎✈️</span>
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed max-w-md mx-auto">
                أنتِ حالياً مسجلة في مجتمع <span className="text-white font-extrabold bg-white/10 px-2 py-0.5 rounded-full">{loggedInUserCountry}</span>.
                دخول مجتمعات الدول الأخرى والفضفضة مع بلدان عربية ثانية هي ميزة حصرية بباقة <span className="text-rose-gold font-extrabold text-xs">"سفيرة السلام الماسية" 🧭🌸</span> المخصصة لكسر الحواجز والتواصل الإقليمي الآمن.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <p className="text-[11px] text-slate-300 font-bold leading-relaxed">
                سيتم إطلاق باقة الترقية الماسية الأسبوع المقبل لتتيح لكِ استكشاف 12 مجتمعاً عربياً، ودعم أشقائك في تونس، المغرب، السعودية، الخليج، والعراق وبناء جسور أخوة لا تنتهي!
              </p>
              
              {registeredUpgrade ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 text-center text-emerald-400 font-black text-xs animate-in fade-in">
                  🎉 تم تسجيل رغبتكِ في الترقية! ستكونين أول من يتم ترقية حسابها مجاناً فور الإطلاق الشامل.
                </div>
              ) : (
                <button
                  onClick={() => setRegisteredUpgrade(true)}
                  className="w-full bg-gradient-to-r from-rose-gold to-plum hover:from-plum hover:to-velvet text-white font-black rounded-xl py-3 text-xs shadow-md active:scale-95 transition"
                >
                  طلب حجز الترقية المجانية الفورية فور الإطلاق 💎✨
                </button>
              )}
            </div>
          </div>
        ) : displayedPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-1/2 p-12 text-center border text-slate-500 text-sm font-medium">
            لا توجد مشاركات في هذا الرواق الوجداني المخصص بعد. كن أول من يكتب كلمته المباركة فيه الآن! ✨✍️
          </div>
        ) : (
          displayedPosts.map((post, idx) => {
            const isAnonymous = post.author === "زائرة مجهولة" || !post.author;
            const isSelf = post.author === currentUsername;
            const isPostReported = hasReported[post.id];

            if (isPostReported) {
              return (
                <div key={`${post.id}-${idx}`} className="bg-rose-50/40 border border-rose-100 p-5 rounded-3xl text-right transition-all animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 text-rose-800 text-xs font-black justify-end mb-2">
                    <span>🛡️ تم إرسال بلاغكِ بنجاح للمشرفات</span>
                    <ShieldAlert className="w-4 h-4 text-rose-600 animate-bounce" />
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed mb-3">
                    نشكرك على المساهمة في الحفاظ على أمان مجتمعنا البوح السليم. تم إخفاء محتوى المنشور مؤقتاً لمراجعته العاجلة من قبل المديرات والتحقق من اللياقة.
                  </p>
                  <button 
                    onClick={() => setHasReported({...hasReported, [post.id]: false})}
                    className="text-[10px] text-slate-400 underline hover:text-slate-600 font-bold"
                  >
                    تراجع عن الإبلاغ وعرض المنشور 👁️
                  </button>
                </div>
              );
            }

            return (
              <div key={`${post.id}-${idx}`} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:border-plum/20 transition-all duration-300 animate-in fade-in text-right">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-plum/10 to-rose-gold/10 flex items-center justify-center font-bold text-plum text-md border border-plum/10">
                      {isAnonymous ? "🔒" : (post.authorDetails?.avatarEmoji || post.author.charAt(0).toUpperCase())}
                    </div>
                    <div className="text-right">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 justify-end">
                        {!isAnonymous && post.authorDetails && (
                          <span className="text-sm filter drop-shadow">
                            {getFlag(post.authorDetails.country)}
                          </span>
                        )}
                        <span>{isAnonymous ? "هوية مجهولة تماماً" : `@${post.author}`}</span>
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5 justify-end flex-wrap">
                        <span className="text-[10px] text-slate-400">{new Date(post.createdAt).toLocaleDateString("ar-EG")}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">🗺️ مجتمع: {post.country || "الوطن العربي"}</span>
                        {!isAnonymous && post.authorDetails && (
                          <span className="text-[10px] bg-plum/5 text-plum px-2 py-0.5 rounded-full font-bold">
                             الأصل: {getFlag(post.authorDetails.country)} {post.authorDetails.country}
                          </span>
                        )}
                        <span className="text-[10px] bg-rose-gold/15 text-velvet px-2 py-0.5 rounded-full font-bold">{post.category || "عام"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-700 text-sm leading-relaxed mb-4 pl-1">{post.content}</p>
                
                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors bg-slate-50 hover:bg-rose-50 px-3.5 py-2 rounded-xl active:scale-95"
                  >
                    <Heart className={cn("w-4 h-4", post.likes > 0 ? "fill-rose-500 text-rose-500" : "")} />
                    <span>{post.likes > 0 ? post.likes : 'أعجبني'}</span>
                  </button>

                  {/* Private chat inviter trigger, hidden if anonymous or self */}
                  {!isAnonymous && !isSelf && (
                    <button
                      onClick={() => handleSendChatRequest(post.author, post.id)}
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-black transition-all bg-plum/5 hover:bg-plum/10 text-plum px-3.5 py-2 rounded-xl active:scale-95",
                        inviteStatus[post.id] && "bg-emerald-50 text-emerald-700"
                      )}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {inviteStatus[post.id] || "طلب فضفضة خاصة مجهولة"}
                    </button>
                  )}
                  
                  <button 
                    onClick={() => setCommentingId(commentingId === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-plum transition-colors bg-slate-50 hover:bg-plum/5 px-3.5 py-2 rounded-xl active:scale-95"
                  >
                    <Reply className="w-4 h-4 rtl:-scale-x-100" />
                    <span>تعليق ({post.comments?.length || 0})</span>
                  </button>

                  <button 
                    onClick={() => {
                      if (window.confirm("هل أنتِ متأكدة من رغبتكِ في الإبلاغ عن هذا المحتوى للمشرفات لمراجعته؟")) {
                        setHasReported({...hasReported, [post.id]: true});
                      }
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 hover:bg-rose-50 px-2.5 py-2 rounded-xl active:scale-95"
                    title="إبلاغ الإدارة والمديرات لضمان بيئة آمنة"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>إبلاغ 🛡️</span>
                  </button>
                </div>

                {/* Comments Section */}
                {commentingId === post.id && (
                  <div className="mt-4 pt-4 border-t border-slate-50 space-y-3 animate-in fade-in slide-in-from-top-2">
                    {post.comments && post.comments.length > 0 ? (
                      <div className="space-y-2 max-h-[250px] overflow-y-auto pl-1 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                        {post.comments.map((comment: any, idx: number) => (
                          <div key={comment.id || `comment-${idx}`} className="bg-slate-50 p-3 rounded-2xl flex flex-col items-start text-right">
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-100 mb-1.5 inline-block">
                              {comment.authorName === "زائرة مجهولة" ? "مجهولة 🔒" : `@${comment.authorName}`}
                            </span>
                            <p className="text-xs text-slate-700 leading-relaxed pl-1">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-2">لا توجد تعليقات بعد، كوني أول من يدعمها 🌸</p>
                    )}
                    
                    <div className="flex gap-2 items-center mt-2">
                      <input 
                        type="text"
                        placeholder="اكتبِ تعليقاً داعماً في هذا الفضاء الآمن..."
                        className="flex-1 bg-slate-50 border border-slate-100 text-xs text-slate-755 py-2.5 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum"
                        value={commentText[post.id] || ""}
                        onChange={(e) => setCommentText({...commentText, [post.id]: e.target.value})}
                        onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                      />
                      <button 
                        onClick={() => handleComment(post.id)}
                        disabled={!commentText[post.id]?.trim()}
                        className="bg-plum hover:bg-velvet text-white w-9 h-9 rounded-full flex items-center justify-center transition disabled:opacity-50 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5 rtl:-scale-x-100" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Premium Authentication Trigger Modal for Visitors */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-100 shadow-2xl relative text-right animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon decoration */}
            <div className="w-14 h-14 bg-gradient-to-tr from-plum/10 to-rose-gold/10 text-plum rounded-2xl flex items-center justify-center mb-5 border border-plum/10 shadow-sm">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>

            {/* Title & Body */}
            <h3 className="text-lg font-black text-slate-800 mb-2">مطلب دخول سري للمجتمعات 🌸🛡️</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-6">
              {authModalReason || "لتتمكني من فتح كامل خصائص التطبيق والاستمتاع بتجربة بوح ومصارحة متكاملة، يرجى تسجيل الدخول أو إنشاء حساب الآن!"}
            </p>

            {/* Call to Actions */}
            <div className="space-y-2.5">
              <Link 
                to="/register" 
                onClick={() => setShowAuthModal(false)}
                className="w-full bg-plum hover:bg-velvet text-white font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-plum/10 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-rose-gold animate-bounce" />
                <span>إنشاء حساب مستقل بـ 3 ثوانٍ فقط (مجاناً) 🌸</span>
              </Link>
              <Link 
                to="/login"
                onClick={() => setShowAuthModal(false)}
                className="w-full bg-slate-100 text-slate-700 font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition active:scale-95"
              >
                <span>لدي حساب بالفعل، تسجيل الدخول 🚪</span>
              </Link>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="w-full text-center text-[11px] font-bold text-slate-400 hover:text-slate-600 pt-2 transition"
              >
                مواصلة التصفح كـ زائر مجهول 🌐
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
