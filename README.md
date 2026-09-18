# GitHub MCP Agent

An Agentic AI-powered GitHub Pull Request review system built with TypeScript, Node.js, MCP, GitHub API, and Google Gemini.

This project allows users to interact with GitHub Pull Requests using natural-language requests. The AI agent understands the user's request, selects the appropriate MCP tool, retrieves Pull Request data from GitHub, and generates an AI-powered analysis.

---

## Features

- Natural-language GitHub Pull Request requests
- AI-based MCP tool selection
- Pull Request summarization
- AI-powered code review
- Security review
- GitHub Pull Request data retrieval
- Changed-file and code-diff analysis
- Google Gemini integration
- MCP Client and MCP Server architecture
- Automatic retry for temporary Gemini API errors
- Dynamic repository owner, repository name, and Pull Request number
- TypeScript-based backend
- Environment variable based secret management

---

## Architecture

```text
User
  |
  v
MCP Client
  |
  v
Google Gemini
  |
  | Select appropriate MCP tool
  v
MCP Server
  |
  +-------------------+
  |        |          |
  v        v          v
summarize  review   security
   |         |          |
   +---------+----------+
             |
             v
       GitHub API
             |
             v
      Pull Request Data
             |
             v
       Google Gemini
             |
             v
        AI Analysis
             |
             v
           User

MCP Tools
1. summarize_pr

Summarizes a GitHub Pull Request.

It provides information about:

What was changed
Files changed
Main purpose of the change
Overall summary
2. review_pr

Performs an AI-powered code review.

It analyzes:

Possible bugs
Code quality
Edge cases
Performance concerns
Suggested improvements

3. security_review

Performs a security-focused Pull Request review.

It checks for:

Hardcoded secrets
Authentication issues
Authorization issues
Input validation problems
Injection vulnerabilities
Sensitive information exposure
Unsafe API usage
Other potential security risks

Tech Stack
TypeScript
Node.js
Express.js
Model Context Protocol (MCP)
Google Gemini
GitHub REST API
Octokit
Zod
dotenv
tsx
ts-node-dev

Project Structure
github-mcp-agent
│
├── src
│   ├── ai
│   │   └── ai.service.ts
│   │
│   ├── config
│   │   └── github.ts
│   │
│   ├── mcp
│   │   └── server.ts
│   │
│   ├── service
│   │   └── github.service.ts
│   │
│   ├── app.ts
│   └── client.ts
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md

How It Works

The application follows an agentic workflow.

Step 1: User Request

The user enters a natural-language request.

Example:

Review PR 1 of Anurag017pratap/github-mcp-agent
Step 2: Gemini Understands the Request

Gemini analyzes the request and selects the appropriate MCP tool.

For example:

review_pr
Step 3: MCP Client Calls the Tool

The MCP Client sends the selected tool and Pull Request details to the MCP Server.

Step 4: MCP Server Retrieves GitHub Data

The MCP Server uses the GitHub API through Octokit to retrieve:

Pull Request information
Changed files
Code patches
Step 5: AI Analysis

The Pull Request data is sent to Gemini with a task-specific prompt.

Step 6: Result

The generated summary, code review, or security review is returned to the user.

Installation

Clone the repository:

git clone https://github.com/Anurag017pratap/github-mcp-agent.git

Move into the project:

cd github-mcp-agent

Install dependencies:

npm install
Environment Variables

Create a .env file in the project root.

GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.1-flash-lite

Never commit your real .env file or API keys to GitHub.

A .env.example file is included as a template.

Run the Application

Start the development server:

npm run dev

Build the TypeScript project:

npm run build

Start the compiled application:

npm start
Run the Agent

Start the MCP client:

npx tsx src/client.ts

The application will display the available MCP tools:

Available tools:
- summarize_pr
- review_pr
- security_review

Then enter a request.

Example Requests
Code Review
Review PR 1 of Anurag017pratap/github-mcp-agent

The agent selects:

review_pr
Pull Request Summary
Summarize PR 1 of Anurag017pratap/github-mcp-agent

The agent selects:

summarize_pr
Security Review
Security review PR 1 of Anurag017pratap/github-mcp-agent

The agent selects:

security_review
MCP Inspector

The MCP server can also be tested using MCP Inspector.

Run:

npx @modelcontextprotocol/inspector npx tsx src/mcp/server.ts

The Inspector can be used to view and test the available MCP tools.

Error Handling

The Gemini integration includes automatic retry handling for temporary 503 API errors.

If Gemini is temporarily unavailable, the client retries the request before returning an error.

Security

Sensitive credentials are stored in environment variables.

The following files and directories are excluded from Git:

.env
node_modules
dist

Never expose:

GitHub access tokens
Gemini API keys
Other private credentials
Future Improvements

Possible future improvements include:

GitHub webhook integration
Automatic Pull Request comments
Automatic review suggestions
Multi-agent review workflows
Test generation
Pull Request quality scoring
CI/CD integration
Support for multiple AI providers
More advanced repository analysis
Project Goal

The goal of this project is to demonstrate how Agentic AI and the Model Context Protocol can be used to build an AI-powered software engineering workflow.

Instead of simply generating text, the agent understands the user's request, selects an appropriate tool, retrieves external data, performs analysis, and returns an actionable result.

Author

Anurag Pratap

GitHub:

https://github.com/Anurag017pratap




