/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle, MessageSquarePlus, MessageSquare } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AppAIPlayground({ app }: { app: any }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Thread state
  const [threads, setThreads] = useState<any[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Load threads on mount
  useEffect(() => {
    fetchThreads();
  }, [app.id]);

  async function fetchThreads() {
    try {
      const res = await fetch(`/api/agent/threads?appId=${app.id}`);
      if (res.ok) {
        const data = await res.json();
        setThreads(data.threads || []);
      }
    } catch (e) {
      console.error('Failed to fetch threads', e);
    }
  }

  async function loadThread(threadId: string) {
    setActiveThreadId(threadId);
    try {
      const res = await fetch(`/api/agent/threads/${threadId}`);
      if (res.ok) {
        const data = await res.json();
        const formatted = data.messages.map((m: any) => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.content
        }));
        setMessages(formatted);
      }
    } catch (e) {
      console.error('Failed to load thread messages', e);
    }
  }

  function createNewThread() {
    setActiveThreadId(null);
    setMessages([]);
  }

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
          threadId: activeThreadId,
          config: {
            model: app.aiModel || 'gemini-1.5-flash',
            systemPrompt: app.aiSystemPrompt || 'You are a helpful assistant for ' + app.name,
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to get response from agent');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      
      if (!activeThreadId && data.threadId) {
        setActiveThreadId(data.threadId);
        fetchThreads(); // Refresh thread list to show the new thread
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while communicating with the agent.');
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please check your AI configuration.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="playground-layout">
      {/* Sidebar for Threads */}
      <div className="sidebar">
        <button onClick={createNewThread} className="btn-new-thread">
          <MessageSquarePlus size={16} /> New Chat
        </button>
        <div className="thread-list">
          {threads.map((t: any) => (
            <button 
              key={t.id} 
              className={`thread-item ${activeThreadId === t.id ? 'active' : ''}`}
              onClick={() => loadThread(t.id)}
            >
              <MessageSquare size={14} />
              <span className="truncate">{t.title || 'New Conversation'}</span>
            </button>
          ))}
        </div>
      </div>

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
            onClick={createNewThread}
          >
            Clear Chat
          </button>
        </div>

        <div className="chat-viewport">
          {messages.length === 0 ? (
            <div className="empty-state">
              <Sparkles size={40} style={{ color: 'var(--primary)', marginBottom: '1rem', opacity: 0.5 }} />
              <p>Start a conversation to test your agent's persistent memory.</p>
            </div>
          ) : (
            messages.map((msg: any, i: number) => (
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
      </div>

      <style jsx>{`
        .playground-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 1.5rem;
          height: 600px;
        }
        .sidebar {
          background: rgba(0,0,0,0.2);
          border-radius: 16px;
          border: 1px solid var(--border);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow: hidden;
        }
        .btn-new-thread {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--primary);
          color: #000;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .btn-new-thread:hover {
          transform: scale(1.02);
        }
        .thread-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          scrollbar-width: thin;
        }
        .thread-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: transparent;
          border: 1px solid transparent;
          color: var(--muted);
          padding: 0.6rem;
          border-radius: 8px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .thread-item:hover {
          background: rgba(255,255,255,0.05);
          color: var(--foreground);
        }
        .thread-item.active {
          background: rgba(var(--primary-rgb), 0.1);
          color: var(--primary);
          border-color: var(--primary);
        }
        .truncate {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .playground-container {
          display: flex;
          flex-direction: column;
          height: 100%;
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
        .btn-clear:hover {
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
