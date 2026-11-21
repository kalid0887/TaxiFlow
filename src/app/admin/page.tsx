"use client";

import { Button, Stat } from "@/components/ui";
import { money } from "@/lib/pricing";
import { useStore } from "@/lib/store";

export default function AdminHome() {
  const { state, resetDemo } = useStore();
  const revenue = state.bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((n, b) => n + b.serviceFee, 0);
  return (
    <div className="space-y-6">
      <h1 className="text-4xl">System overview</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Users" value={state.users.length} />
        <Stat label="Associations" value={state.associations.length} />
        <Stat label="Drivers" value={state.users.filter((u) => u.role === "driver").length} />
        <Stat label="Reservations" value={state.bookings.length} />
        <Stat label="Service fees (demo)" value={money(revenue, state.pricing.currency)} hint="Not collected money." />
        <Stat label="Active ads" value={state.ads.filter((a) => a.active).length} />
      </div>
      <Button variant="ghost" onClick={resetDemo}>
        Reset demo data
      </Button>
    </div>
  );
}
