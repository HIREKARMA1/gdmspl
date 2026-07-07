"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { projectData } from "@/data/projects";
import img1 from "@/assets/project_urban.png";
import img2 from "@/assets/project_desert.png";
import img3 from "@/assets/project_mountain.png";
import img4 from "@/assets/project_modern.png";
import img5 from "@/assets/project1.png";
import img6 from "@/assets/project2.png";
import img7 from "@/assets/project3.png";
import AppImage from "@/components/ui/AppImage";

export default function Services() {
  const router = useRouter();

  const services = useMemo(() => [
    {
      id: "01",
      title: "Architecture",
      category: "Architecture",
      image: projectData.find(p => p.id === 'delhi-haat')?.image || img3,
      description: "Creating innovative and sustainable architectural solutions for diverse built environments."
    },
    {
      id: "02",
      title: "Project Management",
      category: "Project Management",
      image: projectData.find(p => p.category.includes("Project Management"))?.image || img2,
      description: "Ensuring seamless project execution from inception to completion with expert oversight."
    },
    {
      id: "03",
      title: "Urban Design",
      category: "Urban Design",
      image: projectData.find(p => p.category.includes("Urban Design"))?.image || img1,
      description: "Designing large-scale urban and regional developments with long-term vision."
    },
    {
      id: "04",
      title: "Interiors",
      category: "Interiors",
      image: projectData.find(p => p.category.includes("Interiors"))?.image || img4,
      description: "Crafting bespoke interior spaces that balance aesthetics with functional excellence."
    },
    {
      id: "05",
      title: "Landscape",
      category: "Landscape",
      image: projectData.find(p => p.category.includes("Landscape"))?.image || img5,
      description: "Integrating natural elements to create harmonious and engaging outdoor environments."
    },
    {
      id: "06",
      title: "BIM",
      category: "BIM",
      image: projectData.find(p => p.id === "bps-medical")?.image || img1,
      description: "Leveraging Building Information Modeling for precise planning and coordination."
    },
    {
      id: "07",
      title: "Engineering",
      category: "Engineering",
      image: projectData.find(p => p.category.includes("Engineering"))?.image || img7,
      description: "Engineering robust and innovative systems for architectural stability and performance."
    },
    {
      id: "08",
      title: "Conservation and restoration",
      category: "Conservation and restoration",
      image: projectData.find(p => p.category.includes("Conservation and restoration"))?.image || img6,
      description: "Preserving architectural heritage through sensitive and expert restoration techniques."
    },
    {
      id: "09",
      title: "Sustainable Design",
      category: "Sustainable Design",
      image: projectData.find(p => p.category.includes("Sustainable Design"))?.image || img4,
      description: "Integrating eco-friendly practices and materials to minimize environmental impact."
    }
  ], []);

  const [activeService, setActiveService] = useState(() => services[0]);

  const handleServiceClick = (category) => {
    router.push(`/categories?category=${encodeURIComponent(category)}`);
  };

  return (
    <section id="services" className="services-section-creative">
      <div className="blueprint-overlay"></div>
      
      <div className="container-fluid services-container reverse">
        {/* Left Side: Image Preview */}
        <div className="services-preview-side">
          <div className="sticky-preview" onClick={() => handleServiceClick(activeService.category)}>
            <div className="preview-frame">
              <div className="frame-corners top-left"></div>
              <div className="frame-corners top-right"></div>
              <div className="frame-corners bottom-left"></div>
              <div className="frame-corners bottom-right"></div>
              
              <div
                  key={activeService.id}
                  className="preview-image-wrapper"
                >
                  <AppImage src={activeService.image} alt={activeService.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                  <div className="image-overlay-blueprint"></div>
                </div>
            </div>
            
            <div className="active-service-info">
              <div>
                <h4 className="info-title">{activeService.title}</h4>
                <div className="view-more-cta">CLICK TO EXPLORE PORTFOLIO</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Services List */}
        <div className="services-list-side">
          <div className="services-header-text">
            <h2 className="creative-title">Design <br /> <span className="text-outline">Integrity</span></h2>
          </div>

          <div className="services-list-creative">
            {services.map((service) => (
              <div
                key={service.id}
                className={`service-item-creative ${activeService.id === service.id ? 'active' : ''}`}
                onMouseEnter={() => setActiveService(service)}
                onClick={() => handleServiceClick(service.category)}
              >
                <span className="item-number">{service.id}</span>
                <div className="item-content">
                  <h3 className="item-title">{service.title}</h3>
                </div>
                <div className="item-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
