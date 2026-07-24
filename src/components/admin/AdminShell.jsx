"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Briefcase,
  Inbox,
  Tags,
  LogOut,
  Building2,
  MapPin,
} from "lucide-react";
import { hydrateAuth, logout } from "@/store/slices/authSlice";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/project-categories", label: "Categories", icon: Tags },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/job-openings", label: "Job Openings", icon: Briefcase },
  { href: "/admin/applications", label: "Applications", icon: Inbox },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, hydrated, user, loading } = useSelector((state) => state.auth);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated || isLoginPage) return;
    if (!isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [hydrated, isAuthenticated, isLoginPage, router]);

  const handleLogout = async () => {
    await dispatch(logout());
    router.replace("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!hydrated || (!isAuthenticated && !loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f10] text-white/70">
        Checking session…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0f0f10] text-[#e8e8ea]">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-[#141416]">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
            <Building2 size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">GDMSPL Admin</p>
            <p className="text-[11px] text-white/45">Content CMS</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent/20 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 truncate text-xs text-white/50">
            {user?.full_name || user?.email || "Admin"}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="ml-64 flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#141416]/90 px-8 py-4 backdrop-blur">
          <h1 className="text-lg font-semibold text-white">
            {navItems.find((n) =>
              n.exact ? pathname === n.href : pathname === n.href || pathname.startsWith(`${n.href}/`)
            )?.label || "Admin"}
          </h1>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
