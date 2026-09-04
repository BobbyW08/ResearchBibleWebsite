import crypto from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";

interface CachedToken {
  token: string;
  expiresAt: number;
  scopeKey: string;
}

let cachedToken: CachedToken | null = null;

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function buildSignedJwt(email: string, privateKey: string, scopes: string[]): string {
  const now = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: email,
      scope: scopes.join(" "),
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    }),
  );

  const signingInput = `${header}.${claims}`;
  const signature = base64url(crypto.sign("RSA-SHA256", Buffer.from(signingInput), privateKey));

  return `${signingInput}.${signature}`;
}

/**
 * Exchanges the service account's private key for a short-lived Google OAuth
 * access token via the JWT Bearer flow, using only `fetch` + `node:crypto` —
 * no `googleapis`/`google-auth-library` dependency (banned per CLAUDE.md).
 */
export async function getGoogleAccessToken(scopes: string[]): Promise<string> {
  const scopeKey = [...scopes].sort().join(" ");

  if (cachedToken && cachedToken.scopeKey === scopeKey && cachedToken.expiresAt - 60 > Date.now() / 1000) {
    return cachedToken.token;
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawPrivateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!email || !rawPrivateKey) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY env var",
    );
  }

  const privateKey = rawPrivateKey.replace(/\\n/g, "\n");
  const jwt = buildSignedJwt(email, privateKey, scopes);

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google token exchange failed: HTTP ${response.status} — ${await response.text()}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() / 1000 + data.expires_in,
    scopeKey,
  };

  return data.access_token;
}

export const GOOGLE_SCOPES = {
  driveReadonly: "https://www.googleapis.com/auth/drive.readonly",
  spreadsheetsReadonly: "https://www.googleapis.com/auth/spreadsheets.readonly",
  spreadsheets: "https://www.googleapis.com/auth/spreadsheets",
} as const;
