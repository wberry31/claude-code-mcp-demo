#!/bin/bash

# Load the GitHub token from .env.local
if [ -f .env.local ]; then
    set -a && source .env.local && set +a
fi

# Check if token is set
if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
    echo "Error: GITHUB_PERSONAL_ACCESS_TOKEN not found in .env.local"
    echo "Please add GITHUB_PERSONAL_ACCESS_TOKEN=<your_token> to .env.local"
    exit 1
fi

# Add the GitHub MCP server
if claude mcp add --transport http -s local github "https://api.githubcopilot.com/mcp/" --header "Authorization: ${GITHUB_PERSONAL_ACCESS_TOKEN}" > /dev/null 2>&1; then
    echo "GitHub MCP server added successfully!"
else
    echo "Error: Failed to add GitHub MCP server"
    exit 1
fi