export const FALLBACK_OFFICE_LOCATIONS = ["Delhi", "Mumbai", "Nepal", "Muscat"];

/** @deprecated Prefer FALLBACK_OFFICE_LOCATIONS — kept for older imports */
export const OFFICE_LOCATIONS = FALLBACK_OFFICE_LOCATIONS;

export const locationDetails = {
  Delhi: {
    office: "A-58/8, top floor, Vishwakarma colony, MB road ,110044-New Delhi, India",
    phone: "+91 11 41025657",
    email: "mail@gdmspl.com",
    website: "www.gdmspl.com",
    mapUrl: "https://maps.app.goo.gl/sWBwb29jXNMJvqbGA",
  },
  Mumbai: {
    office: "A-124, Silver Spring, Plot No. G-6, In Front of Dena Bank, MIDC Area, Taloja, Navi Mumbai 410208, Maharashtra, India",
    phone: "+91 11 41025657",
    email: "mail@gdmspl.com",
    website: "www.gdmspl.com",
    mapUrl: "https://maps.app.goo.gl/WyetYfETPTBWuRi78",
  },
  Nepal: {
    office: "Ground Floor, End House, Kamal Marg, Near Islington College, Kamal Pokhari, Kathmandu 44600, Nepal",
    phone: "9801555544/88",
    email: "mail@gdmspl.com",
    website: "www.gdmspl.com",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Ground+Floor,+End+House,+Kamal+Marg,+Kathmandu+44600,+Nepal",
  },
  Muscat: {
    office: "Oman Business Park, Muscat, Sultanate of Oman",
    phone: "+968 24 123456",
    email: "muscat@gdmspl.com",
    website: "www.gdmspl.com",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Oman+Business+Park,+Muscat,+Oman",
  },
};

export const mapMarkers = [
  { lat: 28.6139, lng: 77.2090, size: 0.3, pulse: true, name: "Delhi", offsetX: -20, offsetY: -8, w: 14 },
  { lat: 19.0760, lng: 72.8777, size: 0.3, pulse: true, name: "Mumbai", offsetX: -7, offsetY: 8, w: 14 },
  { lat: 27.7172, lng: 85.3240, size: 0.3, pulse: true, name: "Nepal", offsetX: 4, offsetY: -8, w: 14 },
  { lat: 23.5859, lng: 58.4059, size: 0.3, pulse: true, name: "Muscat", offsetX: -20, offsetY: -2, w: 14 },
];

export const CONTACT_LOCATION_EVENT = "contact-location-change";

export function isValidLocationName(location, allowedNames) {
  if (!location) return false;
  if (Array.isArray(allowedNames) && allowedNames.length) {
    return allowedNames.includes(location);
  }
  return FALLBACK_OFFICE_LOCATIONS.includes(location);
}

/** @deprecated Use isValidLocationName with live location list when available */
export function isValidLocation(location) {
  return isValidLocationName(location);
}

export function navigateToContactLocation(location) {
  if (!location) return;
  window.location.href = `/contact?location=${encodeURIComponent(location)}`;
}

export function getPhoneHref(phone) {
  const primary = String(phone || "").split(/[/,]/)[0].trim();
  return `tel:${primary.replace(/[^\d+]/g, "")}`;
}

export function getEmailHref(email) {
  return `mailto:${email}`;
}

export function getWebsiteHref(website) {
  if (!website) return "https://www.gdmspl.com";
  return website.startsWith("http") ? website : `https://${website}`;
}
