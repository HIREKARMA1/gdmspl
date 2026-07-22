import api from "@/lib/api";

export const APPLICATION_STATUSES = ["new", "reviewed", "shortlisted", "rejected"];

export async function fetchAdminApplications(params = {}) {
  const query = { page: 1, page_size: 50, ...params };
  // Drop empty filters
  Object.keys(query).forEach((key) => {
    if (query[key] === "" || query[key] == null) delete query[key];
  });

  const { data } = await api.get("/admin/job-applications", { params: query });
  return {
    items: data.items || [],
    total: data.total ?? data.items?.length ?? 0,
    page: data.page ?? 1,
    page_size: data.page_size ?? 20,
  };
}

export async function fetchAdminApplication(id) {
  const { data } = await api.get(`/admin/job-applications/${id}`);
  return data;
}

export async function updateApplicationStatus(id, status) {
  const { data } = await api.patch(`/admin/job-applications/${id}`, { status });
  return data;
}
