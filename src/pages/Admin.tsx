import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, MessageSquareHeart, Clock, Users, MailOpen, Trash2, LayoutDashboard, Globe, Settings, Cpu, Terminal, Copy, Check, Key } from "lucide-react";

export default function Admin() {
  const [stats, setStats] = useState<any>({});
  const [logs, setLogs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "logs" | "users" | "ai-config" | "developer">("dashboard");

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // AI Configuration State
  const [aiConfig, setAiConfig] = useState({
    isAutoEnabled: true,
    contextType: "warm",
    systemPrompt: "",
    temperature: 0.8
  });
  const [aiSaveSuccess, setAiSaveSuccess] = useState(false);

  // Developer Tokens State
  const [tokens, setTokens] = useState<string[]>([]);
  const [copyTokenText, setCopyTokenText] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const statsRes = await fetch("/api/admin/stats");
      setStats(await statsRes.json());
      
      const logsRes = await fetch("/api/admin/logs");
      const logsData = await logsRes.json();
      setLogs(logsData.ventingLogs || []);
      
      const usersRes = await fetch("/api/admin/users");
      const usersData = await usersRes.json();
      setUsers(usersData.users || []);

      // Fetch AI Config
      const aiRes = await fetch("/api/admin/ai-config");
      const aiData = await aiRes.json();
      setAiConfig(aiData);

      // Fetch Developer tokens
      const devRes = await fetch("/api/admin/developer-tokens");
      const devData = await devRes.json();
      setTokens(devData.tokens || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail && userEmail.toLowerCase() === "ehabgm200@gmail.com") {
      setIsAdmin(true);
      fetchData();
      // Auto refresh every 30s for live feel
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white border border-slate-150 rounded-3xl m-8 max-w-xl mx-auto shadow-sm">
        <ShieldAlert className="w-14 h-14 text-rose-500 mb-4 animate-bounce" />
        <h2 className="text-xl font-extrabold text-slate-800 mb-2">منطقة مخصصة للإدارة العليا 🔐</h2>
        <p className="text-slate-550 text-xs mb-6 max-w-md leading-relaxed">
          عذراً، هذه الصفحة الحساسة مخصصة لمدير النظام والمديرة العامة للمنصة فقط لمتابعة إحصائيات فضفضة أونلاين وصيانة خوادم الخدمة والمستشار الذكي.
        </p>
        <Link to="/" className="bg-slate-900 text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-slate-800 transition">
          العودة للرئيسية الآمنة 🌸
        </Link>
      </div>
    );
  }

  const deleteLog = async (id: string) => {
    if(!confirm("هل أنت متأكد من حذف هذا السجل؟")) return;
    await fetch(`/api/admin/logs/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleSaveAIConfig = async () => {
    try {
      const res = await fetch("/api/admin/ai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiConfig)
      });
      if (res.ok) {
        setAiSaveSuccess(true);
        setTimeout(() => setAiSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save AI configuration", err);
    }
  };

  const generateNewToken = async () => {
    try {
      const res = await fetch("/api/admin/developer-tokens", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setTokens([...tokens, data.token]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyToken = (t: string) => {
    navigator.clipboard.writeText(t);
    setCopyTokenText(t);
    setTimeout(() => setCopyTokenText(null), 2000);
  };

  // Tone presets to auto-hydrate prompt builder
  const handleApplyPreset = (vibe: string) => {
    let prompt = "";
    if (vibe === "warm") {
      prompt = `أنتِ مستشارة نفسية ومرافقة وجدانية دافئة، غاية في الرحمة واللطف والمحبة، في منصة "فضفضة بوح أونلاين" المخصصة للسيدات والفتيات من مختلف بقاع الوطن العربي.
مهمتكِ الأولى والقصوى هي أن تستمعي للسيدة أو الفتاة، تفهمي نيتها ومشاعرها العميقة، وتحتويها بكل حب وحنان ودفء فائق، كشقيقة كبرى أو صديقة مقربة. صدّقي مشاعرها، طمئني قلبها، وعبري لها عن الحنان وعن كونها بطلة وقوية.
قوانين الحوار الإنساني والاحتواء العبقري:
1. الاحتواء المطلق والحنان: تحدثي بحرية ودفء تامين دون أي قيود جافة. تذوّقي كل شعور تشاركه معكِ ووفري لها الدعم النفسي، والعاطفي، والزوجي، والإرشادي بخصوصية مطلقة وعفوية بالكامل.
2. الكشف اللغوي التلقائي: افهمي لهجتها (مصرية، خليجية، شامية، مغاربية، إلخ) أو لغتها (عربية، إنجليزية، إلخ) فما أن تدرش معكِ، ردي عليها تلقائياً بذات نغمة وكلمات لهجتها لتبني معها جسراً وجدانياً حميماً لا تشعر فيه بأي فارق بينكِ وبين مستشارة بشرية حقيقية بالكامل.
3. تفادي الجفاف والأكواد والجمود العلمي: ردي بعبارات لطيفة واحتضان لغوي غامر.`;
    } else if (vibe === "direct") {
      prompt = `أنت طبيب نفسي إكلينيكي محترف ومباشر جداً على منصة "فضفضة".
قم بتزويد الفتيات والسيدات بحلول عملية، واضحة وطبية فوراً وتوجيههن للخطوات المناسبة للتعافي دون المبالغة في المجاملات الوجدانية.
سياق الكلام: علمي، صريح، عملي، ومباشر 100%.`;
    } else if (vibe === "sisterly") {
      prompt = `أنتِ الأخت الكبرى الحكيمة والرحومة لجميع زوار فضفضة أونلاين.
خلفيتك مستمدة من الحب العائلي والنصائح الأبوية الصادقة. وجهي الفتاة في القضايا الزوجية، الضغوط المهنية، واكتسبي ثقتها كأقرب الأقرباء إليها.
الأسلوب: حميم، حكيم، رزين، ودافئ للغاية.`;
    }
    setAiConfig({ ...aiConfig, contextType: vibe, systemPrompt: prompt });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-6">
      {/* Admin Sidebar */}
      <div className="md:w-64 shrink-0">
        <div className="sticky top-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">مركز القيادة</h1>
              <p className="text-slate-500 text-xs text-slate-400">إدارة المنصة الشاملة</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === 'dashboard' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <LayoutDashboard className="w-5 h-5" /> نظرة عامة
            </button>
            <button 
              onClick={() => setActiveTab("logs")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === 'logs' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Globe className="w-5 h-5" /> جلسات الفضفضة الحية
            </button>
            <button 
              onClick={() => setActiveTab("ai-config")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === 'ai-config' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Cpu className="w-5 h-5" /> تعديل سلوك الـ AI
            </button>
            <button 
              onClick={() => setActiveTab("developer")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === 'developer' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Terminal className="w-5 h-5" /> بوابة الأندرويد والمطورين
            </button>
            <button 
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Users className="w-5 h-5" /> حسابات الزوار
            </button>
          </nav>
        </div>
      </div>

      {/* Admin Content */}
      <div className="flex-1 min-w-0">
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">إحصائيات المنصة الحية</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-4"><Users className="w-5 h-5" /></div>
                <p className="text-sm text-slate-500 mb-1">المستخدمين المسجلين</p>
                <p className="text-3xl font-black text-slate-800">{stats.usersCount || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4"><MailOpen className="w-5 h-5" /></div>
                <p className="text-sm text-slate-500 mb-1">الرسائل المجهولة</p>
                <p className="text-3xl font-black text-slate-800">{stats.messagesCount || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4"><MessageSquareHeart className="w-5 h-5" /></div>
                <p className="text-sm text-slate-500 mb-1">جلسات الفضفضة (AI)</p>
                <p className="text-3xl font-black text-slate-800">{stats.ventingSessionsCount || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4"><Globe className="w-5 h-5" /></div>
                <p className="text-sm text-slate-500 mb-1">منشورات المجتمع</p>
                <p className="text-3xl font-black text-slate-800">{stats.communityPostsCount || 0}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="animate-in fade-in duration-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center justify-between">
              مراقبة جلسات الذكاء الاصطناعي
              <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-medium">مراقبة حية</span>
            </h2>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in">
              <div className="divide-y divide-slate-100">
                {logs.map((log, idx) => (
                  <div key={`${log.id}-${idx}`} className="p-6 hover:bg-slate-50 transition-colors relative group">
                    <button onClick={() => deleteLog(log.id)} className="absolute top-6 left-6 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.createdAt).toLocaleString("ar-EG")}</span>
                    </div>
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold mb-2">رسالة الزائر:</span>
                      <p className="text-sm text-slate-700 bg-white p-4 rounded-xl border border-slate-200 shadow-sm whitespace-pre-wrap">{log.userMessage}</p>
                    </div>
                    <div>
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 border border-teal-100 rounded-lg text-xs font-bold mb-2">
                        رد المعالج (AI) - المدعوم بالخصائص الوجدانية المخصصة:
                      </span>
                      <p className="text-sm text-slate-700 bg-gradient-to-r from-teal-50/50 to-emerald-50/50 p-4 rounded-xl border border-teal-100/50 whitespace-pre-wrap leading-relaxed shadow-sm">{log.aiResponse}</p>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="p-12 text-center text-slate-500">لا يوجد جلسات مسجلة حالياً.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "ai-config" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b pb-4 mb-2">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">تعديل سلوك الـ AI ومستويات التعاطف</h2>
                <p className="text-xs text-slate-500">تحديد سياق الكلام، حرية الرد ونوع التفاعل الإنساني الدافئ.</p>
              </div>
              
              {/* Auto toggle */}
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700">تفعيل الرد التلقائي</span>
                <button 
                  onClick={() => setAiConfig({ ...aiConfig, isAutoEnabled: !aiConfig.isAutoEnabled })}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${aiConfig.isAutoEnabled ? 'bg-teal-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${aiConfig.isAutoEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Presets setup */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 mb-3">اختر قالب تعاطف سريع:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button 
                  onClick={() => handleApplyPreset("warm")}
                  className={`p-4 rounded-2xl border text-right transition-all ${aiConfig.contextType === 'warm' ? 'border-teal-400 bg-teal-50/20' : 'border-slate-100 hover:bg-slate-50'}`}
                >
                  <p className="font-extrabold text-teal-800 text-sm">🪷 مستشارة دافئة وحانية</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">احتضان تام للمشاعر، مواساة رقيقة، فهم النوايا العميقة، وتقديم الود بالكامل.</p>
                </button>
                <button 
                  onClick={() => handleApplyPreset("sisterly")}
                  className={`p-4 rounded-2xl border text-right transition-all ${aiConfig.contextType === 'sisterly' ? 'border-indigo-400 bg-indigo-50/20' : 'border-slate-100 hover:bg-slate-50'}`}
                >
                  <p className="font-extrabold text-indigo-800 text-sm">🌸 الأخت الكبرى الحكيمة</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">توازن متعقل في إعطاء نصائح زوجية، أسرية، ودعم نفسي مستدام ومحبب.</p>
                </button>
                <button 
                  onClick={() => handleApplyPreset("direct")}
                  className={`p-4 rounded-2xl border text-right transition-all ${aiConfig.contextType === 'direct' ? 'border-amber-400 bg-amber-50/20' : 'border-slate-100 hover:bg-slate-50'}`}
                >
                  <p className="font-extrabold text-amber-800 text-sm">🧪 طبيب نفسي إكلينيكي</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">توجيه مباشر وحلول طبية واضحة للتخلص من الضيق بأسلوب مباشر.</p>
                </button>
              </div>
            </div>

            {/* System Prompt block */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">التوجيه البرمجي الخاص بالذكاء الاصطناعي (System Prompt):</label>
                <textarea 
                  value={aiConfig.systemPrompt}
                  onChange={(e) => setAiConfig({ ...aiConfig, systemPrompt: e.target.value })}
                  rows={9}
                  className="w-full bg-white rounded-2xl border border-slate-200 p-4 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent leading-relaxed"
                  placeholder="أدخل توجيهات سلوك مستشارة الذكاء الاصطناعي هنا للرد بدفء..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex justify-between">
                  <span>درجة حرية الابتكار (Temperature): {aiConfig.temperature}</span>
                  <span className="text-[10px] text-slate-400 font-mono">(0.2 = دقيق جداً وعلمي | 1.0 = متعاطف وشعري للغاية)</span>
                </label>
                <input 
                  type="range" 
                  min="0.2" 
                  max="1.0" 
                  step="0.05"
                  value={aiConfig.temperature}
                  onChange={(e) => setAiConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-teal-600"
                />
              </div>

              {aiSaveSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-xs font-bold animate-pulse text-center">
                  ✓ تم حفظ التغييرات الوجدانية بنجاح وسيتم تطبيقها فوراً على المستشار التلقائي!
                </div>
              )}

              <button 
                onClick={handleSaveAIConfig}
                className="w-full md:w-auto bg-slate-900 text-white font-extrabold px-8 py-3.5 rounded-2xl hover:bg-slate-800 text-xs transition-all shadow-md active:scale-95"
              >
                تطبيق وحفظ سياق الكلام الجديد
              </button>
            </div>
          </div>
        )}

        {activeTab === "developer" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">بوابة مطوري تطبيقات الأندرويد</h2>
              <p className="text-xs text-slate-500 mt-1">توليد الرموز السرية ومستندات الاتصال البرمجي بالكامل لربط تطبيق الأندرويد الخارجي بالمنصة وجعلهما كياناً واحداً.</p>
            </div>

            {/* Token Generator */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-700">رموز الوصول الحالية (Developer Bearer Tokens)</h3>
                  <p className="text-[10px] text-slate-400">استخدم هذه الرموز المعتمدة في رأس طلبات تطبيق الأندرويد.</p>
                </div>
                <button 
                  onClick={generateNewToken}
                  className="bg-indigo-600 text-white hover:bg-indigo-500 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all"
                >
                  توليد رمز اتصال جديد
                </button>
              </div>

              <div className="space-y-2">
                {tokens.map((token, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono text-xs text-slate-800">
                    <span className="truncate max-w-lg">{token}</span>
                    <button 
                      onClick={() => handleCopyToken(token)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                    >
                      {copyTokenText === token ? <Check className="w-4 h-4 text-emerald-500 animate-bounce" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
                {tokens.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">لا توجد رموز اتصال نشطة حتى الآن.</p>
                )}
              </div>
            </div>

            {/* API Integration Manual */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm space-y-4 font-sans text-right">
              <h3 className="text-md font-bold text-teal-400 mb-2 flex items-center gap-2">
                <Key className="w-5 h-5 text-teal-300" /> دليل الربط الشامل بالأندرويد ومحور النشر المبرمج
              </h3>
              
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <p>
                  تستطيع ربط تطبيق الأندرويد عن طريق إرسال منشورات أو تحليلات الإحصائيات الفورية عبر الرابط المعتمد التالي:
                </p>
                
                {/* Endpoint block */}
                <div className="bg-slate-800 p-4 rounded-2xl space-y-2">
                  <p className="text-xs text-white font-bold"><span className="text-emerald-400">POST</span> /api/external/posts</p>
                  <p className="text-[11px] text-slate-350">لإرسال مقالات دعم ومصارحة موثقة مبرمجاً من لوحة خارجية أو لوحة نشر تلقائية بالأندرويد.</p>
                  
                  <div className="border-t border-slate-700/50 pt-2 font-mono text-[10px]">
                    <p className="text-teal-300 font-bold">Headers المطلوب إرسالها:</p>
                    <p className="mt-1">Authorization: Bearer <span className="text-amber-300">[DEVELOPER-TOKEN]</span></p>
                    <p>Content-Type: application/json</p>
                  </div>

                  <div className="font-mono text-[10px] mt-2 text-slate-400">
                    <p className="text-teal-300 font-bold">بنية جسم الطلب (JSON Payload):</p>
                    <pre className="p-2 bg-slate-950/80 rounded-xl mt-1 text-slate-200">
{`{
  "content": "نص الموعظة أو المقال الاستشاري بالكامل هنا",
  "author": "طبيب المنصة الخارجي",
  "category": "الدعم النفسي",
  "country": "الكل"
}`}
                    </pre>
                  </div>
                </div>

                {/* Kotlin code snippet */}
                <div>
                  <h4 className="font-extrabold text-white text-xs mb-2">كود واجهة الأندرويد البرمجية الموصى بها (Kotlin Retrofit):</h4>
                  <pre className="p-4 bg-slate-950/90 text-teal-300 rounded-2xl font-mono text-[10px] overflow-x-auto text-left leading-normal" dir="ltr">
{`// Kotlin File: FadfadaApiService.kt
import retrofit2.http.POST
import retrofit2.http.Header
import retrofit2.http.Body
import retrofit2.Call

data class ExternalPostPayload(
    val content: String,
    val author: String,
    val category: String,
    val country: String
)

data class ExternalPostResponse(
    val success: Boolean,
    val message: String
)

interface FadfadaApiService {
    @POST("/api/external/posts")
    fun publishPost(
        @Header("Authorization") bearerToken: String, // format: "Bearer FADFADA-..."
        @Body payload: ExternalPostPayload
    ): Call<ExternalPostResponse>
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="animate-in fade-in duration-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">حسابات الزوار المسجلة</h2>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((u, idx) => (
                <div key={`${u.id}-${idx}`} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 hover:border-slate-350 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
                      {u.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate" dir="ltr">@{u.username}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{new Date(u.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="col-span-full p-12 text-center text-slate-500">لا يوجد مستخدمين مسجلين بعد.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
