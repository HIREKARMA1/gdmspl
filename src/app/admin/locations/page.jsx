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
} from "@/components/admin/FormControls";
import { getApiErrorMessage } from "@/lib/apiErrors";
import { slugify } from "@/services/projectCategories";
import {
  createOfficeLocation,
  deleteOfficeLocation,
  emptyLocationForm,
  fetchAdminOfficeLocations,
  formStateToPayload,
  locationToFormState,
  reorderOfficeLocations,
  updateOfficeLocation,
} from "@/services/officeLocations";

export default function AdminLocationsPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyLocationForm());
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadLocations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminOfficeLocations();
      const sorted = [...(data.items || [])].sort(
        (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
      );
      setItems(sorted);
      setTotal(data.total || sorted.length);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load office locations."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyLocationForm());
    setSlugManual(false);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm(locationToFormState(row));
    setSlugManual(Boolean(row.slug));
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
    if (!payload.name || !payload.slug || !payload.office || !payload.phone || !payload.email) {
      setFormError("Name, slug, office address, phone, and email are required.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateOfficeLocation(editingId, payload);
      } else {
        await createOfficeLocation(payload);
      }
      setModalOpen(false);
      await loadLocations();
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Failed to save location."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete location “${row.name}”?`)) return;
    try {
      await deleteOfficeLocation(row.id);
      await loadLocations();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete location."));
    }
  };

  const moveRow = async (index, direction) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    const payload = next.map((m, i) => ({ id: m.id, display_order: i + 1 }));
    setItems(next.map((m, i) => ({ ...m, display_order: i + 1 })));
    try {
      await reorderOfficeLocations(payload);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to reorder locations."));
      await loadLocations();
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    {
      key: "office",
      label: "Address",
      render: (row) => (
        <span className="line-clamp-2 max-w-[280px] text-white/70">{row.office}</span>
      ),
    },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "display_order", label: "Order" },
    {
      key: "is_published",
      label: "Published",
      render: (row) => (
        <StatusBadge active={row.is_published} label={row.is_published ? "Yes" : "No"} />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row, index) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => moveRow(index, -1)}
            className="rounded-lg border border-white/10 p-2 text-white/70 hover:text-white"
            title="Move up"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            onClick={() => moveRow(index, 1)}
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
      <PageToolbar
        title="Office Locations"
        subtitle={`${total} locations · About + Contact sections`}
      >
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
        >
          <Plus size={16} /> New location
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
        <AdminTable columns={columns} rows={items} empty="No locations yet. Create one." />
      )}

      <AdminModal
        open={modalOpen}
        title={editingId ? "Edit office location" : "Create office location"}
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Name *">
              <FormInput
                required
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Delhi"
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
                placeholder="delhi"
              />
            </FormField>
          </div>

          <FormField label="Office address *">
            <FormTextarea
              required
              value={form.office}
              onChange={(e) => setField("office", e.target.value)}
              className="min-h-[90px]"
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Phone *">
              <FormInput
                required
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="+91 11 41025657"
              />
            </FormField>
            <FormField label="Email *">
              <FormInput
                required
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="mail@gdmspl.com"
              />
            </FormField>
            <FormField label="Website">
              <FormInput
                value={form.website}
                onChange={(e) => setField("website", e.target.value)}
                placeholder="www.gdmspl.com"
              />
            </FormField>
            <FormField label="Map / Google Maps URL">
              <FormInput
                value={form.map_url}
                onChange={(e) => setField("map_url", e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
              />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Latitude (map pin)">
              <FormInput
                type="number"
                step="any"
                value={form.lat}
                onChange={(e) => setField("lat", e.target.value)}
                placeholder="28.6139"
              />
            </FormField>
            <FormField label="Longitude (map pin)">
              <FormInput
                type="number"
                step="any"
                value={form.lng}
                onChange={(e) => setField("lng", e.target.value)}
                placeholder="77.2090"
              />
            </FormField>
            <FormField label="Map label offset X">
              <FormInput
                type="number"
                value={form.map_offset_x}
                onChange={(e) => setField("map_offset_x", e.target.value)}
              />
            </FormField>
            <FormField label="Map label offset Y">
              <FormInput
                type="number"
                value={form.map_offset_y}
                onChange={(e) => setField("map_offset_y", e.target.value)}
              />
            </FormField>
            <FormField label="Map label width">
              <FormInput
                type="number"
                value={form.map_label_width}
                onChange={(e) => setField("map_label_width", e.target.value)}
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

          <FormCheckbox
            label="Published (show on landing / contact)"
            checked={form.is_published}
            onChange={(v) => setField("is_published", v)}
          />

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
              {saving ? "Saving…" : editingId ? "Update location" : "Create location"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
