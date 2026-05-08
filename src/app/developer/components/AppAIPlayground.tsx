'use client';

import { useState } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AppAIPlayground({ app }: { app: any }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);
    setError(null);

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          appId: app.id,
          config: {
            model: app.aiModel || 'gemini-1.5-flash',
            systemPrompt: app.aiSystemPrompt || 'You are a helpful assistant for ' + app.name,
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to get response from agent');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      setError(err.message || 'An error occurred while communicating with the agent.');
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please check your AI configuration.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="playground-container">
      <div className="playground-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="bot-avatar">
            <Bot size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{app.name} AI Assistant</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Model: {app.aiModel || 'Gemini 1.5 Flash'}</div>
          </div>
        </div>
        <button 
          className="btn-clear" 
          onClick={() => setMessages([])}
          disabled={messages.length === 0}
        >
          Clear Chat
        </button>
      </div>

      <div className="chat-viewport">
        {messages.length === 0 ? (
          <div className="empty-state">
            <Sparkles size={40} style={{ color: 'var(--primary)', marginBottom: '1rem', opacity: 0.5 }} />
            <p>Start a conversation to test your agent's responses and system instructions.</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`message-row ${msg.role}`}>
              <div className="message-bubble">
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="message-row assistant">
            <div className="message-bubble typing">
              <Loader2 size={16} className="animate-spin" />
              Thinking...
            </div>
          </div>
        )}
        {error && (
          <div className="error-banner">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </div>

      <form className="input-area" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message to test your agent..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping || !input.trim()}>
          <Send size={18} />
        </button>
      </form>

      <style jsx>{`
        .playground-container {
          display: flex;
          flex-direction: column;
          height: 600px;
          background: rgba(0,0,0,0.2);
          border-radius: 16px;
          border: 1px solid var(--border);
          overflow: hidden;
        }
        .playground-header {
          padding: 1rem 1.5rem;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .bot-avatar {
          width: 36px;
          height: 36px;
          background: var(--primary);
          color: #000;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-clear {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--muted);
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-clear:hover:not(:disabled) {
          background: rgba(255,0,0,0.1);
          color: #ff4d4d;
          border-color: #ff4d4d;
        }
        .chat-viewport {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          scrollbar-width: thin;
        }
        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--muted);
          font-size: 0.85rem;
          max-width: 300px;
          margin: 0 auto;
        }
        .message-row {
          display: flex;
          width: 100%;
        }
        .message-row.user { justify-content: flex-end; }
        .message-row.assistant { justify-content: flex-start; }
        
        .message-bubble {
          max-width: 80%;
          padding: 0.8rem 1.2rem;
          border-radius: 18px;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .user .message-bubble {
          background: var(--primary);
          color: #000;
          border-bottom-right-radius: 4px;
        }
        .assistant .message-bubble {
          background: var(--glass);
          color: var(--foreground);
          border: 1px solid var(--border);
          border-bottom-left-radius: 4px;
        }
        .message-bubble.typing {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--muted);
        }
        .input-area {
          padding: 1.25rem;
          background: rgba(0,0,0,0.3);
          border-top: 1px solid var(--border);
          display: flex;
          gap: 0.75rem;
        }
        .input-area input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          color: white;
          outline: none;
        }
        .input-area input:focus { border-color: var(--primary); }
        .input-area button {
          background: var(--primary);
          color: #000;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .input-area button:hover { transform: scale(1.05); }
        .input-area button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        
        .error-banner {
          background: rgba(255, 77, 77, 0.1);
          color: #ff4d4d;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
}
