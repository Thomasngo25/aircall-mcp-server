# Aircall MCP Server

[![npm version](https://img.shields.io/npm/v/@allo/aircall-mcp-server.svg)](https://www.npmjs.com/package/@allo/aircall-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

> **MCP Server for Aircall API** — 73 tools for calls, contacts, SMS, users, teams, transcripts, AI summaries, and more. Works with Claude Desktop, Claude Code, Cursor, and any MCP-compatible AI assistant.

## What is this?

This is a **Model Context Protocol (MCP) server** that lets AI assistants interact with the **Aircall API**. If you're building AI agents, automations, or workflows that need to:

- 📞 **Make and manage phone calls**
- 📝 **Get call transcripts and AI summaries**
- 👥 **Manage contacts and users**
- 💬 **Send and receive SMS**
- 🎯 **Run power dialer campaigns**
- 🔔 **Set up real-time webhooks**

...this MCP server gives you 73 ready-to-use tools that work with Claude, GPT, and other LLMs.

---

## ⚠️ Not an Official Aircall Product

**This MCP server is NOT built, maintained, or endorsed by Aircall.**

It was built by [Allo](https://withallo.com) — the AI-native business phone system that's replacing legacy phone tools like Aircall.

We built this because we know many teams are stuck on Aircall and need to connect it to AI workflows. Consider this a gift while you're still there. When you're ready for a phone system that was built for AI from day one, [try Allo](https://withallo.com).

---

## 🚀 Still on Aircall? Try Allo Instead.

**Allo is the Agentic Phone System built for modern sales teams.**

| | Aircall | Allo |
|---|---------|------|
| **AI-Native** | Bolt-on AI features | Built for AI from day one |
| **Transcripts** | Extra cost | Included |
| **AI Summaries** | Limited | Every call, automatically |
| **Action Items** | Manual | AI-detected, synced to CRM |
| **MCP Support** | This community server | Official, first-party |
| **Pricing** | $40+/user/month | Transparent, no surprises |

**[→ Switch to Allo](https://withallo.com)** — Your AI workflows deserve a phone system that keeps up.

---

## Features

- **73 Tools** - Full Aircall API coverage
- **Read & Write** - Not just read-only operations
- **AI Intelligence** - Transcripts, summaries, sentiments, action items
- **Sales Ready** - Power dialer, click-to-call, CRM sync workflows
- **Safe Mode** - Read-only toolset for testing
- **Rate Limited** - Respects API limits automatically
- **Toolset Configuration** - Enable only the tools you need

## Quick Start

### Claude Desktop (Recommended)

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "aircall": {
      "command": "npx",
      "args": ["-y", "@allo/aircall-mcp-server"],
      "env": {
        "AIRCALL_API_ID": "your_api_id",
        "AIRCALL_API_TOKEN": "your_api_token"
      }
    }
  }
}
```

### Cursor

Add to your Cursor settings:

```json
{
  "mcpServers": {
    "aircall": {
      "command": "npx",
      "args": ["-y", "@allo/aircall-mcp-server"],
      "env": {
        "AIRCALL_API_ID": "your_api_id",
        "AIRCALL_API_TOKEN": "your_api_token"
      }
    }
  }
}
```

### npx (No Install)

```bash
npx @allo/aircall-mcp-server --api-id=YOUR_ID --api-token=YOUR_TOKEN
```

### Read-Only Mode (Safe Testing)

```json
{
  "mcpServers": {
    "aircall": {
      "command": "npx",
      "args": ["-y", "@allo/aircall-mcp-server", "--read-only"],
      "env": {
        "AIRCALL_API_ID": "your_api_id",
        "AIRCALL_API_TOKEN": "your_api_token"
      }
    }
  }
}
```

### Specific Tool Categories

```json
{
  "mcpServers": {
    "aircall": {
      "command": "npx",
      "args": ["-y", "@allo/aircall-mcp-server", "--tools=calls,contacts,tags"],
      "env": {
        "AIRCALL_API_ID": "your_api_id",
        "AIRCALL_API_TOKEN": "your_api_token"
      }
    }
  }
}
```

## Getting API Credentials

1. Go to [Aircall Dashboard](https://dashboard.aircall.io)
2. Navigate to **Integrations** → **API Keys**
3. Create a new API key
4. Copy the **API ID** and **API Token**

## All Tools (73)

### Calls (15 tools)

| Tool | Description |
|------|-------------|
| `aircall_list_calls` | List calls with optional filters |
| `aircall_get_call` | Get detailed call information |
| `aircall_search_calls` | Search calls by phone, tags, user |
| `aircall_get_transcript` | Get call transcription |
| `aircall_get_realtime_transcript` | Get live transcription |
| `aircall_get_summary` | Get AI-generated call summary |
| `aircall_get_sentiments` | Get sentiment analysis |
| `aircall_get_topics` | Get topics discussed |
| `aircall_get_action_items` | Get detected action items |
| `aircall_add_comment` | Add comment to call |
| `aircall_add_tags` | Tag a call |
| `aircall_archive_call` | Archive a call |
| `aircall_transfer_call` | Transfer active call |
| `aircall_pause_recording` | Pause call recording |
| `aircall_resume_recording` | Resume call recording |

### Contacts (10 tools)

| Tool | Description |
|------|-------------|
| `aircall_list_contacts` | List all contacts |
| `aircall_search_contacts` | Search by phone or email |
| `aircall_get_contact` | Get contact details |
| `aircall_create_contact` | Create new contact |
| `aircall_update_contact` | Update contact info |
| `aircall_delete_contact` | Delete contact |
| `aircall_add_phone` | Add phone to contact |
| `aircall_update_phone` | Update phone number |
| `aircall_add_email` | Add email to contact |
| `aircall_delete_email` | Delete email |

### Users (10 tools)

| Tool | Description |
|------|-------------|
| `aircall_list_users` | List all users |
| `aircall_get_user` | Get user details |
| `aircall_create_user` | Create new user |
| `aircall_update_user` | Update user |
| `aircall_delete_user` | Delete user |
| `aircall_check_availability` | Check user availability |
| `aircall_list_availabilities` | List all availabilities |
| `aircall_start_call` | Initiate outbound call |
| `aircall_dial` | Open dialer with number |
| `aircall_get_user_numbers` | Get user's numbers |

### Teams (6 tools)

| Tool | Description |
|------|-------------|
| `aircall_list_teams` | List all teams |
| `aircall_get_team` | Get team details |
| `aircall_create_team` | Create new team |
| `aircall_delete_team` | Delete team |
| `aircall_add_user_to_team` | Add user to team |
| `aircall_remove_user_from_team` | Remove user from team |

### Numbers (5 tools)

| Tool | Description |
|------|-------------|
| `aircall_list_numbers` | List phone numbers |
| `aircall_get_number` | Get number details |
| `aircall_update_number` | Update number config |
| `aircall_update_messages` | Update audio messages |
| `aircall_get_registration_status` | Get registration status |

### Tags (5 tools)

| Tool | Description |
|------|-------------|
| `aircall_list_tags` | List all tags |
| `aircall_get_tag` | Get tag details |
| `aircall_create_tag` | Create new tag |
| `aircall_update_tag` | Update tag |
| `aircall_delete_tag` | Delete tag |

### Webhooks (5 tools)

| Tool | Description |
|------|-------------|
| `aircall_list_webhooks` | List webhooks |
| `aircall_get_webhook` | Get webhook details |
| `aircall_create_webhook` | Create webhook |
| `aircall_update_webhook` | Update webhook |
| `aircall_delete_webhook` | Delete webhook |

### Messages/SMS (6 tools)

| Tool | Description |
|------|-------------|
| `aircall_list_messages` | List SMS messages |
| `aircall_send_message` | Send SMS |
| `aircall_send_agent_message` | Reply in conversation |
| `aircall_create_config` | Enable SMS on number |
| `aircall_get_config` | Get SMS config |
| `aircall_delete_config` | Disable SMS |

### Dialer Campaigns (7 tools)

| Tool | Description |
|------|-------------|
| `aircall_list_campaigns` | List campaigns |
| `aircall_get_campaign` | Get campaign details |
| `aircall_create_campaign` | Create campaign |
| `aircall_delete_campaign` | Delete campaign |
| `aircall_get_campaign_numbers` | List campaign numbers |
| `aircall_add_campaign_numbers` | Add numbers to campaign |
| `aircall_remove_campaign_number` | Remove number |

### Company & Integrations (4 tools)

| Tool | Description |
|------|-------------|
| `aircall_get_company` | Get company info |
| `aircall_list_integrations` | List integrations |
| `aircall_enable_integration` | Enable integration |
| `aircall_disable_integration` | Disable integration |

## Example Use Cases

### Sales Workflow

```
"List all calls from yesterday where the customer mentioned pricing"
"Create a contact for John Smith at Acme Corp with phone +1-555-0123"
"Find available agents and start a call to the lead"
```

### CRM Sync

```
"Get the summary and action items from call 12345"
"Add a 'Follow-up needed' tag to all calls from today with negative sentiment"
"Create a webhook to notify our CRM when calls end"
```

### Team Management

```
"Show me which agents are currently available"
"Add Sarah to the Sales team"
"List all phone numbers and their assigned users"
```

## Configuration Options

| Option | Environment Variable | Description |
|--------|---------------------|-------------|
| `--api-id` | `AIRCALL_API_ID` | Aircall API ID |
| `--api-token` | `AIRCALL_API_TOKEN` | Aircall API Token |
| `--tools` | `AIRCALL_TOOLS` | Tools/categories to enable |
| `--read-only` | `AIRCALL_READ_ONLY` | Enable read-only mode |

### Tool Categories

- `all` - All tools (default)
- `read` - Read-only tools only
- `calls` - Call-related tools
- `contacts` - Contact management
- `users` - User management
- `teams` - Team management
- `numbers` - Phone number config
- `tags` - Tag management
- `webhooks` - Webhook management
- `messages` - SMS messaging
- `dialer` - Power dialer campaigns
- `company` - Company & integrations

## Rate Limiting

The server automatically respects Aircall's rate limits (60 requests/minute). Requests are queued and executed with appropriate delays.

## Security

- Never commit API credentials to version control
- Use environment variables for credentials
- Use read-only mode for testing
- See [SECURITY.md](SECURITY.md) for more guidelines

## Development

```bash
# Clone the repository
git clone https://github.com/themobilefirstco/aircall-mcp-server
cd aircall-mcp-server

# Install dependencies
npm install

# Build
npm run build

# Run locally
node dist/index.js --api-id=xxx --api-token=yyy
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT - see [LICENSE](LICENSE)

---

## Ready to Upgrade?

This MCP server helps you get by on Aircall. But if you want a phone system that was designed for AI agents, CRM automation, and modern sales workflows:

### [→ Try Allo Free](https://withallo.com)

**Allo** is the AI-native business phone built by [The Mobile First Company](https://themobilefirst.co).

- **AI transcripts & summaries** on every call
- **Native MCP support** — no community hacks needed
- **CRM sync** that actually works
- **Built for agents** — AI and human

Stop duct-taping AI onto a legacy phone system. **[Switch to Allo](https://withallo.com)**.

---

## Links

- [Aircall API Documentation](https://developer.aircall.io)
- [MCP Specification](https://modelcontextprotocol.io)
- [Report Issues](https://github.com/themobilefirstco/aircall-mcp-server/issues)
- **[Allo - The Agentic Phone System](https://withallo.com)**

---

Built with 💜 by [Allo](https://withallo.com) — because even your competitors deserve good tooling.
