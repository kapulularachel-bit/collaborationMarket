import { useEffect, useState, useRef } from "react";
import { MessageSquare, Send, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import type { Shop, Chat, Message } from "../types";

export default function MessagesView() {
  const { profile } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const { data: shopData } = await supabase
        .from("shops")
        .select("*")
        .eq("seller_id", profile.id)
        .maybeSingle();
      const s = shopData as Shop | null;
      setShop(s);
      if (s) {
        const { data: chatData } = await supabase
          .from("chats")
          .select("*")
          .eq("shop_id", s.id)
          .order("last_message_at", { ascending: false });
        setChats((chatData ?? []) as Chat[]);
      }
      setLoading(false);
    })();
  }, [profile]);

  useEffect(() => {
    if (!activeChat) return;
    supabase
      .from("messages")
      .select("*")
      .eq("chat_id", activeChat.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setMessages((data ?? []) as Message[]);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      });
  }, [activeChat]);

  const sendMessage = async () => {
    if (!activeChat || !newMessage.trim() || !profile) return;
    const msg: Partial<Message> = {
      chat_id: activeChat.id,
      sender_id: profile.id,
      sender_name: profile.full_name,
      content: newMessage.trim(),
    };
    const { data } = await supabase.from("messages").insert(msg).select("*").single();
    if (data) {
      setMessages([...messages, data as Message]);
      setNewMessage("");
      await supabase
        .from("chats")
        .update({ last_message: newMessage.trim(), last_message_at: new Date().toISOString() })
        .eq("id", activeChat.id);
    }
  };

  if (loading) return <div className="p-6 text-slate-400">Loading...</div>;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className={`w-full border-r border-slate-200 bg-white md:max-w-xs ${activeChat ? "hidden md:block" : ""}`}>
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-sm font-bold text-slate-900">Messages</h2>
        </div>
        <div className="overflow-y-auto">
          {chats.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <MessageSquare size={32} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm text-slate-400">No conversations yet</p>
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`flex w-full items-center gap-3 border-b border-slate-50 px-4 py-3 text-left transition hover:bg-slate-50 ${
                  activeChat?.id === chat.id ? "bg-gula-50" : ""
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gula-100 text-sm font-semibold text-gula-700">
                  {chat.buyer_name?.charAt(0).toUpperCase() ?? "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{chat.buyer_name}</p>
                  <p className="truncate text-xs text-slate-400">{chat.last_message || "Start a conversation"}</p>
                </div>
                {chat.unread_count > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gula-600 px-1 text-[10px] font-bold text-white">
                    {chat.unread_count}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      <div className={`flex flex-1 flex-col bg-slate-50 ${activeChat ? "" : "hidden md:flex"}`}>
        {activeChat ? (
          <>
            <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
              <button onClick={() => setActiveChat(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 md:hidden">
                <ArrowLeft size={20} />
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gula-100 text-sm font-semibold text-gula-700">
                {activeChat.buyer_name?.charAt(0).toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{activeChat.buyer_name}</p>
                <p className="text-xs text-slate-400">{activeChat.shop_name}</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg) => {
                const isOwn = msg.sender_id === profile?.id;
                return (
                  <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isOwn ? "bg-gula-600 text-white" : "bg-white text-slate-900 border border-slate-200"
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`mt-0.5 text-[10px] ${isOwn ? "text-gula-100" : "text-slate-400"}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-gula-500 focus:bg-white focus:ring-2 focus:ring-gula-500/20"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gula-600 text-white transition hover:bg-gula-700 disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageSquare size={40} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm text-slate-400">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
