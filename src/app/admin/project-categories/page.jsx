"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  AdminTable,
  ErrorState,
  LoadingState,
  PageToolbar,
} from "@/components/admin/AdminUI";
import {
  AdminModal,
  FormField,
  FormInput,
} from "@/components/admin/FormControls";
import { getApiErrorMessage } from "@/lib/apiErrors";
import {
  createProjectCategory,
  deleteProjectCategory,
  emptyCategoryForm,
  fetchAdminProjectCategories,
  formStateToPayload,
  slugify,
  updateProjectCategory,
} from "@/services/projectCategories";

export default function AdminProjectCategoriesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyCategoryForm());
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminProjectCategories();
      setItems(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load project categories."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyCategoryForm());
    setSlugManual(false);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name || "",
      slug: row.slug || "",
      display_order: row.display_order ?? 0,
    });
    setSlugManual(true);
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingId(null);
    setFormError("");
  };

  const setField = (key, value) => {
    setForm((prev) => {
      if (key === "name" && !slugManual) {
        return { ...prev, name: value, slug: slugify(value) };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const payload = formStateToPayload(form);
    if (!payload.name || !payload.slug) {
      setFormError("Name and slug are required.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateProjectCategory(editingId, payload);
      } else {
        await createProjectCategory(payload);
      }
      setModalOpen(false);
      await loadCategories();
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Failed to save category."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete category “${row.name}”?`)) return;
    try {
      await deleteProjectCategory(row.id);
      await loadCategories();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete category."));
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "slug", label: "Slug" },
    { key: "display_order", label: "Order" },
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
      <PageToolbar
        title="Project Categories"
        subtitle={`${items.length} categories · Admin CRUD`}
      >
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          <Plus size={16} /> New category
        </button>
      </PageToolbar>

      {error ? (
        <div className="mb-4">
          <ErrorState message={error} />
        </div>
      ) : null}

      {loading ? (
        <LoadingState />
      ) : (
        <AdminTable columns={columns} rows={items} empty="No categories yet. Create one." />
      )}

      <AdminModal
        open={modalOpen}
        title={editingId ? "Edit project category" : "Create project category"}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Name *">
            <FormInput
              required
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Interior Design"
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
              placeholder="interior-design"
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

          {formError ? <ErrorState message={formError} /> : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "Saving…" : editingId ? "Update category" : "Create category"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
