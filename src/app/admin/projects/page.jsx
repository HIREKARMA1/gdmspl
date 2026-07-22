"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  AdminTable,
  ErrorState,
  LoadingState,
  PageToolbar,
  StatusBadge,
} from "@/components/admin/AdminUI";
import {
  AdminModal,
  FormCheckbox,
  FormField,
  FormInput,
  FormTextarea,
  ImageUploadField,
} from "@/components/admin/FormControls";
import { getApiErrorMessage } from "@/lib/apiErrors";
import {
  fetchAdminProjectCategories,
  slugify,
} from "@/services/projectCategories";
import {
  addProjectGalleryImage,
  createProject,
  deleteProject,
  deleteProjectGalleryImage,
  emptyProjectForm,
  fetchAdminProject,
  fetchAdminProjects,
  formStateToCreatePayload,
  formStateToUpdatePayload,
  projectToFormState,
  updateProject,
} from "@/services/projects";
import { uploadProjectImage, validateImageFile } from "@/services/uploads";

export default function AdminProjectsPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProjectForm());
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [formError, setFormError] = useState("");

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminProjects();
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load projects."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const cats = await fetchAdminProjectCategories();
        if (!cancelled) setCategories(cats);
      } catch {
        // categories optional for list; required for create
      }
      if (!cancelled) await loadProjects();
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [loadProjects]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyProjectForm());
    setSlugManual(false);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = async (row) => {
    setFormError("");
    setSaving(true);
    try {
      const detail = await fetchAdminProject(row.id);
      setEditingId(detail.id);
      setForm(projectToFormState(detail));
      setSlugManual(Boolean(detail.slug));
      setModalOpen(true);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load project."));
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    if (saving || uploading || galleryUploading) return;
    setModalOpen(false);
    setEditingId(null);
    setFormError("");
  };

  const setField = (key, value) => {
    setForm((prev) => {
      if (key === "title" && !slugManual) {
        return { ...prev, title: value, slug: slugify(value) };
      }
      return { ...prev, [key]: value };
    });
  };

  const toggleCategory = (id) => {
    setForm((prev) => {
      const has = prev.category_ids.includes(id);
      return {
        ...prev,
        category_ids: has
          ? prev.category_ids.filter((c) => c !== id)
          : [...prev.category_ids, id],
      };
    });
  };

  const handleCoverUpload = async (file) => {
    const validation = validateImageFile(file);
    if (validation) {
      setFormError(validation);
      return;
    }
    setUploading(true);
    setFormError("");
    try {
      const uploaded = await uploadProjectImage(file);
      setField("cover_image_url", uploaded.url);
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Cover upload failed."));
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryFilesSelected = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    setGalleryUploading(true);
    setFormError("");

    let nextOrder = form.gallery.length;
    const appended = [];

    try {
      for (const file of files) {
        const validation = validateImageFile(file);
        if (validation) {
          setFormError(validation);
          break;
        }

        const uploaded = await uploadProjectImage(file);
        const display_order = nextOrder++;

        if (editingId) {
          const added = await addProjectGalleryImage(editingId, {
            image_url: uploaded.url,
            display_order,
          });
          appended.push({
            id: added.id,
            image_url: added.image_url,
            display_order: added.display_order ?? display_order,
          });
        } else {
          appended.push({ image_url: uploaded.url, display_order });
        }
      }

      if (appended.length) {
        setForm((prev) => ({
          ...prev,
          gallery: [...prev.gallery, ...appended],
        }));
      }
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Gallery upload failed."));
    } finally {
      setGalleryUploading(false);
    }
  };

  const removeGalleryImage = async (index) => {
    const image = form.gallery[index];
    if (!image) return;

    if (editingId && image.id) {
      try {
        await deleteProjectGalleryImage(editingId, image.id);
      } catch (err) {
        setFormError(getApiErrorMessage(err, "Failed to remove gallery image."));
        return;
      }
    }

    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.category_ids.length) {
      setFormError("Select at least one project category.");
      return;
    }

    const createPayload = formStateToCreatePayload(form);
    const required = [
      "title",
      "slug",
      "short_description",
      "full_brief",
      "cover_image_url",
      "client",
      "area",
      "cost",
      "status",
      "location",
      "scope",
    ];
    if (required.some((k) => !createPayload[k])) {
      setFormError("Please fill all required fields and upload a cover image.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateProject(editingId, formStateToUpdatePayload(form));
      } else {
        await createProject(createPayload);
      }
      setModalOpen(false);
      await loadProjects();
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Failed to save project."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete project “${row.title}”?`)) return;
    try {
      await deleteProject(row.id);
      await loadProjects();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete project."));
    }
  };

  const columns = [
    {
      key: "cover",
      label: "Cover",
      render: (row) =>
        row.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.cover_image_url}
            alt={row.title}
            className="h-12 w-16 rounded-md object-cover"
          />
        ) : (
          "—"
        ),
    },
    {
      key: "title",
      label: "Title",
      render: (row) => (
        <div>
          <p className="font-medium text-white">{row.title}</p>
          <p className="text-xs text-white/40">{row.slug}</p>
        </div>
      ),
    },
    { key: "client", label: "Client" },
    { key: "location", label: "Location" },
    { key: "status", label: "Project Status" },
    {
      key: "categories",
      label: "Categories",
      render: (row) => (row.categories || []).join(", ") || "—",
    },
    {
      key: "is_published",
      label: "Publish",
      render: (row) => (
        <StatusBadge active={row.is_published} label={row.is_published ? "Published" : "Draft"} />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="rounded-lg border border-white/10 p-2 text-white/70 hover:text-white"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="rounded-lg border border-white/10 p-2 text-white/70 hover:border-red-400/40 hover:text-red-300"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageToolbar title="Projects" subtitle={`${total} total · Admin CRUD`}>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          <Plus size={16} /> New project
        </button>
      </PageToolbar>

      {error ? (
        <div className="mb-4">
          <ErrorState message={error} />
        </div>
      ) : null}

      {loading ? <LoadingState /> : <AdminTable columns={columns} rows={items} empty="No projects yet." />}

      <AdminModal
        open={modalOpen}
        wide
        title={editingId ? "Edit project" : "Create project"}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Title *">
              <FormInput
                required
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
              />
            </FormField>
            <FormField label="Slug *">
              <FormInput
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setField("slug", e.target.value);
                }}
              />
            </FormField>
          </div>

          <FormField label="Short description *">
            <FormTextarea
              required
              value={form.short_description}
              onChange={(e) => setField("short_description", e.target.value)}
            />
          </FormField>

          <FormField label="Full brief *">
            <FormTextarea
              required
              value={form.full_brief}
              onChange={(e) => setField("full_brief", e.target.value)}
              className="min-h-[140px]"
            />
          </FormField>

          <ImageUploadField
            label="Cover image *"
            value={form.cover_image_url}
            onChange={(url) => setField("cover_image_url", url)}
            onUpload={handleCoverUpload}
            uploading={uploading}
          />

          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-white/50">
              Categories *
            </p>
            {categories.length ? (
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <FormCheckbox
                    key={cat.id}
                    label={cat.name}
                    checked={form.category_ids.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-amber-200/80">
                No categories yet. Create some under Project Categories first.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Client *">
              <FormInput
                required
                value={form.client}
                onChange={(e) => setField("client", e.target.value)}
              />
            </FormField>
            <FormField label="Location *">
              <FormInput
                required
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
              />
            </FormField>
            <FormField label="Area *">
              <FormInput
                required
                value={form.area}
                onChange={(e) => setField("area", e.target.value)}
                placeholder="8,00,000 Sq.Ft."
              />
            </FormField>
            <FormField label="Cost *">
              <FormInput
                required
                value={form.cost}
                onChange={(e) => setField("cost", e.target.value)}
              />
            </FormField>
            <FormField label="Status *">
              <FormInput
                required
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
                placeholder="2025-ongoing"
              />
            </FormField>
            <FormField label="Display order">
              <FormInput
                type="number"
                min={0}
                value={form.display_order}
                onChange={(e) => setField("display_order", e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Scope *">
            <FormInput
              required
              value={form.scope}
              onChange={(e) => setField("scope", e.target.value)}
            />
          </FormField>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-white/50">Gallery</p>
              <label className="cursor-pointer text-xs font-medium text-accent hover:underline">
                {galleryUploading ? "Uploading…" : "+ Add images"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  multiple
                  disabled={galleryUploading}
                  onChange={async (e) => {
                    const files = e.target.files;
                    e.target.value = "";
                    if (files?.length) await handleGalleryFilesSelected(files);
                  }}
                />
              </label>
            </div>
            {form.gallery.length ? (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {form.gallery.map((img, index) => (
                  <div key={img.id || img.image_url || index} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.image_url}
                      alt=""
                      className="h-20 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute right-1 top-1 rounded bg-black/70 px-1.5 text-xs text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/40">
                Optional. Select multiple images at once for the project gallery.
              </p>
            )}
          </div>

          <FormCheckbox
            label="Published"
            checked={form.is_published}
            onChange={(v) => setField("is_published", v)}
          />

          {formError ? <ErrorState message={formError} /> : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving || uploading || galleryUploading}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading || galleryUploading}
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "Saving…" : editingId ? "Update project" : "Create project"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
