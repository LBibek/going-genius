'use client';

import React from 'react';
import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="main-footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="auth-logo">
            <div className="auth-logo-icon">GG</div>
            <span className="auth-logo-text">Going Genius</span>
          </div>
          <p className="footer-tagline">The premium subscription-billing and identity platform boilerplate for SaaS creators, teams, and developers in Nepal.</p>
        </div>
        <div className="footer-links-group">
          <div className="footer-col">
            <h4>Platform</h4>
            <Link href="#solutions">Solutions</Link>
            <Link href="#features">Features</Link>
            <Link href="#pricing">Pricing</Link>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <Link href="/developer">Documentation</Link>
            <Link href="/demo/sdk">SDK Demo</Link>
            <Link href="/demo/wordpress">WordPress Plugin</Link>
            <a href="https://github.com/LBibek/going-genius/blob/main/DEVELOPER_QUICKSTART.md">Integration Guide</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/security">Platform Security</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Going Genius. Built with passion for Developers & SaaS in Nepal 🇳🇵</p>
      </div>
    </footer>
  );
}
