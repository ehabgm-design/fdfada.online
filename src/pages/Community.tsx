import { LockKeyhole, HeartPulse, UserRoundCheck } from "lucide-react";

export default function Community() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-8 relative">
        <LockKeyhole className="w-10 h-10" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
          <UserRoundCheck className="w-4 h-4 text-emerald-500" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-slate-800 mb-4 text-center">مجتمع الفتيات الموثق</h1>
      <p className="text-lg text-slate-600 text-center max-w-lg leading-relaxed mb-8">
        هذا القسم مخصص للتعارف الراقي والدعم المتبادل بين الفتيات فقط. للحفاظ على بيئة آمنة وخالية من المتطفلين، يتطلب هذا القسم تسجيلاً وموافقة مسبقة.
      </p>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm w-full max-w-lg">
        <h3 className="font-bold text-slate-800 mb-4 text-center">مميزات المجتمع:</h3>
        <ul className="space-y-4">
          <li className="flex items-center gap-3 text-slate-600">
            <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">1</span>
            ملفات شخصية مبسطة (بدون صور فاضحة).
          </li>
          <li className="flex items-center gap-3 text-slate-600">
            <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">2</span>
            مشاركة الاهتمامات وتبادل الخبرات الحياتية.
          </li>
          <li className="flex items-center gap-3 text-slate-600">
            <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">3</span>
            بيئة محكمة لمنع التجاوزات وضمان الخصوصية الثقة الصفرية (Zero-Trust).
          </li>
        </ul>

        <div className="mt-10">
          <button className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-amber-600 transition-colors opacity-50 cursor-not-allowed">
            الاشتراك مغلق مؤقتاً
          </button>
          <p className="text-center text-xs text-slate-400 mt-3">سيتاح باب الانضمام قريباً..</p>
        </div>
      </div>
    </div>
  );
}
