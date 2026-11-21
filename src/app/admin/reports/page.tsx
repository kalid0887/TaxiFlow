"use client";

import { Card, Stat } from "@/components/ui";
import { money } from "@/lib/pricing";
import { useStore } from "@/lib/store";

export default function AdminReportsPage() {
  const { state } = useStore();
  const fees = state.bookings.filter((b) => b.status !== "rejected" && b.status !== "cancelled");
  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Platform reports</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Quoted volume" value={money(fees.reduce((n, b) => n + b.total, 0), state.pricing.currency)} />
        <Stat label="Empty pickup extras" value={money(fees.reduce((n, b) => n + b.emptyPickupCharge, 0), state.pricing.currency)} />
        <Stat label="Open complaints" value={state.complaints.filter((c) => c.status === "open").length} />
      </div>
      <Card>
        <p className="text-sm text-[var(--muted)]">These figures are calculated from demo bookings stored in this browser. They are not bank settlements.</p>
      </Card>
    </div>
  );
}
