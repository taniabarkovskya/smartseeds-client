import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Send } from "lucide-react";
import { AppHeader } from "@/widgets/AppHeader/AppHeader";
import { supabase } from "@/shared/api/supabase";
import { chatWithAI, type ChatMessage } from "@/shared/api/ai";

interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: Date;
}

const SUGGESTED_TOPICS = [
  "Find materials about pronouncing the sound [R]",
  "Tips for differentiation exercises",
  "How to explain the difference between [S] and [SH] to a child?",
  "Fun games for developing speech",
];

function createChat(title = "New conversation"): Chat {
  return {
    id: crypto.randomUUID(),
    title,
    messages: [],
    updatedAt: new Date(),
  };
}

export function AIAssistantPage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [chats, setChats] = useState<Chat[]>([createChat()]);
  const [activeChatId, setActiveChatId] = useState<string>(chats[0].id);
  const [chatSearch, setChatSearch] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeChatId, isLoading]);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? chats[0];

  const updateChat = (id: string, updater: (chat: Chat) => Chat) => {
    setChats((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
  };

  const handleNewChat = () => {
    const chat = createChat();
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: text.trim() };

    // Auto-title the chat from first message
    const isFirstMessage = activeChat.messages.length === 0;
    updateChat(activeChatId, (c) => ({
      ...c,
      title: isFirstMessage ? text.trim().slice(0, 40) : c.title,
      messages: [...c.messages, userMsg],
      updatedAt: new Date(),
    }));

    setInput("");
    setIsLoading(true);

    const history = [...activeChat.messages, userMsg];
    const reply = await chatWithAI(history);

    const assistantMsg: ChatMessage = { role: "assistant", content: reply };
    updateChat(activeChatId, (c) => ({
      ...c,
      messages: [...c.messages, assistantMsg],
      updatedAt: new Date(),
    }));
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(chatSearch.toLowerCase()),
  );

  const initials = userEmail.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-[#9590B8]">
      <AppHeader />

      <div className="flex flex-1 px-8 pb-8 gap-6" style={{ minHeight: "calc(100vh - 72px)" }}>
        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-white/20 backdrop-blur-sm rounded-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <span className="font-heading font-bold text-foreground text-base">Chats</span>
            <button
              onClick={handleNewChat}
              className="size-7 flex items-center justify-center rounded-lg bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors"
            >
              <Plus className="size-4" />
            </button>
          </div>

          {/* Search */}
          <div className="px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-foreground/50" />
              <input
                type="text"
                placeholder="Search..."
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-white/40 text-xs text-foreground placeholder:text-foreground/50 border border-white/30 focus:outline-none focus:ring-1 focus:ring-white/50"
              />
            </div>
          </div>

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto px-2 space-y-0.5 min-h-0">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium truncate transition-colors ${
                  chat.id === activeChatId
                    ? "bg-white/40 text-foreground"
                    : "text-foreground/70 hover:bg-white/20"
                }`}
              >
                {chat.title}
              </button>
            ))}
          </div>

          {/* Suggested topics */}
          <div className="px-3 py-3 border-t border-white/20">
            <p className="text-xs font-semibold text-foreground/60 mb-2">Suggestions</p>
            <div className="space-y-1">
              {SUGGESTED_TOPICS.slice(0, 2).map((topic) => (
                <button
                  key={topic}
                  onClick={() => void sendMessage(topic)}
                  className="w-full text-left text-xs text-foreground/70 hover:text-foreground px-2 py-1 rounded-lg hover:bg-white/20 transition-colors line-clamp-1"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* User */}
          <div className="flex items-center gap-2 px-3 pb-4 pt-2 border-t border-white/20">
            <div className="size-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <span className="text-xs text-foreground/70 truncate">{userEmail}</span>
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-white/20 backdrop-blur-sm rounded-2xl overflow-hidden min-w-0">
          {/* Chat header */}
          <div className="px-6 py-4 border-b border-white/20 shrink-0">
            <h2 className="font-heading font-bold text-foreground">
              {activeChat.title || "Flippy — AI Assistant"}
            </h2>
            <p className="text-xs text-foreground/60 mt-0.5">
              Ask questions about speech exercises, grammar, and pronunciation
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
            {activeChat.messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-10">
                <div className="text-5xl">🤖</div>
                <div>
                  <p className="font-heading font-bold text-foreground text-lg">Hi! I'm Flippy</p>
                  <p className="text-sm text-foreground/60 mt-1 max-w-sm">
                    I can help with speech exercises, tips for therapists, and materials for children
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full max-w-md mt-2">
                  {SUGGESTED_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => void sendMessage(topic)}
                      className="text-left text-xs bg-white/40 hover:bg-white/60 transition-colors rounded-xl p-3 text-foreground/70 hover:text-foreground"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeChat.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="size-7 rounded-full bg-[#9590B8] flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0 self-end">
                    F
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#1a1a1a] text-white rounded-br-sm"
                      : "bg-white/70 text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="size-7 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-xs font-bold ml-2 shrink-0 self-end">
                    {initials}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="size-7 rounded-full bg-[#9590B8] flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0 self-end">
                  F
                </div>
                <div className="bg-white/70 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-foreground/60 italic">
                  Flippy is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-white/20 shrink-0">
            <div className="flex items-end gap-3 bg-white/40 rounded-2xl px-4 py-3">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Flippy something..."
                className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-foreground/50 focus:outline-none min-h-[24px] max-h-32"
                style={{ height: "auto" }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = `${el.scrollHeight}px`;
                }}
              />
              <button
                onClick={() => void sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="size-8 rounded-xl bg-[#1a1a1a] text-white flex items-center justify-center hover:bg-[#333] transition-colors disabled:opacity-40 shrink-0"
              >
                <Send className="size-4" />
              </button>
            </div>
            <p className="text-center text-xs text-foreground/40 mt-2">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
