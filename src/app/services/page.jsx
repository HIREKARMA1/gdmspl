import SectionPageShell from "@/components/layout/SectionPageShell";
import Services from "@/sections/Services";

export const metadata = {
  title: "Services | GDMSPL",
  description: "Architecture, project management, urban design, interiors, and landscape services.",
};

export default function ServicesPage() {
  return (
    <SectionPageShell>
      <Services />
    </SectionPageShell>
  );
}
