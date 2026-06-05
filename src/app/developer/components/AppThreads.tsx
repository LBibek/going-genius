'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Clock, User, Bot, Sparkles, ChevronRight } from 'lucide-react';

export function AppThreads({ app }: { app: any }) {
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchThreads();
  }, [app.id]);

  async function fetchThreads() {
    try {
      // Create a developer-specific endpoint if needed, or re-use the agent one 
      // Actually we'll need a new server action or API since the agent one filters by session.userId
      const res = await fetch(`/api/developer/apps/${app.id}/threads`);
      if (res.ok) {
        const data = await res.json();
        setThreads(data.threads || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadThread(threadId: string) {
    const thread = threads.find(t => t.id === threadId);
    setSelectedThread(thread);
    try {
      const res = await fetch(`/api/developer/apps/${app.id}/threads/${threadId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (isLoading) return <div className="animate-pulse" style={{ height: '400px', background: 'var(--glass)', borderRadius: '16px' }} />;

  return (
    <div className="threads-manager-grid">
      {/* Sidebar: Thread List */}
      <div className="glass-card sidebar">
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>User Conversations</h3>
        
        <div className="thread-list">
          {threads.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No conversations yet.</p>
          ) : (
            threads.map((t: any) => (
              <button 
                key={t.id} 
                className={`thread-item ${selectedThread?.id === t.id ? 'active' : ''}`}
                onClick={() => loadThread(t.id)}
              >
                <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }} className="truncate">{t.title || 'Untitled Thread'}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                    <Clock size={10} /> {new Date(t.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <ChevronRight size={14} opacity={0.5} />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Area: Transcript Viewer */}
      {selectedThread ? (
        <div className="main-viewer">
          <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
              <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{selectedThread.title}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                User ID: <code>{selectedThread.userId || 'Anonymous'}</code>
              </p>
            </div>

            <div className="chat-transcript">
              {messages.map((msg: any, i: number) => (
                <div key={i} className={`message-row ${msg.role}`}>
                  <div className="message-icon">
                    {msg.role === 'model' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className="message-bubble">
                    {msg.content}
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-center text-muted-foreground text-sm mt-10">Loading messages...</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card empty-state">
          <Sparkles size={48} color="var(--primary)" style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <h3>Select a conversation</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Read anonymized transcripts to understand how users interact with your AI.</p>
        </div>
      )}

      <style jsx>{`
        .threads-manager-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 1.5rem;
          min-height: 600px;
        }
        .sidebar {
          display: flex;
          flex-direction: column;
          padding: 1.25rem;
        }
        .thread-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          overflow-y: auto;
          flex: 1;
        }
        .thread-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid transparent;
          background: rgba(255,255,255,0.02);
          color: var(--foreground);
          cursor: pointer;
          transition: all 0.2s;
        }
        .thread-item:hover {
          background: rgba(255,255,255,0.05);
        }
        .thread-item.active {
          background: rgba(var(--primary-rgb), 0.1);
          border-color: var(--primary);
        }
        .truncate {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .main-viewer {
          height: 100%;
        }
        .chat-transcript {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-right: 0.5rem;
          scrollbar-width: thin;
        }
        .message-row {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .message-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .message-row.user .message-icon {
          background: rgba(255,255,255,0.1);
        }
        .message-row.model .message-icon {
          background: var(--primary);
          color: #000;
        }
        .message-bubble {
          flex: 1;
          font-size: 0.9rem;
          line-height: 1.5;
          padding-top: 0.3rem;
          white-space: pre-wrap;
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 5rem;
        }
      `}</style>
    </div>
  );
}
