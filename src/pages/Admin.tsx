import { useState, useEffect } from "react";
import { ShieldAlert, MessageSquareHeart, Clock, Users, MailOpen, Trash2, LayoutDashboard, Globe } from "lucide-react";

export default function Admin() {
  const [stats, setStats] = useState<any>({});
  const [logs, setLogs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "logs" | "users">("dashboard");

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
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto refresh every 30s for live feel
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const deleteLog = async (id: string) => {
    if(!confirm("هل أنت متأكد من حذف هذا السجل؟")) return;
    await fetch(`/api/admin/logs/${id}`, { method: "DELETE" });
    fetchData();
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
              <p className="text-slate-500 text-xs">إدارة المنصة الشاملة</p>
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
              <Globe className="w-5 h-5" /> جلسات الذكاء الاصطناعي
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
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
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
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center justify-between">
              مراقبة جلسات الذكاء الاصطناعي
              <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-medium">مراقبة حية</span>
            </h2>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <div key={log.id} className="p-6 hover:bg-slate-50 transition-colors relative group">
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
                        المعالج (AI) - متعدد اللغات:
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

        {activeTab === "users" && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">حسابات الزوار المسجلة</h2>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(u => (
                <div key={u.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 hover:border-slate-300 transition-colors">
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
