import dotenv from "dotenv";
import { Octokit } from "octokit";

dotenv.config();

const token = process.env.GITHUB_TOKEN;

if (!token) {
    throw new Error("GITHUB_TOKEN is missing");
}

export const octokit = new Octokit({
    auth: token
});