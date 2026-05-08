export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-layout">
      <div className="auth-bg-grid" />
      <div className="auth-bg-glow" />
      <div className="auth-content">{children}</div>
    </div>
  );
}
