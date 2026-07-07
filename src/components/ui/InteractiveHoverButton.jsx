"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InteractiveHoverButton({ children, className = "", ...props }) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-12 min-w-[200px] items-center justify-center overflow-hidden rounded-full border border-charcoal bg-transparent px-8 text-xs font-bold uppercase tracking-widest text-charcoal transition-colors duration-300",
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 translate-y-full bg-charcoal transition-transform duration-300 group-hover:translate-y-0" />
      <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
        {children}
        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </button>
  );
}
