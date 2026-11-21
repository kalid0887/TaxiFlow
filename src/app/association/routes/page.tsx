"use client";

import { Card } from "@/components/ui";
import { money } from "@/lib/pricing";
import { useCurrentUser, useStore } from "@/lib/store";

export default function RoutesPage() {
  const { state } = useStore();
  const user = useCurrentUser();
  const routes = state.routes.filter((r) => r.associationId === user?.associationId);
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Routes and stations</h1>
      {routes.map((r) => (
        <Card key={r.id}>
          <p className="font-semibold">{r.name}</p>
          <p className="text-sm text-[var(--muted)]">
            {r.distanceKm} km · {r.durationMin} min · base {money(r.baseFare, state.pricing.currency)}
          </p>
          <p className="mt-2 text-sm">
            Stops: {r.stopIds.map((id) => state.stations.find((s) => s.id === id)?.name).join(" → ")}
          </p>
        </Card>
      ))}
    </div>
  );
}
