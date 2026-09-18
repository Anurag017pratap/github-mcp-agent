import express from "express";
import dotenv from "dotenv";
import {
    getPullRequest,
    getPullRequestFiles
} from "./service/github.service";

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

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});