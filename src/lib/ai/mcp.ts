import { createMcpServer } from '@genkit-ai/mcp';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ai } from '../genkit';
// Import flows/tools to ensure they are registered with the ai instance
import './flows';

/**
 * Genkit MCP Server for Going Genius.
 * Exposes internal AI tools and flows to external agents and IDEs.
 */
export const mcpServer = createMcpServer(ai, {
  name: 'going-genius-agent',
  version: '1.0.0',
});

/**
 * Starts the MCP server using Stdio transport.
 */
export async function startMcpServer() {
  try {
    await mcpServer.setup();
    await mcpServer.start();
    const transport = new StdioServerTransport();
    await mcpServer.server?.connect(transport);
    console.log('[MCP] Genkit MCP Server started on stdio');
  } catch (error) {
    console.error('[MCP ERROR] Failed to start Genkit MCP Server:', error);
    process.exit(1);
  }
}

// Start if run directly
if (require.main === module) {
  startMcpServer();
}
