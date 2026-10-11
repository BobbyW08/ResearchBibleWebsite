import Header from "@/components/marketing/header";
import Hero from "@/components/marketing/hero";
import StartHere from "@/components/marketing/start-here";
import QuickCredential from "@/components/marketing/quick-credential";
import Faq from "@/components/marketing/faq";
import Footer from "@/components/marketing/footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header logoAnimatesIn />
      <Hero />
      <StartHere />
      <QuickCredential />
      <Faq />
      <Footer />
    </div>
  );
}
