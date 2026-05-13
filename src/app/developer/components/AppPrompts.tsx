'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Save, 
  History, 
  Rocket, 
  Trash2, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  Play,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { createPrompt, createPromptVersion, setLiveVersion, deletePrompt, getPrompts } from '../prompt-actions';
import { toast } from 'react-hot-toast';

export function AppPrompts({ app }: { app: any }) {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newPrompt, setNewPrompt] = useState({ name: '', slug: '' });
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    loadPrompts();
  }, []);

  async function loadPrompts() {
    try {
      const data = await getPrompts(app.id);
      setPrompts(data);
      if (data.length > 0 && !selectedPrompt) {
        handleSelectPrompt(data[0]);
      }
    } catch (error) {
      toast.error('Failed to load prompts');
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectPrompt(prompt: any) {
    setSelectedPrompt(prompt);
    const live = prompt.versions.find((v: any) => v.isLive) || prompt.versions[0];
    setSelectedVersion(live);
    setEditorContent(live?.content || '');
  }

  async function handleCreatePrompt() {
    if (!newPrompt.name || !newPrompt.slug) return;
    try {
      const p = await createPrompt(app.id, newPrompt.name, newPrompt.slug);
      toast.success('Prompt created');
      setIsAdding(false);
      setNewPrompt({ name: '', slug: '' });
      await loadPrompts();
    } catch (error) {
      toast.error('Failed to create prompt');
    }
  }

  async function handleSaveVersion() {
    if (!selectedPrompt) return;
    try {
      const v = await createPromptVersion(selectedPrompt.id, editorContent, selectedVersion?.config || {});
      toast.success(`Version ${v.version} saved`);
      await loadPrompts();
      // Keep selected version as the newly created one
      setSelectedVersion(v);
    } catch (error) {
      toast.error('Failed to save version');
    }
  }

  async function handleSetLive(versionId: string) {
    try {
      await setLiveVersion(selectedPrompt.id, versionId);
      toast.success('Version deployed to live');
      await loadPrompts();
    } catch (error) {
      toast.error('Failed to deploy version');
    }
  }

  async function handleDelete() {
    if (!selectedPrompt || !confirm('Are you sure? This will delete all versions.')) return;
    try {
      await deletePrompt(selectedPrompt.id);
      toast.success('Prompt deleted');
      setSelectedPrompt(null);
      await loadPrompts();
    } catch (error) {
      toast.error('Failed to delete prompt');
    }
  }

  if (isLoading) return <div className="animate-pulse" style={{ height: '400px', background: 'var(--glass)', borderRadius: '16px' }} />;

  return (
    <div className="prompt-manager-grid">
      {/* Sidebar: Prompt List */}
      <div className="glass-card sidebar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Prompts</h3>
          <button onClick={() => setIsAdding(true)} className="btn-icon" title="New Prompt">
            <Plus size={18} />
          </button>
        </div>

        <div className="prompt-list">
          {prompts.map((p: any) => (
            <button 
              key={p.id} 
              className={`prompt-item ${selectedPrompt?.id === p.id ? 'active' : ''}`}
              onClick={() => handleSelectPrompt(p)}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>/{p.slug}</div>
              </div>
              <ChevronRight size={14} opacity={0.5} />
            </button>
          ))}
        </div>

        {isAdding && (
          <div className="new-prompt-form animate-fade-in">
            <input 
              placeholder="Name (e.g. Support Bot)" 
              value={newPrompt.name}
              onChange={(e) => setNewPrompt({ ...newPrompt, name: e.target.value })}
            />
            <input 
              placeholder="Slug (e.g. support)" 
              value={newPrompt.slug}
              onChange={(e) => setNewPrompt({ ...newPrompt, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleCreatePrompt} className="btn btn-primary" style={{ flex: 1, padding: '0.4rem' }}>Add</button>
              <button onClick={() => setIsAdding(false)} className="btn btn-outline" style={{ flex: 1, padding: '0.4rem' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Main Area: Editor & Versions */}
      {selectedPrompt ? (
        <div className="main-editor">
          <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{selectedPrompt.name}</h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Slug: <code>/{selectedPrompt.slug}</code></p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleDelete} className="btn-icon danger" title="Delete Prompt">
                  <Trash2 size={18} />
                </button>
                <button onClick={handleSaveVersion} className="btn btn-primary" style={{ background: 'var(--primary)', color: '#000', gap: '0.5rem' }}>
                  <Save size={16} /> Save Version
                </button>
              </div>
            </div>

            <div className="editor-container">
              <div className="version-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                  <History size={14} /> Version History
                </div>
                <div className="version-list">
                  {selectedPrompt.versions.map((v: any) => (
                    <button 
                      key={v.id} 
                      className={`version-item ${selectedVersion?.id === v.id ? 'active' : ''} ${v.isLive ? 'live' : ''}`}
                      onClick={() => {
                        setSelectedVersion(v);
                        setEditorContent(v.content);
                      }}
                    >
                      <span>v{v.version}</span>
                      {v.isLive ? <CheckCircle2 size={12} color="#4ade80" /> : <Clock size={12} opacity={0.5} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="content-editor">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                   <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>System Message / Prompt Content</span>
                   {selectedVersion?.isLive ? (
                     <span style={{ fontSize: '0.75rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                       <Rocket size={12} /> This version is LIVE
                     </span>
                   ) : (
                     <button onClick={() => handleSetLive(selectedVersion.id)} className="btn-text" style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>
                       Deploy to Live
                     </button>
                   )}
                </div>
                <textarea 
                  className="prompt-textarea"
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  placeholder="Enter prompt content here... Use {{variable}} for dynamic data."
                />
              </div>
            </div>

            <div className="playground-mini">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Play size={16} color="var(--primary)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quick Test</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="glass-card" style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>VARIABLES (JSON)</div>
                  <pre style={{ fontSize: '0.8rem', color: 'var(--primary)', margin: 0 }}>{`{\n  "company": "Going Genius",\n  "user": "Developer"\n}`}</pre>
                </div>
                <div style={{ flex: 2 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>PREVIEW</div>
                  <div className="preview-bubble">
                    {editorContent.replace(/{{company}}/g, 'Going Genius').replace(/{{user}}/g, 'Developer')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card empty-state">
          <Sparkles size={48} color="var(--primary)" style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <h3>Select a prompt to edit</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Manage your AI system messages and version history here.</p>
        </div>
      )}

      <style jsx>{`
        .prompt-manager-grid {
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

        .prompt-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .prompt-item {
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

        .prompt-item:hover {
          background: rgba(255,255,255,0.05);
        }

        .prompt-item.active {
          background: rgba(var(--primary-rgb), 0.1);
          border-color: var(--primary);
        }

        .new-prompt-form {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .new-prompt-form input {
          width: 100%;
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 0.5rem;
          color: #fff;
          font-size: 0.8rem;
        }

        .main-editor {
          height: 100%;
        }

        .editor-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex: 1;
        }

        .version-bar {
          background: rgba(0,0,0,0.2);
          padding: 0.75rem;
          border-radius: 12px;
        }

        .version-list {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }

        .version-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          border: 1px solid var(--glass-border);
          background: transparent;
          color: var(--muted);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .version-item.active {
          background: var(--primary);
          color: #000;
          border-color: var(--primary);
        }

        .version-item.live {
          border-color: #4ade80;
        }

        .content-editor {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .prompt-textarea {
          flex: 1;
          min-height: 250px;
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 1.25rem;
          color: #e2e8f0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          line-height: 1.6;
          resize: none;
          outline: none;
        }

        .prompt-textarea:focus {
          border-color: var(--primary);
        }

        .playground-mini {
          padding-top: 1.5rem;
          border-top: 1px solid var(--glass-border);
        }

        .preview-bubble {
          padding: 1rem;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          font-size: 0.85rem;
          line-height: 1.5;
          color: #cbd5e1;
          min-height: 60px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 5rem;
        }

        .btn-icon {
          background: transparent;
          border: none;
          color: var(--muted);
          cursor: pointer;
          padding: 0.4rem;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .btn-icon:hover {
          background: rgba(255,255,255,0.1);
          color: var(--foreground);
        }

        .btn-icon.danger:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .btn-text {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          font-weight: 600;
        }

        .btn-text:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
