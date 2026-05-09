/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { Terminal, Book, Code2, ShieldCheck, DollarSign, Bot, Zap } from 'lucide-react';

export function AppDocs({ app }: { app: any }) {
  const [tab, setTab] = useState<'flow' | 'node' | 'react' | 'curl' | 'billing' | 'bot' | 'webhooks'>('flow');
  const [appUrl, setAppUrl] = useState('https://gguser.com');

  useEffect(() => {
    setAppUrl(window.location.origin);
  }, []);

  return (
    <div className="docs-container">
      <div className="docs-tabs">
        <button className={`docs-tab ${tab === 'flow' ? 'active' : ''}`} onClick={() => setTab('flow')}>
          <Book size={14} /> The Flow
        </button>
        <button className={`docs-tab ${tab === 'node' ? 'active' : ''}`} onClick={() => setTab('node')}>
          <Code2 size={14} /> Node.js
        </button>
        <button className={`docs-tab ${tab === 'react' ? 'active' : ''}`} onClick={() => setTab('react')}>
          <ShieldCheck size={14} /> Next.js
        </button>
        <button className={`docs-tab ${tab === 'curl' ? 'active' : ''}`} onClick={() => setTab('curl')}>
          <Terminal size={14} /> cURL
        </button>
        <button className={`docs-tab ${tab === 'billing' ? 'active' : ''}`} onClick={() => setTab('billing')}>
          <DollarSign size={14} /> Billing
        </button>
        <button className={`docs-tab ${tab === 'bot' ? 'active' : ''}`} onClick={() => setTab('bot')}>
          <Bot size={14} /> AI Sales Bot
        </button>
        <button className={`docs-tab ${tab === 'webhooks' ? 'active' : ''}`} onClick={() => setTab('webhooks')}>
          <Zap size={14} /> Webhooks
        </button>
      </div>

      <div className="docs-content">
        {tab === 'flow' && (
          <div className="docs-step-list">
            <div className="docs-step">
              <span className="step-num">1</span>
              <div>
                <h4>Authorize User</h4>
                <p>Redirect your user to our authorization endpoint. They will sign in and approve your app.</p>
                <code className="code-inline">{`${appUrl}/api/gg/authorize?client_id=${app.clientId}&redirect_uri=${app.redirectUris[0]}&response_type=code&scope=openid profile email`}</code>
              </div>
            </div>
            <div className="docs-step">
              <span className="step-num">2</span>
              <div>
                <h4>Exchange Code for Token</h4>
                <p>After redirect, exchange the <code className="code-inline">code</code> from the URL for an access token via a POST request.</p>
              </div>
            </div>
            <div className="docs-step">
              <span className="step-num">3</span>
              <div>
                <h4>Get User Profile</h4>
                <p>Use the access token to fetch the user&apos;s profile information.</p>
                <code className="code-inline">GET /api/gg/userinfo</code>
              </div>
            </div>
          </div>
        )}

        {tab === 'curl' && (
          <div className="code-block">
            <pre>
{`# 1. Exchange authorization code
curl -X POST ${appUrl}/api/gg/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "grant_type": "authorization_code",
    "code": "YOUR_CODE",
    "redirect_uri": "${app.redirectUris[0]}",
    "client_id": "${app.clientId}",
    "client_secret": "YOUR_CLIENT_SECRET"
  }'

# 2. Get user info
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  ${appUrl}/api/gg/userinfo`}
            </pre>
          </div>
        )}

        {tab === 'node' && (
          <div className="code-block">
            <pre>
{`const response = await fetch('${appUrl}/api/gg/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'authorization_code',
    code: authCode,
    client_id: '${app.clientId}',
    client_secret: process.env.GG_CLIENT_SECRET,
    redirect_uri: '${app.redirectUris[0]}'
  })
});

const { access_token } = await response.json();`}
            </pre>
          </div>
        )}

        {tab === 'react' && (
          <div className="code-block">
            <pre>
{`// In your Next.js auth route
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // Exchange code... (as shown in Node.js tab)
  
  // Fetch user profile
  const user = await fetch('${appUrl}/api/gg/userinfo', {
    headers: { Authorization: \`Bearer \${token}\` }
  }).then(r => r.json());

  // Log user in using your own session logic
}`}
            </pre>
          </div>
        )}

        {tab === 'billing' && (
          <div className="docs-step-list">
            <div className="docs-step">
              <span className="step-num">1</span>
              <div>
                <h4>Create Plans</h4>
                <p>Define your Pro, Enterprise, or custom plans in the <b>Subscription Billing</b> section above.</p>
              </div>
            </div>
            <div className="docs-step">
              <span className="step-num">2</span>
              <div>
                <h4>Check Status</h4>
                <p>The <code className="code-inline">/api/gg/userinfo</code> endpoint now includes subscription data for your specific app.</p>
                <div className="code-block" style={{ marginTop: '0.75rem' }}>
                  <pre>
{`// Example Response
{
  "sub": "user_123",
  "name": "Arjun Sharma",
  "subscription": {
    "plan": "Pro Plan",
    "status": "active",
    "expires_at": "2026-12-31"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
            <div className="docs-step">
              <span className="step-num">3</span>
              <div>
                <h4>Gate Features</h4>
                <p>Use simple logic in your code to check the plan and grant access.</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'bot' && (
          <div className="docs-step-list">
            <div className="docs-step">
              <span className="step-num">1</span>
              <div>
                <h4>React SDK Component</h4>
                <p>Drop the pre-built <code className="code-inline">AISalesBot</code> into your app for instant AI support powered by your configuration.</p>
                <div className="code-block" style={{ marginTop: '0.75rem' }}>
                  <pre>
{`import { AISalesBot } from '@going-genius/react';

export default function SupportPage() {
  return (
    <AISalesBot 
      appId="${app.id}"
      apiUrl="https://gguser.com/api/v1/apps/${app.id}/bot"
      greeting="Hi! How can I help you today?"
      theme="dark"
    />
  );
}`}
                  </pre>
                </div>
              </div>
            </div>
            <div className="docs-step">
              <span className="step-num">2</span>
              <div>
                <h4>Direct API Usage</h4>
                <p>Call the bot endpoint from any environment without the SDK component.</p>
                <div className="code-block" style={{ marginTop: '0.75rem' }}>
                  <pre>
{`const res = await fetch('https://gguser.com/api/v1/apps/${app.id}/bot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    message: 'What plans do you offer?', 
    history: [] 
  })
});
const { text } = await res.json();`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'webhooks' && (
          <div className="docs-step-list">
            <div className="docs-step">
              <span className="step-num">1</span>
              <div>
                <h4>Configure Endpoint</h4>
                <p>Go to <b>Configuration → API & Provider Credentials</b> and set your Webhook URL.</p>
              </div>
            </div>
            <div className="docs-step">
              <span className="step-num">2</span>
              <div>
                <h4>Verify Signature</h4>
                <p>Verify the <code className="code-inline">X-GG-Signature</code> header to ensure the request came from Going Genius.</p>
                <div className="code-block" style={{ marginTop: '0.75rem' }}>
                  <pre>
{`// Node.js / Next.js Example
import crypto from 'crypto';

const signature = req.headers.get('x-gg-signature');
const body = await req.text();
const expectedSignature = crypto
  .createHmac('sha256', process.env.GG_WEBHOOK_SECRET)
  .update(body)
  .digest('hex');

if (signature !== expectedSignature) {
  return new Response('Unauthorized', { status: 401 });
}`}
                  </pre>
                </div>
              </div>
            </div>
            <div className="docs-step">
              <span className="step-num">3</span>
              <div>
                <h4>Handle Events</h4>
                <p>Currently supported events: <code className="code-inline">payment.success</code>, <code className="code-inline">subscription.created</code>, <code className="code-inline">lead.captured</code>.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .docs-container { margin-top: 1rem; }
        .docs-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; overflow-x: auto; }
        .docs-tab { 
          display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; 
          background: none; border: none; color: var(--muted); cursor: pointer; 
          font-size: 0.85rem; font-weight: 500; border-radius: 8px; transition: all 0.2s; white-space: nowrap;
        }
        .docs-tab:hover { color: var(--foreground); background: var(--glass-hover); }
        .docs-tab.active { color: var(--primary); background: var(--primary-glow); }
        
        .docs-step-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .docs-step { display: flex; gap: 1rem; }
        .step-num { 
          flex-shrink: 0; width: 24px; height: 24px; background: var(--primary); 
          color: #000; border-radius: 50%; display: flex; align-items: center; 
          justify-content: center; font-size: 0.8rem; font-weight: 800;
        }
        .docs-step h4 { font-size: 0.95rem; margin-bottom: 0.25rem; }
        .docs-step p { font-size: 0.85rem; color: var(--muted-light); line-height: 1.5; margin-bottom: 0.5rem; }
        
        .code-inline { 
          display: block; padding: 0.5rem 0.75rem; background: #000; color: #a5b4fc; 
          border-radius: 6px; font-family: monospace; font-size: 0.75rem; border: 1px solid var(--border);
          word-break: break-all;
        }
        
        .code-block { background: #000; border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; overflow-x: auto; }
        .code-block pre { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: #a5b4fc; line-height: 1.6; }
      `}</style>
    </div>
  );
}
