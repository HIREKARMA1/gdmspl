"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { AdminStat, ErrorState, LoadingState, PageToolbar } from "@/components/admin/AdminUI";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [team, projects, jobs, applications] = await Promise.all([
          api.get("/admin/team-members", { params: { page: 1, page_size: 1 } }),
          api.get("/admin/projects", { params: { page: 1, page_size: 1 } }),
          api.get("/admin/job-openings", { params: { page: 1, page_size: 1 } }),
          api.get("/admin/job-applications", { params: { page: 1, page_size: 1 } }),
        ]);

        if (cancelled) return;
        setStats({
          team: team.data.total ?? team.data.items?.length ?? 0,
          projects: projects.data.total ?? projects.data.items?.length ?? 0,
          jobs: jobs.data.total ?? jobs.data.items?.length ?? 0,
          applications: applications.data.total ?? applications.data.items?.length ?? 0,
        });
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.detail || "Failed to load dashboard stats. Is the API running?");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <PageToolbar
        title="Dashboard"
        subtitle="Overview of CMS content connected to the FastAPI backend."
      />

      {error ? <ErrorState message={error} /> : null}
      {loading ? <LoadingState label="Loading dashboard…" /> : null}

      {!loading && !error && stats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link href="/admin/team">
            <AdminStat label="Team Members" value={stats.team} hint="Manage people" />
          </Link>
          <Link href="/admin/projects">
            <AdminStat label="Projects" value={stats.projects} hint="Portfolio briefs" />
          </Link>
          <Link href="/admin/job-openings">
            <AdminStat label="Job Openings" value={stats.jobs} hint="Current openings" />
          </Link>
          <Link href="/admin/applications">
            <AdminStat label="Applications" value={stats.applications} hint="Inbox" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
