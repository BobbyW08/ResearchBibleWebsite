/**
 * Hand-rolled GitHub REST API client for the content-sync pipeline — direct
 * `fetch` calls, no Octokit/SDK dependency. Matches the "no heavy SDK"
 * convention already used for Google APIs (see `lib/google/serviceAccountAuth.ts`,
 * `lib/google/docs.ts`) and CLAUDE.md's locked tech-stack policy of no new
 * dependencies without approval.
 *
 * Auth: `GITHUB_CONTENT_SYNC_TOKEN` — a fine-grained PAT scoped to this repo
 * with Contents: write + Pull requests: write. Separate from Keystatic's own
 * GitHub App credentials (`KEYSTATIC_GITHUB_*`), which are for the CMS UI's
 * OAuth flow, not this server-side webhook.
 */

const GITHUB_API = "https://api.github.com";
const REPO_OWNER = "BobbyW08";
const REPO_NAME = "ResearchBibleWebsite";

function authHeaders(): Record<string, string> {
  const token = process.env.GITHUB_CONTENT_SYNC_TOKEN;
  if (!token) {
    throw new Error("Missing GITHUB_CONTENT_SYNC_TOKEN env var");
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function githubFetch(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers ?? {}) },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${init?.method ?? "GET"} ${path} failed: HTTP ${response.status} — ${body}`);
  }
  return response;
}

/** Returns the current commit SHA the default branch (`main`) points at. */
export async function getDefaultBranchSha(): Promise<string> {
  const response = await githubFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/main`);
  const data = (await response.json()) as { object: { sha: string } };
  return data.object.sha;
}

/** Creates a new branch named `name` pointing at commit `fromSha`. */
export async function createBranch(name: string, fromSha: string): Promise<void> {
  await githubFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/git/refs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ref: `refs/heads/${name}`, sha: fromSha }),
  });
}

/**
 * Returns the blob SHA of `path` at `ref`, or `null` if the file doesn't
 * exist there yet (e.g. a bible being ingested for the first time).
 */
export async function getFileSha(path: string, ref: string): Promise<string | null> {
  const response = await fetch(
    `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${encodeURIComponent(ref)}`,
    { headers: authHeaders() },
  );
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`GitHub API GET contents/${path} failed: HTTP ${response.status} — ${await response.text()}`);
  }
  const data = (await response.json()) as { sha: string };
  return data.sha;
}

/**
 * Returns the current UTF-8 content of `path` at `ref`, or `null` if it
 * doesn't exist there. Used by the webhook's dedup guard to diff against
 * the live GitHub file's current body.
 */
export async function getFileContent(path: string, ref: string): Promise<string | null> {
  const response = await fetch(
    `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${encodeURIComponent(ref)}`,
    { headers: { ...authHeaders(), Accept: "application/vnd.github.raw+json" } },
  );
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`GitHub API GET contents/${path} (raw) failed: HTTP ${response.status} — ${await response.text()}`);
  }
  return response.text();
}

/**
 * Creates (if `sha` omitted) or updates (if `sha` provided) a file at
 * `path` on `branch` with a single commit.
 */
export async function putFile(
  path: string,
  content: string,
  message: string,
  branch: string,
  sha?: string,
): Promise<void> {
  await githubFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });
}

/** Alias for `putFile` used when the caller already knows `sha` is required (an update, not a create). */
export async function updateFile(
  path: string,
  content: string,
  message: string,
  branch: string,
  sha: string,
): Promise<void> {
  await putFile(path, content, message, branch, sha);
}

/** Opens a pull request from `head` into `base`. Returns the PR's HTML URL. */
export async function openPullRequest(
  title: string,
  body: string,
  head: string,
  base: string,
): Promise<string> {
  const response = await githubFetch(`/repos/${REPO_OWNER}/${REPO_NAME}/pulls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body, head, base }),
  });
  const data = (await response.json()) as { html_url: string };
  return data.html_url;
}
