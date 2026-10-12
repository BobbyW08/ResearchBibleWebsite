import "server-only";
import {
  SUBSTACK_SUBDOMAIN,
  SUBSTACK_URL,
  SUBSTACK_EMBED_URL,
  CAL_COM_INTRO_CALL_URL,
} from "@/lib/links";

export async function getSiteLinks() {
  try {
    const { getSiteSettings } = await import("@/lib/payload-globals");
    const settings = await getSiteSettings();
    const subdomain =
      (settings as { substackSubdomain?: string }).substackSubdomain || SUBSTACK_SUBDOMAIN;
    const calUrl =
      (settings as { calComUrl?: string }).calComUrl || CAL_COM_INTRO_CALL_URL;
    return {
      SUBSTACK_SUBDOMAIN: subdomain,
      SUBSTACK_URL: `https://${subdomain}.substack.com/`,
      SUBSTACK_EMBED_URL: `https://${subdomain}.substack.com/embed`,
      CAL_COM_INTRO_CALL_URL: calUrl,
    };
  } catch {
    return {
      SUBSTACK_SUBDOMAIN,
      SUBSTACK_URL,
      SUBSTACK_EMBED_URL,
      CAL_COM_INTRO_CALL_URL,
    };
  }
}
