import { useState, useRef, useEffect } from "react";
import { Send, LockKeyhole, UserRound, Bot, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Venting() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: "أهلاً بكِ يا حبيبتي في خزانة الأسرار.. هنا لا أحد يعرفك، ولا نحتفظ بأي معلومات عنك. بمجرد خروجك سيمحى كل شيء. اتفضلي، قوليلي إيه اللي مزعلك ومضايقك؟ أنا هنا عشان أسمعك."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: any) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: `msg-${Date.now()}-${Math.random()}`, role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage.content,
          previousMessages: messages.slice(-5) // Send only recent context
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-${Math.random()}`,
        role: "assistant",
        content: data.reply
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-${Math.random()}`,
        role: "assistant",
        content: "أعتذر منك يا حبيبتي، يبدو أن هناك مشكلة في الاتصال. حاولي مرة أخرى متى ما شعرتِ بالراحة."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white/50 backdrop-blur-sm border-x border-slate-100">
      <div className="p-4 md:p-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
            <LockKeyhole className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800">خزانة الأسرار</h1>
            <p className="text-xs text-slate-500">محادثة سرية وآمنة 100% (Zero-Trust)</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div 
            key={msg.id || `msg-${idx}`} 
            className={cn(
              "flex gap-4 max-w-[85%] md:max-w-[75%]",
              msg.role === "user" ? "mr-auto flex-row-reverse" : "ml-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex shrink-0 items-center justify-center mt-1",
              msg.role === "user" ? "bg-slate-200 text-slate-600" : "bg-teal-100 text-teal-600"
            )}>
              {msg.role === "user" ? <UserRound className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === "user" 
                ? "bg-slate-800 text-white rounded-tr-sm" 
                : "bg-teal-50 border border-teal-100/50 text-slate-700 rounded-tl-sm"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex shrink-0 items-center justify-center mt-1">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100/50 text-slate-700 rounded-tl-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              <span className="text-xs text-teal-600">تكتب لكِ رسالة...</span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="اكتبي اللي وجعك هنا بكل حرية..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 pr-6 pl-14 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-700"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute left-2 w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600 transition-colors"
          >
            <Send className="w-4 h-4 rtl:-scale-x-100" />
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          لا نشارك بياناتك ولا نخزن عنوان IP الخاص بك. راحتك وأمانك أولويتنا.
        </p>
      </div>
    </div>
  );
}
