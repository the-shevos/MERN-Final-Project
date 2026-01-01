"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Plus,
  MessageSquare,
  Sparkles,
  Bot,
  User,
  Mic,
  ImageIcon,
  Paperclip,
  ChevronLeft,
  ArrowLeft,
  Trash2,
} from "lucide-react";

type Message = {
  id: number | string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  video?: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
};

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem("neura_chat_sessions");
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setChatHistory(parsed);
    }
    createNewSession();

    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createNewSession = () => {
    const newId = Date.now().toString();
    const initialMessage: Message = {
      id: 1,
      text: "Hello! I'm Neura. How can we build something amazing today?",
      sender: "bot",
      timestamp: new Date(),
    };

    setCurrentSessionId(newId);
    setMessages([initialMessage]);
    if (window.innerWidth < 768) setSidebarCollapsed(true);
  };

  const saveCurrentToHistory = (updatedMessages: Message[]) => {
    const updatedHistory = [...chatHistory];
    const sessionIndex = updatedHistory.findIndex(
      (s) => s.id === currentSessionId
    );

    const firstUserMsg = updatedMessages.find((m) => m.sender === "user");
    const sessionTitle = firstUserMsg
      ? firstUserMsg.text.substring(0, 25) + "..."
      : "New Session";

    const sessionData: ChatSession = {
      id: currentSessionId!,
      title: sessionTitle,
      messages: updatedMessages,
      lastUpdated: new Date(),
    };

    if (sessionIndex !== -1) {
      updatedHistory[sessionIndex] = sessionData;
    } else {
      updatedHistory.unshift(sessionData);
    }

    setChatHistory(updatedHistory);
    localStorage.setItem("neura_chat_sessions", JSON.stringify(updatedHistory));
  };

  const loadSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    if (window.innerWidth < 768) setSidebarCollapsed(true);
  };

  const deleteSession = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation();

    const filtered = chatHistory.filter((s) => s.id !== id);
    setChatHistory(filtered);
    localStorage.setItem("neura_chat_sessions", JSON.stringify(filtered));

    if (currentSessionId === id) createNewSession();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.text }),
      });

      const data = await response.json();
      const botMessage: Message = {
        id: Date.now() + 1,
        text: data.answer || "I'm processing that right now...",
        video: data.video,
        sender: "bot",
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);
      saveCurrentToHistory(finalMessages);
    } catch {
      setMessages((prev: Message[]) => [
        ...prev,
        {
          id: Date.now(),
          text: "Connection error. Please check your local server.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#0f1115] text-slate-200 selection:bg-indigo-500/30">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full pointer-events-none opacity-40 bg-blue-600/10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full pointer-events-none opacity-40 bg-purple-600/10" />

      <aside
        className={`fixed inset-y-0 left-0 z-50 md:relative md:z-20 flex-shrink-0 border-r border-white/5 transition-all duration-500 bg-black/95 md:bg-black/40 backdrop-blur-3xl w-72 
          ${
            sidebarCollapsed
              ? "-translate-x-full md:-ml-72"
              : "translate-x-0 shadow-2xl"
          }`}
      >
        <div className="w-72 h-full flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                NeuraChat
              </span>
            </div>
            <button
              onClick={createNewSession}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all group border bg-white/5 hover:bg-white/10 border-white/10"
            >
              <span className="text-sm font-semibold text-slate-200">
                New Session
              </span>
              <Plus className="w-4 h-4 opacity-50 group-hover:opacity-100" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
            <p className="px-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
              Recent History
            </p>
            {chatHistory.map((session) => (
              <div
                key={session.id}
                onClick={() => loadSession(session)}
                className={`group flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                  currentSessionId === session.id
                    ? "bg-white/10 border-white/10 text-white"
                    : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <MessageSquare size={16} className="shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {session.title}
                  </span>
                </div>
                <button
                  onClick={(e) => deleteSession(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      <main className="flex-1 flex flex-col relative z-10 min-w-0">
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-4 md:px-6 border-b border-white/5 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2.5 rounded-xl transition-all border border-transparent hover:bg-white/5 text-gray-400 z-50 relative"
            >
              <ChevronLeft
                className={`w-5 h-5 transition-transform duration-500 ${
                  sidebarCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
            <div>
              <h1 className="text-sm font-bold text-white">Neura AI</h1>
              <span className="text-[10px] text-emerald-500 font-bold uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
                Live
              </span>
            </div>
          </div>
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Back</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto py-6 md:py-10 px-4 md:px-6 space-y-8">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2`}
              >
                <div
                  className={`flex gap-3 md:gap-4 max-w-[90%] md:max-w-[85%] ${
                    m.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex-shrink-0 flex items-center justify-center border shadow-sm ${
                      m.sender === "bot"
                        ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                        : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    {m.sender === "bot" ? (
                      <Bot size={18} />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <div
                    className={`px-4 py-3 md:px-5 md:py-3.5 rounded-2xl text-[14px] md:text-[15px] leading-relaxed shadow-sm flex flex-col gap-3 ${
                      m.sender === "user"
                        ? "bg-indigo-600 text-white font-medium"
                        : "bg-[#1a1d23] border border-white/5 text-slate-300"
                    }`}
                  >
                    <span>{m.text}</span>
                    {m.video && (
                      <div className="mt-2 w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg">
                        <iframe
                          width="100%"
                          height="100%"
                          src={m.video}
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-400">
                  <Bot size={18} />
                </div>
                <div className="px-5 py-4 rounded-2xl border bg-[#1a1d23] border-white/5 flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <footer className="p-4 md:p-6 bg-transparent">
          <div className="max-w-3xl mx-auto relative">
            <div className="rounded-2xl p-2 transition-all border shadow-2xl bg-[#1a1d23]/90 border-white/10 focus-within:border-indigo-500/50">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
                placeholder="Ask Neura anything..."
                rows={1}
                className="w-full bg-transparent border-none outline-none resize-none px-4 py-3 text-sm font-medium text-slate-200 placeholder:text-gray-500"
              />
              <div className="flex items-center justify-between px-2 pb-1">
                <div className="flex gap-1">
                  {[Paperclip, ImageIcon, Mic].map((Icon, idx) => (
                    <button
                      key={idx}
                      className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-white/5 hover:text-indigo-400"
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-4 md:px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-xl flex items-center gap-2 text-xs font-bold transition-all shadow-lg active:scale-95"
                >
                  <span className="hidden xs:inline">SEND</span>{" "}
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
