import { useState, useEffect } from "react";
import { Frown, ThermometerSnowflake, Flame, ArrowRight, UserRound, TrendingUp, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

type Mood = "sad" | "anxious" | "angry" | "lonely" | null;

interface MoodLog {
  date: string;
  moodId: Mood;
  score: number;
}

const getStoredMoods = (): MoodLog[] => {
  try {
    const data = localStorage.getItem("fadfada_mood_logs");
    if (data) return JSON.parse(data);
  } catch (e) {}
  
  // Default mock data representing a month if no data exists
  const mockData: MoodLog[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    // Randomize some data for the example
    const scores = [4, 5, 2, 6, 7, 8, 3, 5, 6, 9];
    const score = scores[i % scores.length] + Math.floor(Math.random() * 2);
    mockData.push({
      date: d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }),
      moodId: "sad", // mock
      score: Math.min(10, Math.max(0, score))
    });
  }
  return mockData;
};

export default function MoodHub() {
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [moodHistory, setMoodHistory] = useState<MoodLog[]>([]);
  const [savedToday, setSavedToday] = useState(false);

  useEffect(() => {
    setMoodHistory(getStoredMoods());
  }, []);

  const moods = [
    {
      id: "sad",
      label: "حزينة ومكسورة",
      icon: Frown,
      score: 3,
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
      score: 4,
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
      score: 2,
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
      score: 5,
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

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId as Mood);
    setSavedToday(false);
  };

  const saveTodayMood = () => {
    if (!selectedMood) return;
    
    const moodObj = moods.find(m => m.id === selectedMood);
    if (!moodObj) return;

    const todayStr = new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
    
    // Check if today already recorded, if so, update it, else add it.
    let currentLogs = [...moodHistory];
    
    // For realism in this demo we assume last log might be today if names match
    if (currentLogs.length > 0 && currentLogs[currentLogs.length - 1].date === todayStr) {
      currentLogs[currentLogs.length - 1] = {
        date: todayStr,
        moodId: selectedMood,
        score: moodObj.score
      };
    } else {
      currentLogs.push({
        date: todayStr,
        moodId: selectedMood,
        score: moodObj.score
      });
    }

    // Keep only last 30 days
    if (currentLogs.length > 30) {
      currentLogs = currentLogs.slice(currentLogs.length - 30);
    }

    setMoodHistory(currentLogs);
    localStorage.setItem("fadfada_mood_logs", JSON.stringify(currentLogs));
    setSavedToday(true);
  };

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
              onClick={() => handleMoodSelect(mood.id)}
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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-12">
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
              <ul className="space-y-3 mb-8">
                {activeContent.routine.map((step, idx) => (
                  <li key={`step-${idx}`} className="flex items-start gap-3 text-slate-600 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <ArrowRight className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0 rtl:hidden" />
                    <ArrowRight className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0 hidden rtl:block rotate-180" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center pt-6 border-t border-slate-100">
                <button
                  onClick={saveTodayMood}
                  disabled={savedToday}
                  className={cn(
                    "px-8 py-3 rounded-full font-bold transition-all inline-flex items-center gap-2",
                    savedToday 
                      ? "bg-emerald-50 text-emerald-600 cursor-not-allowed" 
                      : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md"
                  )}
                >
                  {savedToday ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" /> تم تسجيل شعورك لهذا اليوم بخزانتك السريّة
                    </>
                  ) : "حفظ شعوري في مؤشري الخاص للتحليل"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mood History Chart */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">تطور الحالة المزاجية (30 يوماً)</h2>
            <p className="text-sm text-slate-500">نظرة تحليلية على بياناتك المسجلة خلال الشهر الماضي لتقييم التقدم</p>
          </div>
        </div>
        
        <div className="h-64 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={moodHistory} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} minTickGap={20} />
              <YAxis domain={[0, 10]} hide />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', textAlign: 'right' }}
                labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
                formatter={(value: number) => [`${value}/10`, 'مستوى التحسن المزاجي']}
                labelFormatter={(label) => `تاريخ التسجيل: ${label}`}
              />
              <Area type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}