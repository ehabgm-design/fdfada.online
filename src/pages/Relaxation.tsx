import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Square, Volume2, CloudRain, Waves } from "lucide-react";
import { cn } from "../lib/utils";

export default function Relaxation() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Ready">("Ready");
  const [noiseType, setNoiseType] = useState<"rain" | "waves" | "none">("none");
  const [isPlayingNoise, setIsPlayingNoise] = useState(false);
  
  // Pink Noise Synthesizer (Web Audio API)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

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
        output[i] *= 0.11; // (roughly) compensate for gain
        b6 = white * 0.115926;
    }
    return buffer;
  };

  const toggleNoise = (type: "rain" | "waves") => {
    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (isPlayingNoise && noiseType === type) {
        // Stop current
        gainNodeRef.current?.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
        setTimeout(() => {
            noiseNodeRef.current?.stop();
            setIsPlayingNoise(false);
            setNoiseType("none");
        }, 500);
        return;
    }

    if (isPlayingNoise) {
        // Switch type, just change state and keep playing
        setNoiseType(type);
        return;
    }

    // Start playing
    const buffer = createNoiseBuffer();
    if (!buffer) return;

    const source = audioCtxRef.current.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Filter simulating rain or waves
    const filter = audioCtxRef.current.createBiquadFilter();
    filter.type = type === "rain" ? "lowpass" : "lowshelf";
    filter.frequency.value = type === "rain" ? 1000 : 400;

    const gain = audioCtxRef.current.createGain();
    gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
    gain.gain.setTargetAtTime(0.5, audioCtxRef.current.currentTime, 1); // Fade in

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
      setPhase("Inhale"); // 4s
      timer = setTimeout(() => {
        setPhase("Hold"); // 7s
        timer = setTimeout(() => {
          setPhase("Exhale"); // 8s
          timer = setTimeout(() => {
            if (isBreathing) runBreathingCycle();
          }, 8000);
        }, 7000);
      }, 4000);
    };

    runBreathingCycle();

    return () => clearTimeout(timer);
  }, [isBreathing]);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 flex flex-col items-center">
      <div className="text-center mb-12 mt-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">متنفس السكينة</h1>
        <p className="text-slate-500">تمارين استرخاء وأصوات طبيعية للتشويش على القلق.</p>
      </div>

      {/* Breathing Visualizer */}
      <div className="bg-slate-800 w-full max-w-md rounded-3xl p-10 flex flex-col items-center shadow-xl mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-700/50 to-transparent pointer-events-none" />
        
        <div className="h-64 flex items-center justify-center relative mt-4">
          <AnimatePresence>
            <motion.div
              initial={false}
              animate={{
                scale: phase === "Inhale" ? 2.5 : phase === "Hold" ? 2.5 : phase === "Exhale" ? 1 : 1,
                opacity: phase === "Ready" ? 0.5 : 0.8,
              }}
              transition={{
                duration: phase === "Inhale" ? 4 : phase === "Exhale" ? 8 : 1,
                ease: "easeInOut"
              }}
              className="w-24 h-24 rounded-full bg-teal-400 blur-xl opacity-50 absolute"
            />
            <motion.div
              initial={false}
              animate={{
                scale: phase === "Inhale" ? 2.3 : phase === "Hold" ? 2.3 : phase === "Exhale" ? 1 : 1,
                borderColor: phase === "Hold" ? "rgba(45, 212, 191, 0.8)" : "rgba(45, 212, 191, 0.3)"
              }}
              transition={{
                duration: phase === "Inhale" ? 4 : phase === "Exhale" ? 8 : 1,
                ease: "easeInOut"
              }}
              className="w-24 h-24 rounded-full border-2 border-teal-300 absolute z-10"
            />
            <div className="z-20 text-center">
              <p className="text-2xl font-bold text-white mb-1">
                {phase === "Ready" && "مستعدة؟"}
                {phase === "Inhale" && "شهيق من الأنف.."}
                {phase === "Hold" && "اكتمي النفس بلطف.."}
                {phase === "Exhale" && "زفير ببطء من الفم.."}
              </p>
              {phase !== "Ready" && (
                <p className="text-teal-300 tracking-widest text-sm">
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
            "mt-8 px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all z-20",
            isBreathing 
              ? "bg-rose-500/10 text-rose-300 hover:bg-rose-500/20" 
              : "bg-teal-500 text-white hover:bg-teal-400"
          )}
        >
          {isBreathing ? (
            <><Square className="w-4 h-4 fill-current" /> إيقاف التمرين</>
          ) : (
            <><Play className="w-4 h-4 fill-current" /> بدء تمرين (4-7-8)</>
          )}
        </button>
      </div>

      {/* Nature Sounds */}
      <div className="w-full max-w-md">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-slate-400" />
          أصوات الطبيعة المهدئة
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => toggleNoise("rain")}
            className={cn(
              "p-4 rounded-2xl flex flex-col items-center gap-3 transition-colors border",
              noiseType === "rain" && isPlayingNoise
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            <CloudRain className={cn("w-6 h-6", noiseType === "rain" && isPlayingNoise && "animate-pulse")} />
            <span className="font-semibold text-sm">تساقط المطر</span>
          </button>
          <button
            onClick={() => toggleNoise("waves")}
            className={cn(
              "p-4 rounded-2xl flex flex-col items-center gap-3 transition-colors border",
              noiseType === "waves" && isPlayingNoise
                ? "bg-cyan-50 border-cyan-200 text-cyan-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            <Waves className={cn("w-6 h-6", noiseType === "waves" && isPlayingNoise && "animate-pulse")} />
            <span className="font-semibold text-sm">أمواج البحر</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-6 text-center leading-relaxed">
          نستخدم تقنيات الخوارزميات الصوتية لتوليد الضوضاء الوردية (Pink Noise) داخل المتصفح للتشويش المريح دون انتظار تحميل ملفات.
        </p>
      </div>
    </div>
  );
}
