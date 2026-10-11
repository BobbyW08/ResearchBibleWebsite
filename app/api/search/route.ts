// Fumadocs full-text search removed with Payload migration.
// This stub exists to prevent 404s from any cached links; a proper
// Payload-backed search endpoint can be wired in here later.
export function GET() {
  return new Response(JSON.stringify({ results: [] }), {
    headers: { "Content-Type": "application/json" },
  });
}
