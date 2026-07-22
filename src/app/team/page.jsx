import SectionPageShell from "@/components/layout/SectionPageShell";
import Team from "@/sections/Team";

export const metadata = {
  title: "Team | GDMSPL",
  description: "Meet the team behind our architectural vision.",
};

export default function TeamPage() {
  return (
    <SectionPageShell>
      <Team />
    </SectionPageShell>
  );
}
