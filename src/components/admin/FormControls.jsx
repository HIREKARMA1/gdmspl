"use client";

import { Plus, Trash2 } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0f0f10] px-3 py-2.5 text-sm text-white outline-none transition focus:border-accent";

const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50";

export function FormField({ label, children }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export function FormInput(props) {
  return <input className={inputClass} {...props} />;
}

export function FormTextarea({ className = "", ...props }) {
  return <textarea className={`${inputClass} min-h-[100px] resize-y ${className}`} {...props} />;
}

export function FormSelect({ children, ...props }) {
  return (
    <select className={inputClass} {...props}>
      {children}
    </select>
  );
}

export function FormCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-white/80">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-white/20 bg-[#0f0f10] accent-[var(--accent,#c45c26)]"
      />
      {label}
    </label>
  );
}

/** Upload image → sets URL via onUploaded({ url }) */
export function ImageUploadField({
  label,
  value,
  onChange,
  onUpload,
  uploading,
  accept = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp",
  hint = "JPG, PNG, or WEBP · max 5MB",
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mb-2 h-24 w-24 rounded-xl object-cover" />
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer rounded-xl border border-white/10 bg-[#0f0f10] px-3 py-2 text-sm text-white/80 transition hover:border-accent/40">
          {uploading ? "Uploading…" : "Choose file"}
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={uploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file && onUpload) await onUpload(file);
            }}
          />
        </label>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-white/50 hover:text-red-300"
          >
            Clear
          </button>
        ) : null}
      </div>
      {hint ? <p className="mt-1 text-xs text-white/40">{hint}</p> : null}
      {value ? (
        <input
          className={`${inputClass} mt-2`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL"
        />
      ) : null}
    </div>
  );
}

/** Dynamic string list for responsibilities / requirements */
export function StringListField({ label, values, onChange, placeholder = "Enter item…" }) {
  const updateAt = (index, value) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  const add = () => onChange([...values, ""]);

  const remove = (index) => {
    if (values.length <= 1) {
      onChange([""]);
      return;
    }
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className={labelClass}>{label}</label>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
        >
          <Plus size={14} /> Add
        </button>
      </div>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              className={inputClass}
              value={value}
              onChange={(e) => updateAt(index, e.target.value)}
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="rounded-xl border border-white/10 px-3 text-white/50 transition hover:border-red-400/40 hover:text-red-300"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminModal({ open, title, onClose, children, wide }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div
        className={`my-8 w-full rounded-2xl border border-white/10 bg-[#17171a] shadow-2xl ${
          wide ? "max-w-3xl" : "max-w-xl"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-white/50 hover:bg-white/5 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
