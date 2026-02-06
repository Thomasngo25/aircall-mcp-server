---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

## Describe the bug
A clear and concise description of what the bug is.

## To Reproduce
Steps to reproduce the behavior:
1. Configure MCP server with '...'
2. Run tool '....'
3. See error

## Expected behavior
A clear and concise description of what you expected to happen.

## Error messages
```
Paste any error messages here
```

## Environment
- Node.js version: [e.g., 20.x]
- OS: [e.g., macOS 14.0]
- MCP Client: [e.g., Claude Desktop, Cursor]
- Server version: [e.g., 1.0.0]

## Configuration
```json
// Your MCP configuration (remove credentials!)
{
  "mcpServers": {
    "aircall": {
      "command": "npx",
      "args": ["-y", "@mfc/aircall-mcp-server"]
    }
  }
}
```

## Additional context
Add any other context about the problem here.
