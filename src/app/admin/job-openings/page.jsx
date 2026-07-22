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
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  StringListField,
} from "@/components/admin/FormControls";
import { getApiErrorMessage } from "@/lib/apiErrors";
import {
  createJobOpening,
  deleteJobOpening,
  emptyJobForm,
  fetchAdminJobOpenings,
  fetchCareerCategories,
  formStateToPayload,
  jobToFormState,
  updateJobOpening,
} from "@/services/jobOpenings";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

export default function AdminJobOpeningsPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyJobForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminJobOpenings();
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load job openings."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const cats = await fetchCareerCategories();
        if (!cancelled) setCategories(cats.filter((c) => c.is_active !== false));
      } catch {
        // categories may fail separately; jobs still load
      }
      if (!cancelled) await loadJobs();
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [loadJobs]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyJobForm());
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (job) => {
    setEditingId(job.id);
    setForm(jobToFormState(job));
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
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.category_id) {
      setFormError("Please select a career category.");
      return;
    }

    const payload = formStateToPayload(form);
    if (!payload.title || !payload.location || !payload.employment_type || !payload.experience || !payload.intro) {
      setFormError("Please fill all required fields.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateJobOpening(editingId, payload);
      } else {
        await createJobOpening(payload);
      }
      setModalOpen(false);
      setEditingId(null);
      await loadJobs();
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Failed to save job opening."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (job) => {
    const ok = window.confirm(`Delete job opening “${job.title}”? This cannot be undone from the list.`);
    if (!ok) return;
    try {
      await deleteJobOpening(job.id);
      await loadJobs();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete job opening."));
    }
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (row) => (
        <div>
          <p className="font-medium text-white">{row.title}</p>
          <p className="text-xs text-white/40">{row.category?.name || "—"}</p>
        </div>
      ),
    },
    { key: "location", label: "Location" },
    { key: "employment_type", label: "Type" },
    { key: "experience", label: "Experience" },
    {
      key: "is_published",
      label: "Status",
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
            className="rounded-lg border border-white/10 p-2 text-white/70 transition hover:border-accent/40 hover:text-white"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="rounded-lg border border-white/10 p-2 text-white/70 transition hover:border-red-400/40 hover:text-red-300"
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
      <PageToolbar title="Job Openings" subtitle={`${total} total · Admin CRUD`}>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          <Plus size={16} /> New opening
        </button>
      </PageToolbar>

      {error ? (
        <div className="mb-4">
          <ErrorState message={error} />
        </div>
      ) : null}

      {loading ? <LoadingState /> : <AdminTable columns={columns} rows={items} empty="No openings yet. Create one." />}

      <AdminModal
        open={modalOpen}
        wide
        title={editingId ? "Edit job opening" : "Create job opening"}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Title *">
              <FormInput
                required
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Senior Project Architect"
              />
            </FormField>

            <FormField label="Category *">
              <FormSelect
                required
                value={form.category_id}
                onChange={(e) => setField("category_id", e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </FormSelect>
            </FormField>

            <FormField label="Location *">
              <FormInput
                required
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
                placeholder="New Delhi"
              />
            </FormField>

            <FormField label="Employment type *">
              <FormSelect
                required
                value={form.employment_type}
                onChange={(e) => setField("employment_type", e.target.value)}
              >
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </FormSelect>
            </FormField>

            <FormField label="Experience *">
              <FormInput
                required
                value={form.experience}
                onChange={(e) => setField("experience", e.target.value)}
                placeholder="10+ Years"
              />
            </FormField>

            <FormField label="Published">
              <label className="flex h-[42px] items-center gap-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setField("is_published", e.target.checked)}
                  className="h-4 w-4 accent-[var(--color-accent-primary,#8b0000)]"
                />
                Show on public careers page
              </label>
            </FormField>
          </div>

          <FormField label="Intro / description *">
            <FormTextarea
              required
              value={form.intro}
              onChange={(e) => setField("intro", e.target.value)}
              placeholder="We're looking for a visionary Lead Architect..."
            />
          </FormField>

          <StringListField
            label="Responsibilities"
            values={form.responsibilities}
            onChange={(values) => setField("responsibilities", values)}
            placeholder="Add a responsibility"
          />

          <StringListField
            label="Requirements"
            values={form.requirements}
            onChange={(values) => setField("requirements", values)}
            placeholder="Add a requirement"
          />

          {formError ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {formError}
            </p>
          ) : null}

          {!categories.length ? (
            <p className="text-sm text-amber-200/90">
              No career categories found. Create categories via API first (`POST /admin/career-categories`).
            </p>
          ) : null}

          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !categories.length}
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "Saving…" : editingId ? "Update opening" : "Create opening"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
