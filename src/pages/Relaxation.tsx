import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Square, Volume2, CloudRain, Waves, Heart, Droplet, Sparkles, RefreshCw, Layers } from "lucide-react";
import { cn } from "../lib/utils";
import GuestLock from "../components/GuestLock";
import { WhatsAppVentCard } from "../components/WhatsAppSupport";

// Affirmations based on selected struggle
const GARDEN_AFFIRMATIONS: Record<string, { advice: string; affirmation: string; flower: string; color: string }> = {
  anxiety: {
    advice: "القلق لا يفرغ الغد من حزنه، بل يفرغ اليوم من قوته. تذكري يا أختي الحبيبة أن الأفكار ليست حقائق مطلقة، وأن هذه العاصفة مجرد غمامة ستعبر بسلام.",
    affirmation: "أنا آمنة تماماً هنا، أتنفس السكينة، وأسمح لقلبي أن يستريح من عبء التفكير المتواصل.",
    flower: "🪷 لوتس السكينة الوردي",
    color: "from-pink-400 to-rose-300"
  },
  grief: {
    advice: "الحزن هو دليل على رهافة وعمق إحساسك ونبل مشاعرك. لا بأس بالبكاء، ولا بأس بالضعف المؤقت. خذي كل ليلة على حدة، فالنور سيشق طريقه عبر هذه التصدعات بالتأكيد.",
    affirmation: "أحتضن حزني بلطف، وأعلم أن روحي برغم الجراح ستتفتح من جديد بكل دفء وقوة.",
    flower: "🌸 ياسمين المواساة الدمشقي",
    color: "from-purple-400 to-fuchsia-300"
  },
  burnout: {
    advice: "التعب الجسدي والروحي يخبركِ اليوم: 'أرجوكِ خذي هدنة'. لستِ مطالبة بإنقاذ العالم اليوم. إتاحة مساحة لنفسكِ دون القيام بأي شيء هو أعمق شكل من أشكال الرعاية والتقدير الذاتي.",
    affirmation: "أحرر نفسي من توقعات المثالية، أستحق الراحة الدافئة، جسدي وروحي أمانة أراعيها الآن بكل حنان.",
    flower: "🌻 بهجة الريحان البري",
    color: "from-amber-400 to-yellow-300"
  },
  stress: {
    advice: "عندما تزدحم المسؤوليات، تذكري أن تقومي بتقسيم الأمور لخطوات متناهية الصغر. لا يحق لأي واجب أو التزام خارجي أن يسلبك بهجتك الداخلية وهدوءك العذب.",
    affirmation: "الهدوء ينساب بداخلي الآن. أتعامل مع يومي خطوة بخطوة، وأثق بذكائي وقدرتي على التجاوز.",
    flower: "🌺 زهرة الأوركيدا الأرجوانية",
    color: "from-indigo-400 to-violet-300"
  }
};

