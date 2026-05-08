export default function PrivacyPage() {
  return (
    <main className="auth-layout">
      <div className="auth-card auth-card-wide animate-fade-in">
        <h1 className="auth-title">Privacy Policy</h1>
        <p className="auth-subtitle">Last updated: May 7, 2026</p>
        
        <div className="glass-card" style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--muted-light)', maxHeight: '400px', overflowY: 'auto', padding: '1.5rem' }}>
          <h2 style={{ color: 'var(--foreground)', marginBottom: '1rem' }}>Data Collection</h2>
          <p style={{ marginBottom: '1rem' }}>We collect your email, username, and optionally your phone number to provide authentication services across the Going Genius ecosystem.</p>
          
          <h2 style={{ color: 'var(--foreground)', marginBottom: '1rem' }}>OAuth 2.0</h2>
          <p style={{ marginBottom: '1rem' }}>When you use GGUser to sign into other apps, we share your basic profile info (name, email, avatar) with those apps only after your explicit authorization.</p>
          
          <h2 style={{ color: 'var(--foreground)', marginBottom: '1rem' }}>Security</h2>
          <p style={{ marginBottom: '1rem' }}>We use industry-standard encryption (bcrypt, JWT) and secure session management to protect your data.</p>
        </div>
        
        <p className="auth-footer">
          <a href="/auth/register" className="form-link">← Back to Registration</a>
        </p>
      </div>
    </main>
  );
}
