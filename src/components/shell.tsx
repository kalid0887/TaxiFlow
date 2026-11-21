"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { IconBus } from "./ui";
import { roleHome, useCurrentUser, useStore } from "@/lib/store";
import type { Role } from "@/lib/types";

const NAV: Record<Role, { href: string; label: string }[]> = {
  passenger: [
    { href: "/passenger", label: "Home" },
    { href: "/passenger/search", label: "Find a taxi" },
    { href: "/passenger/reservations", label: "Reservations" },
    { href: "/passenger/queue", label: "Station queue" },
    { href: "/passenger/history", label: "History" },
    { href: "/passenger/complaints", label: "Reports" },
    { href: "/passenger/contracts", label: "Contracts" },
    { href: "/passenger/deliveries", label: "Deliveries" },
  ],
  driver: [
    { href: "/driver", label: "Home" },
    { href: "/driver/requests", label: "Requests" },
    { href: "/driver/trips", label: "Trips" },
    { href: "/driver/return", label: "Return demand" },
    { href: "/driver/vehicle", label: "Vehicle" },
    { href: "/driver/earnings", label: "Earnings" },
  ],
  association_admin: [
    { href: "/association", label: "Overview" },
    { href: "/association/drivers", label: "Drivers" },
    { href: "/association/vehicles", label: "Vehicles" },
    { href: "/association/routes", label: "Routes" },
    { href: "/association/queue", label: "Queues" },
    { href: "/association/complaints", label: "Complaints" },
    { href: "/association/contracts", label: "Contracts" },
    { href: "/association/reports", label: "Reports" },
  ],
  system_admin: [
    { href: "/admin", label: "Overview" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/associations", label: "Associations" },
    { href: "/admin/pricing", label: "Pricing" },
    { href: "/admin/ads", label: "Ads" },
    { href: "/admin/channels", label: "SMS / USSD" },
    { href: "/admin/reports", label: "Reports" },
  ],
};

export function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  const user = useCurrentUser();
  const { logout, state } = useStore();
  const router = useRouter();
  const path = usePathname();
  const unread = state.notifications.filter((n) => n.userId === user?.id && !n.read).length;

  useEffect(() => {
    if (!user) router.replace("/login");
    else if (user.role !== role) router.replace(roleHome(user.role));
  }, [user, role, router]);

  if (!user || user.role !== role) {
    return <p className="p-8 text-sm text-[var(--muted)]">Checking your session…</p>;
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-[var(--line)] bg-[var(--ink)] text-[var(--cream)] md:border-b-0 md:border-r md:border-white/10">
        <div className="flex items-center gap-2 px-5 py-5">
          <IconBus className="h-7 w-7 text-[var(--amber)]" />
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg leading-none">TaxiFlow</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/60">{role.replace("_", " ")}</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
          {NAV[role].map((item) => {
            const active = path === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-3 py-2 text-sm ${active ? "bg-[var(--amber)] text-[#3b2a00]" : "text-white/80 hover:bg-white/10"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div>
        <header className="flex items-center justify-between gap-3 border-b border-[var(--line)] bg-white px-4 py-3 md:px-8">
          <p className="text-sm">
            <span className="font-semibold">{user.name}</span>
            <span className="ml-2 text-[var(--muted)]">{user.phone}</span>
          </p>
          <div className="flex items-center gap-3 text-sm">
            {unread > 0 ? (
              <span className="rounded-full bg-[var(--amber)] px-2 py-0.5 text-xs font-semibold text-[#3b2a00]">
                {unread} new
              </span>
            ) : null}
            <button
              className="text-[var(--muted)] hover:text-[var(--ink)]"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              Sign out
            </button>
          </div>
        </header>
        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
