import { getPayloadClient } from "@/lib/payload-client";
import ProofWallHero, { type Testimonial } from "@/components/marketing/proof-wall-hero";

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Feeling heard and seen by someone that has experienced similar or same experiences is a welcomed relief.",
    attribution: "Parent peer-support client",
  },
  {
    quote:
      "You called me out on my crap — which I needed. I always felt like you were in my corner.",
    attribution: "Parent peer-support client",
  },
  {
    quote:
      "We have more tools to de-escalate situations, and more confidence as a parent.",
    attribution: "Parent peer-support client",
  },
  {
    quote:
      "Real life, honest, lived experiences made me feel heard, seen, and not alone.",
    attribution: "Parent peer-support client",
  },
  {
    quote: "If we didn't have Bobby, I don't know if we would be where we are.",
    attribution: "Parent peer-support client",
  },
];

async function Hero() {
  let testimonials: Testimonial[] = FALLBACK_TESTIMONIALS;
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({ collection: "testimonials", limit: 20, depth: 0 });
    if (docs.length > 0) {
      testimonials = docs.map((doc) => {
        const d = doc as unknown as { quote: string; attribution: string };
        return { quote: d.quote, attribution: d.attribution };
      });
    }
  } catch {
    // Payload not ready yet — use fallback
  }

  return <ProofWallHero testimonials={testimonials} />;
}

export default Hero;
