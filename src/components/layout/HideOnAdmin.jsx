"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the public Header/Footer chrome when inside /admin routes.
 * Must stay a client component for pathname detection.
 */
export default function HideOnAdmin({ children }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return children;
}
