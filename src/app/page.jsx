import GdmSplatLanding from "@/sections/GdmSplatLanding";
import Projects from "@/sections/Projects";
import About from "@/sections/About";
import Services from "@/sections/Services";
import Team from "@/sections/Team";
import Careers from "@/sections/Careers";
import Contact from "@/sections/Contact";

export default function HomePage() {
  return (
    <>
      <GdmSplatLanding />
      <Projects />
      <About />
      <Services />
      <Team />
      <Careers embedded />
      <Contact />
    </>
  );
}
