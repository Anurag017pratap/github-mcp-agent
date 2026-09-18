import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

import {
    getPullRequest,
    getPullRequestFiles
} from "../service/github.service.js";

import {
    summarizePullRequest,
    reviewPullRequest,
    securityReviewPullRequest
} from "../ai/ai.service.js";

const server = new McpServer({
    name: "github-mcp-agent",
    version: "1.0.0"
});

server.registerTool(
    "summarize_pr",
    {
        description: "Summarize a GitHub Pull Request using AI",
        inputSchema: z.object({
            owner: z.string(),
            repo: z.string(),
            pullNumber: z.number()
        })
    },
    async ({ owner, repo, pullNumber }) => {

        const pullRequest = await getPullRequest(
            owner,
            repo,
            pullNumber
        );

        const files = await getPullRequestFiles(
            owner,
            repo,
            pullNumber
        );

        const summary = await summarizePullRequest(
            pullRequest,
            files
        );

        return {
            content: [
                {
                    type: "text",
                    text: summary || "No summary generated"
                }
            ]
        };
    }
);

server.registerTool(
    "review_pr",
    {
        description: "Review a GitHub Pull Request using AI",
        inputSchema: z.object({
            owner: z.string(),
            repo: z.string(),
            pullNumber: z.number()
        })
    },
    async ({ owner, repo, pullNumber }) => {

        const pullRequest = await getPullRequest(
            owner,
            repo,
            pullNumber
        );

        const files = await getPullRequestFiles(
            owner,
            repo,
            pullNumber
        );

        const review = await reviewPullRequest(
            pullRequest,
            files
        );

        return {
            content: [
                {
                    type: "text",
                    text: review || "No review generated"
                }
            ]
        };
    }
);

server.registerTool(
    "security_review",
    {
        description: "Perform a security review of a GitHub Pull Request using AI",
        inputSchema: z.object({
            owner: z.string(),
            repo: z.string(),
            pullNumber: z.number()
        })
    },
    async ({ owner, repo, pullNumber }) => {

        const pullRequest = await getPullRequest(
            owner,
            repo,
            pullNumber
        );

        const files = await getPullRequestFiles(
            owner,
            repo,
            pullNumber
        );

        const securityReview = await securityReviewPullRequest(
            pullRequest,
            files
        );

        return {
            content: [
                {
                    type: "text",
                    text: securityReview || "No security review generated"
                }
            ]
        };
    }
);

void serveStdio(() => server);

console.error("GitHub MCP Agent server is running");