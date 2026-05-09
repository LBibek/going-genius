/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateAppAIAgents } from '@/app/actions/developer';
import { Bot, Save, Sparkles, Cpu, MessagesSquare, Zap } from 'lucide-react';

export function AppAIAgents({ app }: { app: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    openaiApiKey: app.openaiApiKey || '',
    geminiApiKey: app.geminiApiKey || '',
    anthropicApiKey: app.anthropicApiKey || '',
    deepseekApiKey: app.deepseekApiKey || '',
    systemPrompt: app.systemPrompt || '',
    leadCaptureEnabled: app.leadCaptureEnabled || false
  });
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    
    try {
      const result = await updateAppAIAgents(app.id, formData);
      if (result.success) {
        setMessage({ text: 'AI Agent configurations saved successfully.', type: 'success' });
        router.refresh();
      } else {
        setMessage({ text: result.message || 'Failed to save config.', type: 'error' });
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

      {/* System Prompt Section */}
      <div className="provider-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div className="social-icon" style={{ background: 'var(--primary)' }}><Sparkles size={14} style={{ color: '#000' }} /></div>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Global System Prompt</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
          Define the personality, rules, and knowledge base for your AI agent. This will be applied to all chat sessions.
        </p>
        <div className="form-group">
          <textarea 
            className="form-input" 
            style={{ fontSize: '0.85rem', minHeight: '120px', resize: 'vertical', fontFamily: 'monospace' }}
            placeholder="You are a helpful assistant for Going Genius users..."
            value={formData.systemPrompt}
            onChange={(e) => setFormData({...formData, systemPrompt: e.target.value})}
          />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />

      {/* Lead Capture Mode */}
      <div className="provider-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="social-icon" style={{ background: '#3b82f6' }}><Bot size={14} /></div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Lead Capture Mode (CRM)</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Turn your AI agent into a sales qualification machine.</div>
            </div>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={formData.leadCaptureEnabled}
              onChange={(e) => setFormData({...formData, leadCaptureEnabled: e.target.checked})}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <h3 style={{ fontSize: '0.9rem', margin: '0.5rem 0 0.25rem 0', color: 'var(--muted)' }}>Model Provider Keys</h3>

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
          <div className="social-icon" style={{ background: '#1a73e8' }}><Zap size={14} /></div>
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
        
        /* Switch Toggle */
        .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #333; transition: .4s; }
        .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; }
        input:checked + .slider { background-color: var(--primary); }
        input:focus + .slider { box-shadow: 0 0 1px var(--primary); }
        input:checked + .slider:before { transform: translateX(20px); }
        .slider.round { border-radius: 20px; }
        .slider.round:before { border-radius: 50%; }
      `}</style>
    </form>
  );
}
