import { useEffect, useState, useRef } from "react";
import { Send, MessageSquare } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import type { Chat, Message } from "../types";

export default function MessagesView({ shopId }: { shopId: string | null }) {
  const { profile } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shopId) return;
    supabase.from("chats").select("*").eq("shop_id", shopId).order("last_message_at", { ascending: false })
      .then(({ data }) => { if (data) setChats(data as Chat[]); setLoading(false); });
  }, [shopId]);

  useEffect(() => {
    if (!activeChat) return;
    supabase.from("messages").select("*").eq("chat_id", activeChat.id).order("created_at", { ascending: true })
      .then(({ data }) => { if (data) setMessages(data as Message[]); });
  }, [activeChat]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim() || !activeChat || !profile) return;
    setSending(true);
    const msg: Omit<Message, "id" | "created_at"> = {
      chat_id: activeChat.id,
      sender_id: profile.id,
      sender_name: profile.full_name,
      content: newMsg.trim(),
      is_read: false,
    };
    const { data } = await supabase.from("messages").insert(msg).select().single();
    if (data) {
      setMessages((prev) => [...prev, data as Message]);
      setNewMsg("");
      await supabase.from("chats").update({
        last_message: newMsg.trim(),
        last_message_at: new Date().toISOString(),
      }).eq("id", activeChat.id);
    }
    setSending(false);
  };

  if (loading) return <div className="p-6 text-sm text-slate-400 dark:text-slate-500">Loading messages...</div>;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col p-4 lg:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Messages</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Chat with your customers</p>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className={`w-full border-r border-slate-200 dark:border-slate-700 md:w-72 ${activeChat ? "hidden md:block" : ""}`}>
          {chats.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <MessageSquare size={32} className="mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm text-slate-400 dark:text-slate-500">No conversations yet</p>
            </div>
          ) : (
            <div className="overflow-y-auto">
              {chats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChat(c)}
                  className={`flex w-full items-center gap-3 border-b border-slate-100 p-3 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50 ${activeChat?.id === c.id ? "bg-gula-50 dark:bg-gula-950/30" : ""}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gula-600 text-sm font-bold text-white">
                    {c.buyer_name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{c.buyer_name}</p>
                    <p className="truncate text-xs text-slate-400 dark:text-slate-500">{c.last_message}</p>
                  </div>
                  {c.unread_count > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gula-600 px-1.5 text-xs font-bold text-white">{c.unread_count}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={`flex flex-1 flex-col ${activeChat ? "" : "hidden md:flex"}`}>
          {!activeChat ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <MessageSquare size={40} className="mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-sm text-slate-400 dark:text-slate-500">Select a conversation to start chatting</p>
            </div>
          ) : (
            <>
              <div className="border-b border-slate-200 p-4 dark:border-slate-700">
                <button onClick={() => setActiveChat(null)} className="mb-2 text-xs text-gula-600 hover:underline dark:text-gula-400 md:hidden">Back</button>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{activeChat.buyer_name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{activeChat.shop_name}</p>
              </div>
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((m) => {
                  const own = m.sender_id === profile?.id;
                  return (
                    <div key={m.id} className={`flex ${own ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${own ? "bg-gula-600 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"}`}>
                        <p>{m.content}</p>
                        <p className={`mt-0.5 text-[10px] ${own ? "text-gula-100" : "text-slate-400"}`}>{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-slate-200 p-3 dark:border-slate-700">
                <div className="flex gap-2">
                  <input
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type a message..."
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:bg-slate-600"
                  />
                  <button onClick={handleSend} disabled={sending || !newMsg.trim()} className="flex items-center justify-center rounded-xl bg-gula-600 px-4 text-white hover:bg-gula-700 disabled:opacity-50">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
