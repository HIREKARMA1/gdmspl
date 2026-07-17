import SectionPageShell from "@/components/layout/SectionPageShell";
import Contact from "@/sections/Contact";

export const metadata = {
  title: "Contact | GDMSPL",
  description: "Get in touch with GDMSPL offices in Delhi, Mumbai, Nepal, and Muscat.",
};

export default function ContactPage() {
  return (
    <SectionPageShell>
      <Contact />
    </SectionPageShell>
  );
}
