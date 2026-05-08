export default function TermsPage() {
  return (
    <main className="auth-layout">
      <div className="auth-card auth-card-wide animate-fade-in">
        <h1 className="auth-title">Terms of Service</h1>
        <p className="auth-subtitle">Last updated: May 7, 2026</p>
        
        <div className="glass-card" style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--muted-light)', maxHeight: '400px', overflowY: 'auto', padding: '1.5rem' }}>
          <h2 style={{ color: 'var(--foreground)', marginBottom: '1rem' }}>1. Introduction</h2>
          <p style={{ marginBottom: '1rem' }}>Welcome to Going Genius User (GGUser). By using our services, you agree to these terms...</p>
          
          <h2 style={{ color: 'var(--foreground)', marginBottom: '1rem' }}>2. Account Security</h2>
          <p style={{ marginBottom: '1rem' }}>You are responsible for maintaining the security of your account and password. GGUser cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</p>
          
          <h2 style={{ color: 'var(--foreground)', marginBottom: '1rem' }}>3. Privacy</h2>
          <p style={{ marginBottom: '1rem' }}>Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect and use your data.</p>
        </div>
        
        <p className="auth-footer">
          <a href="/auth/register" className="form-link">← Back to Registration</a>
        </p>
      </div>
    </main>
  );
}
