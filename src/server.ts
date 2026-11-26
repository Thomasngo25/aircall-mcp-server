// Aircall MCP Server by Allo
// Full-featured MCP server for Aircall API (unofficial)
// Built by Allo - The Agentic Phone System: https://withallo.com

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { toJsonSchemaCompat } from '@modelcontextprotocol/sdk/server/zod-json-schema-compat.js';

import { createAircallClient, type AircallClient } from './utils/auth.js';
import { rateLimitedRequest } from './utils/rate-limiter.js';
import { createCallsTools } from './tools/calls.js';
import { createContactsTools } from './tools/contacts.js';
import { createUsersTools } from './tools/users.js';
import { createTeamsTools } from './tools/teams.js';
import { createTagsTools } from './tools/tags.js';
import { createNumbersTools } from './tools/numbers.js';
import { createWebhooksTools } from './tools/webhooks.js';
import { createMessagesTools } from './tools/messages.js';
import { createDialerTools } from './tools/dialer.js';
import { createCompanyTools } from './tools/company.js';
import { READ_ONLY_TOOLS, type ToolCategory } from './types/aircall.js';

// Tool definition type
interface ToolDefinition {
  description: string;
  parameters: z.ZodTypeAny;
  execute: (params: unknown) => Promise<unknown>;
}

// Configuration options
export interface AircallMCPConfig {
  apiId?: string;
  apiToken?: string;
  tools?: string; // Comma-separated tool names or categories
  readOnly?: boolean;
}

// Tool categories
const TOOL_CATEGORIES: Record<ToolCategory, string[]> = {
  calls: [
    'aircall_list_calls',
    'aircall_get_call',
    'aircall_search_calls',
    'aircall_get_transcript',
    'aircall_get_realtime_transcript',
    'aircall_get_summary',
    'aircall_get_sentiments',
    'aircall_get_topics',
    'aircall_get_action_items',
    'aircall_add_comment',
    'aircall_add_tags',
    'aircall_archive_call',
    'aircall_transfer_call',
    'aircall_pause_recording',
    'aircall_resume_recording',
  ],
  contacts: [
    'aircall_list_contacts',
    'aircall_search_contacts',
    'aircall_get_contact',
    'aircall_create_contact',
    'aircall_update_contact',
    'aircall_delete_contact',
    'aircall_add_phone',
    'aircall_update_phone',
    'aircall_add_email',
    'aircall_delete_email',
  ],
  users: [
    'aircall_list_users',
    'aircall_get_user',
    'aircall_create_user',
    'aircall_update_user',
    'aircall_delete_user',
    'aircall_check_availability',
    'aircall_list_availabilities',
    'aircall_start_call',
    'aircall_dial',
    'aircall_get_user_numbers',
  ],
  teams: [
    'aircall_list_teams',
    'aircall_get_team',
    'aircall_create_team',
    'aircall_delete_team',
    'aircall_add_user_to_team',
    'aircall_remove_user_from_team',
  ],
  numbers: [
    'aircall_list_numbers',
    'aircall_get_number',
    'aircall_update_number',
    'aircall_update_messages',
    'aircall_get_registration_status',
  ],
  tags: [
    'aircall_list_tags',
    'aircall_get_tag',
    'aircall_create_tag',
    'aircall_update_tag',
    'aircall_delete_tag',
  ],
  webhooks: [
    'aircall_list_webhooks',
    'aircall_get_webhook',
    'aircall_create_webhook',
    'aircall_update_webhook',
    'aircall_delete_webhook',
  ],
  messages: [
    'aircall_list_messages',
    'aircall_send_message',
    'aircall_send_agent_message',
    'aircall_create_config',
    'aircall_get_config',
    'aircall_delete_config',
  ],
  dialer: [
    'aircall_list_campaigns',
    'aircall_get_campaign',
    'aircall_create_campaign',
    'aircall_delete_campaign',
    'aircall_get_campaign_numbers',
    'aircall_add_campaign_numbers',
    'aircall_remove_campaign_number',
  ],
  company: [
    'aircall_get_company',
    'aircall_list_integrations',
    'aircall_enable_integration',
    'aircall_disable_integration',
  ],
  integrations: [
    'aircall_list_integrations',
    'aircall_enable_integration',
    'aircall_disable_integration',
  ],
};