export default function Relaxation() {
  const currentUserId = localStorage.getItem("userId");
  const [activeSubTab, setActiveSubTab] = useState<"breathing" | "garden">("breathing");

  // Breathing & Noise state
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Ready">("Ready");
  const [noiseType, setNoiseType] = useState<"rain" | "waves" | "none">("none");
  const [isPlayingNoise, setIsPlayingNoise] = useState(false);
  
  // Pink Noise Synthesizer (Web Audio API)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Garden game state
  const [selectedStruggle, setSelectedStruggle] = useState<string | null>(null);
  const [gardenStep, setGardenStep] = useState<"choose" | "planting" | "growing" | "bloomed">("choose");
  const [waterCount, setWaterCount] = useState(0);
  const [isWatering, setIsWatering] = useState(false);

  // Synthesize simple pink-ish noise for rain/waves
  const createNoiseBuffer = () => {
    if (!audioCtxRef.current) return;
    const bufferSize = audioCtxRef.current.sampleRate * 2; // 2 seconds
    const buffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
    const output = buffer.getChannelData(0);
    
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; 
        b6 = white * 0.115926;
    }
    return buffer;
  };

  const toggleNoise = (type: "rain" | "waves") => {
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (isPlayingNoise && noiseType === type) {
        gainNodeRef.current?.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
        setTimeout(() => {
            noiseNodeRef.current?.stop();
            setIsPlayingNoise(false);
            setNoiseType("none");
        }, 500);
        return;
    }

    if (isPlayingNoise) {
        setNoiseType(type);
        return;
    }

    const buffer = createNoiseBuffer();
    if (!buffer) return;

    const source = audioCtxRef.current.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = audioCtxRef.current.createBiquadFilter();
    filter.type = type === "rain" ? "lowpass" : "lowshelf";
    filter.frequency.value = type === "rain" ? 1000 : 400;

    const gain = audioCtxRef.current.createGain();
    gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
    gain.gain.setTargetAtTime(0.5, audioCtxRef.current.currentTime, 1); 

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtxRef.current.destination);

    source.start(0);
    noiseNodeRef.current = source;
    gainNodeRef.current = gain;
    
    setNoiseType(type);
    setIsPlayingNoise(true);
  };

  // Breathing Logic (4-7-8)
  useEffect(() => {
    if (!isBreathing) {
      setPhase("Ready");
      return;
    }

    let timer: NodeJS.Timeout;

    const runBreathingCycle = () => {
      setPhase("Inhale"); 
      timer = setTimeout(() => {
        setPhase("Hold"); 
        timer = setTimeout(() => {
          setPhase("Exhale"); 
          timer = setTimeout(() => {
            if (isBreathing) runBreathingCycle();
          }, 8000);
        }, 7000);
      }, 4000);
    };

    runBreathingCycle();

    return () => clearTimeout(timer);
  }, [isBreathing]);

  // Garden interactions
  const startPlanting = (struggle: string) => {
    setSelectedStruggle(struggle);
    setGardenStep("planting");
    setWaterCount(0);
  };

  const handleWaterPlant = () => {
    if (waterCount >= 3) return;
    setIsWatering(true);
    setTimeout(() => {
      setIsWatering(false);
      const newCount = waterCount + 1;
      setWaterCount(newCount);
      if (newCount === 1) {
        setGardenStep("growing");
      } else if (newCount === 3) {
        setTimeout(() => {
          setGardenStep("bloomed");
        }, 800);
      }
    }, 1000);
  };

  const resetGarden = () => {
    setSelectedStruggle(null);
    setGardenStep("choose");
    setWaterCount(0);
  };

  if (!currentUserId) {
    return (
      <GuestLock 
        title="متنفس السكينة والهدوء الروحي 🌸"
        description="استمتعي بتجربة روتين التنفس الموجه ومحاكي الطبيعة التفاعلي لتهدئة ضربات القلب وتخفيف ضغوط يومكِ المتواصلة. هذا النشاط مخصص حصريًا لعضوات المنصة."
        featureBadge="غرفة السكينة المغلقة"
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 flex flex-col items-center">
      
      {/* Tab Selectors */}
      <div className="w-full max-w-md bg-slate-100 p-1.5 rounded-2xl flex gap-1 mb-8 shadow-inner">
        <button
          onClick={() => setActiveSubTab("breathing")}
          className={cn(
            "flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
            activeSubTab === "breathing" ? "bg-white text-slate-800 shadow-md" : "text-slate-500 hover:text-slate-800"
          )}
        >
          <Volume2 className="w-4 h-4" /> تمارين التنفس والأصوات
        </button>
        <button
          onClick={() => setActiveSubTab("garden")}
          className={cn(
            "flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
            activeSubTab === "garden" ? "bg-white text-slate-800 shadow-md" : "text-slate-500 hover:text-slate-800"
          )}
        >
          <Heart className="w-4 h-4 text-emerald-500 fill-current" /> حديقة السكينة الذاتية
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === "breathing" ? (
          <motion.div 
            key="breathing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full flex flex-col items-center"
          >
            <div className="text-center mb-8 mt-2">
              <h1 className="text-3xl font-extrabold text-slate-800 bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">متنفس السكينة</h1>
              <p className="text-slate-500 mt-2 text-sm">تمارين مريحة وجلسات صوتية مصممة للتشويش على القلق واحتواء الضغوط اليومية.</p>
            </div>

            {/* Breathing Visualizer */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-850 w-full max-w-lg rounded-3xl p-8 flex flex-col items-center shadow-xl mb-8 relative overflow-hidden text-center">
              <div className="absolute top-4 right-4 bg-teal-500/10 text-teal-300 border border-teal-500/20 px-3 py-1 rounded-full text-xs font-mono">
                نمط (4-7-8) الطبيعي
              </div>
              
              <div className="h-64 flex items-center justify-center relative mt-6 w-full">
                <AnimatePresence>
                  <motion.div
                    initial={false}
                    animate={{
                      scale: phase === "Inhale" ? 2.5 : phase === "Hold" ? 2.5 : phase === "Exhale" ? 1 : 1,
                      opacity: phase === "Ready" ? 0.3 : 0.7,
                    }}
                    transition={{
                      duration: phase === "Inhale" ? 4 : phase === "Exhale" ? 8 : 1,
                      ease: "easeInOut"
                    }}
                    className="w-24 h-24 rounded-full bg-teal-400 blur-2xl opacity-40 absolute"
                  />
                  <motion.div
                    initial={false}
                    animate={{
                      scale: phase === "Inhale" ? 2.2 : phase === "Hold" ? 2.2 : phase === "Exhale" ? 1 : 1,
                      borderColor: phase === "Hold" ? "rgba(45, 212, 191, 0.9)" : "rgba(45, 212, 191, 0.3)"
                    }}
                    transition={{
                      duration: phase === "Inhale" ? 4 : phase === "Exhale" ? 8 : 1,
                      ease: "easeInOut"
                    }}
                    className="w-24 h-24 rounded-full border-4 border-teal-300 absolute z-10"
                  />
                  <div className="z-20 text-center">
                    <p className="text-2xl font-extrabold text-white mb-2 leading-snug">
                      {phase === "Ready" && "هل أنتِ مستعدة لبدء الهدوء؟"}
                      {phase === "Inhale" && "شهيق من الأنف العذب.."}
                      {phase === "Hold" && "احبسي السكينة داخلكِ.."}
                      {phase === "Exhale" && "ابسمي واطردي التوتر (زفير).."}
                    </p>
                    {phase !== "Ready" && (
                      <p className="text-teal-300 tracking-widest text-sm font-bold">
                        {phase === "Inhale" && "4 ثوان"}
                        {phase === "Hold" && "7 ثوان"}
                        {phase === "Exhale" && "8 ثوان"}
                      </p>
                    )}
                  </div>
                </AnimatePresence>
              </div>

              <button
                onClick={() => setIsBreathing(!isBreathing)}
                className={cn(
                  "mt-6 px-10 py-3.5 rounded-full font-bold flex items-center justify-center gap-2 transition-all active:scale-95 duration-150 z-20 shadow-lg",
                  isBreathing 
                    ? "bg-rose-500/20 text-rose-300 hover:bg-rose-500/35 border border-rose-500/50" 
                    : "bg-teal-500 text-white hover:bg-teal-400 hover:shadow-teal-500/20"
                )}
              >
                {isBreathing ? (
                  <><Square className="w-4 h-4 fill-current" /> إيقاف التمرين والملاحظة</>
                ) : (
                  <><Play className="w-4 h-4 fill-current" /> بدء التنفس الهدوء الآن</>
                )}
              </button>
            </div>

            {/* Nature Sounds */}
            <div className="w-full max-w-lg bg-white p-6 border border-slate-100 shadow-md rounded-2xl">
              <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
                <Volume2 className="w-5 h-5 text-indigo-500" />
                الموجات الصوتية وعازل الضوضاء الخارجية
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => toggleNoise("rain")}
                  className={cn(
                    "p-4 rounded-xl flex flex-col items-center gap-2.5 transition-all duration-300 border active:scale-95",
                    noiseType === "rain" && isPlayingNoise
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                      : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-white"
                  )}
                >
                  <CloudRain className={cn("w-6 h-6", noiseType === "rain" && isPlayingNoise && "animate-bounce text-indigo-500")} />
                  <span className="font-bold text-xs">سقوط المطر الغامر</span>
                </button>
                <button
                  onClick={() => toggleNoise("waves")}
                  className={cn(
                    "p-4 rounded-xl flex flex-col items-center gap-2.5 transition-all duration-300 border active:scale-95",
                    noiseType === "waves" && isPlayingNoise
                      ? "bg-cyan-50 border-cyan-200 text-cyan-700 shadow-sm"
                      : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-white"
                  )}
                >
                  <Waves className={cn("w-6 h-6", noiseType === "waves" && isPlayingNoise && "animate-pulse text-cyan-500")} />
                  <span className="font-bold text-xs">ضربات وتناغم البحر</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 text-center leading-relaxed font-mono">
                ملاحظة: محاكيات الطبيعة نولدها بخلاصة التوليد الذاتي (Web HTML5 Audio) وبشكل مجاني دون باقات إنترنت.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="garden"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-2xl flex flex-col items-center text-center"
          >
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-slate-800 flex items-center justify-center gap-2">
                <Heart className="w-7 h-7 text-rose-500 fill-current" /> حديقة الطمأنينة النفسية
              </h1>
              <p className="text-slate-500 text-sm mt-1">تمرين تفاعلي لتنمية السلام الداخلي وبطاقات الرعاية الإملائية.</p>
            </div>

            {gardenStep === "choose" && (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md w-full">
                <p className="text-slate-700 font-bold mb-6 text-sm">ما هو أكثر شعور يثقل قلبكِ أو يجهدكِ اليوم؟ سنزرع له زهرة وبذرة لنحرره:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button onClick={() => startPlanting("anxiety")} className="p-4 rounded-2xl border border-slate-100 bg-rose-50/40 hover:border-rose-200 text-rose-700 font-bold text-sm transition-all hover:scale-105">
                    😔 نوبات ومخاوف القلق
                  </button>
                  <button onClick={() => startPlanting("grief")} className="p-4 rounded-2xl border border-slate-100 bg-purple-50/40 hover:border-purple-200 text-purple-700 font-bold text-sm transition-all hover:scale-105">
                    🥺 الحزن والوحشة
                  </button>
                  <button onClick={() => startPlanting("burnout")} className="p-4 rounded-2xl border border-slate-100 bg-amber-50/40 hover:border-amber-200 text-amber-700 font-bold text-sm transition-all hover:scale-105">
                    😩 الاحتراق والإنهاك
                  </button>
                  <button onClick={() => startPlanting("stress")} className="p-4 rounded-2xl border border-slate-100 bg-indigo-50/40 hover:border-indigo-200 text-indigo-700 font-bold text-sm transition-all hover:scale-105">
                    😭 كثرة المسؤوليات
                  </button>
                </div>
              </div>
            )}

            {(gardenStep === "planting" || gardenStep === "growing") && selectedStruggle && (
              <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl w-full flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-4 left-4 text-xs bg-white/10 px-3 py-1 rounded-full font-mono text-emerald-300">
                  بذرة مشاعر: {selectedStruggle === "anxiety" ? "القلق" : selectedStruggle === "grief" ? "الحزن" : selectedStruggle === "burnout" ? "الاحتراق" : "الضغوط"}
                </div>

                <div className="w-56 h-56 flex items-end justify-center relative mb-8">
                  <AnimatePresence>
                    {isWatering && (
                      <motion.div 
                        initial={{ opacity: 0, y: -20, scale: 0.5 }}
                        animate={{ opacity: 1, y: 15, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-0 text-cyan-400"
                      >
                        <Droplet className="w-8 h-8 animate-bounce fill-current" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Seed & Plant Visual evolution */}
                  {gardenStep === "planting" && (
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [0.8, 1.1, 0.9] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-10 h-10 bg-amber-600 rounded-full border-2 border-amber-800 shadow-md flex items-center justify-center font-bold text-xs"
                    >
                      🌱
                    </motion.div>
                  )}

                  {gardenStep === "growing" && (
                    <motion.div 
                      initial={{ height: 10 }}
                      animate={{ height: waterCount === 1 ? 55 : 120 }}
                      className="w-4 bg-emerald-500 rounded-full relative flex items-center justify-center"
                    >
                      <div className="absolute -top-4 w-8 h-6 bg-emerald-400 rounded-full blur-[1px]" />
                      <div className="absolute top-4 -right-3 w-6 h-3 bg-emerald-400 rounded-full transform rotate-12" />
                      {waterCount > 1 && (
                        <div className="absolute top-12 -left-3 w-6 h-3 bg-emerald-400 rounded-full transform -rotate-12" />
                      )}
                    </motion.div>
                  )}
                </div>

                <div className="max-w-xs text-center">
                  <p className="text-md font-bold mb-3">
                    {waterCount === 0 && "لقد وضعتِ بذرة السلام في التربة الدافئة. اسقيها لتتحرر تلك المشاعر الصعبة."}
                    {waterCount === 1 && "رائع! البذرة تتنفس الآن بهدوء، أضيفي القليل من الحب والصبر."}
                    {waterCount === 2 && "قاربتِ على الاكتمال! زهرة الارتياح أوشكت أن تتفتح لأجلكِ."}
                  </p>
                  
                  {/* Water counter dots */}
                  <div className="flex justify-center gap-1.5 mb-5 mb-5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={cn("w-3 h-3 rounded-full transition-colors", i <= waterCount ? "bg-cyan-400" : "bg-slate-700")} />
                    ))}
                  </div>

                  <button
                    onClick={handleWaterPlant}
                    disabled={isWatering}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-900 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-md active:scale-95 transition-all duration-150"
                  >
                    <Droplet className="w-5 h-5 fill-current" />
                    {isWatering ? "جاري سقاية البذرة بالحب..." : "اسقي البذرة بالسكينة"}
                  </button>
                </div>
              </div>
            )}

            {gardenStep === "bloomed" && selectedStruggle && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border select-none border-teal-100 p-8 rounded-3xl shadow-xl w-full text-center relative"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                  <Sparkles className="w-7 h-7" />
                </div>

                <div className="text-6xl mb-6 mt-4">
                  {selectedStruggle === "anxiety" ? "🪷" : selectedStruggle === "grief" ? "🌸" : selectedStruggle === "burnout" ? "🌻" : "🌺"}
                </div>

                <h2 className="text-xl font-extrabold text-teal-800 mb-2">تفتحت زهرة: {GARDEN_AFFIRMATIONS[selectedStruggle].flower}!</h2>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 max-w-lg mx-auto mb-6">
                  <p className="text-slate-700 text-sm leading-relaxed mb-4">
                    "{GARDEN_AFFIRMATIONS[selectedStruggle].advice}"
                  </p>
                  <p className="text-teal-700 font-extrabold text-md border-t border-dashed border-teal-200/50 pt-4 px-2">
                    « {GARDEN_AFFIRMATIONS[selectedStruggle].affirmation} »
                  </p>
                </div>

                <div className="flex gap-3 justify-center max-w-md mx-auto">
                  <button onClick={resetGarden} className="flex-1 py-3 px-6 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-extrabold text-xs flex items-center justify-center gap-2 transition-all">
                    <RefreshCw className="w-4 h-4" /> زراعة مشاعر جديدة
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Human Venting Option */}
      <div className="w-full mt-10">
        <WhatsAppVentCard 
          title="هل ما زال القلق يثقل صدرك؟ فضفضي مع شخص حقيقي 🌸"
          description="التنفس والسكينة خطوة ممتازة، لكن التحدث مع إنسانة مستمعة وموثوقة قد يكون الدواء الشافي لقلبك. تواصلي معنا عبر الواتساب بدون تسجيل وبسرية تامة."
          badge="مستمعة حقيقية لمواساتك"
        />
      </div>
    </div>
  );
}
