/**
 * Going Genius Developer SDK (Internal Reference)
 * This SDK is designed to be imported by applications integrating with the GG Identity platform.
 */

export interface GGUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

export interface GGAppConfig {
  clientId: string;
  redirectUri: string;
}

export class GoingGenius {
  private config: GGAppConfig;

  constructor(config: GGAppConfig) {
    this.config = config;
  }

  /**
   * Generates the OAuth 2.0 authorization URL.
   */
  getAuthUrl(state?: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gg-identity.vercel.app';
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
    });

    if (state) params.append('state', state);

    return `${baseUrl}/auth/login?${params.toString()}`;
  }

  /**
   * Redirects the user to the GG Login screen.
   */
  login(state?: string) {
    if (typeof window !== 'undefined') {
      window.location.href = this.getAuthUrl(state);
    }
  }
}
