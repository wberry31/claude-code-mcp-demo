# Claude Customer Support Agent

An advanced, fully customizable customer support chat interface powered by Claude.
![preview](tutorial/preview.png)

## Key Features

-  AI-powered chat using Anthropic's Claude model
-  Built-in knowledge base with TF-IDF based search
-  Real-time thinking & debug information display
-  User mood detection & appropriate agent redirection
-  Context viewing - click the context status to see full RAG context
-  Highly customizable UI with shadcn/ui components

## Clone the repo
```
git clone https://github.com/anthropic-krzim/claude-code-mcp-demo.git
cd claude-code-mcp-demo
```

## ⚙️ Configuration

Before running the application, you need to set up your API key.

### Anthropic API Key

1. Visit [console.anthropic.com](https://console.anthropic.com/dashboard)
2. Sign up or log in to your account
3. Click on "Get API keys"
4. Copy the key and save it for the next step

### Environment Setup

Create a `.env.local` file in the root directory with the following:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**Important**: Never commit your `.env.local` file to version control.

### GitHub MCP Setup (Optional)

To enable GitHub integration with Claude via MCP (Model Context Protocol):

1. **Get a GitHub Personal Access Token**:
   - Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)" or use "Fine-grained personal access tokens" for better security
   - Give it a descriptive name (e.g., "Claude MCP")
   
   **For Classic Token**, select these scopes:
   - `repo` - Full control of private repositories
   
   **For Fine-grained Token** (Recommended):
   - Repository access: Select only this specific repository
   - Repository permissions:
     - **Read access to**: metadata, commit statuses
     - **Read and Write access to**: code, issues, pull requests
   
   - Generate and copy the token

2. **Add the token to your `.env.local`**:
   ```
   GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here
   ```

3. **Run the setup script**:
   ```bash
   ./setup-github-mcp.sh
   ```

This will configure Claude to access your GitHub repositories through the MCP server, enabling features like code search, issue management, and pull request operations directly from Claude.

##  Getting Started

1. Clone this repository
2. Ensure you've created the `.env.local` file with your API key (see Configuration above)
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Scripts

- `npm run dev` - Start development server with left sidebar only
- `npm run dev:full` - Start with both sidebars enabled
- `npm run dev:left` - Start with left sidebar only
- `npm run dev:right` - Start with right sidebar only
- `npm run dev:chat` - Start with chat interface only (no sidebars)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

##  Switching Models

This project supports multiple Claude models. The currently configured models are:

- **Claude 3 Haiku** - Fast and efficient for quick responses
- **Claude 3.5 Sonnet** (Default) - Balanced performance and capabilities

To switch between models:

1. In `ChatArea.tsx`, the `models` array defines available models:

```typescript
const models: Model[] = [
  { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" },
  { id: "claude-3-5-sonnet-20240620", name: "Claude 3.5 Sonnet" },
  // Add more models as needed
];
```

2. The `selectedModel` state variable controls the currently selected model:

```typescript
const [selectedModel, setSelectedModel] = useState("claude-3-5-sonnet-20240620");
```

3. Users can switch models using the dropdown in the chat interface.

##  Customization

This project leverages shadcn/ui components, offering a high degree of customization:

### UI Components
- Modify the UI components in the `components/ui` directory
- Adjust the theme in `app/globals.css`
- Customize the layout and functionality in individual component files

### Theme Customization
Modify the theme colors and styles by editing the `styles/themes.js` file:

```javascript
// styles/themes.js
export const themes = {
  neutral: {
    light: {
      // Light mode colors for neutral theme
    },
    dark: {
      // Dark mode colors for neutral theme
    }
  },
  // Add more themes here
};
```

### Knowledge Base
The knowledge base is stored in `app/lib/knowledgebase.json`. You can:
- Add new documents to expand the knowledge base
- Modify existing documents to update information
- The search uses TF-IDF for efficient document retrieval

## Project Structure

- `/app` - Next.js app directory containing the main application logic
- `/components` - React components including UI elements
- `/lib` - Utility functions and shared code
- `/public` - Static assets
- `/styles` - Global styles and theme configurations

## Features in Detail

### Context Viewing
Click the "Context: ✅" button in the left sidebar to view:
- The full context provided to Claude
- Retrieved documents with relevance scores
- The exact information used to generate responses

### Mood Detection
The system automatically detects user mood (positive, negative, curious, frustrated, confused, neutral) and displays it in the left sidebar.

### Smart Routing
Automatically detects when queries should be escalated to human agents based on complexity or content.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
