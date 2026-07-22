import api from "@/lib/api";

export async function fetchAdminProjectCategories() {
  const { data } = await api.get("/admin/project-categories");
  return Array.isArray(data) ? data : data.items || [];
}

export async function createProjectCategory(payload) {
  const { data } = await api.post("/admin/project-categories", payload);
  return data;
}

export async function updateProjectCategory(id, payload) {
  const { data } = await api.patch(`/admin/project-categories/${id}`, payload);
  return data;
}

export async function deleteProjectCategory(id) {
  const { data } = await api.delete(`/admin/project-categories/${id}`);
  return data;
}

export function emptyCategoryForm() {
  return {
    name: "",
    slug: "",
    display_order: 0,
  };
}

/** slugify name → "Interior Design" → "interior-design" */
export function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formStateToPayload(form) {
  return {
    name: form.name.trim(),
    slug: (form.slug || slugify(form.name)).trim(),
    display_order: Number(form.display_order) || 0,
  };
}
