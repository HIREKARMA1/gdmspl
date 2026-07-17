import Link from "next/link";
import SocialLinks from "@/components/ui/SocialLinks";
import { FOOTER_QUICK_LINKS } from "@/config/navigation";

export default function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] bg-black px-0 py-16 pb-8 font-sans text-[#a1a1aa]">
      <div className="container-app">
        <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <h3 className="mb-4 text-2xl font-bold text-white">GDMSPL</h3>
            <p className="mb-6 leading-relaxed">
              Pioneering innovative architectural solutions and crafting sustainable
              spaces that inspire and elevate human experiences.
            </p>
            <div className="space-y-2 text-sm">
              <p>Email: mail@gdmspl.com</p>
              <p>Phone: +91 11 41025657</p>
              <p>Presence: Delhi, Mumbai, Nepal, Muscat</p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-sm">
              {FOOTER_QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Legal</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Follow Us</h4>
            <SocialLinks
              className="flex gap-3"
              linkClassName="flex h-10 w-10 items-center justify-center rounded-full border border-[#333] bg-[#1a1a1a] text-white transition-all duration-normal hover:-translate-y-1 hover:bg-white hover:text-black"
            />
          </div>
        </div>

        <div className="border-t border-[#1a1a1a] pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} GDMSPL. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
