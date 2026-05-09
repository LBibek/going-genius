import { NextResponse } from 'next/server';

/**
 * GET /api/docs/openapi.json
 * Returns the OpenAPI 3.1 specification for the Going Genius Identity API.
 * This is consumed by the interactive documentation page at /api/docs.
 */
export async function GET() {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'Going Genius Identity API',
      version: '1.0.0',
      description: 'The Going Genius platform API for OAuth 2.0 identity, subscription management, and AI agent integration.',
      contact: {
        name: 'Going Genius Developer Support',
        url: 'https://gguser.com/developer',
      },
    },
    servers: [
      { url: 'https://gguser.com', description: 'Production' },
      { url: 'http://localhost:3000', description: 'Local Development' },
    ],
    tags: [
      { name: 'OAuth', description: 'Authorization Code Flow endpoints' },
      { name: 'Identity', description: 'User profile and session management' },
      { name: 'AI Agent', description: 'Public bot API for SDK integration' },
    ],
    paths: {
      '/api/gg/authorize': {
        get: {
          tags: ['OAuth'],
          summary: 'Authorization Endpoint',
          description: 'Initiates the OAuth 2.0 Authorization Code Flow. Redirects the user to the GG login page.',
          parameters: [
            { name: 'client_id', in: 'query', required: true, schema: { type: 'string' }, description: 'Your application\'s client ID' },
            { name: 'redirect_uri', in: 'query', required: true, schema: { type: 'string', format: 'uri' }, description: 'Where to redirect after authorization' },
            { name: 'response_type', in: 'query', required: true, schema: { type: 'string', enum: ['code'] } },
            { name: 'scope', in: 'query', required: false, schema: { type: 'string', example: 'openid profile email' } },
            { name: 'state', in: 'query', required: false, schema: { type: 'string' }, description: 'CSRF protection token' },
            { name: 'code_challenge', in: 'query', required: false, schema: { type: 'string' }, description: 'PKCE code challenge (S256)' },
            { name: 'code_challenge_method', in: 'query', required: false, schema: { type: 'string', enum: ['S256'] } },
          ],
          responses: {
            '302': { description: 'Redirect to login page' },
          },
        },
      },
      '/api/gg/token': {
        post: {
          tags: ['OAuth'],
          summary: 'Token Endpoint',
          description: 'Exchange an authorization code for an access token and refresh token.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['grant_type', 'code', 'redirect_uri', 'client_id', 'client_secret'],
                  properties: {
                    grant_type: { type: 'string', enum: ['authorization_code', 'refresh_token'] },
                    code: { type: 'string', description: 'Authorization code from the authorize endpoint' },
                    redirect_uri: { type: 'string', format: 'uri' },
                    client_id: { type: 'string' },
                    client_secret: { type: 'string' },
                    code_verifier: { type: 'string', description: 'PKCE code verifier' },
                    refresh_token: { type: 'string', description: 'Required for refresh_token grant' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Token pair returned successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      access_token: { type: 'string' },
                      refresh_token: { type: 'string' },
                      token_type: { type: 'string', example: 'Bearer' },
                      expires_in: { type: 'integer', example: 3600 },
                    },
                  },
                },
              },
            },
            '400': { description: 'Invalid request' },
            '401': { description: 'Invalid client credentials' },
          },
        },
      },
      '/api/gg/userinfo': {
        get: {
          tags: ['Identity'],
          summary: 'UserInfo Endpoint',
          description: 'Returns the authenticated user\'s profile including their active subscription for the requesting app.',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'User profile with subscription data',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      sub: { type: 'string', description: 'User ID' },
                      name: { type: 'string' },
                      email: { type: 'string', format: 'email' },
                      username: { type: 'string' },
                      avatar_url: { type: 'string', format: 'uri' },
                      subscription: {
                        type: 'object',
                        nullable: true,
                        properties: {
                          plan: { type: 'string' },
                          status: { type: 'string', enum: ['active', 'expired', 'cancelled'] },
                          expires_at: { type: 'string', format: 'date-time', nullable: true },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'Missing or invalid Bearer token' },
          },
        },
      },
      '/api/v1/apps/{appId}/bot': {
        post: {
          tags: ['AI Agent'],
          summary: 'Chat with AI Bot',
          description: 'Send a message to the AI sales/support agent configured for a specific application. Supports persistent memory via threadId.',
          parameters: [
            { name: 'appId', in: 'path', required: true, schema: { type: 'string' }, description: 'Your application ID' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['message'],
                  properties: {
                    message: { type: 'string', description: 'The user\'s message' },
                    threadId: { type: 'string', nullable: true, description: 'Persist conversation across sessions. Omit to start a new thread.' },
                    userId: { type: 'string', nullable: true, description: 'Optional user identifier to link the thread' },
                    history: {
                      type: 'array',
                      description: 'Client-side history (only used when threadId is null)',
                      items: {
                        type: 'object',
                        properties: {
                          role: { type: 'string', enum: ['user', 'model'] },
                          content: { type: 'array', items: { type: 'object', properties: { text: { type: 'string' } } } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'AI response with threadId for memory persistence',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      text: { type: 'string', description: 'The AI\'s response' },
                      threadId: { type: 'string', description: 'Store this and send it with the next request to maintain memory' },
                    },
                  },
                },
              },
            },
            '400': { description: 'Missing appId or message' },
            '404': { description: 'Application not found' },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'Access token obtained from /api/gg/token',
        },
      },
    },
  };

  return NextResponse.json(spec, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    }
  });
}
