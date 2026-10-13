import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api';
import { MessageSquare, Send, X, CheckCheck, Circle, Loader2 } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConversationItem {
  conversationId: string;
  otherUser: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  lastMessage: string | null;
  lastMessageTime: string | null;
}

interface MessageItem {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isMe: boolean;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConv, setActiveConv] = useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoadingConvs, setIsLoadingConvs] = useState(false);
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Suggested peers if conversations are empty
  const defaultPeers = [
    {
      id: 'hamza-user',
      name: 'Hamza Malik',
      email: 'hamza.malik@ucp.edu.pk',
      role: 'TASKER',
      department: 'Computer Science',
    },
    {
      id: 'ayesha-user',
      name: 'Ayesha Khan',
      email: 'ayesha.khan@ucp.edu.pk',
      role: 'TASKER',
      department: 'Software Engineering',
    },
  ];

  const fetchConversations = async () => {
    setIsLoadingConvs(true);
    try {
      const res = await apiClient.get('/chat/conversations');
      const convList: ConversationItem[] = res.data || [];
      setConversations(convList);

      if (convList.length > 0 && !activeConv) {
        setActiveConv(convList[0]);
        await fetchMessages(convList[0].conversationId);
      }
    } catch {
      // In case of error
    } finally {
      setIsLoadingConvs(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setIsLoadingMsgs(true);
    try {
      const res = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
      const msgList = (res.data?.messages || []).map((m: any) => ({
        id: m.id,
        senderId: m.senderId,
        text: m.text,
        time: m.createdAt
          ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'Now',
        isMe: m.senderId === user?.id,
      }));
      setMessages(msgList);
    } catch {
      // Keep state
    } finally {
      setIsLoadingMsgs(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  const handleSelectConversation = (conv: ConversationItem) => {
    setActiveConv(conv);
    fetchMessages(conv.conversationId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConv || isSending) return;

    const textToSend = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    try {
      const res = await apiClient.post('/chat/send', {
        recipientId: activeConv.otherUser.id,
        text: textToSend,
      });

      const newMsg: MessageItem = {
        id: res.data?.chatMessage?.id || `msg-${Date.now()}`,
        senderId: user?.id || 'me',
        text: textToSend,
        time: 'Just now',
        isMe: true,
      };

      setMessages((prev) => [...prev, newMsg]);

      // Refetch conversation thread to keep synchronized
      if (res.data?.conversationId) {
        await fetchMessages(res.data.conversationId);
        await fetchConversations();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel chat-modal-panel"
        style={{
          maxWidth: 840,
          width: '100%',
          height: 620,
          display: 'grid',
          gridTemplateColumns: '270px 1fr',
          padding: 0,
          background: '#0d121d',
          border: '1px solid #1e293b',
          boxShadow: 'var(--shadow-modal)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Sidebar: Conversations */}
        <div
          style={{
            borderRight: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
            background: '#090d16',
          }}
        >
          <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MessageSquare size={20} color="var(--accent-indigo-light)" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>Campus Inbox</h4>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4, display: 'block' }}>
              Dynamic Backend Direct Messaging
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
            {isLoadingConvs && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8' }}>
                <Loader2 size={20} className="spinning" style={{ margin: '0 auto 6px' }} />
                <span style={{ fontSize: '0.78rem' }}>Loading threads...</span>
              </div>
            )}

            {!isLoadingConvs && conversations.length === 0 && (
              <div style={{ padding: 14, textAlign: 'center', color: '#64748b', fontSize: '0.82rem' }}>
                <p style={{ marginBottom: 12 }}>No conversations yet.</p>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                  Start chat with campus taskers:
                </span>
                {defaultPeers.map((peer) => (
                  <button
                    key={peer.id}
                    onClick={() => {
                      setActiveConv({
                        conversationId: `new-${peer.id}`,
                        otherUser: {
                          id: peer.id === 'hamza-user' ? 'hamza.malik@ucp.edu.pk' : peer.id,
                          fullName: peer.name,
                          email: peer.email,
                          role: peer.role,
                        },
                        lastMessage: null,
                        lastMessageTime: null,
                      });
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: '#131b2c',
                      border: '1px solid #1e293b',
                      borderRadius: 'var(--radius-sm)',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      marginBottom: 6,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    💬 {peer.name} ({peer.department})
                  </button>
                ))}
              </div>
            )}

            {!isLoadingConvs &&
              conversations.map((c) => {
                const isSelected = activeConv?.conversationId === c.conversationId;
                return (
                  <div
                    key={c.conversationId}
                    onClick={() => handleSelectConversation(c)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      border: `1px solid ${isSelected ? 'var(--accent-indigo)' : 'transparent'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        flexShrink: 0,
                      }}
                    >
                      {c.otherUser?.fullName ? c.otherUser.fullName.charAt(0) : 'U'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: '#ffffff',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {c.otherUser?.fullName || 'Campus Peer'}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#94a3b8',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {c.lastMessage || 'Click to view conversation'}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right Chat Thread */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0d121d' }}>
          {/* Thread Header */}
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#090d16',
            }}
          >
            {activeConv ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                  }}
                >
                  {activeConv.otherUser?.fullName?.charAt(0) || 'U'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.98rem' }}>
                      {activeConv.otherUser?.fullName}
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: '0.72rem',
                        color: 'var(--accent-emerald-light)',
                      }}
                    >
                      <Circle size={8} fill="var(--accent-emerald)" />
                      Active Peer
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {activeConv.otherUser?.email} • {activeConv.otherUser?.role}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Select a contact to view chat</div>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Feed */}
          <div
            style={{
              flex: 1,
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {isLoadingMsgs && (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                <Loader2 size={24} className="spinning" style={{ margin: '0 auto 8px' }} />
                <span>Loading messages...</span>
              </div>
            )}

            {!isLoadingMsgs && messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                <MessageSquare size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>No messages yet in this conversation.</p>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Send a message below to start collaborating!</span>
              </div>
            )}

            {!isLoadingMsgs &&
              messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '78%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: m.isMe ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius:
                        m.isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background:
                        m.isMe
                          ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                          : '#1e293b',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      boxShadow: m.isMe ? '0 4px 18px rgba(99, 102, 241, 0.3)' : 'none',
                    }}
                  >
                    {m.text}
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#94a3b8',
                      marginTop: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>{m.time}</span>
                    {m.isMe && <CheckCheck size={13} color="var(--accent-emerald)" />}
                  </div>
                </div>
              ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '16px 20px',
              borderTop: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#090d16',
            }}
          >
            <input
              type="text"
              value={inputMessage}
              disabled={!activeConv}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={activeConv ? `Message ${activeConv.otherUser?.fullName}...` : 'Select a contact to type'}
              className="input-field"
              style={{ borderRadius: 'var(--radius-full)' }}
            />
            <button
              type="submit"
              disabled={!activeConv || isSending || !inputMessage.trim()}
              className="btn btn-primary btn-icon"
              style={{ borderRadius: '50%', width: 44, height: 44, flexShrink: 0 }}
            >
              {isSending ? <Loader2 size={18} className="spinning" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
