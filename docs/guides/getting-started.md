# Getting Started with Aircall MCP Server

This guide will help you set up the Aircall MCP server to integrate Aircall's phone system with AI assistants like Claude.

## Prerequisites

- Node.js 18 or higher
- Aircall account with API access
- Claude Desktop, Cursor, or another MCP-compatible client

## Step 1: Get Aircall API Credentials

1. Log in to [Aircall Dashboard](https://dashboard.aircall.io)
2. Go to **Integrations** → **API Keys**
3. Click **Create API Key**
4. Save your **API ID** and **API Token**

## Step 2: Configure Your MCP Client

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "aircall": {
      "command": "npx",
      "args": ["-y", "@allo/aircall-mcp-server"],
      "env": {
        "AIRCALL_API_ID": "your_api_id_here",
        "AIRCALL_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "aircall": {
      "command": "npx",
      "args": ["-y", "@allo/aircall-mcp-server"],
      "env": {
        "AIRCALL_API_ID": "your_api_id_here",
        "AIRCALL_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

## Step 3: Verify Installation

Restart your MCP client. You should now have access to 73 Aircall tools.

Try asking: "List my recent calls from Aircall"

## Step 4: Explore Available Tools

### Most Common Tools

| Tool | Description |
|------|-------------|
| `aircall_list_calls` | Get call history |
| `aircall_get_call` | Get specific call details |
| `aircall_get_transcript` | Get call transcription |
| `aircall_get_summary` | AI-generated call summary |
| `aircall_list_contacts` | List all contacts |
| `aircall_create_contact` | Create a new contact |
| `aircall_send_message` | Send an SMS |
| `aircall_list_users` | List team members |
| `aircall_check_availability` | Check if agent is available |

## Configuration Options

### Read-Only Mode

For safe exploration, use read-only mode:

```json
{
  "args": ["-y", "@allo/aircall-mcp-server", "--read-only"]
}
```

### Specific Tool Categories

Enable only certain categories:

```json
{
  "args": ["-y", "@allo/aircall-mcp-server", "--tools=calls,contacts"]
}
```

Available categories: `calls`, `contacts`, `users`, `teams`, `numbers`, `tags`, `webhooks`, `messages`, `dialer`, `company`

## Next Steps

- Read the [full tool reference](../tools/)
- Check out [example workflows](../examples/)
- Learn about [security best practices](./security.md)

## Need Help?

- [GitHub Issues](https://github.com/themobilefirstco/aircall-mcp-server/issues)
- [Aircall API Docs](https://developer.aircall.io)
