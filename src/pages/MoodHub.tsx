import { useState } from "react";
import { Frown, ThermometerSnowflake, Flame, ArrowRight, UserRound, TrendingUp } from "lucide-react";
import { cn } from "../lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type Mood = "sad" | "anxious" | "angry" | "lonely" | null;

const moodHistory = [
  { day: 'السبت', moodScore: 3 },
  { day: 'الأحد', moodScore: 4 },
  { day: 'الإثنين', moodScore: 2 },
  { day: 'الثلاثاء', moodScore: 5 },
  { day: 'الأربعاء', moodScore: 7 },
  { day: 'الخميس', moodScore: 6 },
  { day: 'الجمعة', moodScore: 8 },
];

export default function MoodHub() {
  const [selectedMood, setSelectedMood] = useState<Mood>(null);

  const moods = [
    {
      id: "sad",
      label: "حزينة ومكسورة",
      icon: Frown,
      color: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
      content: {
        quote: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
        message: "أعلم أن قلبكِ يعتصر وتأكدي أن الحزن ضيف ثقيل لكنه حتماً سيرحل. ابكي إذا أردتِ، فالبكاء يغسل الروح.",
        routine: [
          "قومي وتوضئي بماء بارد.",
          "اشربي كوباً دافئاً من أوراق النعناع أو اليانسون.",
          "اغمضي عينيك وتنفسي بعمق، ليس مطلوباً منك أي مجهود الآن."
        ]
      }
    },
    {
      id: "anxious",
      label: "قلقة وخائفة",
      icon: ThermometerSnowflake,
      color: "bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100",
      content: {
        quote: "لا تَخَفْ وَلا تَحْزَنْ إِنَّا مُنَجُّوكَ",
        message: "القلق يجعلكِ تظنين أن كل الأبواب مغلقة، لكن الله يملك المفاتيح الخفية. رتبي أفكارك بهدوء وسترين النور.",
        routine: [
          "اذهبي لغرفة الاسترخاء واستمعي لأصوات المطر لمدة 5 دقائق.",
          "مارسي تمرين التنفس (4-7-8) لإبطاء ضربات القلب.",
          "اكتبي مخاوفك في ورقة، ثم قطعيها وارميها."
        ]
      }
    },
    {
      id: "angry",
      label: "مكبوتة وغاضبة",
      icon: Flame,
      color: "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100",
      content: {
        quote: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
        message: "من حقك أن تغضبي حين تُسلب حقوقك، ولكن الغضب يحرق طاقتك الجميلة. لا تردي الإساءة في منتصف الانفعال.",
        routine: [
          "غيري وضعيتك (إذا كنتِ واقفة اجلسي، وإذا جالسة قفي أو تمددي).",
          "اغسلي وجهك ويديكِ بماء بارد فوراً.",
          "استخدمي -خزانة الأسرار- لتفريغ غضبك في رسالة، ثم امسحيها."
        ]
      }
    },
    {
      id: "lonely",
      label: "وحيدة ومشتتة",
      icon: UserRound,
      color: "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100",
      content: {
        quote: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ",
        message: "أنتِ لستِ وحدك، السماء كلها تراكِ وتسمع دبيب خطواتك. كوني صديقة صالحة لنفسك قبل أن تحتاجي للآخرين.",
        routine: [
          "اكتبي 3 نعم صغيرة تملكينها الآن (كوب دافئ، سرير ناعم، صحة).",
          "تصفحي مجتمع الفتيات لقراءة قصص ملهمة من زميلاتك.",
          "احتضني وسادتك بلطف، وابتسمي لنفسك."
        ]
      }
    }
  ];

  const activeContent = moods.find(m => m.id === selectedMood)?.content;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <div className="text-center mb-10 mt-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">مؤشر الوجدان</h1>
        <p className="text-slate-500">بماذا تشعرين الآن؟ اختاري حالتك لنقدم لكِ إسعافات عاطفية فورية.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {moods.map((mood, idx) => {
          const Icon = mood.icon;
          const isActive = selectedMood === mood.id;
          return (
            <button
              key={`mood-${mood.id}-${idx}`}
              onClick={() => setSelectedMood(mood.id as Mood)}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300",
                mood.color,
                isActive ? "scale-105 shadow-md border-opacity-100" : "border-opacity-0 bg-opacity-50 grayscale hover:grayscale-0 cursor-pointer"
              )}
            >
              <Icon className="w-10 h-10 mb-3 stroke-[1.5]" />
              <span className="font-semibold text-sm md:text-base">{mood.label}</span>
            </button>
          );
        })}
      </div>

      {activeContent && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-400 opacity-50" />
            
            <div className="text-center mb-8">
              <p className="text-2xl md:text-3xl font-bold text-indigo-700 leading-relaxed font-serif">
                "{activeContent.quote}"
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
              <p className="text-lg text-slate-700 leading-relaxed text-center">
                {activeContent.message}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">♡</span>
                روتين الإسعاف السريع في هذه اللحظة:
              </h3>
              <ul className="space-y-3">
                {activeContent.routine.map((step, idx) => (
                  <li key={`step-${idx}`} className="flex items-start gap-3 text-slate-600 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <ArrowRight className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0 rtl:hidden" />
                    <ArrowRight className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0 hidden rtl:block rotate-180" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mood History Chart */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">تاريخ تحسن الحالة المزاجية</h2>
            <p className="text-sm text-slate-500">نظرة عامة على تقدمك خلال الأسبوع الماضي</p>
          </div>
        </div>
        
        <div className="h-64 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodHistory} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
              <YAxis domain={[0, 10]} hide />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
                formatter={(value: number) => [`${value}/10`, 'مستوى التحسن']}
              />
              <Line type="monotone" dataKey="moodScore" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}