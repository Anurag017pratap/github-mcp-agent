import express from "express";
import dotenv from "dotenv";
import {
    askGemini,
    summarizePullRequest,
    reviewPullRequest,
    securityReviewPullRequest
} from "./ai/ai.service.js";
import {
    getPullRequest,
    getPullRequestFiles
} from "./service/github.service.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "GitHub MCP AI Agent is working"
    });
});

app.get("/test-pr", async (req, res) => {
    try {
        const owner = req.query.owner as string;
        const repo = req.query.repo as string;
        const pullNumber = Number(req.query.pull);

        if (!owner || !repo || !pullNumber) {
            return res.status(400).json({
                error: "owner, repo and pull are required"
            });
        }

        const data = await getPullRequest(
            owner,
            repo,
            pullNumber
        );

        res.json(data);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch pull request"
        });
    }
});


app.get("/test-files", async (req, res) => {
    try {
        const owner = req.query.owner as string;
        const repo = req.query.repo as string;
        const pullNumber = Number(req.query.pull);

        if (!owner || !repo || !pullNumber) {
            return res.status(400).json({
                error: "owner, repo and pull are required"
            });
        }

        const files = await getPullRequestFiles(
            owner,
            repo,
            pullNumber
        );

        res.json(files);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch pull request files"
        });
    }
});

app.get("/test-ai", async (req, res) => {
    try {
        const response = await askGemini(
            "Explain in simple words what a GitHub Pull Request is."
        );

        res.json({
            response
        });
    } catch (error) {
        console.error("GEMINI ERROR:", error);

        res.status(500).json({
            error: "Gemini request failed",
            details: String(error)
        });
    }
});

app.get("/summarize-pr", async (req, res) => {
    try {
        const owner = req.query.owner as string;
        const repo = req.query.repo as string;
        const pullNumber = Number(req.query.pull);

        if (!owner || !repo || !pullNumber) {
            return res.status(400).json({
                error: "owner, repo and pull are required"
            });
        }

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

        res.json({
            owner,
            repo,
            pullNumber,
            summary
        });

    } catch (error) {
        console.error("SUMMARY ERROR:", error);

        res.status(500).json({
            error: "Failed to summarize pull request",
            details: String(error)
        });
    }
});

app.get("/review-pr", async (req, res) => {
    try {
        const owner = req.query.owner as string;
        const repo = req.query.repo as string;
        const pullNumber = Number(req.query.pull);

        if (!owner || !repo || !pullNumber) {
            return res.status(400).json({
                error: "owner, repo and pull are required"
            });
        }

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

        res.json({
            owner,
            repo,
            pullNumber,
            review
        });

    } catch (error) {
        console.error("REVIEW ERROR:", error);

        res.status(500).json({
            error: "Failed to review pull request",
            details: String(error)
        });
    }
});

app.get("/security-review", async (req, res) => {
    try {
        const owner = req.query.owner as string;
        const repo = req.query.repo as string;
        const pullNumber = Number(req.query.pull);

        if (!owner || !repo || !pullNumber) {
            return res.status(400).json({
                error: "owner, repo and pull are required"
            });
        }

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

        res.json({
            owner,
            repo,
            pullNumber,
            securityReview
        });

    } catch (error) {
        console.error("SECURITY REVIEW ERROR:", error);

        res.status(500).json({
            error: "Failed to perform security review",
            details: String(error)
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});