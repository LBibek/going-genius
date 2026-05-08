'use client';

import { deleteAppUser, addAppUserDirectly, manualCreateAppUser, editAppUserInfo } from '@/app/actions/developer';
import { useState } from 'react';
import { UserPlus, UserMinus, Search, Mail, AtSign, Edit2, Check, X, Trash2 } from 'lucide-react';

export function AppUserList({ appId, users }: { appId: string, users: any[] }) {
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<'search' | 'manual' | null>(null);
  
  // Search state
  const [identifier, setIdentifier] = useState('');
  
  // Manual state
  const [manualData, setManualData] = useState({ email: '', displayName: '', username: '' });
  
  // Edit state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ displayName: '', metadata: '' });

  const [feedback, setFeedback] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  async function handleRevoke(userId: string) {
    if (!confirm('Are you sure you want to revoke access?')) return;
    setIsActionLoading(userId);
    try {
      await deleteAppUser(appId, userId);
      showFeedback('User access revoked.');
    } catch {
      showFeedback('Failed to revoke access.', 'error');
    } finally {
      setIsActionLoading(null);
    }
  }

  async function handleSearchAdd(e: React.FormEvent) {
    e.preventDefault();
    setIsActionLoading('adding');
    const result = await addAppUserDirectly(appId, identifier);
    if (result.success) {
      showFeedback(result.message!);
      setIdentifier('');
      setShowAddForm(null);
    } else {
      showFeedback(result.message!, 'error');
    }
    setIsActionLoading(null);
  }

  async function handleManualAdd(e: React.FormEvent) {
    e.preventDefault();
    setIsActionLoading('adding');
    const result = await manualCreateAppUser(appId, manualData);
    if (result.success) {
      showFeedback(result.message!);
      setManualData({ email: '', displayName: '', username: '' });
      setShowAddForm(null);
    } else {
      showFeedback(result.message!, 'error');
    }
    setIsActionLoading(null);
  }

  async function handleSaveEdit(userId: string) {
    setIsActionLoading(userId);
    try {
      let metadata = {};
      try { metadata = JSON.parse(editData.metadata); } catch {}
      
      const result = await editAppUserInfo(appId, userId, { 
        displayName: editData.displayName, 
        metadata 
      });
      
      if (result.success) {
        showFeedback('User updated.');
        setEditingUserId(null);
      } else {
        showFeedback(result.message!, 'error');
      }
    } catch {
      showFeedback('Error saving changes.', 'error');
    } finally {
      setIsActionLoading(null);
    }
  }

  const startEditing = (user: any) => {
    setEditingUserId(user.user.id);
    setEditData({
      displayName: user.user.displayName,
      metadata: JSON.stringify(user.metadata || {}, null, 2)
    });
  };

  return (
    <div className="user-list-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setShowAddForm(showAddForm === 'search' ? null : 'search')}
            className={`btn btn-outline ${showAddForm === 'search' ? 'active-tab' : ''}`}
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
          >
            <Search size={14} /> Search Existing
          </button>
          <button 
            onClick={() => setShowAddForm(showAddForm === 'manual' ? null : 'manual')}
            className={`btn btn-outline ${showAddForm === 'manual' ? 'active-tab' : ''}`}
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
          >
            <UserPlus size={14} /> Create Manual
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`form-alert ${feedback.type}`} style={{ marginBottom: '1rem', padding: '0.6rem' }}>
          {feedback.message}
        </div>
      )}

      {/* ─── Search Add Form ─── */}
      {showAddForm === 'search' && (
        <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem', border: '1px solid var(--primary)' }}>
          <form onSubmit={handleSearchAdd} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              className="form-input"
              style={{ fontSize: '0.85rem' }}
              placeholder="Enter email or username of existing GGUser"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={isActionLoading === 'adding'} style={{ background: 'var(--primary)', color: '#000' }}>
              Add User
            </button>
          </form>
        </div>
      )}

      {/* ─── Manual Add Form ─── */}
      {showAddForm === 'manual' && (
        <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.25rem', border: '1px solid var(--primary)' }}>
          <form onSubmit={handleManualAdd} className="grid-2-col">
            <div className="form-group">
              <label className="detail-label">Full Name</label>
              <input 
                className="form-input" 
                placeholder="John Doe"
                value={manualData.displayName}
                onChange={(e) => setManualData({...manualData, displayName: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="detail-label">Email Address</label>
              <input 
                className="form-input" 
                type="email" 
                placeholder="john@example.com"
                value={manualData.email}
                onChange={(e) => setManualData({...manualData, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="detail-label">Custom Username (Optional)</label>
              <input 
                className="form-input" 
                placeholder="leave blank for auto-gen"
                value={manualData.username}
                onChange={(e) => setManualData({...manualData, username: e.target.value})}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isActionLoading === 'adding'} style={{ background: 'var(--primary)', color: '#000', gridColumn: 'span 2' }}>
              {isActionLoading === 'adding' ? 'Creating...' : 'Create & Link User'}
            </button>
          </form>
        </div>
      )}

      {users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          <UserPlus size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
          <p>No users yet. Start by adding one above!</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.75rem 0', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Identity</th>
                <th style={{ padding: '0.75rem 0', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Metadata</th>
                <th style={{ padding: '0.75rem 0', textAlign: 'right', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item.user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 0' }}>
                    {editingUserId === item.user.id ? (
                      <input 
                        className="form-input" 
                        style={{ fontSize: '0.85rem' }}
                        value={editData.displayName}
                        onChange={(e) => setEditData({...editData, displayName: e.target.value})}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', background: 'var(--glass-hover)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                          {item.user.displayName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.user.displayName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{item.user.email}</div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    {editingUserId === item.user.id ? (
                      <textarea 
                        className="form-input" 
                        style={{ fontSize: '0.75rem', fontFamily: 'monospace', minHeight: '60px' }}
                        value={editData.metadata}
                        onChange={(e) => setEditData({...editData, metadata: e.target.value})}
                      />
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', maxHeight: '40px', overflow: 'hidden' }}>
                        {Object.keys(item.metadata || {}).length > 0 ? JSON.stringify(item.metadata) : 'No metadata'}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      {editingUserId === item.user.id ? (
                        <>
                          <button onClick={() => handleSaveEdit(item.user.id)} className="btn-icon success"><Check size={16} /></button>
                          <button onClick={() => setEditingUserId(null)} className="btn-icon"><X size={16} /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEditing(item)} className="btn-icon" title="Edit User"><Edit2 size={14} /></button>
                          <button onClick={() => handleRevoke(item.user.id)} className="btn-icon danger" title="Revoke Access"><Trash2 size={14} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .btn-icon {
          width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border);
          background: none; color: var(--muted); cursor: pointer; display: flex;
          align-items: center; justify-content: center; transition: all 0.2s;
        }
        .btn-icon:hover { background: var(--glass-hover); color: var(--foreground); border-color: var(--muted); }
        .btn-icon.success:hover { background: rgba(16, 185, 129, 0.1); color: #6ee7b7; border-color: #059669; }
        .btn-icon.danger:hover { background: rgba(239, 68, 68, 0.1); color: #fca5a5; border-color: #dc2626; }
        .active-tab { border-color: var(--primary) !important; color: var(--primary) !important; background: var(--primary-glow) !important; }
      `}</style>
    </div>
  );
}
