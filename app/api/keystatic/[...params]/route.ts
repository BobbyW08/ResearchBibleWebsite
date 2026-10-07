import { makeRouteHandler } from "@keystatic/next/route-handler";
import keystaticConfig from "@/keystatic.config";
import type { NextRequest } from "next/server";

type RouteCtx = { params: Promise<Record<string, string | string[]>> };
type RouteHandler = (req: NextRequest, ctx: RouteCtx) => Promise<Response>;

let _GET: RouteHandler | undefined;
let _POST: RouteHandler | undefined;

function ensureHandlers() {
  if (!_GET || !_POST) {
    const handlers = makeRouteHandler({ config: keystaticConfig }) as {
      GET: RouteHandler;
      POST: RouteHandler;
    };
    _GET = handlers.GET;
    _POST = handlers.POST;
  }
}

export function GET(request: NextRequest, context: RouteCtx) {
  ensureHandlers();
  return _GET!(request, context);
}

export function POST(request: NextRequest, context: RouteCtx) {
  ensureHandlers();
  return _POST!(request, context);
}
