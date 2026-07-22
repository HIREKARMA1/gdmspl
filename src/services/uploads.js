import api from "@/lib/api";

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file) {
  if (!file) return "Please select a file.";
  if (!IMAGE_TYPES.includes(file.type) && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
    return "Only JPG, PNG, or WEBP images are allowed.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Image must be 5MB or smaller.";
  }
  return "";
}

async function uploadFile(endpoint, file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(endpoint, formData);
  return data;
}

export async function uploadTeamImage(file) {
  return uploadFile("/admin/uploads/team-image", file);
}

export async function uploadProjectImage(file) {
  return uploadFile("/admin/uploads/project-image", file);
}
