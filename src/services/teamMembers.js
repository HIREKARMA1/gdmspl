import api from "@/lib/api";
import { slugify } from "@/services/projectCategories";

export async function fetchAdminTeamMembers(params = {}) {
  const { data } = await api.get("/admin/team-members", {
    params: { page: 1, page_size: 50, ...params },
  });
  return {
    items: data.items || [],
    total: data.total ?? data.items?.length ?? 0,
  };
}

export async function fetchAdminTeamMember(id) {
  const { data } = await api.get(`/admin/team-members/${id}`);
  return data;
}

export async function createTeamMember(payload) {
  const { data } = await api.post("/admin/team-members", payload);
  return data;
}

export async function updateTeamMember(id, payload) {
  const { data } = await api.patch(`/admin/team-members/${id}`, payload);
  return data;
}

export async function deleteTeamMember(id) {
  const { data } = await api.delete(`/admin/team-members/${id}`);
  return data;
}

export async function reorderTeamMembers(items) {
  const { data } = await api.patch("/admin/team-members/reorder", { items });
  return data;
}

export async function fetchPublicTeamMembers(params = {}) {
  const { data } = await api.get("/team-members", {
    params: { page: 1, page_size: 100, ...params },
  });
  return {
    items: data.items || [],
    total: data.total ?? data.items?.length ?? 0,
  };
}

export function normalizeTeamMember(member) {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    bio: member.bio || "",
    image: member.image_url || member.image,
    display_order: member.display_order ?? 0,
    is_featured: member.is_featured ?? false,
  };
}

/** Stable sort by admin display_order (ascending). */
export function sortTeamMembersByOrder(members) {
  return [...members].sort((a, b) => {
    const orderDiff = (a.display_order ?? 0) - (b.display_order ?? 0);
    if (orderDiff !== 0) return orderDiff;
    return String(a.name || "").localeCompare(String(b.name || ""));
  });
}

export function emptyTeamForm() {
  return {
    name: "",
    role: "",
    bio: "",
    image_url: "",
    display_order: 0,
    is_featured: true,
    is_published: true,
    slug: "",
  };
}

export function memberToFormState(member) {
  return {
    name: member.name || "",
    role: member.role || "",
    bio: member.bio || "",
    image_url: member.image_url || "",
    display_order: member.display_order ?? 0,
    is_featured: member.is_featured ?? false,
    is_published: member.is_published ?? true,
    slug: member.slug || "",
  };
}

export function formStateToPayload(form) {
  const slug = (form.slug || slugify(form.name)).trim() || null;
  return {
    name: form.name.trim(),
    role: form.role.trim(),
    bio: form.bio.trim(),
    image_url: form.image_url.trim(),
    display_order: Number(form.display_order) || 0,
    is_featured: Boolean(form.is_featured),
    is_published: Boolean(form.is_published),
    slug,
  };
}
