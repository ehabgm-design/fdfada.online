import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Mail, LogOut, Check, Share2, Trash2, MessageSquare, Send, CheckCircle2, ShieldAlert, Clock, UserCheck, User, Settings, Edit, HelpCircle } from "lucide-react";

export default function UserDashboard() {
  const [messages, setMessages] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Double Opt-in Chat States
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  // Friends and connection states
  const [friendsList, setFriendsList] = useState<any[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<any[]>([]);

  // Profile Customization States
  const [profile, setProfile] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editAge, setEditAge] = useState("18 - 25 سنة (شابة يافعة)");
  const [editCountry, setEditCountry] = useState("مصر");
  const [editBio, setEditBio] = useState("");
  const [editAvatarEmoji, setEditAvatarEmoji] = useState("🌸");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const availableEmojis = ["🌸", "🌙", "🦋", "💜", "✨", "⭐", "🍀", "🐱", "🧸", "🍒", "🌻", "🌈", "🎈", "👒"];

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

  const fetchProfile = () => {
    if (!userId) return;
    fetch(`/api/profile/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProfile(data);
          setEditDisplayName(data.displayName || "");
          setEditUsername(data.username || "");
          setEditAge(data.age || "18 - 25 سنة (شابة يافعة)");
          setEditCountry(data.country || "مصر");
          setEditBio(data.bio || "");
          setEditAvatarEmoji(data.avatarEmoji || "🌸");

          // Update local state storage just in case
          localStorage.setItem("username", data.username);
          localStorage.setItem("displayName", data.displayName);
        }
      });
  };

  const handleUpdateProfile = async (e: any) => {
    e.preventDefault();
    if (!editUsername.trim() || !editDisplayName.trim()) {
      setProfileError("يرجى ملء الاسم المستعار وبطاقة المعرف.");
      return;
    }
    setProfileError("");
    setProfileLoading(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          displayName: editDisplayName,
          username: editUsername.toLowerCase().replace(/[^a-z0-9_]/g, ''),
          age: editAge,
          country: editCountry,
          bio: editBio,
          avatarEmoji: editAvatarEmoji
        })
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        localStorage.setItem("username", data.username);
        localStorage.setItem("displayName", data.displayName);
        setShowProfileModal(false);
        setToastMessage("تم حفظ إعدادات ملفك الشخصي بالكامل! 💖🌟");
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        setProfileError(data.error || "خطأ في التحديث، يرجى محاولة اسم مستخدم آخر.");
      }
    } catch(err) {
      setProfileError("تعذر الاتصال بالخادم لتحديث ملفك الشخصي.");
    }
    setProfileLoading(false);
  };

  const fetchMessages = (isPolling = false) => {
    if (!userId) return;
    fetch(`/api/messages/${userId}`)
      .then(res => res.json())
      .then(data => {
        const fetchedMessages = data.messages || [];
        setMessages(prev => {
          if (isPolling && prev.length > 0 && fetchedMessages.length > prev.length) {
            setToastMessage("لديكِ رسالة مصارحة جديدة! 🤫");
            setTimeout(() => setToastMessage(null), 5000);
          }
          return fetchedMessages;
        });
      });
  };

  const fetchChats = () => {
    if (!userId) return;
    fetch(`/api/chats?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setChats(data.chats || []);
      });
  };

  const fetchChatMessages = (chatId: string) => {
    fetch(`/api/chats/${chatId}/messages`)
      .then(res => res.json())
      .then(data => {
        setChatMessages(data.messages || []);
      });
  };

  const fetchFriends = () => {
    if (!userId) return;
    fetch(`/api/friends?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setFriendsList(data.friends || []);
        setIncomingRequests(data.incomingRequests || []);
        setOutgoingRequests(data.outgoingRequests || []);
      })
      .catch(err => console.error("Error fetching friends:", err));
  };

  const handleAcceptDashboardFriend = async (requestId: string) => {
    try {
      const res = await fetch("/api/friends/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action: "accept" })
      });
      if (res.ok) {
        setToastMessage("تم قبول طلب الصداقة! أنتما الآن صديقتان 🌸");
        setTimeout(() => setToastMessage(null), 4000);
        fetchFriends();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectDashboardFriend = async (requestId: string) => {
    try {
      const res = await fetch("/api/friends/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action: "reject" })
      });
      if (res.ok) {
        setToastMessage("تم رفض طلب الصداقة.");
        setTimeout(() => setToastMessage(null), 4000);
        fetchFriends();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartFriendChat = async (friendUsername: string) => {
    try {
      const res = await fetch("/api/chats/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userA: userId, usernameB: friendUsername })
      });
      if (res.ok) {
        setToastMessage("تم فتح نافذة الدردشة السرية والمحمية 🔒!");
        setTimeout(() => setToastMessage(null), 4000);
        fetchChats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Setup main fetches and pollers
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchProfile();
    fetchMessages();
    fetchChats();
    fetchFriends();
    
    const intervalId = setInterval(() => {
      fetchMessages(true);
      fetchChats();
      fetchFriends();
    }, 8000);
    
    return () => clearInterval(intervalId);
  }, [userId, navigate]);

  // Poller for active chat thread
  useEffect(() => {
    if (!selectedChat) return;
    fetchChatMessages(selectedChat.id);
    
    const intervalMsg = setInterval(() => {
      fetchChatMessages(selectedChat.id);
    }, 4000);

    return () => clearInterval(intervalMsg);
  }, [selectedChat]);

  // Auto-scroll chat thread
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const profileLink = `${window.location.origin}/u/${profile?.username || username}`;

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
      copyLink();
    }
  };

  const deleteMessage = async (msgId: string) => {
    if(confirm("هل أنت متأكد من حذف هذه الرسالة؟")) {
      await fetch(`/api/messages/${msgId}`, { method: "DELETE" });
      fetchMessages();
    }
  };

  const handleAcceptChat = async (chatId: string) => {
    try {
      const res = await fetch("/api/chats/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, userId })
      });
      if (res.ok) {
        fetchChats();
        if (selectedChat && selectedChat.id === chatId) {
          const data = await res.json();
          setSelectedChat({ ...selectedChat, acceptedB: true, acceptedA: true });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendChatMessage = async (e: any) => {
    e.preventDefault();
    if (!newChatMessage.trim() || !selectedChat) return;
    try {
      const res = await fetch(`/api/chats/${selectedChat.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: userId,
          text: newChatMessage
        })
      });
      if (res.ok) {
        setNewChatMessage("");
        fetchChatMessages(selectedChat.id);
      } else {
        const errorData = await res.json();
        alert(errorData.error || "فشل إرسال الرسالة");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("displayName");
    localStorage.removeItem("userAge");
    localStorage.removeItem("userCountry");
    navigate("/login");
  };

  if (!username) return null;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 font-sans">
      
      {/* 👑 FULL PROFILE ONBOARDING FOR UN-ONBOARDED USERS */}
      {profile && !profile.isOnboarded && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-10 w-full max-w-2xl border border-slate-100 text-right my-8 max-h-[92vh] overflow-y-auto w-full">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mb-6 mx-auto animate-bounce">
              🌸
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 text-center mb-2">إعداد ملفكِ الشخصي الكامل</h2>
            <p className="text-slate-500 text-sm text-center mb-8 max-w-lg mx-auto">
              أهلاً بكِ في واحة الفتيات الآمنة! 💖 لضمان ملاءمة تجربتك وحفظ سريّة محاوراتك، يرجى كتابة اسمكِ اللطيف واختيار رمزكِ التعبيري المعبر.
            </p>

            {profileError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold p-4 rounded-2xl mb-6 text-center">
                {profileError}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Avatar Emoji picker */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-3 text-center">اختاري أيقونتكِ التعبيرية المعبرة:</label>
                <div className="flex flex-wrap gap-2 justify-center bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  {availableEmojis.map((emoji) => (
                    <button
                      key={`onboard-${emoji}`}
                      type="button"
                      onClick={() => setEditAvatarEmoji(emoji)}
                      className={`text-2xl w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                        editAvatarEmoji === emoji 
                          ? "bg-white border-2 border-teal-500 shadow-md scale-110" 
                          : "bg-transparent grayscale-30 hover:grayscale-0"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-right">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">اسمكِ المستعار (الذي يظهر للجميع)</label>
                  <input
                    type="text"
                    required
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    placeholder="مثال: ياسمين الفاتنة"
                    className="w-full border border-slate-200 rounded-2xl p-3.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">اسم المستخدم المستعار (لاتيني فريد لروابط الصراحة)</label>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="yasmin_safe"
                    className="w-full border border-slate-200 rounded-2xl p-3.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-left text-sm"
                    dir="ltr"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block text-left">رابط صراحتك سيكون: /u/{editUsername || "username"}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-right">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">الفئة العمرية مناسبة لكِ:</label>
                  <select 
                    value={editAge}
                    onChange={e=>setEditAge(e.target.value)}
                    className="w-full border border-slate-200 rounded-2xl p-3.5 bg-slate-50 focus:bg-white text-sm"
                  >
                    <option value="تحت 18 سنة (فتاة مراهقة)">تحت 18 سنة (فتاة مراهقة)</option>
                    <option value="18 - 25 سنة (شابة يافعة)">18 - 25 سنة (شابة يافعة)</option>
                    <option value="26 - 40 سنة (سيدة ناضجة)">26 - 40 سنة (سيدة ناضجة)</option>
                    <option value="فوق 40 سنة (سيدة حكيمة)">فوق 40 سنة (سيدة حكيمة)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">بلد الإقامة أو الانتماء:</label>
                  <select 
                    value={editCountry}
                    onChange={e=>setEditCountry(e.target.value)}
                    className="w-full border border-slate-200 rounded-2xl p-3.5 bg-slate-50 focus:bg-white text-sm"
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

              <div className="text-right">
                <label className="block text-xs font-bold text-slate-700 mb-2">نبذة عنكِ / السيرة الكنفية (اختياري)</label>
                <textarea
                  value={editBio}
                  onChange={e=>setEditBio(e.target.value)}
                  placeholder="مثال: أحب مشاركة السلام والمصارحة بكل رقي وأمان..."
                  rows={2}
                  className="w-full border border-slate-200 rounded-2xl p-3.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-right text-sm"
                />
              </div>

              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full bg-gradient-to-l from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white font-black py-4 px-6 rounded-2xl transition duration-200 shadow-lg shadow-teal-500/10 active:scale-[0.98] disabled:opacity-50"
                >
                  {profileLoading ? "جاري تجهيز حسابكِ الشخصي..." : "ابدئي رحلتكِ الجميلة الآن ✨"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile edit modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-8 w-full max-w-xl border border-slate-100 text-right max-h-[92vh] overflow-y-auto">
            <h2 className="text-xl font-black text-slate-800 mb-2">تعديل الملف الشخصي</h2>
            <p className="text-slate-500 text-xs mb-6">غير معلوماتك، رمزك المفضل، وفئتك العمرية متى شئت بكل خصوصية وأمان.</p>

            {profileError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold p-3 rounded-xl mb-4 text-center">
                {profileError}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 text-center">الرمز التعبيري الممثل:</label>
                <div className="flex flex-wrap gap-1.5 justify-center bg-slate-50 p-3 rounded-2xl border">
                  {availableEmojis.map((emoji) => (
                    <button
                      key={`edit-${emoji}`}
                      type="button"
                      onClick={() => setEditAvatarEmoji(emoji)}
                      className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        editAvatarEmoji === emoji ? "bg-white border-2 border-plum shadow-sm scale-110 font-bold" : "grayscale-30 hover:grayscale-0 hover:scale-105"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">الاسم المستعار (الذي يظهر للجميع)</label>
                  <input
                    type="text"
                    required
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 text-right font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم المستخدم المستعار (لاتيني للروابط)</label>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 text-left font-mono"
                    dir="ltr"
                  />
                  <span className="text-[9px] text-slate-400 mt-0.5 block text-left">/u/{editUsername || "username"}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">العمر والصفة</label>
                  <select 
                    value={editAge}
                    onChange={e=>setEditAge(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-plum/20 text-right"
                  >
                    {localStorage.getItem("userGender") === "male" ? (
                      <>
                        <option value="تحت 18 سنة (شاب يافع مراهق)">تحت 18 سنة (شاب يافع مراهق)</option>
                        <option value="18 - 25 سنة (شاب يافع وطموح)">18 - 25 سنة (شاب يافع وطموح)</option>
                        <option value="26 - 40 سنة (رجل ناضج)">26 - 40 سنة (رجل ناضج)</option>
                        <option value="فوق 40 سنة (رجل حكيم)">فوق 40 سنة (رجل حكيم)</option>
                      </>
                    ) : (
                      <>
                        <option value="تحت 18 سنة (فتاة مراهقة)">تحت 18 سنة (فتاة مراهقة)</option>
                        <option value="18 - 25 سنة (شابة يافعة)">18 - 25 سنة (شابة يافعة)</option>
                        <option value="26 - 40 سنة (سيدة ناضجة)">26 - 40 سنة (سيدة ناضجة)</option>
                        <option value="فوق 40 سنة (سيدة حكيمة)">فوق 40 سنة (سيدة حكيمة)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">البلد</label>
                  <select 
                    value={editCountry}
                    onChange={e=>setEditCountry(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-plum/20 text-right"
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

              <div className="text-right">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">السير الكنفية / النبذة التعريفية الشخصية (اختياري)</label>
                <textarea
                  value={editBio}
                  onChange={e=>setEditBio(e.target.value)}
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 text-right"
                  placeholder="اكتبِ لمحة قصيرة لطيفة تصف روحك..."
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-5 py-2 rounded-xl border border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-2 rounded-xl bg-plum hover:bg-velvet text-white text-xs font-bold disabled:opacity-50 transition active:scale-95"
                >
                  {profileLoading ? "جاري الحفظ..." : "حفظ التعديلات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header greeting area details */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4 text-right">
        <div className="flex flex-col sm:flex-row items-center gap-3 order-2 md:order-1">
          <button 
            onClick={() => setShowProfileModal(true)}
            className="text-slate-600 hover:text-plum hover:bg-plum/5 px-4 py-2 rounded-xl border border-slate-200 hover:border-plum/20 flex items-center gap-1.5 text-xs transition-all font-semibold shadow-sm bg-white"
          >
            <Settings className="w-3.5 h-3.5 text-plum" /> تعديل الملف الكامل
          </button>
          <button 
            onClick={logout} 
            className="text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 flex items-center gap-1.5 text-xs transition-all font-semibold shadow-sm bg-white"
          >
            <LogOut className="w-3.5 h-3.5 rtl:rotate-180" /> تسجيل خروج
          </button>
        </div>

        <div className="order-1 md:order-2 flex flex-col items-end gap-2">
          <div className="flex items-center gap-4 bg-white p-3 pr-5 pl-4 rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-right">
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-1.5 justify-end">
                {localStorage.getItem("userGender") === "male" ? "أهلاً بكَ، " : "أهلاً بكِ، "}{profile?.displayName || username}
                {profile?.subscriptionType === 'diamond' && <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">💎 ماسي</span>}
                {profile?.subscriptionType === 'golden' && <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full font-black">👑 ذهبي</span>}
              </h1>
              <p className="text-slate-400 flex items-center justify-end gap-1.5 mt-0.5 text-xs">
                <span className="font-mono">@{profile?.username || username}</span> • 
                <span className="text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> نشط وجاهز
                </span>
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-gold/10 to-plum/5 border border-plum/10 flex items-center justify-center text-3xl shadow-sm hover:rotate-6 transition-transform">
              {profile?.avatarEmoji || "🌸"}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {profile?.coins !== undefined && (
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 cursor-default">
                رصيدك: {profile.coins} كوينز
              </span>
            )}
            <button
               onClick={() => navigate('/store')} 
               className="bg-plum/5 text-plum hover:bg-plum/10 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1 transition-colors"
            >
              شحن الرصيد / ترقية الاشتراك
            </button>
          </div>
        </div>
      </div>

      {/* Share Box */}
      <div className="bg-gradient-to-tr from-plum via-velvet to-rose-gold rounded-3xl p-8 md:p-10 text-white mb-10 shadow-xl relative overflow-hidden text-right">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="flex-1 text-center md:text-right">
            <h2 className="text-3xl font-black mb-3">
              {localStorage.getItem("userGender") === "male" ? "شارك رابطك السري!" : "شاركي رابطكِ السري!"}
            </h2>
            <p className="text-rose-100 mb-8 max-w-xl leading-relaxed text-sm md:text-base opacity-95 mx-auto md:mx-0 font-medium">
              {localStorage.getItem("userGender") === "male" 
                ? "انسخ الرابط وشاركه في حالات الواتساب، انستغرام أو فيسبوك، واستقبل رسائل المصارحة المجهولة والفضفضة دون تطفل ومعرفة الهوية في سرية مجهولة مطلقة!"
                : "انسخي الرابط وشاركي صديقاتكِ في حالات الواتساب، انستغرام أو فيسبوك، واستقبلي رسائل المصارحة المجهولة والفضفضة دون تطفل ومعرفة الهوية في سرية مجهولة مطلقة!"}
            </p>
            
            <div className="flex flex-col sm:flex-row-reverse items-stretch sm:items-center gap-3">
              <div className="flex flex-1 items-center bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-inner">
                <input 
                  type="text" 
                  readOnly 
                  value={profileLink} 
                  className="bg-transparent text-white w-full px-3 focus:outline-none text-center font-mono text-sm tracking-tight"
                  dir="ltr"
                />
              </div>
              <div className="flex gap-2 shrink-0 justify-center">
                <button 
                  onClick={copyLink}
                  className="bg-white/20 hover:bg-white text-white hover:text-plum backdrop-blur-md px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm text-sm"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? "تم النسخ!" : "نسخ الرابط"}
                </button>
                <button 
                  onClick={shareNative}
                  className="bg-velvet hover:bg-plum/90 text-white px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md text-sm"
                >
                  <Share2 className="w-5 h-5" />
                  مشاركة فورية
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Friends & Connections Block */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 mb-10 shadow-sm text-right">
        <h3 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center justify-end gap-2">
          <span>دليل صديقاتي وشبكة التواصل الآمن 🤝</span>
        </h3>

        {/* Incoming Friend requests alert */}
        {incomingRequests.length > 0 && (
          <div className="mb-6 bg-gradient-to-l from-indigo-50/50 to-rose-50/50 border border-indigo-100/50 rounded-2xl p-4">
            <h4 className="text-xs font-black text-indigo-800 mb-3 flex items-center justify-end gap-1">
              <span>لديكِ طلبات مصادقة جديدة من شقيقاتكِ بالمنصة:</span>
            </h4>
            <div className="space-y-3">
              {incomingRequests.map((req) => (
                <div key={req.id} className="flex flex-col sm:flex-row-reverse items-center justify-between bg-white/85 p-3 rounded-xl border border-indigo-100/30 gap-3">
                  <div className="flex items-center gap-3.5 flex-row-reverse">
                    <span className="text-3xl">{req.senderAvatar || "🌸"}</span>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-800">{req.senderDisplayName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">@{req.senderUsername}</p>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full mt-1">
                        <span>{getFlag(req.senderCountry)}</span>
                        <span>{req.senderCountry}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptDashboardFriend(req.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2 rounded-xl transition shadow-sm active:scale-95"
                    >
                      قبول الطلب ✅
                    </button>
                    <button
                      onClick={() => handleRejectDashboardFriend(req.id)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-3 py-2 rounded-xl transition active:scale-95"
                    >
                      تجاهل ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends grid list */}
        {friendsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {friendsList.map((friend) => (
              <div key={friend.id} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center transition duration-300 relative group">
                <div className="relative">
                  <span className="text-4xl block mb-2">{friend.avatarEmoji || "🌸"}</span>
                  <span className="absolute bottom-1 right-0 text-lg filter drop-shadow">
                    {getFlag(friend.country)}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{friend.displayName}</h4>
                <p className="text-[10px] text-slate-400 font-mono tracking-tight mb-3">@{friend.username}</p>
                
                <button
                  onClick={() => handleStartFriendChat(friend.username)}
                  className="mt-auto w-full bg-slate-900 hover:bg-indigo-700 text-white text-[10px] font-bold py-2 rounded-xl transition duration-300"
                >
                  دردشة سرية 💬
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            لا توجد صديقات معتمدات بعد. توجهي إلى <strong>"دليل العضوات والصديقات"</strong> بأعلى لتكتشفي الفتيات المتاحات بالمنصة وتضيفيهن لصديقاتكِ 🌸✨
          </div>
        )}
      </div>

      {/* Grid: Columns of messages vs double opt-in chats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RIGHT COLUMN: Double Opt-in Conversations (2 Cols on desktop) */}
        <div className="lg:col-span-2 space-y-6 text-right">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 justify-end">
            <MessageSquare className="w-6 h-6 text-teal-600" /> فضفضة مغلقة ثنائية (الموافقة المزدوجة)
            <span className="bg-teal-100 text-teal-800 text-xs px-2 py-0.5 rounded-full font-bold">نشط</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-sm min-h-[480px]">
            {/* Rooms sidebar */}
            <div className="md:col-span-2 border-l border-slate-100 bg-slate-50/50 p-4 space-y-2 max-h-[500px] overflow-y-auto">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">طلبات ومحادثات الدردشة:</span>
              
              {chats.map((c, idx) => {
                const isAcceptPending = (c.userB === userId && !c.acceptedB) || (c.userA === userId && !c.acceptedA);
                const isWaitingOther = (c.userA === userId && !c.acceptedB) || (c.userB === userId && !c.acceptedA);
                
                return (
                  <button
                    key={`${c.id || 'chat'}-${idx}`}
                    onClick={() => setSelectedChat(c)}
                    className={`w-full p-3.5 rounded-xl border text-right transition-all flex flex-col gap-1 ${
                      selectedChat && selectedChat.id === c.id 
                        ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                        : "bg-white border-slate-100 hover:border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isAcceptPending 
                          ? "bg-amber-100 text-amber-800" 
                          : isWaitingOther 
                            ? "bg-slate-100 text-slate-500" 
                            : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {isAcceptPending ? "يريد محادثتكِ ⚠️" : isWaitingOther ? "بانتظار الموافقة ⏳" : "مفتوحة 💬"}
                      </span>
                      <span className="font-extrabold text-xs truncate">@{c.otherUsername}</span>
                    </div>
                    <p className={`text-[11px] truncate w-full ${selectedChat && selectedChat.id === c.id ? 'text-slate-300' : 'text-slate-400'}`}>
                      {c.lastMessage || "بدء تواصل آمن..."}
                    </p>
                  </button>
                );
              })}

              {chats.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-400 leading-relaxed px-4">
                  لا توجد محادثات خاصة بعد. اذهبي إلى "رواق المصارحة" وانقري فوق 
                  <strong> "طلب فضفضة خاصة مجهولة" </strong> 
                  على منشورات الآخرين لبدء الاتصال التعاطفي! ⭐
                </div>
              )}
            </div>

            {/* Chat conversation area */}
            <div className="md:col-span-3 flex flex-col h-[500px]">
              {selectedChat ? (
                <>
                  {/* Chat header */}
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <span className="text-[10px] text-slate-400 font-mono">
                      تشفير ثنائي 100%
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-1">
                      فضفضة مع @{selectedChat.otherUsername} 🔒
                    </h4>
                  </div>

                  {/* Accept Banner if pending */}
                  {((selectedChat.userB === userId && !selectedChat.acceptedB) || (selectedChat.userA === userId && !selectedChat.acceptedA)) ? (
                    <div className="p-6 text-center bg-amber-50/50 border-b border-amber-100/50 flex-1 flex flex-col items-center justify-center gap-3">
                      <ShieldAlert className="w-8 h-8 text-amber-600" />
                      <p className="text-xs text-slate-700 font-bold leading-relaxed max-w-xs">
                        يرغب العضو @{selectedChat.otherUsername} ببدء محادثة آمنة ومجهولة معكِ. نضمن حماية هويتك تماماً.
                      </p>
                      <button 
                        onClick={() => handleAcceptChat(selectedChat.id)}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
                      >
                        <UserCheck className="w-4 h-4" />
                        قبول المحادثة وموافقة مزدوجة
                      </button>
                    </div>
                  ) : (selectedChat.userA === userId && !selectedChat.acceptedB) || (selectedChat.userB === userId && !selectedChat.acceptedA) ? (
                    <div className="p-6 text-center bg-slate-50 flex-1 flex flex-col items-center justify-center gap-3">
                      <Clock className="w-8 h-8 text-slate-400 animate-pulse" />
                      <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-xs">
                        تم إرسال طلب المحادثة بنجاح. نحن بانتظار موافقة الطرف الآخر مزدوجة الطرفين لفك قفل الدردشة.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Message Thread */}
                      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                        {chatMessages.map((m, idx) => {
                          const isMe = m.senderId === userId;
                          return (
                            <div key={`${m.id}-${idx}`} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                              <div className={`p-3 max-w-[80%] rounded-2xl text-xs leading-relaxed shadow-sm ${
                                isMe 
                                  ? "bg-slate-900 text-white rounded-br-none" 
                                  : "bg-white border text-slate-800 rounded-bl-none"
                              }`}>
                                <p className="whitespace-pre-wrap">{m.text}</p>
                                <span className={`text-[8px] block mt-1 font-mono text-left ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                                  {new Date(m.createdAt).toLocaleTimeString("ar-EG", { hour: "numeric", minute: "2-digit" })}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        {chatMessages.length === 0 && (
                          <p className="text-center text-[11px] text-slate-400 mt-12">ابدئي المحادثة بكلمة طيبة 🌸</p>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Chat input form */}
                      <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2">
                        <button 
                          type="submit" 
                          disabled={!newChatMessage.trim()}
                          className="bg-indigo-600 disabled:opacity-50 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition-all active:scale-95 shrink-0"
                        >
                          <Send className="w-4 h-4 rtl:-scale-x-100" />
                        </button>
                        <input
                          type="text"
                          value={newChatMessage}
                          onChange={(e) => setNewChatMessage(e.target.value)}
                          placeholder="اكتبي فضفضتكِ الثنائية والآمنة..."
                          className="flex-1 border border-slate-200 rounded-xl px-4 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-right font-sans"
                        />
                      </form>
                    </>
                  )}
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                  <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
                  <p className="text-xs leading-relaxed max-w-sm font-medium">
                    انقري فوق أي محادثة في القائمة الجانبية لبدء التبادل الوجداني أو قبول الطلبات المعلقة.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LEFT COLUMN: Anonymous Mailbox (1 Col on Desktop) */}
        <div className="space-y-6 text-right">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 justify-end">
            <Mail className="w-6 h-6 text-indigo-500" /> صندوق الفضفضة والمصارحة
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-0.5 rounded-full font-black">{messages.length}</span>
          </h3>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h4 className="text-sm text-slate-700 font-bold mb-1">الصندوق فارغ تماماً</h4>
                <p className="text-slate-400 text-[11px] max-w-xs mx-auto leading-relaxed">
                  شاركي الرابط بأعلى لتستقبلي رسائل مصارحة مجهولة دون معرفة الناشر.
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isOfficial = msg.message && (msg.message.includes("إدارة \"فضفضة أونلاين\"") || msg.message.includes("عائلة إدارة"));
                return (
                  <div 
                    key={`${msg.id}-${idx}`} 
                    className={`p-5 rounded-3xl border relative group flex flex-col transition-all ${
                      isOfficial 
                        ? "bg-rose-50/20 border-pink-200/60 shadow-md shadow-pink-100/30 hover:border-pink-300" 
                        : "bg-white border-slate-100 shadow-sm hover:border-indigo-100"
                    }`}
                  >
                    <button 
                      onClick={() => deleteMessage(msg.id)}
                      className="absolute top-4 left-4 p-1.5 bg-slate-50 text-slate-400 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-100 hover:text-rose-500 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <p className={`text-xs leading-relaxed mb-4 whitespace-pre-wrap ${isOfficial ? "text-slate-800 font-medium" : "text-slate-700"}`}>
                      {msg.message}
                    </p>
                    
                    <div className="flex items-center justify-between text-[10px] text-slate-450 border-t border-slate-50 pt-2 font-mono">
                      {isOfficial ? (
                        <span className="text-pink-600 font-bold text-[9px] bg-pink-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          👑 ترحيب رسمي آمن
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold text-[9px] bg-slate-50 px-2 py-0.5 rounded-md">
                          🔒 مجهول
                        </span>
                      )}
                      <span>{new Date(msg.createdAt).toLocaleDateString("ar-EG")}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 md:bottom-10 bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50 whitespace-nowrap">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm drop-shadow-md">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
