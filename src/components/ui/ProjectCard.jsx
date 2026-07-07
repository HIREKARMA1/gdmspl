"use client";

import { useRouter } from "next/navigation";
import AppImage from "@/components/ui/AppImage";

export default function ProjectCard({ title, category, image, onClick, projectId }) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (projectId) {
      router.push(`/project/${projectId}`);
      return;
    }
    router.push("/categories");
  };

  return (
    <div
      onClick={handleClick}
      className="group relative h-full w-full cursor-pointer overflow-hidden rounded-xl transition-transform duration-300 hover:scale-[0.98]"
    >
      <div className="relative h-full w-full overflow-hidden">
        <AppImage
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[rgba(10,10,12,0.95)] via-[rgba(10,10,12,0.45)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="w-full p-6">
            {category && (
              <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[2px] text-accent">
                {category}
              </span>
            )}
            <h3 className="mb-3 line-clamp-2 text-xl font-bold text-white">{title}</h3>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-white/90">
              View Project
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
