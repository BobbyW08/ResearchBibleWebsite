import { getAuth } from "@/lib/auth/server";
import type { NextRequest } from "next/server";

type RouteHandler = (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) => Promise<Response>;

let _GET: RouteHandler | undefined;
let _POST: RouteHandler | undefined;

function ensureHandlers() {
  if (!_GET || !_POST) {
    const handlers = getAuth().handler() as { GET: RouteHandler; POST: RouteHandler };
    _GET = handlers.GET;
    _POST = handlers.POST;
  }
}

export function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  ensureHandlers();
  return _GET!(request, context);
}

export function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  ensureHandlers();
  return _POST!(request, context);
}
