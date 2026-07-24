import api from "@/lib/api";
import { slugify } from "@/services/projectCategories";

export async function fetchAdminProjects(params = {}) {
  const { data } = await api.get("/admin/projects", {
    params: { page: 1, page_size: 50, ...params },
  });
  return {
    items: data.items || [],
    total: data.total ?? data.items?.length ?? 0,
  };
}

export async function fetchAdminProject(id) {
  const { data } = await api.get(`/admin/projects/${id}`);
  return data;
}

export async function createProject(payload) {
  const { data } = await api.post("/admin/projects", payload);
  return data;
}

export async function updateProject(id, payload) {
  const { data } = await api.patch(`/admin/projects/${id}`, payload);
  return data;
}

export async function deleteProject(id) {
  const { data } = await api.delete(`/admin/projects/${id}`);
  return data;
}

export async function addProjectGalleryImage(projectId, payload) {
  const { data } = await api.post(`/admin/projects/${projectId}/gallery`, payload);
  return data;
}

export async function deleteProjectGalleryImage(projectId, imageId) {
  const { data } = await api.delete(`/admin/projects/${projectId}/gallery/${imageId}`);
  return data;
}

export async function reorderProjectGallery(projectId, items) {
  const { data } = await api.patch(`/admin/projects/${projectId}/gallery/reorder`, { items });
  return data;
}

export async function fetchPublicProjects(params = {}) {
  const { data } = await api.get("/projects", {
    params: { page: 1, page_size: 50, ...params },
  });
  return {
    items: data.items || [],
    total: data.total ?? data.items?.length ?? 0,
  };
}

export async function fetchPublicProject(slug) {
  const { data } = await api.get(`/projects/${encodeURIComponent(slug)}`);
  return data;
}

/** Map API project → public UI shape. */
export function normalizePublicProject(project) {
  const galleryUrls = (project.gallery || [])
    .slice()
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((g) => (typeof g === "string" ? g : g.image_url))
    .filter(Boolean);

  const cover = project.cover_image_url || project.image || galleryUrls[0] || "";

  const categories = (project.categories || project.category || [])
    .map((c) => (typeof c === "string" ? c : c?.name))
    .filter(Boolean);

  const badge_tags = (project.scope || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    id: project.slug || String(project.id),
    title: project.title || "",
    category: categories,
    badge_tags: badge_tags.length ? badge_tags : categories.slice(0, 1),
    description: project.short_description || project.description || "",
    image: cover,
    client: project.client || "",
    area: project.area || "",
    cost: project.cost || "",
    status: project.status || "",
    location: project.location || "",
    scope: project.scope || "",
    details: project.full_brief || project.details || "",
    gallery: galleryUrls.length ? galleryUrls : cover ? [cover] : [],
    source: "api",
  };
}

export function emptyProjectForm() {
  return {
    title: "",
    slug: "",
    short_description: "",
    full_brief: "",
    cover_image_url: "",
    client: "",
    area: "",
    cost: "",
    status: "",
    location: "",
    scope: "",
    is_published: true,
    display_order: 0,
    category_ids: [],
    gallery: [], // { id?, image_url, display_order } — id only after save
  };
}

export function projectToFormState(project) {
  return {
    title: project.title || "",
    slug: project.slug || "",
    short_description: project.short_description || "",
    full_brief: project.full_brief || "",
    cover_image_url: project.cover_image_url || "",
    client: project.client || "",
    area: project.area || "",
    cost: project.cost || "",
    status: project.status || "",
    location: project.location || "",
    scope: project.scope || "",
    is_published: project.is_published ?? true,
    display_order: project.display_order ?? 0,
    category_ids: project.category_ids || [],
    gallery: (project.gallery || []).map((g, i) => ({
      id: g.id,
      image_url: g.image_url,
      display_order: g.display_order ?? i,
    })),
  };
}

export function formStateToCreatePayload(form) {
  return {
    slug: (form.slug || slugify(form.title)).trim(),
    title: form.title.trim(),
    short_description: form.short_description.trim(),
    full_brief: form.full_brief.trim(),
    cover_image_url: form.cover_image_url.trim(),
    client: form.client.trim(),
    area: form.area.trim(),
    cost: form.cost.trim(),
    status: form.status.trim(),
    location: form.location.trim(),
    scope: form.scope.trim(),
    is_published: Boolean(form.is_published),
    display_order: Number(form.display_order) || 0,
    category_ids: form.category_ids,
    gallery: (form.gallery || [])
      .filter((g) => g.image_url)
      .map((g, i) => ({
        image_url: g.image_url,
        display_order: g.display_order ?? i,
      })),
  };
}

export function formStateToUpdatePayload(form) {
  const { gallery, ...rest } = formStateToCreatePayload(form);
  void gallery;
  return rest;
}
