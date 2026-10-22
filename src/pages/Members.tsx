import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Search, MapPin, Send, UserPlus, UserCheck, Check, Clock, UserCheck2 } from "lucide-react";
import GuestLock from "../components/GuestLock";

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

export default function Members() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Connection states
  const [friends, setFriends] = useState<any[]>([]);
  const [incoming, setIncoming] = useState<any[]>([]);
  const [outgoing, setOutgoing] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const currentUserId = localStorage.getItem("userId");
  const currentUsername = localStorage.getItem("username");

  useEffect(() => {
    document.title = "دليل العضوات والصديقات | فضفضة أونلاين";
    fetchMembersAndConnections();
  }, []);

  const fetchMembersAndConnections = async () => {
    setLoading(true);
    try {
      // 1. Fetch community users
      const resUsers = await fetch("/api/users/explore");
      const dataUsers = await resUsers.json();
      if (resUsers.ok) {
        setUsers(dataUsers.users || []);
      }

      // 2. Fetch friend relations if logged in
      if (currentUserId) {
        const resFriends = await fetch(`/api/friends?userId=${currentUserId}`);
        const dataFriends = await resFriends.json();
        if (resFriends.ok) {
          setFriends(dataFriends.friends || []);
          setIncoming(dataFriends.incomingRequests || []);
          setOutgoing(dataFriends.outgoingRequests || []);
        }
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddFriend = async (targetUsername: string) => {
    if (!currentUserId) {
      alert("يرجى تسجيل الدخول لتتمكني من تكوين صداقات وإرسال طلبات التواصل الآمنة 💕");
      return;
    }
    setActionLoading(targetUsername);
    try {
      const res = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: currentUserId, targetUsername })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "تم إرسال طلب الصداقة بنجاح 🌸");
        // refresh
        await fetchMembersAndConnections();
      } else {
        alert(data.error || "فشل إرسال طلب الصداقة");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ ما");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAcceptFriend = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      const res = await fetch("/api/friends/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action: "accept" })
      });
      const data = await res.json();
      if (res.ok) {
        alert("أصبحتما الآن صديقتان! يمكنكما مواصلة الكلام بخصوصية تامة 🎈");
        await fetchMembersAndConnections();
      } else {
        alert(data.error || "فشل قبول الفضفضة");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username !== currentUsername && (
      (u.displayName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.country || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Helper to determine friendship status of a user
  const getRelationState = (user: any) => {
    if (friends.some(f => f.username === user.username)) {
      return { status: "friend", label: "صديقتكِ الحالية 🌸" };
    }
    const incomingReq = incoming.find(i => i.senderUsername === user.username);
    if (incomingReq) {
      return { status: "incoming", label: "تريد مصادقتكِ", requestId: incomingReq.id };
    }
    if (outgoing.some(o => o.receiverUsername === user.username)) {
      return { status: "outgoing", label: "طلب معلق..." };
    }
    return { status: "none", label: "إضافة لصديقاتي 🤝" };
  };

  if (!currentUserId) {
    return (
      <GuestLock 
        title="دليل شقيقات وعضوات فضفضة أونلاين 🌸"
        description="هذا القسم مخصص حصريًا للتواصل الوجداني المباشر والتعارف الآمن بين العضوات والفتيات بالبلدان العربية بخصوصية تامة. سجلي دخولكِ الآن لتصفح رفيقاتك وتفعيل ميزة طلبات المصادقة."
        featureBadge="دليل العضوات المشفر"
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 font-sans">
      <div className="text-center mb-8 shrink-0">
        <div className="w-16 h-16 bg-gradient-to-tr from-rose-100 to-indigo-100 text-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm animate-pulse">
          <Users className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-l from-indigo-700 to-rose-600 bg-clip-text text-transparent mb-2">دليل العضوات والصديقات</h1>
        <p className="text-slate-500 text-sm">مجتمع من السيدات والفتيات المستعدات للتواصل والدعم المتبادل وتحقيق شروط الصداقة الحقيقية والآمنة.</p>
      </div>

      {/* Guest Invitation Widget */}
      {!currentUserId && (
        <div className="bg-gradient-to-tr from-indigo-500/10 via-pink-500/5 to-rose-500/10 border border-indigo-100/40 p-6 rounded-3xl text-right mb-8 animate-in fade-in max-w-3xl mx-auto">
          <p className="font-extrabold text-sm text-slate-800 mb-2 flex items-center gap-1.5 justify-end">
            <span>التواصل المباشر مع رفيقاتكِ يتطلب حساب عضوية آمنة 🔐🌸</span>
          </p>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            تستكشفين حالياً شقيقات الوطن العربي المستعدات للتواصل بصفة زائرة مجهولة. لتتمكني من إضافة أي صديقة لقائمتكِ الخاصة، أو إرسال طلبات فضفضة سرية وسريرية، أو تلقي رسائل مجهولة، بادري بعضوية المنصة الآن مجاناً!
          </p>
          <div className="flex gap-2 justify-end">
            <Link to="/login" className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-extrabold text-xs px-5 py-2.5 rounded-xl transition active:scale-95 shadow-sm">
              تسجيل الدخول 🚪
            </Link>
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-505 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-sm transition active:scale-95">
              عضوية سريّة جديدة 🌸
            </Link>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="relative max-w-lg mx-auto">
          <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="ابحثي بالاسم، أو المعرّف، أو البلد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-full py-4 pr-12 pl-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm text-right"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
          {filteredUsers.length === 0 ? (
            <div className="col-span-full p-12 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
              لا توجد نتائج مطابقة لبحثكِ. أو ربما لم يقم أحد بالتسجيل بعد!
            </div>
          ) : (
            filteredUsers.map(user => {
              const relation = getRelationState(user);
              return (
                <div key={user.username} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-50 to-indigo-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-tr from-indigo-50 to-rose-50 flex items-center justify-center text-3xl mb-4 border border-indigo-100/50 shadow-sm group-hover:scale-105 transition-transform duration-300">
                        {user.avatarEmoji || "🌸"}
                      </div>
                      <span className="absolute bottom-2 right-0 text-xl filter drop-shadow">
                        {getFlag(user.country)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800 truncate px-2 max-w-full mb-0.5">
                      {user.displayName || user.username}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono tracking-tight mb-2" dir="ltr">@{user.username}</span>
                    
                    {user.country && (
                      <span className="flex items-center gap-1 text-[10px] bg-slate-50 text-slate-500 px-2.5 py-1 rounded-full font-bold mb-4">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        {user.country}
                      </span>
                    )}
                    
                    <p className="text-xs text-slate-500 text-center line-clamp-2 h-8 mb-6 overflow-hidden leading-relaxed">
                      {user.bio || "عضوة في مجتمع فضفضة أونلاين الراقي والمحمي..."}
                    </p>
                    
                    <div className="w-full space-y-2">
                      {/* Send friend requests or handle pending state */}
                      {relation.status === "friend" && (
                        <div className="w-full text-center py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                          <Check className="w-4 h-4" />
                          <span>صديقتكِ المقرّبة 🌸</span>
                        </div>
                      )}

                      {relation.status === "outgoing" && (
                        <div className="w-full text-center py-2 bg-slate-50 text-slate-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-slate-100">
                          <Clock className="w-4 h-4 text-slate-300" />
                          <span>بانتظار قبولها ⏳</span>
                        </div>
                      )}

                      {relation.status === "incoming" && (
                        <button
                          onClick={() => handleAcceptFriend(relation.requestId!)}
                          disabled={actionLoading === relation.requestId}
                          className="w-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold py-2.5 rounded-xl flex justify-center items-center gap-1.5 transition-all shadow-sm active:scale-95"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>قبول طلب الصداقة ✅</span>
                        </button>
                      )}

                      {relation.status === "none" && (
                        <button
                          onClick={() => handleAddFriend(user.username)}
                          disabled={actionLoading === user.username}
                          className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold py-2.5 rounded-xl flex justify-center items-center gap-1.5 transition-all active:scale-95 border border-indigo-100"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>إضافة لصديقاتي 🤝</span>
                        </button>
                      )}

                      {/* Sarahah Msg */}
                      <Link 
                        to={`/u/${user.username}`}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl flex justify-center items-center gap-1.5 transition-all hover:shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5 rtl:-scale-x-100" /> فضفضة مجهولة
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
