"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { teamMembers } from "@/data/team";
import AppImage from "@/components/ui/AppImage";

export default function TeamPage() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".team-page-row").forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="team-page-container">
      <button className="back-to-home-btn" onClick={() => router.push("/team")}>
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </button>

      <div className="team-page-header">
        <h1>Meet our core team</h1>
        <p>The visionaries behind our architectural excellence.</p>
      </div>

      <div className="team-page-list">
        {teamMembers.map((member) => (
          <div key={member.id} className="team-page-row">
            <div className="team-page-row-meta">
              <h3 className="team-page-row-name">{member.name}</h3>
              <span className="team-page-row-role">{member.role}</span>
            </div>
            <div className="team-page-row-image-container relative overflow-hidden">
              <AppImage
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="team-page-row-image object-cover"
              />
            </div>
            <div className="team-page-row-bio">
              {member.bio.split("\n\n").map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
