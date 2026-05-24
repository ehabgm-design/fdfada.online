import { useState, useEffect } from "react";
import { Users, Send, Heart, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

export default function Community() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/community/posts");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPost, author: authorName.trim() || "زائرة مجهولة" })
      });
      setNewPost("");
      fetchPosts();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleLike = async (postId: string) => {
    // Optimistic update
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p));
    try {
      await fetch(`/api/community/posts/${postId}/like`, { method: "POST" });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 flex flex-col h-screen md:h-auto">
      <div className="text-center mb-8 shrink-0">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <Users className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">الساحة العامة للفضفضة</h1>
        <p className="text-slate-500 text-sm">مساحة آمنة لمشاركة الدعم والرسائل الإيجابية مع الجميع بدون أحكام.</p>
      </div>

      {/* Write Post */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-8 shrink-0 relative z-10">
        <form onSubmit={handlePost}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            disabled={loading}
            placeholder="اكتبي رسالة دعم أو شاركي ما تمرين به ليستفيد غيرك..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-700 transition-all text-sm mb-3"
          ></textarea>
          <div className="flex items-center justify-between gap-4">
            <input 
              type="text" 
              placeholder="اسم مستعار (اختياري)" 
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              className="bg-transparent border-b border-slate-200 py-2 px-1 text-sm focus:outline-none focus:border-amber-500 text-slate-600 w-40"
            />
            <button 
              type="submit" 
              disabled={loading || !newPost.trim()}
              className="bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-600 transition-colors disabled:opacity-50 shadow-sm shadow-amber-500/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 rtl:-scale-x-100" /> نشر عام</>}
            </button>
          </div>
        </form>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pb-20 md:pb-0 relative">
        {fetching ? (
          <div className="flex justify-center p-12 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border text-slate-500">
            لا توجد مشاركات بعد. كوني أول من يشارك رسالة إيجابية!
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:border-amber-100 transition-colors animate-in fade-in">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-100 to-rose-100 flex items-center justify-center font-bold text-amber-700 text-lg border border-amber-50">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{post.author}</h4>
                    <p className="text-[10px] text-slate-400">{new Date(post.createdAt).toLocaleDateString("ar-EG")} • {new Date(post.createdAt).toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-4 pl-12">{post.content}</p>
              
              <div className="pl-12 flex">
                <button 
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-500 transition-colors bg-slate-50 hover:bg-rose-50 px-3 py-1.5 rounded-lg active:scale-95"
                >
                  <Heart className={cn("w-4 h-4", post.likes > 0 ? "fill-rose-500 text-rose-500" : "")} />
                  <span>{post.likes > 0 ? post.likes : 'أعجبني هذا'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
