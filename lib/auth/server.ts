import { createNeonAuth } from "@neondatabase/auth/next/server";

type NeonAuth = ReturnType<typeof createNeonAuth>;

let _auth: NeonAuth | null = null;

export function getAuth(): NeonAuth {
  if (!_auth) {
    _auth = createNeonAuth({
      baseUrl: process.env.NEON_AUTH_BASE_URL ?? "",
      cookies: {
        secret: process.env.NEON_AUTH_COOKIE_SECRET ?? "",
      },
    });
  }
  return _auth;
}

export const auth: NeonAuth = new Proxy({} as NeonAuth, {
  get(_t, prop, receiver) {
    const instance = getAuth();
    const val = Reflect.get(instance, prop, receiver);
    return typeof val === "function" ? (val as (...args: unknown[]) => unknown).bind(instance) : val;
  },
});
