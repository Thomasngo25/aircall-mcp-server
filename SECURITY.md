# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

1. **Do not** open a public GitHub issue
2. Email opensource@withallo.com with details
3. Include steps to reproduce if possible
4. We will respond within 48 hours

## Security Best Practices

### API Credentials

**Never commit credentials to version control.**

```bash
# Good: Use environment variables
export AIRCALL_API_ID="your_api_id"
export AIRCALL_API_TOKEN="your_api_token"

# Bad: Don't hardcode in config files
"apiId": "abc123"  # Never do this
```

### Environment Variables

Store credentials securely:

```bash
# macOS: Use keychain or .env file (add to .gitignore)
echo "AIRCALL_API_ID=xxx" >> .env
echo "AIRCALL_API_TOKEN=yyy" >> .env

# Make sure .env is in .gitignore
echo ".env" >> .gitignore
```

### Read-Only Mode

Use read-only mode for testing and non-production environments:

```json
{
  "mcpServers": {
    "aircall": {
      "command": "npx",
      "args": ["-y", "@mfc/aircall-mcp-server", "--read-only"],
      "env": {
        "AIRCALL_API_ID": "your_api_id",
        "AIRCALL_API_TOKEN": "your_api_token"
      }
    }
  }
}
```

### Toolset Restriction

Enable only the tools you need:

```bash
# Only enable calls and contacts (no write operations on users, etc.)
npx @mfc/aircall-mcp-server --tools=calls,contacts
```

### API Token Permissions

When creating Aircall API keys:
- Use the minimum permissions required
- Create separate keys for different environments
- Rotate keys periodically
- Revoke unused keys

## Data Handling

This MCP server:
- Does not store any data locally
- Does not log sensitive information
- Passes all requests directly to Aircall's API
- Uses HTTPS for all API communication

## Dependencies

We regularly update dependencies to patch security vulnerabilities:

```bash
npm audit
npm update
```

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Security Features

### Rate Limiting
Built-in rate limiting prevents accidental API abuse.

### Input Validation
All tool parameters are validated using Zod schemas before API calls.

### Error Handling
Errors are caught and returned safely without exposing internal details.

## Third-Party Security

This server relies on:
- **Aircall API** - Review their [security practices](https://aircall.io/security)
- **MCP SDK** - Maintained by Anthropic
- **Node.js** - Keep your runtime updated

## Compliance

If you use this server in a regulated environment:
- Ensure compliance with your organization's security policies
- Review Aircall's compliance certifications
- Implement additional logging if required
- Consider network isolation for the MCP server

## Questions

For security-related questions, contact opensource@withallo.com
