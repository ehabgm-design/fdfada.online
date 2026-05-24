import { useState, useEffect } from "react";
import { ShieldAlert, MessageSquareHeart, Clock } from "lucide-react";

export default function Admin() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/logs")
      .then(res => res.json())
      .then(data => setLogs(data.ventingLogs || []));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-slate-800 text-white rounded-xl flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">لوحة الإدارة (Admin Panel)</h1>
          <p className="text-slate-500 text-sm">مراقبة النظام وتفاعلات الذكاء الاصطناعي مع الزوار</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center"><MessageSquareHeart className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-slate-500">إجمالي الجلسات المجهولة</p>
            <p className="text-2xl font-bold text-slate-800">{logs.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-slate-700">سجل استشارات الذكاء الاصطناعي</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                <Clock className="w-3 h-3" />
                <span>{new Date(log.createdAt).toLocaleString("ar-EG")}</span>
              </div>
              <div className="mb-3 pl-4 md:pl-10">
                <span className="inline-block bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs mb-2">رسالة الزائر:</span>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">{log.userMessage}</p>
              </div>
              <div className="pl-4 md:pl-10">
                <span className="inline-block bg-teal-50 text-teal-600 px-2 py-1 rounded text-xs mb-2">رد الذكاء الاصطناعي متعدد اللغات:</span>
                <p className="text-sm text-teal-800 bg-teal-50/50 p-3 rounded-lg border border-teal-100/50 leading-relaxed whitespace-pre-wrap">{log.aiResponse}</p>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="p-8 text-center text-slate-500">لا يوجد سجلات بعد.</div>
          )}
        </div>
      </div>
    </div>
  );
}
