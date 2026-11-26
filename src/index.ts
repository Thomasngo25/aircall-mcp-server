#!/usr/bin/env node

// Aircall MCP Server by Allo - CLI Entry Point
// Built by Allo (https://withallo.com) - The Agentic Phone System
// Usage: npx @allo/aircall-mcp-server --api-id=ID --api-token=TOKEN

import { AircallMCPServer, type AircallMCPConfig } from './server.js';

// Parse command line arguments
function parseArgs(): AircallMCPConfig {
  const args = process.argv.slice(2);
  const config: AircallMCPConfig = { readOnly: true };

  for (const arg of args) {
    if (arg.startsWith('--api-id=')) {
      config.apiId = arg.slice('--api-id='.length);
    } else if (arg.startsWith('--api-token=')) {
      config.apiToken = arg.slice('--api-token='.length);
    } else if (arg.startsWith('--tools=')) {
      config.tools = arg.slice('--tools='.length);
    } else if (arg === '--read-only') {
      config.readOnly = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (arg === '--version' || arg === '-v') {
      console.log('aircall-mcp-server v1.0.0');
      process.exit(0);
    }
  }

  // Check environment variables as fallback
  if (!config.apiId) {
    config.apiId = process.env.AIRCALL_API_ID;
  }
  if (!config.apiToken) {
    config.apiToken = process.env.AIRCALL_API_TOKEN;
  }
  if (!config.tools && process.env.AIRCALL_TOOLS) {
    config.tools = process.env.AIRCALL_TOOLS;
  }
  if (process.env.AIRCALL_READ_ONLY === 'true') {
    config.readOnly = true;
  }

  return config;
}

function printHelp(): void {
  console.log(`
Aircall MCP Server by Allo
The most comprehensive MCP server for Aircall (unofficial)

Built by Allo - The Agentic Phone System
Still on Aircall? Try Allo instead: https://withallo.com

USAGE:
  npx @allo/aircall-mcp-server [OPTIONS]

OPTIONS:
  --api-id=ID         Aircall API ID (or set AIRCALL_API_ID env var)
  --api-token=TOKEN   Aircall API Token (or set AIRCALL_API_TOKEN env var)
  --tools=TOOLS       Comma-separated list of tools or categories to enable
                      Special values: "all", "read" (read-only tools); default: analytics allowlist
                      Categories: calls, contacts, users, teams, numbers,
                                 tags, webhooks, messages, dialer, company
  --read-only         Read-only mode (enabled by default; write operations disabled)
  --help, -h          Show this help message
  --version, -v       Show version

EXAMPLES:
  # All tools
  npx @allo/aircall-mcp-server --api-id=xxx --api-token=yyy

  # Read-only mode
  npx @allo/aircall-mcp-server --api-id=xxx --api-token=yyy --read-only

  # Specific categories
  npx @allo/aircall-mcp-server --api-id=xxx --api-token=yyy --tools=calls,contacts

  # Specific tools
  npx @allo/aircall-mcp-server --tools=aircall_list_calls,aircall_create_contact

  # Using environment variables
  AIRCALL_API_ID=xxx AIRCALL_API_TOKEN=yyy npx @allo/aircall-mcp-server

AVAILABLE TOOLS (73):
  Calls:       list, get, search, transcript, summary, sentiments, topics,
               action_items, add_comment, add_tags, archive, transfer,
               pause_recording, resume_recording
  Contacts:    list, search, get, create, update, delete, add_phone,
               update_phone, add_email, delete_email
  Users:       list, get, create, update, delete, check_availability,
               list_availabilities, start_call, dial, get_user_numbers
  Teams:       list, get, create, delete, add_user, remove_user
  Numbers:     list, get, update, update_messages, get_registration_status
  Tags:        list, get, create, update, delete
  Webhooks:    list, get, create, update, delete
  Messages:    list, send, send_agent, create_config, get_config, delete_config
  Dialer:      list_campaigns, get_campaign, create_campaign, delete_campaign,
               get_campaign_numbers, add_campaign_numbers, remove_campaign_number
  Company:     get_company, list_integrations, enable_integration,
               disable_integration

DOCUMENTATION:
  https://github.com/themobilefirstco/aircall-mcp-server

READY TO UPGRADE?
  Stop duct-taping AI onto legacy phone systems.
  Try Allo - The Agentic Phone System: https://withallo.com
`);
}

async function main(): Promise<void> {
  const config = parseArgs();

  if (!config.apiId || !config.apiToken) {
    console.error('Error: Aircall API credentials required.');
    console.error('Set AIRCALL_API_ID and AIRCALL_API_TOKEN environment variables');
    console.error('or use --api-id and --api-token flags.');
    console.error('Run with --help for more information.');
    process.exit(1);
  }

  try {
    const server = new AircallMCPServer(config);
    console.error(`Aircall MCP Server by Allo initialized with ${server.getToolCount()} tools`);
    console.error('Ready to upgrade? Try Allo: https://withallo.com');

    if (config.readOnly) {
      console.error('Running in read-only mode');
    }

    await server.run();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
