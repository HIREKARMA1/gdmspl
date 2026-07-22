"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import InteractiveHoverButton from "@/components/ui/InteractiveHoverButton";
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

export default function Team() {
  const router = useRouter();
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState(staticTeam.slice(0, 6).map(normalizeMember));
  const [total, setTotal] = useState(staticTeam.length);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchPublicTeamMembers({ featured: true, limit: 8 });
        if (cancelled || !data.items?.length) return;
        setMembers(data.items.map(normalizeMember));
        setTotal(data.total || data.items.length);
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
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const nodes = document.querySelectorAll(".team-member");
    nodes.forEach((member) => observer.observe(member));

    return () => observer.disconnect();
  }, [members]);

  const displayedMembers = members.slice(0, 6);

  return (
    <section id="team" className="team-section">
      <div className="team-container">
        <header className="team-header">
          <h2 className="team-title">
            The Team Behind
            <br />
            <span className="team-title-sub">The Vision</span>
          </h2>
        </header>

        <div className="team-grid">
          {displayedMembers.map((member) => (
            <div key={member.id} className="team-member" onClick={() => setSelectedMember(member)}>
              <div className="member-image-wrapper">
                <div className="member-image-container">
                  <AppImage
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="member-image"
                  />
                </div>
                <div className="member-info-overlay">
                  <span className="member-role">{member.role}</span>
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-bio">{member.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {total > 6 && (
          <div
            className="team-view-more"
            onClick={() => router.push("/team/all")}
            style={{ cursor: "pointer" }}
          >
            <InteractiveHoverButton>VIEW MORE</InteractiveHoverButton>
          </div>
        )}
      </div>

      {selectedMember && (
        <div className="bio-modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="bio-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="bio-modal-close" onClick={() => setSelectedMember(null)}>
              <X size={24} />
            </button>
            <div className="bio-modal-body">
              <div className="bio-modal-image-container relative min-h-[280px] w-full">
                <AppImage
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="bio-modal-image object-cover"
                />
              </div>
              <div className="bio-modal-info">
                <span className="bio-modal-role">{selectedMember.role}</span>
                <h3 className="bio-modal-name">{selectedMember.name}</h3>
                <div className="bio-modal-divider"></div>
                <div className="bio-modal-description">
                  {selectedMember.bio.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
