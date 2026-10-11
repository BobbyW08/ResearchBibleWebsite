import { getPayloadClient } from "./payload-client";

export async function getFaq() {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: "faq" });
}

export async function getFooter() {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: "footer" });
}

export async function getSiteSettings() {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: "site-settings" });
}

export async function getAbout() {
  const payload = await getPayloadClient();
  return payload.findGlobal({ slug: "about" });
}
