export function getApiErrorMessage(error, fallback = "Something went wrong") {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg || d.message || String(d)).join(", ");
  }
  return error?.response?.data?.message || error?.message || fallback;
}
