"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import logo from "@/assets/GDMS_logo.png";
import AppImage from "@/components/ui/AppImage";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (isHomepage) {
        setIsScrolled(window.scrollY > window.innerHeight * 2.0);
      } else {
        setIsScrolled(window.scrollY > 20);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomepage]);

  const handleNavClick = (id) => {
    setIsMenuOpen(false);
    if (pathname === "/") {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isHomepage && !isScrolled) return null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[1000] flex h-[88px] items-center transition-all duration-normal ${
        isScrolled ? "glass h-[72px]" : ""
      }`}
    >
      <div className="flex h-full w-full items-center justify-between px-[52px] max-md:px-4">
        <Link href="/" className="flex h-full shrink-0 cursor-pointer items-center">
          <AppImage
            src={logo}
            alt="GDMS Logo"
            width={70}
            height={48}
            priority
            className="h-12 w-[70px] object-contain transition-all duration-normal"
          />
        </Link>

        <nav
          className={`flex items-center gap-8 text-xs font-semibold tracking-wide transition-all duration-normal max-md:fixed max-md:inset-x-0 max-md:top-[88px] max-md:flex-col max-md:border-b max-md:border-border max-md:bg-canvas max-md:p-8 max-md:shadow-lg ${
            isMenuOpen
              ? "max-md:translate-y-0 max-md:opacity-100 max-md:visible"
              : "max-md:-translate-y-[150%] max-md:opacity-0 max-md:invisible"
          } ${isScrolled ? "opacity-100 visible" : "opacity-0 invisible"} ${
            isScrolled ? "max-md:top-[72px]" : ""
          }`}
        >
          {[
            { href: "/#projects", id: "projects", label: "PROJECTS" },
            { href: "/#about", id: "about", label: "ABOUT US" },
            { href: "/#services", id: "services", label: "SERVICES" },
            { href: "/#team", id: "team", label: "TEAM" },
          ].map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => handleNavClick(item.id)}
              className="text-charcoal transition-all duration-fast hover:-translate-y-px hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/careers" onClick={() => setIsMenuOpen(false)} className="text-charcoal hover:text-accent">
            CAREER
          </Link>
          <Link
            href="/#contact"
            onClick={() => handleNavClick("contact")}
            className="text-charcoal hover:text-accent"
          >
            CONTACT US
          </Link>
        </nav>

        <button
          className={`text-charcoal max-md:block md:hidden transition-all duration-normal ${
            isScrolled ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