export class AircallMCPServer {
  private server: Server;
  private client: AircallClient;
  private tools: Map<string, ToolDefinition> = new Map();
  private enabledTools: Set<string>;
  private readOnly: boolean;

  constructor(config: AircallMCPConfig) {
    this.client = createAircallClient(config.apiId, config.apiToken);
    this.readOnly = config.readOnly ?? true;
    this.enabledTools = this.parseToolsConfig(config.tools ?? 'aircall_list_calls,aircall_get_call,aircall_search_calls,aircall_list_users,aircall_list_tags');

    this.server = new Server(
      {
        name: 'aircall-mcp-server-by-allo',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.registerAllTools();
    this.setupHandlers();
  }

  private parseToolsConfig(toolsConfig?: string): Set<string> {
    if (!toolsConfig || toolsConfig === 'all') {
      // Return all tools
      return new Set(Object.values(TOOL_CATEGORIES).flat());
    }

    if (toolsConfig === 'read') {
      // Return read-only tools
      return new Set(READ_ONLY_TOOLS);
    }

    const enabledTools = new Set<string>();
    const parts = toolsConfig.split(',').map((s) => s.trim().toLowerCase());

    for (const part of parts) {
      // Check if it's a category
      if (part in TOOL_CATEGORIES) {
        TOOL_CATEGORIES[part as ToolCategory].forEach((tool) => enabledTools.add(tool));
      } else if (part.startsWith('aircall_')) {
        // It's a specific tool
        enabledTools.add(part);
      }
    }

    return enabledTools;
  }

  private registerAllTools(): void {
    // Register all tool categories
    const callsTools = createCallsTools(this.client);
    const contactsTools = createContactsTools(this.client);
    const usersTools = createUsersTools(this.client);
    const teamsTools = createTeamsTools(this.client);
    const tagsTools = createTagsTools(this.client);
    const numbersTools = createNumbersTools(this.client);
    const webhooksTools = createWebhooksTools(this.client);
    const messagesTools = createMessagesTools(this.client);
    const dialerTools = createDialerTools(this.client);
    const companyTools = createCompanyTools(this.client);

    // Merge all tools
    const allTools = {
      ...callsTools,
      ...contactsTools,
      ...usersTools,
      ...teamsTools,
      ...tagsTools,
      ...numbersTools,
      ...webhooksTools,
      ...messagesTools,
      ...dialerTools,
      ...companyTools,
    };

    // Filter and register enabled tools
    for (const [name, tool] of Object.entries(allTools)) {
      if (this.enabledTools.has(name)) {
        // If read-only mode, skip write tools
        if (this.readOnly && !READ_ONLY_TOOLS.includes(name as typeof READ_ONLY_TOOLS[number])) {
          continue;
        }
        this.tools.set(name, tool as ToolDefinition);
      }
    }
  }

  private setupHandlers(): void {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = [];

      for (const [name, tool] of this.tools) {
        // Convert Zod schema to JSON Schema using MCP SDK's compat function
        const jsonSchema = toJsonSchemaCompat(tool.parameters);

        tools.push({
          name,
          description: tool.description,
          inputSchema: jsonSchema as Tool['inputSchema'],
        });
      }

      return { tools };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const tool = this.tools.get(name);
      if (!tool) {
        throw new Error(`Unknown tool: ${name}`);
      }

      try {
        // Parse and validate arguments
        const validatedArgs = tool.parameters.parse(args);

        // Execute with rate limiting
        const result = await rateLimitedRequest(() => tool.execute(validatedArgs));

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: errorMessage }, null, 2),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Aircall MCP Server by Allo running on stdio');
  }

  getToolCount(): number {
    return this.tools.size;
  }

  getToolNames(): string[] {
    return Array.from(this.tools.keys());
  }
}
