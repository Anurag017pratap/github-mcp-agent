import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
    apiKey
});

export async function askGemini(prompt: string) {
    const response = await ai.models.generateContent({
    model: model,
    contents: prompt
});

    return response.text;
}

export async function summarizePullRequest(
    pullRequest: any,
    files: any[]
) {
    let changes = "";

    for (const file of files) {
        changes += `
File: ${file.filename}
Status: ${file.status}
Changes: ${file.changes}

Patch:
${file.patch || "No patch available"}

--------------------
`;
    }

    const prompt = `
You are a software engineer reviewing a GitHub Pull Request.

Summarize this Pull Request in simple and clear language.

Pull Request Title:
${pullRequest.title}

Pull Request Description:
${pullRequest.body || "No description provided"}

Changed Files:
${changes}

Give the response in this format:

1. What was changed
2. Files changed
3. Main purpose of the change
4. Short overall summary
`;

    return await askGemini(prompt);
}

export async function reviewPullRequest(
    pullRequest: any,
    files: any[]
) {
    let changes = "";

    for (const file of files) {
        changes += `
File: ${file.filename}
Status: ${file.status}
Changes: ${file.changes}

Patch:
${file.patch || "No patch available"}

--------------------
`;
    }

    const prompt = `
You are an experienced software engineer performing a code review.

Review the following GitHub Pull Request.

Pull Request Title:
${pullRequest.title}

Pull Request Description:
${pullRequest.body || "No description provided"}

Changed Files:
${changes}

Analyze the code changes and provide:

1. Bugs or possible problems
2. Code quality issues
3. Potential edge cases
4. Performance concerns
5. Suggested improvements

If you do not find any major issue, clearly say so.

Keep the review simple and practical.
`;

    return await askGemini(prompt);
}

export async function securityReviewPullRequest(
    pullRequest: any,
    files: any[]
) {
    let changes = "";

    for (const file of files) {
        changes += `
File: ${file.filename}
Status: ${file.status}

Patch:
${file.patch || "No patch available"}

--------------------
`;
    }

    const prompt = `
You are a security-focused software engineer.

Analyze this GitHub Pull Request for potential security problems.

Pull Request Title:
${pullRequest.title}

Pull Request Description:
${pullRequest.body || "No description provided"}

Changed Files:
${changes}

Look specifically for:

1. Hardcoded secrets or API keys
2. Authentication problems
3. Authorization problems
4. Input validation issues
5. Injection vulnerabilities
6. Sensitive information exposure
7. Unsafe API usage
8. Other important security risks

For every issue found, explain:
- What the problem is
- Why it is a security risk
- How it can be improved

If no obvious security issue is found, clearly say so.

Keep the response simple and practical.
`;

    return await askGemini(prompt);
}