# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Affidavit Manager application - a legal document generation system for creating affidavits, certifications, and verifications for civil litigation. The application is built with Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS v4.

## Common Commands

```bash
# Development
pnpm dev          # Start development server with Turbopack on http://localhost:3000
pnpm build        # Create production build
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Package Management
pnpm install      # Install dependencies
pnpm add [pkg]    # Add new dependency
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.3.3 with App Router
- **UI**: React 19.0.0 with Server Components by default
- **Styling**: Tailwind CSS v4 with PostCSS
- **Language**: TypeScript 5 with strict mode
- **Package Manager**: pnpm (workspace configured)
- **Development**: Turbopack for fast refresh

### Project Structure
- `/app` - Next.js App Router pages and layouts
- `/public` - Static assets
- Components should be created in `/app/components` or `/components` as needed
- Use the `@/*` path alias for imports from the root directory

### Key Architectural Decisions
1. **App Router**: All routing uses the new App directory structure
2. **Server Components**: Components are server-rendered by default; use `'use client'` directive only when needed
3. **Tailwind v4**: Uses the new CSS-first configuration approach with `@import "tailwindcss"`
4. **TypeScript**: Strict mode enabled for type safety

### MCP Integration
The project includes an MCP (Model Context Protocol) server configuration pointing to `http://10.16.0.9:8000/sse` for memory/context management.

**Important**: When using memory MCP tools (mcp__memory__ or mcp__graphiti-memory__), always use `group_id: "litigation-tools"` to access project-specific context and documentation.

## Instructions for Using Graphiti's MCP Tools for Agent Memory

### Before Starting Any Task

- **Always search first:** Use the `search_nodes` tool to look for relevant preferences and procedures before beginning work.
- **Search for facts too:** Use the `search_facts` tool to discover relationships and factual information that may be relevant to your task.
- **Filter by entity type:** Specify `Preference`, `Procedure`, or `Requirement` in your node search to get targeted results.
- **Review all matches:** Carefully examine any preferences, procedures, or facts that match your current task.

### Always Save New or Updated Information

- **Capture requirements and preferences immediately:** When a user expresses a requirement or preference, use `add_episode` to store it right away.
  - _Best practice:_ Split very long requirements into shorter, logical chunks.
- **Be explicit if something is an update to existing knowledge.** Only add what's changed or new to the graph.
- **Document procedures clearly:** When you discover how a user wants things done, record it as a procedure.
- **Record factual relationships:** When you learn about connections between entities, store these as facts.
- **Be specific with categories:** Label preferences and procedures with clear categories for better retrieval later.

### During Your Work

- **Respect discovered preferences:** Align your work with any preferences you've found.
- **Follow procedures exactly:** If you find a procedure for your current task, follow it step by step.
- **Apply relevant facts:** Use factual information to inform your decisions and recommendations.
- **Stay consistent:** Maintain consistency with previously identified preferences, procedures, and facts.

### Best Practices

- **Search before suggesting:** Always check if there's established knowledge before making recommendations.
- **Combine node and fact searches:** For complex tasks, search both nodes and facts to build a complete picture.
- **Use `center_node_uuid`:** When exploring related information, center your search around a specific node.
- **Prioritize specific matches:** More specific information takes precedence over general information.
- **Be proactive:** If you notice patterns in user behavior, consider storing them as preferences or procedures.

**Remember:** The knowledge graph is your memory. Use it consistently to provide personalized assistance that respects the user's established preferences, procedures, and factual context.

## Legal Document Features (To Be Implemented)

Based on the project's purpose, the following features are planned:
- Document type selection (affidavit, certification, verification)
- Jurisdiction-specific templates (Federal 28 U.S.C. § 1746, NJ R. 1:4-4(b))
- Exhibit management system (up to 702 exhibits with auto-labeling)
- Court caption auto-population
- Multi-format export (Word, PDF, CM/ECF)

## Development Guidelines

When implementing features:
1. Leverage Next.js 15 features like parallel routes for split-screen editing
2. Use server actions for form submissions
3. Implement streaming responses for large document generation
4. Utilize edge functions for fast document preview
5. Follow the existing TypeScript and ESLint configurations