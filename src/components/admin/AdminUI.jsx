"use client";

export function AdminCard({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-[#17171a] p-5 ${className}`}>
      {children}
    </div>
  );
}

export function AdminStat({ label, value, hint }) {
  return (
    <AdminCard>
      <p className="text-xs uppercase tracking-wider text-white/45">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value ?? "—"}</p>
      {hint ? <p className="mt-1 text-xs text-white/40">{hint}</p> : null}
    </AdminCard>
  );
}

export function AdminTable({ columns, rows, empty = "No records found." }) {
  if (!rows?.length) {
    return (
      <AdminCard>
        <p className="py-10 text-center text-sm text-white/45">{empty}</p>
      </AdminCard>
    );
  }

  return (
    <AdminCard className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-white/45">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id ?? rowIndex} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 align-middle text-white/80">
                    {col.render ? col.render(row, rowIndex) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}

export function StatusBadge({ active, label }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
        active ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-white/50"
      }`}
    >
      {label}
    </span>
  );
}

export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-white/45">
      {label}
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      {message || "Something went wrong while fetching data."}
    </div>
  );
}

export function PageToolbar({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {title ? <h2 className="text-xl font-semibold text-white">{title}</h2> : null}
        {subtitle ? <p className="mt-1 text-sm text-white/45">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}
