"use client";

import { Card, StatusPill } from "@/components/ui";
import { useCurrentUser, useStore } from "@/lib/store";

export default function DriversPage() {
  const { state } = useStore();
  const user = useCurrentUser();
  const drivers = state.users.filter((u) => u.role === "driver" && u.associationId === user?.associationId);
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Drivers</h1>
      {drivers.map((d) => {
        const v = state.vehicles.find((x) => x.driverId === d.id);
        const avgRatings = state.ratings.filter((r) => r.driverId === d.id);
        return (
          <Card key={d.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{d.name}</p>
              <p className="text-sm text-[var(--muted)]">
                {d.phone} · {v?.plate ?? "No vehicle"} · {avgRatings.length} ratings
              </p>
            </div>
            {v ? <StatusPill status={v.available ? "idle" : "offline"} /> : null}
          </Card>
        );
      })}
    </div>
  );
}
