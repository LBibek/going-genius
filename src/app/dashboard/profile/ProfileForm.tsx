'use client';

import { useState } from 'react';
import { updateUserProfile } from '@/app/actions/auth';
import { User, AtSign, Phone, Save, CheckCircle } from 'lucide-react';

export function ProfileForm({ user }: { user: any }) {
  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    username: user.username || '',
    phone: user.phone || ''
  });
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);

    const result = await updateUserProfile(formData);
    
    if (result.success) {
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } else {
      setMessage({ text: result.message || 'Something went wrong.', type: 'error' });
    }
    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {message && (
        <div className={`form-alert ${message.type}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {message.type === 'success' && <CheckCircle size={16} />}
          {message.text}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Full Name</label>
        <div className="input-icon-wrapper">
          <User size={18} className="input-prefix" style={{ left: '0.75rem', opacity: 0.5 }} />
          <input 
            className="form-input prefix-input"
            value={formData.displayName}
            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Username</label>
        <div className="input-icon-wrapper">
          <AtSign size={18} className="input-prefix" style={{ left: '0.75rem', opacity: 0.5 }} />
          <input 
            className="form-input prefix-input"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Phone Number (Optional)</label>
        <div className="input-icon-wrapper">
          <Phone size={18} className="input-prefix" style={{ left: '0.75rem', opacity: 0.5 }} />
          <input 
            className="form-input prefix-input"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="+977"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input 
          className="form-input"
          value={user.email}
          disabled
          style={{ opacity: 0.6, cursor: 'not-allowed', background: 'rgba(255,255,255,0.02)' }}
        />
        <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
          Email cannot be changed directly. Contact support for email updates.
        </p>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="btn-submit"
        style={{ marginTop: '1rem', width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        {isPending ? <span className="spinner" /> : <><Save size={18} style={{ marginRight: '8px' }} /> Save Changes</>}
      </button>
    </form>
  );
}
