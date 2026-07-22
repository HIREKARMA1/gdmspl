import SectionPageShell from "@/components/layout/SectionPageShell";
import Projects from "@/sections/Projects";

export const metadata = {
  title: "Projects | GDMSPL",
  description: "Explore our portfolio of architectural and design projects.",
};

export default function ProjectsPage() {
  return (
    <SectionPageShell className="overflow-x-hidden">
      <Projects standalone />
    </SectionPageShell>
  );
}
