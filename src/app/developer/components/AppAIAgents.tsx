'use client';

import { useState } from 'react';
import { updateAppAIAgents } from '@/app/actions/developer';
import { Bot, Save, Sparkles, Cpu, MessagesSquare } from 'lucide-react';

export function AppAIAgents({ app }: { app: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    openaiApiKey: app.openaiApiKey || '',
    geminiApiKey: app.geminiApiKey || '',
    anthropicApiKey: app.anthropicApiKey || '',
    deepseekApiKey: app.deepseekApiKey || ''
  });
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    
    try {
      const result = await updateAppAIAgents(app.id, formData);
      if (result.success) {
        setMessage({ text: 'AI Agent keys saved successfully.', type: 'success' });
      } else {
        setMessage({ text: result.message || 'Failed to save keys.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Error communicating with server.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {message && (
        <div className={`form-alert ${message.type}`} style={{ padding: '0.6rem', fontSize: '0.8rem' }}>
          {message.text}
        </div>
      )}

      {/* OpenAI / ChatGPT */}
      <div className="provider-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div className="social-icon" style={{ background: '#10a37f' }}><Bot size={14} /></div>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>OpenAI (ChatGPT)</span>
        </div>
        <div className="form-group">
          <input 
            className="form-input" 
            style={{ fontSize: '0.75rem' }}
            type="password"
            placeholder="sk-proj-..."
            value={formData.openaiApiKey}
            onChange={(e) => setFormData({...formData, openaiApiKey: e.target.value})}
          />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.25rem 0' }} />

      {/* Gemini */}
      <div className="provider-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div className="social-icon" style={{ background: '#1a73e8' }}><Sparkles size={14} /></div>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Google Gemini</span>
        </div>
        <div className="form-group">
          <input 
            className="form-input" 
            style={{ fontSize: '0.75rem' }}
            type="password"
            placeholder="AIzaSy..."
            value={formData.geminiApiKey}
            onChange={(e) => setFormData({...formData, geminiApiKey: e.target.value})}
          />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.25rem 0' }} />

      {/* Anthropic Claude */}
      <div className="provider-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div className="social-icon" style={{ background: '#d97757' }}><MessagesSquare size={14} /></div>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Anthropic (Claude)</span>
        </div>
        <div className="form-group">
          <input 
            className="form-input" 
            style={{ fontSize: '0.75rem' }}
            type="password"
            placeholder="sk-ant-..."
            value={formData.anthropicApiKey}
            onChange={(e) => setFormData({...formData, anthropicApiKey: e.target.value})}
          />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.25rem 0' }} />

      {/* DeepSeek */}
      <div className="provider-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div className="social-icon" style={{ background: '#4d6bfe' }}><Cpu size={14} /></div>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>DeepSeek</span>
        </div>
        <div className="form-group">
          <input 
            className="form-input" 
            style={{ fontSize: '0.75rem' }}
            type="password"
            placeholder="sk-..."
            value={formData.deepseekApiKey}
            onChange={(e) => setFormData({...formData, deepseekApiKey: e.target.value})}
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSaving}
        className="btn btn-primary" 
        style={{ background: 'var(--primary)', color: '#000', width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
      >
        <Save size={16} style={{ marginRight: '4px' }} />
        {isSaving ? 'Saving...' : 'Save AI Agent Keys'}
      </button>

      <style jsx>{`
        .social-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; }
        .provider-group { display: flex; flex-direction: column; }
      `}</style>
    </form>
  );
}
