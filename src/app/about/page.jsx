import SectionPageShell from "@/components/layout/SectionPageShell";
import About from "@/sections/About";

export const metadata = {
  title: "About Us | GDMSPL",
  description: "Learn about Geometric Design Management Services and our architectural practice.",
};

export default function AboutPage() {
  return (
    <SectionPageShell>
      <About />
    </SectionPageShell>
  );
}
