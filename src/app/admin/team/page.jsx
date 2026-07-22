"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
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
import { slugify } from "@/services/projectCategories";
import {
  createTeamMember,
  deleteTeamMember,
  emptyTeamForm,
  fetchAdminTeamMembers,
  formStateToPayload,
  memberToFormState,
  reorderTeamMembers,
  updateTeamMember,
} from "@/services/teamMembers";
import { uploadTeamImage, validateImageFile } from "@/services/uploads";

export default function AdminTeamPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyTeamForm());
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminTeamMembers();
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load team members."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyTeamForm());
    setSlugManual(false);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (member) => {
    setEditingId(member.id);
    setForm(memberToFormState(member));
    setSlugManual(Boolean(member.slug));
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving || uploading) return;
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

  const handleUpload = async (file) => {
    const validation = validateImageFile(file);
    if (validation) {
      setFormError(validation);
      return;
    }
    setUploading(true);
    setFormError("");
    try {
      const uploaded = await uploadTeamImage(file);
      setField("image_url", uploaded.url);
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Photo upload failed."));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const payload = formStateToPayload(form);
    if (!payload.name || !payload.role || !payload.bio || !payload.image_url) {
      setFormError("Name, role, bio, and photo are required.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateTeamMember(editingId, payload);
      } else {
        await createTeamMember(payload);
      }
      setModalOpen(false);
      await loadMembers();
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Failed to save team member."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Delete ${member.name}?`)) return;
    try {
      await deleteTeamMember(member.id);
      await loadMembers();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete member."));
    }
  };

  const moveOrder = async (index, direction) => {
    const next = [...items];
    const swap = index + direction;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    const payload = next.map((m, i) => ({ id: m.id, display_order: i + 1 }));
    setItems(next.map((m, i) => ({ ...m, display_order: i + 1 })));
    try {
      await reorderTeamMembers(payload);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to reorder."));
      await loadMembers();
    }
  };

  const columns = [
    {
      key: "image",
      label: "Photo",
      render: (row) =>
        row.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={row.image_url} alt={row.name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs">
            {row.name?.[0] || "?"}
          </div>
        ),
    },
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    {
      key: "is_featured",
      label: "Featured",
      render: (row) => <StatusBadge active={row.is_featured} label={row.is_featured ? "Yes" : "No"} />,
    },
    {
      key: "is_published",
      label: "Status",
      render: (row) => (
        <StatusBadge active={row.is_published} label={row.is_published ? "Published" : "Draft"} />
      ),
    },
    { key: "display_order", label: "Order" },
    {
      key: "actions",
      label: "Actions",
      render: (row, rowIndex) => (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => moveOrder(rowIndex, -1)}
            className="rounded-lg border border-white/10 p-2 text-white/70 hover:text-white"
            title="Move up"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            onClick={() => moveOrder(rowIndex, 1)}
            className="rounded-lg border border-white/10 p-2 text-white/70 hover:text-white"
            title="Move down"
          >
            <ArrowDown size={14} />
          </button>
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
      <PageToolbar title="Team Members" subtitle={`${total} total · Admin CRUD`}>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          <Plus size={16} /> New member
        </button>
      </PageToolbar>

      {error ? (
        <div className="mb-4">
          <ErrorState message={error} />
        </div>
      ) : null}

      {loading ? <LoadingState /> : <AdminTable columns={columns} rows={items} empty="No team members yet." />}

      <AdminModal
        open={modalOpen}
        wide
        title={editingId ? "Edit team member" : "Create team member"}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Name *">
              <FormInput
                required
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Jane Doe"
              />
            </FormField>
            <FormField label="Role *">
              <FormInput
                required
                value={form.role}
                onChange={(e) => setField("role", e.target.value)}
                placeholder="CEO"
              />
            </FormField>
          </div>

          <FormField label="Slug">
            <FormInput
              value={form.slug}
              onChange={(e) => {
                setSlugManual(true);
                setField("slug", e.target.value);
              }}
              placeholder="jane-doe"
            />
          </FormField>

          <FormField label="Bio *">
            <FormTextarea
              required
              value={form.bio}
              onChange={(e) => setField("bio", e.target.value)}
              placeholder="Short bio…"
            />
          </FormField>

          <ImageUploadField
            label="Photo *"
            value={form.image_url}
            onChange={(url) => setField("image_url", url)}
            onUpload={handleUpload}
            uploading={uploading}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Display order">
              <FormInput
                type="number"
                min={0}
                value={form.display_order}
                onChange={(e) => setField("display_order", e.target.value)}
              />
            </FormField>
            <div className="flex items-end pb-2">
              <FormCheckbox
                label="Featured on home"
                checked={form.is_featured}
                onChange={(v) => setField("is_featured", v)}
              />
            </div>
            <div className="flex items-end pb-2">
              <FormCheckbox
                label="Published"
                checked={form.is_published}
                onChange={(v) => setField("is_published", v)}
              />
            </div>
          </div>

          {formError ? <ErrorState message={formError} /> : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving || uploading}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "Saving…" : editingId ? "Update member" : "Create member"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
