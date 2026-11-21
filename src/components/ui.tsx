import Link from "next/link";
import type { ReactNode } from "react";

export function IconBus({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 11h18M7 17v2M17 17v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="7.5" cy="14" r="1" fill="currentColor" />
      <circle cx="16.5" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}

export function StatusPill({
  status,
}: {
  status: string;
}) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-900",
    confirmed: "bg-emerald-100 text-emerald-900",
    rejected: "bg-rose-100 text-rose-900",
    cancelled: "bg-zinc-200 text-zinc-700",
    completed: "bg-sky-100 text-sky-900",
    waiting: "bg-amber-100 text-amber-900",
    boarding: "bg-teal-100 text-teal-900",
    departed: "bg-zinc-200 text-zinc-700",
    open: "bg-rose-100 text-rose-900",
    reviewing: "bg-amber-100 text-amber-900",
    resolved: "bg-emerald-100 text-emerald-900",
    dismissed: "bg-zinc-200 text-zinc-700",
    idle: "bg-emerald-100 text-emerald-900",
    en_route: "bg-sky-100 text-sky-900",
    offline: "bg-zinc-200 text-zinc-700",
    submitted: "bg-amber-100 text-amber-900",
    offered: "bg-emerald-100 text-emerald-900",
    assigned: "bg-sky-100 text-sky-900",
    in_transit: "bg-sky-100 text-sky-900",
    delivered: "bg-emerald-100 text-emerald-900",
    active: "bg-emerald-100 text-emerald-900",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${map[status] ?? "bg-zinc-200 text-zinc-700"}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export function Button({
  children,
  href,
  type = "button",
  variant = "primary",
  onClick,
  disabled,
}: {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost" | "danger";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const styles = {
    primary: "bg-[var(--ink)] text-[var(--cream)] hover:bg-[#2a4f4a]",
    secondary: "bg-[var(--amber)] text-[#3b2a00] hover:bg-[#ffc94a]",
    ghost: "bg-white text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--mist)]",
    danger: "bg-rose-700 text-white hover:bg-rose-800",
  }[variant];
  const cls = `inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${styles}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-[var(--ink)]">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm outline-none ring-[var(--amber)] focus:ring-2";

export function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p> : null}
    </Card>
  );
}

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--line)] p-8 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{body}</p>
    </div>
  );
}

export function ErrorText({ message }: { message?: string | null }) {
  if (!message) return null;
  return <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">{message}</p>;
}

export function SuccessText({ message }: { message?: string | null }) {
  if (!message) return null;
  return <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>;
}
