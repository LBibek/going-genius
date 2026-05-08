import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ProfileForm } from './ProfileForm';
import Link from 'next/link';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const user = await prisma.gGUser.findUnique({
    where: { id: session.userId }
  });

  if (!user) redirect('/auth/login');

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '600px' }}>
      <Link href="/dashboard" className="form-link-sm" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
        ← Back to Dashboard
      </Link>

      <div className="glass-card animate-fade-in">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Edit Profile</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Update your personal identity and contact details.</p>

        <ProfileForm user={user} />
      </div>

      <div className="glass-card" style={{ marginTop: '1.5rem', padding: '1.25rem', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
        <h3 style={{ fontSize: '1rem', color: '#fca5a5', marginBottom: '0.5rem' }}>Danger Zone</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Deleting your account will permanently remove all your data and access to all linked applications.
        </p>
        <button className="btn btn-outline" style={{ color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.3)', width: '100%', justifyContent: 'center' }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
