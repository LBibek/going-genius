'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Terminal } from 'lucide-react';

export function AppBotPreview({ app }: { app: any }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hello! I'm your integrated AI agent for ${app.name}. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `As an agent for ${app.name}, I've processed your request: "${userMessage}". Since this is a preview, I'm simulating a response using your configured provider.` 
      }]);
    }, 1500);
  };

  return (
    <div className="bot-preview-container">
      <div className="bot-header">
        <div className="bot-info">
          <div className="bot-avatar">
            <Bot size={16} color="#000" />
          </div>
          <div>
            <div className="bot-name">{app.name} Agent</div>
            <div className="bot-status">
              <span className="status-dot" /> Online
            </div>
          </div>
        </div>
        <div className="bot-actions">
          <Terminal size={14} className="icon-btn" />
        </div>
      </div>

      <div className="chat-window" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`message-wrapper ${msg.role}`}>
            <div className="message-icon">
              {msg.role === 'assistant' ? <Sparkles size={12} /> : <User size={12} />}
            </div>
            <div className="message-bubble">
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-wrapper assistant">
            <div className="message-icon"><Sparkles size={12} /></div>
            <div className="message-bubble typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Test your agent..." 
          className="chat-input"
        />
        <button type="submit" className="send-btn" disabled={!input.trim() || isTyping}>
          <Send size={14} />
        </button>
      </form>

      <style jsx>{`
        .bot-preview-container {
          background: #000; border: 1px solid var(--border); border-radius: 14px; overflow: hidden;
          display: flex; flex-direction: column; height: 400px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .bot-header {
          background: #111; padding: 0.75rem 1rem; border-bottom: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .bot-info { display: flex; align-items: center; gap: 0.75rem; }
        .bot-avatar {
          width: 32px; height: 32px; background: var(--primary); border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .bot-name { font-size: 0.85rem; font-weight: 700; color: #fff; }
        .bot-status { font-size: 0.65rem; color: var(--muted); display: flex; align-items: center; gap: 0.3rem; }
        .status-dot { width: 6px; height: 6px; background: #27c93f; border-radius: 50%; }
        .icon-btn { color: var(--muted); cursor: pointer; }

        .chat-window {
          flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem;
          background: radial-gradient(circle at bottom, rgba(0, 240, 255, 0.03) 0%, transparent 100%);
        }
        .message-wrapper { display: flex; gap: 0.75rem; max-width: 85%; }
        .message-wrapper.user { align-self: flex-end; flex-direction: row-reverse; }
        .message-icon {
          width: 24px; height: 24px; border-radius: 6px; background: rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: center; color: var(--muted); flex-shrink: 0;
        }
        .assistant .message-icon { background: rgba(0, 240, 255, 0.1); color: var(--primary); }
        .message-bubble {
          padding: 0.75rem; border-radius: 12px; font-size: 0.8rem; line-height: 1.4;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); color: #e0e0e0;
        }
        .user .message-bubble { background: var(--primary); color: #000; border: none; font-weight: 500; }
        
        .chat-input-area {
          padding: 1rem; border-top: 1px solid var(--border); display: flex; gap: 0.5rem;
          background: #0a0a0f;
        }
        .chat-input {
          flex: 1; background: rgba(255,255,255,0.05); border: 1px solid var(--border);
          border-radius: 8px; padding: 0.5rem 0.75rem; color: #fff; font-size: 0.8rem;
          outline: none; transition: border-color 0.2s;
        }
        .chat-input:focus { border-color: var(--primary); }
        .send-btn {
          width: 36px; height: 36px; background: var(--primary); color: #000;
          border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: transform 0.1s;
        }
        .send-btn:active { transform: scale(0.95); }
        .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .typing { display: flex; gap: 4px; padding: 0.5rem 0.75rem; }
        .dot { 
          width: 4px; height: 4px; background: var(--muted); border-radius: 50%; 
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </div>
  );
}
