'use client';

import { useState } from 'react';
import { createAppInvite, deleteAppInvite } from '@/app/actions/developer';
import { Copy, Trash2, Plus, Check, Clock, Share2, ExternalLink } from 'lucide-react';

export function AppInvites({ appId, invites }: { appId: string, invites: any[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCreate = async () => {
    setIsCreating(true);
    await createAppInvite(appId);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this invite?')) return;
    await deleteAppInvite(id);
  };

  const getInviteUrl = (token: string) => `${window.location.origin}/join/${token}`;

  const copyInviteLink = async (token: string) => {
    const link = getInviteUrl(token);
    await navigator.clipboard.writeText(link);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const shareInviteLink = async (token: string) => {
    const link = getInviteUrl(token);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join our Application',
          text: 'You have been invited to join an application on GGUser.',
          url: link,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyInviteLink(token);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <button 
        onClick={handleCreate}
        disabled={isCreating}
        className="btn btn-primary" 
        style={{ background: 'var(--primary)', color: '#000', width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
      >
        <Plus size={16} style={{ marginRight: '4px' }} />
        {isCreating ? 'Generating...' : 'Generate New Invite Link'}
      </button>

      {invites.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem' }}>
          No active invite links.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          {invites.map((invite) => (
            <div key={invite.id} className="glass-card" style={{ padding: '1rem', borderRadius: '14px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={14} color="var(--muted)" />
                  <span suppressHydrationWarning style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 600 }}>
                    EXPIRES {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(invite.expiresAt))}
                  </span>
                </div>
                <button 
                  onClick={() => handleDelete(invite.id)}
                  style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', opacity: 0.6 }}
                  title="Revoke Invite"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ 
                background: '#000', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                fontSize: '0.8rem', 
                color: 'var(--primary)', 
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                marginBottom: '1rem',
                border: '1px solid var(--border)'
              }}>
                {getInviteUrl(invite.token)}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => copyInviteLink(invite.token)}
                  className="btn btn-outline"
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem', justifyContent: 'center' }}
                >
                  {copiedToken === invite.token ? <><Check size={14} style={{ marginRight: '4px' }} /> Copied</> : <><Copy size={14} style={{ marginRight: '4px' }} /> Copy Link</>}
                </button>
                <button 
                  onClick={() => shareInviteLink(invite.token)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.75rem', padding: '0.5rem', width: '40px', justifyContent: 'center' }}
                  title="Share Link"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
