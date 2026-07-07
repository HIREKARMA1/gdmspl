"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export function TextAnimate({
  children,
  className,
  animation = "fadeIn",
  by = "word",
  once = true,
  as: Tag = "p",
}) {
  const ref = useRef(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;

    const text = typeof children === "string" ? children : el.textContent;
    const parts = by === "word" ? text.split(" ") : text.split("");

    el.innerHTML = parts
      .map((part, i) => `<span class="inline-block opacity-0 translate-y-4" style="margin-right:${by === "word" ? "0.25em" : "0"}">${part}${by === "word" && i < parts.length - 1 ? "" : ""}</span>`)
      .join(by === "word" ? " " : "");

    const spans = el.querySelectorAll("span");

    const tween = gsap.to(spans, {
      opacity: 1,
      y: 0,
      duration: animation === "blurInUp" ? 0.6 : 0.5,
      stagger: by === "word" ? 0.05 : 0.03,
      ease: "power2.out",
      scrollTrigger: once
        ? { trigger: el, start: "top 85%", once: true }
        : { trigger: el, start: "top 85%" },
    });

    return () => tween.kill();
  }, [children, animation, by, once]);

  return <Tag ref={ref} className={cn(className)}>{children}</Tag>;
}
