import api from "@/lib/api";

export async function fetchCareerCategories() {
  const { data } = await api.get("/admin/career-categories");
  return Array.isArray(data) ? data : data.items || [];
}

export async function fetchPublicCareerCategories() {
  const { data } = await api.get("/career-categories");
  return Array.isArray(data) ? data : data.items || [];
}

export async function fetchAdminJobOpenings(params = {}) {
  const { data } = await api.get("/admin/job-openings", {
    params: { page: 1, page_size: 50, ...params },
  });
  return {
    items: data.items || [],
    total: data.total ?? data.items?.length ?? 0,
    page: data.page ?? 1,
    page_size: data.page_size ?? 20,
  };
}

export async function fetchPublicJobOpenings(params = {}) {
  const { data } = await api.get("/job-openings", {
    params: { page: 1, page_size: 50, ...params },
  });
  return {
    items: data.items || [],
    total: data.total ?? data.items?.length ?? 0,
  };
}

export async function fetchAdminJobOpening(id) {
  const { data } = await api.get(`/admin/job-openings/${id}`);
  return data;
}

export async function createJobOpening(payload) {
  const { data } = await api.post("/admin/job-openings", payload);
  return data;
}

export async function updateJobOpening(id, payload) {
  const { data } = await api.patch(`/admin/job-openings/${id}`, payload);
  return data;
}

export async function deleteJobOpening(id) {
  const { data } = await api.delete(`/admin/job-openings/${id}`);
  return data;
}

export async function submitJobApplication(formData) {
  const { data } = await api.post("/job-applications", formData);
  return data;
}

/** Map API job → admin form state */
export function jobToFormState(job) {
  return {
    title: job.title || "",
    category_id: job.category?.id || "",
    location: job.location || "",
    employment_type: job.employment_type || "Full-time",
    experience: job.experience || "",
    intro: job.description?.intro || "",
    responsibilities: job.description?.responsibilities?.length
      ? [...job.description.responsibilities]
      : [""],
    requirements: job.description?.requirements?.length
      ? [...job.description.requirements]
      : [""],
    is_published: job.is_published ?? true,
  };
}

export function emptyJobForm() {
  return {
    title: "",
    category_id: "",
    location: "",
    employment_type: "Full-time",
    experience: "",
    intro: "",
    responsibilities: [""],
    requirements: [""],
    is_published: true,
  };
}

/** Form state → create/update payload (filters empty list lines) */
export function formStateToPayload(form) {
  return {
    title: form.title.trim(),
    category_id: form.category_id,
    location: form.location.trim(),
    employment_type: form.employment_type.trim(),
    experience: form.experience.trim(),
    intro: form.intro.trim(),
    responsibilities: form.responsibilities.map((s) => s.trim()).filter(Boolean),
    requirements: form.requirements.map((s) => s.trim()).filter(Boolean),
    is_published: Boolean(form.is_published),
  };
}
