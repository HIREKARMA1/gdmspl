"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Eye, Mail } from "lucide-react";
import {
  AdminTable,
  ErrorState,
  LoadingState,
  PageToolbar,
  StatusBadge,
} from "@/components/admin/AdminUI";
import { AdminModal } from "@/components/admin/FormControls";
import { getApiErrorMessage } from "@/lib/apiErrors";
import {
  APPLICATION_STATUSES,
  fetchAdminApplication,
  fetchAdminApplications,
  updateApplicationStatus,
} from "@/services/applications";
import { fetchAdminJobOpenings } from "@/services/jobOpenings";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
];

function statusActive(status) {
  return status === "new" || status === "shortlisted";
}

export default function AdminApplicationsPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [detailError, setDetailError] = useState("");

  const loadInbox = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (statusFilter) params.status_filter = statusFilter;
      if (jobFilter) params.job_opening_id = jobFilter;
      const data = await fetchAdminApplications(params);
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load applications."));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, jobFilter]);

  useEffect(() => {
    fetchAdminJobOpenings({ page_size: 100 })
      .then((data) => setJobs(data.items))
      .catch(() => setJobs([]));
  }, []);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  const openDetail = async (row) => {
    setSelected(row);
    setDetailError("");
    setDetailLoading(true);
    try {
      const full = await fetchAdminApplication(row.id);
      setSelected(full);
    } catch (err) {
      setDetailError(getApiErrorMessage(err, "Failed to load application detail."));
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    if (updatingStatus) return;
    setSelected(null);
    setDetailError("");
  };

  const changeStatus = async (status) => {
    if (!selected?.id || selected.status === status) return;
    setUpdatingStatus(true);
    setDetailError("");
    try {
      const updated = await updateApplicationStatus(selected.id, status);
      setSelected(updated);
      setItems((prev) => prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)));
    } catch (err) {
      setDetailError(getApiErrorMessage(err, "Failed to update status."));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const columns = [
    {
      key: "full_name",
      label: "Applicant",
      render: (row) => (
        <div>
          <p className="font-medium text-white">{row.full_name}</p>
          <p className="text-xs text-white/40">{row.email}</p>
        </div>
      ),
    },
    {
      key: "job_title",
      label: "Job",
      render: (row) => row.job_title || "—",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <StatusBadge active={statusActive(row.status)} label={row.status || "new"} />
      ),
    },
    {
      key: "submitted_at",
      label: "Submitted",
      render: (row) =>
        row.submitted_at ? new Date(row.submitted_at).toLocaleString() : "—",
    },
    {
      key: "resume_url",
      label: "Resume",
      render: (row) =>
        row.resume_url ? (
          <a
            href={row.resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-accent underline"
            onClick={(e) => e.stopPropagation()}
          >
            View PDF <ExternalLink size={12} />
          </a>
        ) : (
          "—"
        ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button
          type="button"
          onClick={() => openDetail(row)}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-white/70 transition hover:border-accent/40 hover:text-white"
        >
          <Eye size={14} /> View
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageToolbar title="Applications" subtitle={`${total} total · Applications inbox`} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value || "all"}
            type="button"
            onClick={() => setStatusFilter(tab.value)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
              statusFilter === tab.value
                ? "bg-accent text-white"
                : "border border-white/10 text-white/55 hover:bg-white/5 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}

        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="ml-auto rounded-lg border border-white/10 bg-[#0f0f10] px-3 py-2 text-sm text-white outline-none"
        >
          <option value="">All jobs</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="mb-4">
          <ErrorState message={error} />
        </div>
      ) : null}

      {loading ? (
        <LoadingState label="Loading applications…" />
      ) : (
        <AdminTable columns={columns} rows={items} empty="No applications in this filter." />
      )}

      <AdminModal
        open={Boolean(selected)}
        title="Application detail"
        onClose={closeDetail}
        wide
      >
        {detailLoading && !selected?.message && !selected?.resume_url ? (
          <p className="py-8 text-center text-sm text-white/45">Loading…</p>
        ) : selected ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Applicant</p>
                <p className="mt-1 text-lg font-semibold text-white">{selected.full_name}</p>
                <a
                  href={`mailto:${selected.email}`}
                  className="mt-1 inline-flex items-center gap-1 text-sm text-accent"
                >
                  <Mail size={14} /> {selected.email}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Job</p>
                <p className="mt-1 font-medium text-white">{selected.job_title || "—"}</p>
                <p className="mt-1 text-xs text-white/40">
                  Submitted{" "}
                  {selected.submitted_at
                    ? new Date(selected.submitted_at).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-white/40">Status</p>
              <div className="flex flex-wrap gap-2">
                {APPLICATION_STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={updatingStatus}
                    onClick={() => changeStatus(status)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition disabled:opacity-50 ${
                      selected.status === status
                        ? "bg-accent text-white"
                        : "border border-white/10 text-white/55 hover:bg-white/5"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {selected.resume_url ? (
                <a
                  href={selected.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white hover:border-accent/40"
                >
                  View resume <ExternalLink size={14} />
                </a>
              ) : null}
              {selected.portfolio_url ? (
                <a
                  href={selected.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white hover:border-accent/40"
                >
                  Portfolio <ExternalLink size={14} />
                </a>
              ) : null}
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-white/40">Message</p>
              <p className="rounded-xl border border-white/10 bg-[#0f0f10] px-4 py-3 text-sm leading-relaxed text-white/75">
                {selected.message?.trim() || "No message provided."}
              </p>
            </div>

            {detailError ? (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {detailError}
              </p>
            ) : null}
          </div>
        ) : null}
      </AdminModal>
    </div>
  );
}
