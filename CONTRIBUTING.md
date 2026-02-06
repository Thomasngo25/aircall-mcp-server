# Contributing to Aircall MCP Server

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/themobilefirstco/aircall-mcp-server/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node version, OS, etc.)

### Suggesting Features

1. Check existing issues for similar suggestions
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests and linting: `npm run lint && npm run typecheck`
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/aircall-mcp-server
cd aircall-mcp-server

# Install dependencies
npm install

# Build
npm run build

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

## Code Style

- Use TypeScript strict mode
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Use meaningful variable names

### File Structure

```
src/
├── index.ts        # CLI entry point
├── server.ts       # MCP server implementation
├── tools/          # Tool implementations by category
│   ├── calls.ts
│   ├── contacts.ts
│   └── ...
├── types/          # TypeScript type definitions
│   └── aircall.ts
└── utils/          # Utility functions
    ├── auth.ts
    └── rate-limiter.ts
```

### Adding a New Tool

1. Add types to `src/types/aircall.ts`
2. Create or update tool file in `src/tools/`
3. Add tool to category mapping in `src/server.ts`
4. Update README.md with documentation
5. Add to read-only list if applicable

Example tool structure:

```typescript
// src/tools/example.ts
import { z } from 'zod';
import type { AircallClient } from '../utils/auth.js';

export const myToolSchema = z.object({
  param1: z.string().describe('Description of param1'),
  param2: z.number().optional().describe('Optional parameter'),
});

export function createExampleTools(client: AircallClient) {
  return {
    aircall_my_tool: {
      description: 'Clear description of what this tool does',
      parameters: myToolSchema,
      execute: async (params: z.infer<typeof myToolSchema>) => {
        // Implementation
        const result = await client.get('/endpoint', params);
        return { success: true, data: result };
      },
    },
  };
}
```

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add support for call recording pause/resume
fix: handle rate limiting for bulk operations
docs: update README with new tools
refactor: simplify tool registration logic
```

## Testing

Before submitting a PR:

1. Ensure `npm run build` succeeds
2. Ensure `npm run typecheck` passes
3. Ensure `npm run lint` passes
4. Test changes manually with a real Aircall account if possible

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions
- Update tool tables in README when adding tools

## Questions?

Open an issue or reach out to the maintainers.

Thank you for contributing!
