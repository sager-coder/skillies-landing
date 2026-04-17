import Hero from "@/components/Hero";
import Promise from "@/components/Promise";
import WhatIsKDP from "@/components/WhatIsKDP";
import Program from "@/components/Program";
import Guarantee from "@/components/Guarantee";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main>
      <Hero />
      <Promise />
      <WhatIsKDP />
      <Program />
      <Guarantee />
      <About />
      <FAQ />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
