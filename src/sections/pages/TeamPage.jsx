"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { teamMembers as staticTeam } from "@/data/team";
import { fetchPublicTeamMembers } from "@/services/teamMembers";
import AppImage from "@/components/ui/AppImage";

function normalizeMember(member) {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    bio: member.bio || "",
    image: member.image_url || member.image,
  };
}

export default function TeamPage() {
  const router = useRouter();
  const [members, setMembers] = useState(staticTeam.map(normalizeMember));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchPublicTeamMembers({ page: 1, page_size: 50 });
        if (cancelled || !data.items?.length) return;
        setMembers(data.items.map(normalizeMember));
      } catch {
        // keep static fallback
      }
    }
    load();
    return () => {
      cancelled = true;
    };
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
  }, [members]);

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
        {members.map((member) => (
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
