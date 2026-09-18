import "dotenv/config";

import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import readline from "readline";

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
    apiKey
});

async function askGeminiWithRetry(prompt: string) {
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3.1-flash-lite",
                contents: prompt
            });

            return response.text?.trim();

        } catch (error: any) {

            if (error?.status === 503 && attempt < 3) {
                console.log(
                    `Gemini busy. Retrying... (${attempt}/3)`
                );

                await new Promise(resolve =>
                    setTimeout(resolve, 2000)
                );

            } else {
                throw error;
            }
        }
    }

    return undefined;
}

const client = new Client({
    name: "github-mcp-client",
    version: "1.0.0"
});

const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "src/mcp/server.ts"]
});

async function main() {

    await client.connect(transport);

    const { tools } = await client.listTools();

    console.log("Available tools:");

    for (const tool of tools) {
        console.log("-", tool.name);
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Enter your request: ", async (question) => {

        console.log("\nYou asked:", question);

        console.log("\nYou asked:", question);

const prMatch = question.match(
    /PR\s*#?(\d+)\s+of\s+([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/i
);

if (!prMatch) {
    console.log(
        "\nPlease use this format: Review PR 1 of owner/repository"
    );

    rl.close();
    await client.close();
    return;
}

const pullNumber = Number(prMatch[1]);
const owner = prMatch[2];
const repo = prMatch[3];

        try {

            console.log("\nAsking Gemini...");

            const selectedTool = await askGeminiWithRetry(`

You are an AI agent for a GitHub Pull Request system.

Choose the correct MCP tool based on the user's request.

Available tools:

summarize_pr:
Use when the user wants to understand or summarize the PR.

review_pr:
Use when the user wants a code review, bug review, or code quality review.

security_review:
Use when the user wants to find security vulnerabilities or security problems.

If the user's request is unclear or does not relate to these tasks, return:
unclear

User request:
${question}

Return ONLY one of these:
summarize_pr
review_pr
security_review
unclear

`);

            console.log("\nAI selected tool:");
            console.log(selectedTool);

            if (
                selectedTool === "summarize_pr" ||
                selectedTool === "review_pr" ||
                selectedTool === "security_review"
            ) {

                console.log("\nCalling MCP tool...");

                const result = await client.callTool({
                    name: selectedTool,
                    arguments: {
                          owner,
                          repo,
                         pullNumber
                    }
                });

                console.log("\nMCP Tool Result:");

                if (result.isError) {

                    console.log("MCP tool failed:");
                    console.log(result);

                } else {

                    const content =
                        result.content as Array<{
                            type: string;
                            text?: string;
                        }>;

                    const textContent = content.find(
                        (item) => item.type === "text"
                    );

                    console.log(
                        textContent?.text ||
                        "No result returned"
                    );
                }

            } else {

                console.log(
                    "\nSorry, I could not understand your request."
                );
            }

        } catch (error) {

            console.error("\nGemini Error:");
            console.error(error);

        }

        rl.close();

        await client.close();
    });
}

main().catch((error) => {
    console.error("Client error:", error);
});