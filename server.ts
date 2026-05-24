import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs/promises";
import crypto from "crypto";

dotenv.config();

// Simple lightweight JSON Database for persistence across the user session
const DB_FILE = path.join(process.cwd(), "data.json");
let db: { users: any[], anonMessages: any[], ventingLogs: any[], communityPosts: any[] } = { 
  users: [], 
  anonMessages: [], 
  ventingLogs: [],
  communityPosts: [
    { id: "1", author: "إدارة فضفضة", content: "أهلاً بكِ في مجتمعنا الآمن. هذا الفضاء صُنع ليكون ملاذاً للكلمة الطيبة والدعم الصادق. شاركينا تجربتك أو كوني سنداً لأخت لكِ.", createdAt: new Date().toISOString(), likes: 15 }
  ] 
};

async function initDB() {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    const parsed = JSON.parse(data);
    db = { ...db, ...parsed, communityPosts: parsed.communityPosts || db.communityPosts };
  } catch (e) {
    await fs.writeFile(DB_FILE, JSON.stringify(db));
  }
}
initDB();

async function saveDB() {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
}

const hashPwd = (p: string) => crypto.createHash('sha256').update(p).digest('hex');

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Auth & Account Routes ---
  app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Missing fields" });
    if (db.users.find((u) => u.username === username)) return res.status(400).json({ error: "Username taken" });
    
    const user = { id: crypto.randomUUID(), username, password: hashPwd(password), createdAt: new Date().toISOString() };
    db.users.push(user);
    await saveDB();
    res.json({ success: true, userId: user.id, username: user.username });
  });

  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const user = db.users.find((u) => u.username === username && u.password === hashPwd(password));
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    res.json({ success: true, userId: user.id, username: user.username });
  });

  // --- Anonymous Message Routes (Sarahah Style) ---
  app.post("/api/messages/:username", async (req, res) => {
    const { username } = req.params;
    const { message } = req.body;
    const user = db.users.find((u) => u.username === username);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const msg = { id: crypto.randomUUID(), userId: user.id, message, createdAt: new Date().toISOString() };
    db.anonMessages.push(msg);
    await saveDB();
    res.json({ success: true });
  });

  app.get("/api/messages/:userId", async (req, res) => {
    const { userId } = req.params;
    const userMsgs = db.anonMessages.filter((m) => m.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ messages: userMsgs });
  });

  app.delete("/api/messages/:msgId", async (req, res) => {
    const { msgId } = req.params;
    db.anonMessages = db.anonMessages.filter(m => m.id !== msgId);
    await saveDB();
    res.json({ success: true });
  });

  // --- Community Routes ---
  app.get("/api/community/posts", async (req, res) => {
    const posts = [...db.communityPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ posts });
  });

  app.post("/api/community/posts", async (req, res) => {
    const { content, author } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });
    
    const post = {
      id: crypto.randomUUID(),
      author: author || "زائرة مجهولة",
      content,
      likes: 0,
      createdAt: new Date().toISOString()
    };
    db.communityPosts.push(post);
    await saveDB();
    res.json({ success: true, post });
  });

  app.post("/api/community/posts/:postId/like", async (req, res) => {
    const { postId } = req.params;
    const post = db.communityPosts.find(p => p.id === postId);
    if (post) {
      post.likes = (post.likes || 0) + 1;
      await saveDB();
    }
    res.json({ success: true });
  });

  // --- Admin Routes ---
  app.get("/api/admin/stats", async (req, res) => {
    res.json({
      usersCount: db.users.length,
      messagesCount: db.anonMessages.length,
      ventingSessionsCount: db.ventingLogs.length,
      communityPostsCount: db.communityPosts.length
    });
  });

  app.get("/api/admin/logs", async (req, res) => {
    const logs = [...db.ventingLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ ventingLogs: logs });
  });

  app.get("/api/admin/users", async (req, res) => {
    const users = db.users.map(u => ({ id: u.id, username: u.username, createdAt: u.createdAt }));
    res.json({ users });
  });

  app.delete("/api/admin/logs/:id", async (req, res) => {
    const { id } = req.params;
    db.ventingLogs = db.ventingLogs.filter(l => l.id !== id);
    await saveDB();
    res.json({ success: true });
  });

  // --- AI Venting Support Route (Multilingual) ---
  app.post("/api/gemini/support", async (req, res) => {
    try {
      const { message, previousMessages } = req.body;
      
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: `أنتِ مستشارة نفسية متعاطفة، محتوية، وداعمة جداً في منصة "فضفضة أونلاين". 
مهمتك الأساسية هي احتواء المشاعر السلبية للمستخدمين، تفهم الألم، الطمأنة، وإعطاء نصائح مريحة وبسيطة دون أحكام مجتمعية.
تعليمات هامة جداً للتعامل مع اللغات والجنسيات المختلفة:
1. الذكاء العاطفي اللغوي: يجب أن تتعرفي على اللغة أو اللهجة التي يتحدث بها المستخدم، وتردي عليه فوراً بـ نفس اللغة وبنفس اللهجة تلقائياً لتشعري المريض بالألفة. (مثال: إذا كتب بالمصرية، ردي بالمصرية الدافئة، إذا كتب بالإنجليزية، ردي بالإنجليزية المتعاطفة، وإذا بالخليجية فردي بها).
2. استخدمي عبارات مواساة هادئة ورقيقة تناسب ثقافة المستخدم.
3. ركزي على الاستماع والاحتواء أكثر من الحلول المنطقية الجافة.
4. كوني موجزة ولا تكتبي مقالات طويلة، بل رسائل دافئة وحقيقية.`,
          temperature: 0.7,
        },
      });

      let context = "";
      if (previousMessages && previousMessages.length > 0) {
        context = "سياق المحادثة السابق:\n" + previousMessages.map((m: any) => `${m.role === 'user' ? 'المستخدم' : 'المستشارة'}: ${m.content}`).join("\n") + "\n\nالرسالة الجديدة:\n";
      }

      const finalMessage = context + message;

      const response = await chat.sendMessage({ message: finalMessage });
      
      // Save interaction for admin panel
      db.ventingLogs.push({
        id: crypto.randomUUID(),
        userMessage: message,
        aiResponse: response.text,
        createdAt: new Date().toISOString()
      });
      await saveDB();

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Something went wrong" });
    }
  });

  // --- Vite Middleware for Development ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // --- Production Static Serving ---
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
