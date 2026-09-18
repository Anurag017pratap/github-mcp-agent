import { octokit } from "../config/github";

export async function getPullRequest(
    owner: string,
    repo: string,
    pullNumber: number
) {
    const response = await octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: pullNumber
    });

    return response.data;
}
export async function getPullRequestFiles(
    owner: string,
    repo: string,
    pullNumber: number
) {
    const response = await octokit.rest.pulls.listFiles({
        owner,
        repo,
        pull_number: pullNumber
    });

    return response.data;
}