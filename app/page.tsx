import Header from "@/components/marketing/header";
import Hero from "@/components/marketing/hero";
import PainPoints from "@/components/marketing/pain-points";
import Connect from "@/components/marketing/connect";
import MeetBobby from "@/components/marketing/meet-bobby";
import Testimonials from "@/components/marketing/testimonials";
import Faq from "@/components/marketing/faq";
import Footer from "@/components/marketing/footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <Hero />
      <PainPoints />
      <Connect />
      <MeetBobby />
      <Testimonials />
      <Faq />
      <Footer />
    </div>
  );
}
