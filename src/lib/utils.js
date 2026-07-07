import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Resolve Next.js static image imports ({ src }) or plain URL strings for <img>. */
export function getImageSrc(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.src ?? image.default?.src ?? "";
}
