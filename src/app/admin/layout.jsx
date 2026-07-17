"use client";

import Providers from "@/store/Providers";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({ children }) {
  return (
    <Providers>
      <AdminShell>{children}</AdminShell>
    </Providers>
  );
}
