import { reader } from "@/lib/keystatic-reader";
import TestimonialsMarquee, { type Testimonial } from "@/components/marketing/testimonials-marquee";

async function Testimonials() {
  const entries = await reader.collections.testimonials.all();
  const testimonials: Testimonial[] = entries.map(({ entry }) => ({
    quote: entry.quote,
    attribution: entry.attribution,
  }));

  return <TestimonialsMarquee testimonials={testimonials} />;
}

export default Testimonials;
