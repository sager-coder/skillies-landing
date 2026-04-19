import HeroV2 from "@/components/design/HeroV2";
import PromiseEditorial from "@/components/design/PromiseEditorial";
import Transformation from "@/components/design/Transformation";
import ProofWall from "@/components/design/ProofWall";
import First7Days from "@/components/design/First7Days";
import HowItWorks from "@/components/design/HowItWorks";
import Program from "@/components/design/ProgramEditorial";
import Guarantee from "@/components/Guarantee";
import AboutEditorial from "@/components/design/AboutEditorial";
import FAQ from "@/components/FAQ";
import FooterEditorial from "@/components/design/FooterEditorial";
import TopNav from "@/components/design/TopNav";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main>
      <TopNav />
      <HeroV2 />
      <section id="promise">
        <PromiseEditorial />
      </section>
      <Transformation />
      <section id="proof">
        <ProofWall />
      </section>
      <First7Days />
      <HowItWorks />
      <Program />
      <Guarantee />
      <AboutEditorial />
      <section id="faq">
        <FAQ />
      </section>
      <FooterEditorial />
      <WhatsAppButton />
    </main>
  );
}
