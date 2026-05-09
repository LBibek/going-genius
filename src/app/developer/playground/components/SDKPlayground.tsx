'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, RefreshCw, Code2, Eye, Copy, Check, Sparkles } from 'lucide-react';

interface BotConfig {
  appId: string;
  greeting: string;
  theme: 'dark' | 'glass' | 'light';
  position: 'bottom-right' | 'bottom-left';
  botName: string;
  primaryColor: string;
}

interface PlaygroundMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function SDKPlayground() {
  const [config, setConfig] = useState<BotConfig>({
    appId: '',
    greeting: "Hi! I'm your AI assistant. How can I help you today?",
    theme: 'glass',
    position: 'bottom-right',
    botName: 'AI Assistant',
    primaryColor: '#00F0FF',
  });
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: config.greeting }]);
    setThreadId(null);
  }, [config.greeting]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping || !config.appId) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`/api/v1/apps/${config.appId}/bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, threadId })
      });
      const data = await res.json();
      if (data.threadId && !threadId) setThreadId(data.threadId);
      setMessages(prev => [...prev, { role: 'assistant', content: data.text || 'Error: No response' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to connect. Check your App ID.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const generatedCode = `import { AISalesBot } from '@going-genius/react';

export default function MyApp() {
  return (
    <>
      {/* Your app content */}
      <AISalesBot
        appId="${config.appId || 'YOUR_APP_ID'}"
        botName="${config.botName}"
        greeting="${config.greeting}"
        theme="${config.theme}"
        position="${config.position}"
        apiHost="https://gguser.com"
      />
    </>
  );
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bg = config.theme === 'dark' ? '#0A0A0F' : config.theme === 'glass' ? 'rgba(10,10,15,0.9)' : '#FFF';
  const textColor = config.theme === 'light' ? '#000' : '#FFF';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'start' }}>

      {/* Config Panel */}
      <div className="glass-card" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} style={{ color: 'var(--primary)' }} /> Configure Bot
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>App ID *</label>
            <input
              className="input-field"
              placeholder="Paste your App ID"
              value={config.appId}
              onChange={e => setConfig(p => ({ ...p, appId: e.target.value }))}
              style={{ width: '100%', fontSize: '0.8rem' }}
            />
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.3rem' }}>
              Find this in Developer → Your App → Overview
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>Bot Name</label>
            <input
              className="input-field"
              value={config.botName}
              onChange={e => setConfig(p => ({ ...p, botName: e.target.value }))}
              style={{ width: '100%', fontSize: '0.8rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>Greeting Message</label>
            <textarea
              className="input-field"
              value={config.greeting}
              onChange={e => setConfig(p => ({ ...p, greeting: e.target.value }))}
              rows={3}
              style={{ width: '100%', fontSize: '0.8rem', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>Theme</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['dark', 'glass', 'light'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setConfig(p => ({ ...p, theme: t }))}
                  className="btn btn-secondary btn-sm"
                  style={{
                    flex: 1, fontSize: '0.75rem', padding: '0.3rem 0',
                    background: config.theme === t ? 'var(--primary)' : undefined,
                    color: config.theme === t ? '#000' : undefined,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>Position</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['bottom-right', 'bottom-left'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setConfig(c => ({ ...c, position: p }))}
                  className="btn btn-secondary btn-sm"
                  style={{
                    flex: 1, fontSize: '0.7rem', padding: '0.3rem 0',
                    background: config.position === p ? 'var(--primary)' : undefined,
                    color: config.position === p ? '#000' : undefined,
                  }}
                >
                  {p === 'bottom-right' ? '↘ Right' : '↙ Left'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>Primary Color</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="color"
                value={config.primaryColor}
                onChange={e => setConfig(p => ({ ...p, primaryColor: e.target.value }))}
                style={{ width: '36px', height: '36px', borderRadius: '6px', cursor: 'pointer', border: 'none', background: 'none' }}
              />
              <input
                className="input-field"
                value={config.primaryColor}
                onChange={e => setConfig(p => ({ ...p, primaryColor: e.target.value }))}
                style={{ flex: 1, fontSize: '0.8rem' }}
              />
            </div>
          </div>

          <button
            onClick={() => { setMessages([{ role: 'assistant', content: config.greeting }]); setThreadId(null); }}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', fontSize: '0.85rem' }}
          >
            <RefreshCw size={14} /> Reset Conversation
          </button>
        </div>
      </div>

      {/* Preview / Code Panel */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('preview')}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem',
              background: activeTab === 'preview' ? 'var(--primary)' : undefined,
              color: activeTab === 'preview' ? '#000' : undefined,
            }}
          >
            <Eye size={14} /> Live Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem',
              background: activeTab === 'code' ? 'var(--primary)' : undefined,
              color: activeTab === 'code' ? '#000' : undefined,
            }}
          >
            <Code2 size={14} /> Generated Code
          </button>
        </div>

        {activeTab === 'preview' && (
          <div>
            {!config.appId && (
              <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#f59e0b' }}>
                ⚠️ Enter your App ID in the config panel to enable real AI responses.
              </div>
            )}

            {/* Simulated bot window */}
            <div style={{
              width: '100%', maxWidth: '420px', height: '540px', margin: '0 auto',
              background: bg, backdropFilter: 'blur(16px)', color: textColor,
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
              {/* Header */}
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', background: config.primaryColor, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Sparkles size={16} color="#000" />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{config.botName}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', background: '#27c93f', borderRadius: '50%' }} /> Online
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{
                    maxWidth: '85%', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    padding: '0.65rem 0.85rem', borderRadius: '12px', fontSize: '0.85rem', lineHeight: 1.5,
                    background: msg.role === 'user' ? config.primaryColor : 'rgba(255,255,255,0.06)',
                    color: msg.role === 'user' ? '#000' : textColor,
                    border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  }}>
                    {msg.content}
                  </div>
                ))}
                {isTyping && (
                  <div style={{ alignSelf: 'flex-start', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                    Typing...
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSend} style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.1)' }}>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={config.appId ? 'Type a message...' : 'Enter App ID to chat...'}
                  disabled={isTyping || !config.appId}
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', padding: '0.55rem 0.75rem', color: textColor, fontSize: '0.85rem', outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping || !config.appId}
                  style={{
                    width: '38px', height: '38px', background: config.primaryColor, color: '#000',
                    border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', opacity: (!input.trim() || isTyping || !config.appId) ? 0.4 : 1,
                    flexShrink: 0
                  }}
                >
                  <Play size={15} />
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: 0 }}>
                Install: <code style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>npm install @going-genius/react</code>
              </p>
              <button onClick={handleCopy} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
              </button>
            </div>
            <div style={{ background: '#000', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', overflowX: 'auto' }}>
              <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', color: '#a5b4fc', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                {generatedCode}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
