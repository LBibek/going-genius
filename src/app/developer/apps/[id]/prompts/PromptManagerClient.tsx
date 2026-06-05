'use client';

import { useState } from 'react';
import { createPrompt, addPromptVersion, setLiveVersion } from '@/app/actions/ai';
import { Plus, CheckCircle, Clock } from 'lucide-react';

export function PromptManagerClient({ appId, initialPrompts }: { appId: string, initialPrompts: any[] }) {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newContent, setNewContent] = useState('');

  const [activePromptId, setActivePromptId] = useState<string | null>(null);
  const [newVersionContent, setNewVersionContent] = useState('');
  const [newVariantLabel, setNewVariantLabel] = useState('');

  const handleCreatePrompt = async () => {
    if (!newName || !newContent) return;
    try {
      const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await createPrompt(appId, { name: newName, slug, content: newContent });
      // In a real app we'd re-fetch, but Server Actions with revalidatePath will handle the refresh
      window.location.reload();
    } catch (err) {
      alert('Failed to create prompt');
    }
  };

  const handleAddVersion = async (promptId: string) => {
    if (!newVersionContent || !newVariantLabel) return;
    try {
      await addPromptVersion(promptId, appId, { content: newVersionContent, variantLabel: newVariantLabel });
      window.location.reload();
    } catch (err) {
      alert('Failed to add version');
    }
  };

  const handleSetLive = async (versionId: string, promptId: string) => {
    try {
      await setLiveVersion(versionId, promptId, appId);
      window.location.reload();
    } catch (err) {
      alert('Failed to set live version');
    }
  };

  return (
    <div className="space-y-8">
      {prompts.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-muted-light mb-4">No AI Prompts found. Create one to get started.</p>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            Create System Prompt
          </button>
        </div>
      ) : (
        <div className="flex justify-end">
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus size={16} /> New Prompt
          </button>
        </div>
      )}

      {isCreating && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Create New Prompt</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name (e.g., Sales Bot)</label>
              <input 
                type="text" 
                value={newName} 
                onChange={e => setNewName(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">System Instructions</label>
              <textarea 
                value={newContent} 
                onChange={e => setNewContent(e.target.value)}
                rows={4}
                className="w-full bg-background border border-border rounded-md px-3 py-2 font-mono text-sm"
                placeholder="You are a helpful assistant..."
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreatePrompt} className="bg-primary text-primary-foreground px-4 py-2 rounded-md">Save</button>
              <button onClick={() => setIsCreating(false)} className="bg-muted text-muted-foreground px-4 py-2 rounded-md">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {prompts.map((prompt: any) => (
          <div key={prompt.id} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{prompt.name}</h3>
                <p className="text-sm text-muted-light font-mono mt-1">Slug: {prompt.slug}</p>
              </div>
              <button 
                onClick={() => setActivePromptId(activePromptId === prompt.id ? null : prompt.id)}
                className="text-sm text-primary hover:underline"
              >
                {activePromptId === prompt.id ? 'Cancel New Version' : 'Add Variant'}
              </button>
            </div>

            {activePromptId === prompt.id && (
              <div className="p-6 bg-background border-b border-border">
                <h4 className="text-sm font-bold mb-3">Create A/B Variant</h4>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Variant Label (e.g., Aggressive Sales)" 
                    value={newVariantLabel}
                    onChange={e => setNewVariantLabel(e.target.value)}
                    className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm"
                  />
                  <textarea 
                    placeholder="Variant System Instructions..." 
                    value={newVersionContent}
                    onChange={e => setNewVersionContent(e.target.value)}
                    rows={3}
                    className="w-full bg-card border border-border rounded-md px-3 py-2 font-mono text-sm"
                  />
                  <button 
                    onClick={() => handleAddVersion(prompt.id)}
                    className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm"
                  >
                    Save Variant
                  </button>
                </div>
              </div>
            )}

            <div className="divide-y divide-border">
              {prompt.versions.map((v: any) => (
                <div key={v.id} className={`p-6 ${v.isLive ? 'bg-indigo-500/5' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm bg-background border border-border px-2 py-1 rounded">v{v.version}</span>
                      <span className="font-medium">{v.variantLabel}</span>
                      {v.isLive ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
                          <CheckCircle size={12} /> LIVE
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleSetLive(v.id, prompt.id)}
                          className="flex items-center gap-1 text-xs text-muted-light hover:text-primary transition-colors bg-background border border-border px-2 py-1 rounded-full"
                        >
                          <Clock size={12} /> Set Live
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-muted-light">{new Date(v.createdAt).toLocaleDateString()}</span>
                  </div>
                  <pre className="text-sm text-muted-light bg-background p-4 rounded-md border border-border overflow-x-auto whitespace-pre-wrap">
                    {v.content}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
