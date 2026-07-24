import api from "@/lib/api";
import { slugify } from "@/services/projectCategories";
import {
  FALLBACK_OFFICE_LOCATIONS,
  locationDetails as staticDetails,
  mapMarkers as staticMarkers,
} from "@/data/locations";

export async function fetchAdminOfficeLocations(params = {}) {
  const { data } = await api.get("/admin/office-locations", {
    params: { page: 1, page_size: 50, ...params },
  });
  return {
    items: data.items || (Array.isArray(data) ? data : []),
    total: data.total ?? data.items?.length ?? (Array.isArray(data) ? data.length : 0),
  };
}

export async function fetchAdminOfficeLocation(id) {
  const { data } = await api.get(`/admin/office-locations/${id}`);
  return data;
}

export async function createOfficeLocation(payload) {
  const { data } = await api.post("/admin/office-locations", payload);
  return data;
}

export async function updateOfficeLocation(id, payload) {
  const { data } = await api.patch(`/admin/office-locations/${id}`, payload);
  return data;
}

export async function deleteOfficeLocation(id) {
  const { data } = await api.delete(`/admin/office-locations/${id}`);
  return data;
}

export async function reorderOfficeLocations(items) {
  const { data } = await api.patch("/admin/office-locations/reorder", { items });
  return data;
}

export async function fetchPublicOfficeLocations(params = {}) {
  const { data } = await api.get("/office-locations", {
    params: { page: 1, page_size: 50, ...params },
  });
  return {
    items: data.items || (Array.isArray(data) ? data : []),
    total: data.total ?? data.items?.length ?? (Array.isArray(data) ? data.length : 0),
  };
}

export function emptyLocationForm() {
  return {
    name: "",
    slug: "",
    office: "",
    phone: "",
    email: "",
    website: "www.gdmspl.com",
    map_url: "",
    lat: "",
    lng: "",
    map_offset_x: 0,
    map_offset_y: 0,
    map_label_width: 14,
    display_order: 0,
    is_published: true,
  };
}

export function locationToFormState(loc) {
  return {
    name: loc.name || "",
    slug: loc.slug || "",
    office: loc.office || loc.address || "",
    phone: loc.phone || "",
    email: loc.email || "",
    website: loc.website || "www.gdmspl.com",
    map_url: loc.map_url || loc.mapUrl || "",
    lat: loc.lat ?? "",
    lng: loc.lng ?? "",
    map_offset_x: loc.map_offset_x ?? loc.offsetX ?? 0,
    map_offset_y: loc.map_offset_y ?? loc.offsetY ?? 0,
    map_label_width: loc.map_label_width ?? loc.w ?? 14,
    display_order: loc.display_order ?? 0,
    is_published: loc.is_published ?? true,
  };
}

export function formStateToPayload(form) {
  return {
    name: form.name.trim(),
    slug: (form.slug || slugify(form.name)).trim(),
    office: form.office.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    website: form.website.trim() || "www.gdmspl.com",
    map_url: form.map_url.trim(),
    lat: form.lat === "" || form.lat == null ? null : Number(form.lat),
    lng: form.lng === "" || form.lng == null ? null : Number(form.lng),
    map_offset_x: Number(form.map_offset_x) || 0,
    map_offset_y: Number(form.map_offset_y) || 0,
    map_label_width: Number(form.map_label_width) || 14,
    display_order: Number(form.display_order) || 0,
    is_published: Boolean(form.is_published),
  };
}

/** Normalize API or static location into UI shape. */
export function normalizeOfficeLocation(loc) {
  const name = loc.name || "";
  const staticDetail = staticDetails[name] || {};
  const staticMarker = staticMarkers.find((m) => m.name === name) || {};

  return {
    id: loc.id || name,
    name,
    slug: loc.slug || "",
    office: loc.office || loc.address || staticDetail.office || "",
    phone: loc.phone || staticDetail.phone || "",
    email: loc.email || staticDetail.email || "",
    website: loc.website || staticDetail.website || "www.gdmspl.com",
    mapUrl: loc.map_url || loc.mapUrl || staticDetail.mapUrl || "",
    lat: loc.lat ?? staticMarker.lat ?? null,
    lng: loc.lng ?? staticMarker.lng ?? null,
    offsetX: loc.map_offset_x ?? loc.offsetX ?? staticMarker.offsetX ?? 0,
    offsetY: loc.map_offset_y ?? loc.offsetY ?? staticMarker.offsetY ?? 0,
    w: loc.map_label_width ?? loc.w ?? staticMarker.w ?? 14,
    display_order: loc.display_order ?? 0,
    is_published: loc.is_published ?? true,
  };
}

export function sortLocationsByOrder(locations) {
  return [...locations].sort((a, b) => {
    const d = (a.display_order ?? 0) - (b.display_order ?? 0);
    if (d !== 0) return d;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
}

/** Static fallback list shaped like API-normalized locations. */
export function getFallbackOfficeLocations() {
  return sortLocationsByOrder(
    FALLBACK_OFFICE_LOCATIONS.map((name, index) =>
      normalizeOfficeLocation({
        name,
        display_order: index,
        ...staticDetails[name],
        ...staticMarkers.find((m) => m.name === name),
      })
    )
  );
}

export function toMapMarkers(locations) {
  return locations
    .filter((l) => l.lat != null && l.lng != null)
    .map((l) => ({
      lat: Number(l.lat),
      lng: Number(l.lng),
      size: 0.3,
      pulse: true,
      name: l.name,
      offsetX: l.offsetX ?? 0,
      offsetY: l.offsetY ?? 0,
      w: l.w ?? 14,
    }));
}
