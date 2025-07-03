# Customer Support Agent

## Setup & Development

### Using npm
- **Install dependencies**: `npm install`
- **Run dev server**: `npm run dev` (left sidebar only - default)
- **UI variants**: 
  - `npm run dev:full` (both sidebars)
  - `npm run dev:left` (left sidebar only)
  - `npm run dev:right` (right sidebar only)
  - `npm run dev:chat` (chat only, no sidebars)
- **Lint**: `npm run lint`
- **Build**: `npm run build` (builds with left sidebar by default)
- **Build variants**: 
  - `npm run build:full` (both sidebars)
  - `npm run build:left` (left sidebar only)
  - `npm run build:right` (right sidebar only)
  - `npm run build:chat` (chat only)

## Features

- **AI Chat**: Powered by Claude
- **Knowledge Base**: Built-in TF-IDF search with pre-loaded documents about Anthropic
- **Context Viewing**: Click the context status button in left sidebar to see full RAG context
- **Mood Detection**: Automatic user mood detection and display
- **Category Matching**: Automatic categorization of customer inquiries
- **Agent Redirect**: Smart detection of when to escalate to human agents

## Code Style

- **TypeScript**: Strict mode with proper interfaces
- **Components**: Function components with React hooks
- **Formatting**: Follow ESLint Next.js configuration
- **UI components**: Use shadcn/ui components library
