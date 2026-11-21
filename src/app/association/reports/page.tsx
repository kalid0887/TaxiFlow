"use client";

import { Card, Stat } from "@/components/ui";
import { money } from "@/lib/pricing";
import { useCurrentUser, useStore } from "@/lib/store";

export default function AssocReportsPage() {
  const { state } = useStore();
  const user = useCurrentUser();
  const vehicles = state.vehicles.filter((v) => v.associationId === user?.associationId);
  const bookings = state.bookings.filter((b) => vehicles.some((v) => v.id === b.vehicleId));
  const revenue = bookings.filter((b) => b.status === "confirmed" || b.status === "completed").reduce((n, b) => n + b.total, 0);
  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Operational reports</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Bookings" value={bookings.length} />
        <Stat label="Recorded totals" value={money(revenue, state.pricing.currency)} hint="Not processed payments." />
        <Stat label="Empty pickups" value={bookings.filter((b) => b.type === "empty_pickup").length} />
      </div>
      <Card>
        <p className="text-sm text-[var(--muted)]">Activity by status</p>
        {(["pending", "confirmed", "completed", "cancelled", "rejected"] as const).map((s) => (
          <p key={s} className="mt-1 text-sm">
            {s}: {bookings.filter((b) => b.status === s).length}
          </p>
        ))}
      </Card>
    </div>
  );
}
