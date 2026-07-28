import Header from "@/components/marketing/header";
import Hero from "@/components/marketing/hero";
import About from "@/components/marketing/about";
import Guides from "@/components/marketing/guides";
import FreeGuide from "@/components/marketing/free-guide";
import SubscribePrompt from "@/components/marketing/subscribe-prompt";
import Services from "@/components/marketing/services";
import Testimonials from "@/components/marketing/testimonials";
import Footer from "@/components/marketing/footer";

// Remaining placeholders — Book a call and FAQ are out of scope for this
// pass and still await their ShadcnSpace blocks.
function PlaceholderSection({ id, title }: { id: string; title: string }) {
  return (
    <section
      id={id}
      className="border-t border-border px-6 py-16 text-center text-muted-foreground"
    >
      <p className="text-xs tracking-wide uppercase">{title}</p>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <Hero />
      <div id="about">
        <About />
      </div>
      <div id="guides">
        <Guides />
      </div>
      <FreeGuide />
      <SubscribePrompt />
      <div id="services">
        <Services />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <PlaceholderSection id="book-a-call" title="Book a call" />
      <PlaceholderSection id="faq" title="FAQ" />
      <Footer />
    </div>
  );
}
