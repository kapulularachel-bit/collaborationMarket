import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, CheckCheck, Smile } from 'lucide-react';
import { Chat, Message } from '../types';

interface MessagesViewProps {
  chats: Chat[];
  messages: Message[];
  onSendMessage: (chatId: string, text: string) => void;
  onReceiveMockMessage?: (chatId: string, text: string) => void;
  onChatOpen: (chatId: string) => void;
}

export default function MessagesView({
  chats,
  messages,
  onSendMessage,
  onReceiveMockMessage,
  onChatOpen
}: MessagesViewProps) {
  const [activeChatId, setActiveChatId] = useState<string | null>(chats[0]?.id || null);
  const [typedMessage, setTypedMessage] = useState('');
  const chatHistoryEndRef = useRef<HTMLDivElement>(null);

  // Keep activeChatId in sync: if it no longer exists in chats, fall back to first available
  useEffect(() => {
    if (chats.length === 0) {
      setActiveChatId(null);
    } else if (!chats.find(c => c.id === activeChatId)) {
      setActiveChatId(chats[0].id);
    }
  }, [chats]);

  // Auto-scroll chat window to bottom
  useEffect(() => {
    chatHistoryEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChatId]);

  const activeChat = chats.find(c => c.id === activeChatId);
  const activeChatHistory = messages.filter(m => m.chatId === activeChatId);

  const handleSend = () => {
    if (!typedMessage.trim() || !activeChatId) return;
    
    // Send user message
    onSendMessage(activeChatId, typedMessage.trim());
    const query = typedMessage.trim().toLowerCase();
    setTypedMessage('');

    // Trigger auto reply simulation after 1.5s
    if (onReceiveMockMessage) {
      setTimeout(() => {
        let replyText = "Perfect! I'll be waiting at the hostel entrance.";
        if (query.includes('available') || query.includes('have')) {
          replyText = "Awesome! Just placed the order, please make sure it's nice and warm.";
        } else if (query.includes('price') || query.includes('discount') || query.includes('mwk')) {
          replyText = "Great price, thanks for the student discount Brenda!";
        } else if (query.includes('deliver') || query.includes('time') || query.includes('hour')) {
          replyText = "Sounds good. Please call me when you reach the block gates.";
        }
        
        onReceiveMockMessage(activeChatId, replyText);
      }, 1500);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden h-[600px] flex">
      {/* 1. LEFT SIDE: CHATS SIDEBAR PANEL */}
      <div className="w-1/3 border-r border-slate-200/80 dark:border-slate-800 flex flex-col shrink-0 h-full">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#2E7D32]" />
            Chats Registry
          </h3>
          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-[#2E7D32] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 px-2 py-0.5 rounded-full font-bold">
            {chats.filter(c => c.unreadCount > 0).length} Unread
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
          {chats.map((c) => {
            const isActive = c.id === activeChatId;
            return (
              <div
                key={c.id}
                onClick={() => {
                  setActiveChatId(c.id);
                  onChatOpen(c.id);
                }}
                className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition ${
                  isActive 
                    ? "bg-slate-50 dark:bg-slate-850/60 border-l-4 border-[#2E7D32]" 
                    : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img
                      src={c.buyerAvatar}
                      alt={c.buyerName}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    {c.unreadCount > 0 && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#2E7D32] border-2 border-white dark:border-slate-900 rounded-full" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{c.buyerName}</h4>
                    <p className={`text-[11px] truncate mt-0.5 ${c.unreadCount > 0 ? "font-bold text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}>
                      {c.lastMessage}
                    </p>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-mono">{c.timestamp}</span>
                  {c.unreadCount > 0 && !isActive && (
                    <span className="inline-block mt-1 bg-[#2E7D32] text-white text-[9px] font-extrabold w-4 h-4 rounded-full text-center leading-4 font-mono">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. RIGHT SIDE: ACTIVE THREAD CHAT SCREEN */}
      <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/30">
        {activeChat ? (
          <>
            {/* Header info */}
            <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={activeChat.buyerAvatar}
                  alt={activeChat.buyerName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{activeChat.buyerName}</h4>
                  <p className="text-[9px] text-[#2E7D32] dark:text-emerald-400 font-extrabold uppercase tracking-wide">MUBAS Campus • Online</p>
                </div>
              </div>
            </div>

            {/* Message Feed list */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {activeChatHistory.map((m, idx) => {
                const isSeller = m.senderId === 'u1';
                return (
                  <div
                    key={m.id || idx}
                    className={`flex ${isSeller ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex flex-col space-y-1 max-w-[70%]">
                      {/* Product context box */}
                      {m.productContext && (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl flex items-center gap-3 mb-1 shadow-2xs">
                          <img
                            src={m.productContext.image}
                            alt="thumb"
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="text-[11px] font-black text-slate-900 dark:text-white truncate">{m.productContext.name}</h5>
                            <p className="text-[10px] font-bold text-[#2E7D32] dark:text-emerald-400 mt-0.5">MWK {m.productContext.price.toLocaleString()}</p>
                          </div>
                        </div>
                      )}

                      <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isSeller
                          ? "bg-[#2E7D32] text-white rounded-tr-none shadow-2xs"
                          : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/80 dark:border-slate-800 shadow-3xs"
                      }`}>
                        <p>{m.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1 text-[8.5px]">
                          <span className={isSeller ? "text-green-100" : "text-slate-400 dark:text-slate-500"}>
                            {m.timestamp}
                          </span>
                          {isSeller && <CheckCheck className="w-3 h-3 text-green-100" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatHistoryEndRef} />
            </div>

            {/* Input keyboard row */}
            <div className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-3 shrink-0">
              <button className="text-slate-400 hover:text-slate-600 transition">
                <Smile className="w-5 h-5" />
              </button>
              <input
                type="text"
                placeholder="Type a response to student buyer..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                className="flex-1 text-xs border border-slate-200 dark:border-slate-800 focus:border-[#2E7D32] rounded-xl px-3.5 py-2.5 focus:outline-none transition font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900"
              />
              <button
                onClick={handleSend}
                className="bg-[#2E7D32] hover:bg-emerald-700 text-white p-2.5 rounded-xl transition cursor-pointer shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300">No active thread selected</h4>
            <p className="text-xs text-slate-400 mt-1">Select a student customer chat conversation from the list to begin replying.</p>
          </div>
        )}
      </div>
    </div>
  );
}
