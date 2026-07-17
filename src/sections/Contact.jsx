"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Phone, MapPin, MessageSquare, ArrowRight, Globe } from "lucide-react";
import { DottedMap } from "@/components/magicui/dotted-map";
import {
  CONTACT_LOCATION_EVENT,
  isValidLocation,
  locationDetails,
  mapMarkers,
  OFFICE_LOCATIONS,
} from "@/data/locations";

function ContactContent() {
  const searchParams = useSearchParams();
  const [selectedLocation, setSelectedLocation] = useState("Delhi");
  const [status, setStatus] = useState("idle");
  const formRef = useRef(null);

  const selectLocation = (location) => {
    if (!isValidLocation(location)) return;
    setSelectedLocation(location);
  };

  useEffect(() => {
    const locationFromUrl = searchParams.get("location");
    if (isValidLocation(locationFromUrl)) {
      setSelectedLocation(locationFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleLocationChange = (event) => {
      const location = event.detail;
      if (isValidLocation(location)) {
        setSelectedLocation(location);
      }
    };

    window.addEventListener(CONTACT_LOCATION_EVENT, handleLocationChange);
    return () => window.removeEventListener(CONTACT_LOCATION_EVENT, handleLocationChange);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  const currentDetails = locationDetails[selectedLocation];

  return (
    <section id="contact" className="contact-section">
      <div className="contact-background">
        <div className="abstract-shape shape-1"></div>
        <div className="abstract-shape shape-2"></div>
        <div className="grid-overlay"></div>
      </div>

      <div className="container">
        <div className="contact-grid">
          <div className="contact-info-container">
            <div className="contact-header">
              <h2 className="section-title">
                Let&apos;s Build <span>Something Extraordinary</span>
              </h2>
              <p className="section-subtitle">
                Whether you&apos;re planning a residential masterpiece or a commercial landmark, our team is ready to bring your vision to life.
              </p>
            </div>

            <div className="dotted-map-wrapper">
              <DottedMap
                markers={mapMarkers}
                pulse={true}
                className="magic-dotted-map"
                dotColor="#0a0a0a"
                markerColor="#ff6b35"
                renderMarkerOverlay={({ marker, x, y }) => {
                  const rx = x + (marker.offsetX || 3);
                  const ry = y + (marker.offsetY || -4);
                  const w = marker.w || 14;
                  const isActive = selectedLocation === marker.name;

                  return (
                    <g
                      className="map-marker"
                      style={{ cursor: "pointer" }}
                      onClick={() => selectLocation(marker.name)}
                    >
                      <rect
                        x={rx - 4}
                        y={ry - 6}
                        width={w + 8}
                        height={14}
                        fill="transparent"
                      />
                      <rect
                        x={rx}
                        y={ry}
                        width={w}
                        height="5"
                        rx="2.5"
                        fill={isActive ? "#ff6b35" : "rgba(255, 255, 255, 0.9)"}
                        stroke="#ff6b35"
                        strokeWidth="0.3"
                        opacity="0.95"
                      />
                      <text
                        x={rx + w / 2}
                        y={ry + 2.8}
                        fill={isActive ? "#fff" : "#111"}
                        fontSize="2.5"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontWeight="600"
                        style={{ fontFamily: "Inter, sans-serif", letterSpacing: "0.02em", pointerEvents: "none" }}
                      >
                        {marker.name}
                      </text>
                    </g>
                  );
                }}
              />
            </div>

            <div className="location-chips">
              {OFFICE_LOCATIONS.map((location) => (
                <button
                  key={location}
                  type="button"
                  className={`location-chip ${selectedLocation === location ? "active" : ""}`}
                  onClick={() => selectLocation(location)}
                >
                  {location}
                </button>
              ))}
            </div>

            <div className="contact-details">
              <a
                href={currentDetails.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-item detail-item-link"
                aria-label={`Open ${selectedLocation} office location in Google Maps`}
              >
                <div className="icon-box"><MapPin size={20} /></div>
                <div>
                  <h3>{selectedLocation} Office</h3>
                  <p>{currentDetails.office}</p>
                </div>
              </a>
              <a
                href={currentDetails.telUrl}
                className="detail-item detail-item-link"
                aria-label={`Call us at ${currentDetails.phone}`}
              >
                <div className="icon-box"><Phone size={20} /></div>
                <div>
                  <h3>Call Us</h3>
                  <p>{currentDetails.phone}</p>
                </div>
              </a>
              <a
                href={currentDetails.mailtoUrl}
                className="detail-item detail-item-link"
                aria-label={`Email us at ${currentDetails.email}`}
              >
                <div className="icon-box"><Mail size={20} /></div>
                <div>
                  <h3>Email Us</h3>
                  <p>{currentDetails.email}</p>
                </div>
              </a>
              <a
                href={currentDetails.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-item detail-item-link"
                aria-label={`Visit our website at ${currentDetails.website}`}
              >
                <div className="icon-box"><Globe size={20} /></div>
                <div>
                  <h3>Website</h3>
                  <p>{currentDetails.website}</p>
                </div>
              </a>
            </div>
          </div>

          <div className="contact-form-container glass" ref={formRef}>
            <div className="form-header">
              <MessageSquare className="header-icon" />
              <h3>Send a Message</h3>
              <p>We&apos;ll get back to you within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="premium-form">
              <div className="form-group">
                <div className="input-wrapper">
                  <input type="text" id="name" placeholder=" " required />
                  <label htmlFor="name">Full Name</label>
                  <div className="input-focus-bg"></div>
                </div>
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <input type="email" id="email" placeholder=" " required />
                  <label htmlFor="email">Email Address</label>
                  <div className="input-focus-bg"></div>
                </div>
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <select id="interest" required defaultValue="">
                    <option value="" disabled hidden></option>
                    <option value="residential">Residential Architecture</option>
                    <option value="commercial">Commercial Projects</option>
                    <option value="interior">Interior Design</option>
                    <option value="consultation">Strategic Consultation</option>
                  </select>
                  <label htmlFor="interest">Interested in...</label>
                  <div className="input-focus-bg"></div>
                </div>
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <textarea id="message" rows="5" placeholder=" " required></textarea>
                  <label htmlFor="message">Your Message</label>
                  <div className="input-focus-bg"></div>
                </div>
              </div>

              <button
                type="submit"
                className={`submit-btn ${status}`}
                disabled={status === "submitting"}
              >
                <span className="btn-text">
                  {status === "idle" && "Send Message"}
                  {status === "submitting" && "Sending..."}
                  {status === "success" && "Message Sent!"}
                </span>
                <ArrowRight className="btn-icon" />
                <div className="btn-progress"></div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Contact() {
  return (
    <Suspense fallback={<section id="contact" className="contact-section min-h-[50vh]" />}>
      <ContactContent />
    </Suspense>
  );
}
