"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Wrapper around next/image that accepts static imports (StaticImageData) or URL strings.
 */
export default function AppImage({
  src,
  alt,
  className,
  fill = false,
  width,
  height,
  priority = false,
  sizes,
  ...props
}) {
  if (!src) return null;

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "100vw"}
        className={cn("object-cover", className)}
        {...props}
      />
    );
  }

  if (typeof src !== "string" && src.width && src.height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width ?? src.width}
        height={height ?? src.height}
        priority={priority}
        className={className}
        {...props}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1200}
      height={height ?? 800}
      priority={priority}
      className={className}
      {...props}
    />
  );
}
