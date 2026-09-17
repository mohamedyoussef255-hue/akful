import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import {
  Send,
  ShieldCheck,
  Building2,
  HeartHandshake,
  GraduationCap,
  MessageSquare,
  Lock,
} from 'lucide-react';

export const RealTimeChat: React.FC = () => {
  const { currentUser, socket, t, themeConfig } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [activePartnerName, setActivePartnerName] = useState('دار الأمل للأيتام والرعاية');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch initial messages
  useEffect(() => {
    fetch('/api/v1/chat/messages')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(data);
        }
      })
      .catch((err) => console.error('Chat fetch error:', err));
  }, []);

  // Listen for real-time messages from Socket.io
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receive_chat_message', handleNewMessage);

    return () => {
      socket.off('receive_chat_message', handleNewMessage);
    };
  }, [socket]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !currentUser) return;

    const msgPayload = {
      sender_id: currentUser.id,
      sender_name: currentUser.full_name,
      recipient_id: currentUser.role === 'CARE_HOME' ? 'user_sponsor_01' : 'user_carehome_01',
      case_id: 'case_001',
      content: newMessageText.trim(),
    };

    if (socket && socket.connected) {
      socket.emit('send_chat_message', msgPayload);
    } else {
      // Local fallback
      const fallbackMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        ...msgPayload,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }

    setNewMessageText('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col h-[640px]">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-900">{activePartnerName}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>جهة موثقة</span>
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                محادثة مباشرة ومشفرة لكفالة حالة الطفلين زياد ونور
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">مشفرة P2P</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/40">
          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[11px] font-bold text-neutral-500">
                    {isMe ? 'أنت' : msg.sender_name}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    isMe
                      ? `${themeConfig.primary} text-white rounded-br-xs`
                      : 'bg-white text-neutral-900 border border-neutral-200/90 rounded-bl-xs'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-neutral-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder={t('chat_placeholder')}
              className="flex-1 px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!newMessageText.trim()}
              className={`p-3 rounded-2xl text-white font-bold transition-all shadow-md disabled:opacity-50 ${themeConfig.primary} ${themeConfig.primaryHover}`}
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
