import SectionPageShell from "@/components/layout/SectionPageShell";
import Careers from "@/sections/Careers";

export const metadata = {
  title: "Careers | GDMSPL",
  description: "Join GDMSPL and build extraordinary architectural projects.",
};

export default function CareersPage() {
  return (
    <SectionPageShell className="bg-[#fcfcfc]">
      <Careers />
    </SectionPageShell>
  );
}
