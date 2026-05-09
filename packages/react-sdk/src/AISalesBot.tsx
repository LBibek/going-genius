import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';

export interface AISalesBotProps {
  appId: string;
  agentType?: 'sales' | 'support' | 'custom';
  greeting?: string;
  theme?: 'light' | 'dark' | 'glass';
  position?: 'bottom-right' | 'bottom-left';
  apiHost?: string;
  apiUrl?: string;   // Override the full API URL directly
  userId?: string;   // Optional: link conversations to a user
  botName?: string;  // Customize bot display name
}

export function AISalesBot({ 
  appId, 
  agentType = 'sales', 
  greeting = "Hi! I'm your AI assistant. How can I help you today?",
  theme = 'glass',
  position = 'bottom-right',
  apiHost = 'https://goinggenius.com',
  apiUrl,
  userId,
  botName = 'AI Assistant'
}: AISalesBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: greeting }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null); // Persistent memory
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Resolve the endpoint — apiUrl takes priority
      const endpoint = apiUrl || `${apiHost}/api/v1/apps/${appId}/bot`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          threadId,   // Send persisted threadId (null on first message)
          userId,     // Optional user linking
          agentType
        })
      });

      if (!res.ok) throw new Error('Failed to fetch from AI agent');
      
      const response = await res.json();

      // Persist the threadId returned by the server for future turns
      if (response.threadId && !threadId) {
        setThreadId(response.threadId);
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.text 
      }]);
    } catch (err) {
      console.error('GG AI Bot Error:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again later." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          [position === 'bottom-right' ? 'right' : 'left']: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--gg-primary, #00F0FF)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0, 240, 255, 0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Bot size={28} color="#000" />
      </button>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: isMinimized ? '2rem' : '1rem',
        [position === 'bottom-right' ? 'right' : 'left']: '1rem',
        width: '380px',
        maxWidth: 'calc(100vw - 2rem)',
        height: isMinimized ? '60px' : '600px',
        maxHeight: 'calc(100vh - 2rem)',
        background: theme === 'dark' ? '#0A0A0F' : (theme === 'glass' ? 'rgba(10, 10, 15, 0.8)' : '#FFF'),
        backdropFilter: theme === 'glass' ? 'blur(16px)' : 'none',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        zIndex: 9999,
        transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        color: theme === 'light' ? '#000' : '#FFF'
      }}
    >
      <div style={{
        padding: '1rem',
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '32px', height: '32px', background: 'var(--gg-primary, #00F0FF)', 
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <Bot size={18} color="#000" />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{botName}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', background: '#27c93f', borderRadius: '50%' }} /> Online
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '4px' }}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div 
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {messages.map((msg, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                gap: '0.75rem', 
                maxWidth: '85%',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
              }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '6px', 
                  background: msg.role === 'assistant' ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  color: msg.role === 'assistant' ? 'var(--gg-primary, #00F0FF)' : 'inherit',
                  flexShrink: 0
                }}>
                  {msg.role === 'assistant' ? <Sparkles size={12} /> : <User size={12} />}
                </div>
                <div style={{
                  padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', lineHeight: 1.5,
                  background: msg.role === 'user' ? 'var(--gg-primary, #00F0FF)' : 'rgba(255,255,255,0.05)',
                  color: msg.role === 'user' ? '#000' : 'inherit',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  fontWeight: msg.role === 'user' ? 500 : 400
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '6px', 
                  background: 'rgba(0, 240, 255, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gg-primary, #00F0FF)'
                }}>
                  <Sparkles size={12} />
                </div>
                <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <span style={{ display: 'inline-flex', gap: '4px' }}>
                    <span className="gg-dot" />
                    <span className="gg-dot" />
                    <span className="gg-dot" />
                  </span>
                </div>
              </div>
            )}
          </div>

          <form 
            onSubmit={handleSend}
            style={{
              padding: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              gap: '0.5rem',
              background: 'rgba(0,0,0,0.1)'
            }}
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '0.6rem 0.8rem',
                color: '#FFF',
                fontSize: '0.9rem',
                outline: 'none'
              }}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              style={{
                width: '40px', height: '40px', background: 'var(--gg-primary, #00F0FF)', 
                color: '#000', border: 'none', borderRadius: '8px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', opacity: (!input.trim() || isTyping) ? 0.5 : 1
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </>
      )}

      <style>{`
        .gg-dot {
          width: 4px; height: 4px; background: rgba(255,255,255,0.5); border-radius: 50%;
          animation: gg-bounce 1.4s infinite ease-in-out both;
        }
        .gg-dot:nth-child(1) { animation-delay: -0.32s; }
        .gg-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes gg-bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </div>
  );
}
