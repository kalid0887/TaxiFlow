"use client";

import { Card, Stat } from "@/components/ui";
import { money } from "@/lib/pricing";
import { useCurrentUser, useStore } from "@/lib/store";

export default function EarningsPage() {
  const { state } = useStore();
  const user = useCurrentUser();
  const mine = state.bookings.filter((b) => b.driverId === user?.id && (b.status === "confirmed" || b.status === "completed"));
  const expected = mine.reduce((n, b) => n + b.baseFare + b.emptyPickupCharge, 0);
  const ratings = state.ratings.filter((r) => r.driverId === user?.id);
  const avg =
    ratings.length === 0
      ? 0
      : ratings.reduce((n, r) => n + (r.driving + r.punctuality + r.cleanliness + r.safety + r.service) / 5, 0) /
        ratings.length;
  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Earnings and feedback</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Expected earnings" value={money(expected, state.pricing.currency)} hint="Demo totals from accepted trips. No payouts are processed." />
        <Stat label="Accepted trips" value={mine.length} />
        <Stat label="Average rating" value={avg.toFixed(1)} />
      </div>
      {ratings.map((r) => (
        <Card key={r.id}>
          <p className="font-medium">{state.users.find((u) => u.id === r.passengerId)?.name}</p>
          <p className="text-sm text-[var(--muted)]">
            Drive {r.driving} · Time {r.punctuality} · Clean {r.cleanliness} · Safety {r.safety} · Service {r.service}
          </p>
          <p className="mt-2 text-sm">{r.comment}</p>
        </Card>
      ))}
    </div>
  );
}
