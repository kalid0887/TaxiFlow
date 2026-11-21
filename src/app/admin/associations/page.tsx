"use client";

import { Card } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function AdminAssociationsPage() {
  const { state } = useStore();
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Associations</h1>
      {state.associations.map((a) => (
        <Card key={a.id}>
          <p className="font-semibold">{a.name}</p>
          <p className="text-sm text-[var(--muted)]">{a.contactPhone}</p>
          <p className="mt-2 text-sm">
            Stations: {a.stationIds.map((id) => state.stations.find((s) => s.id === id)?.name).join(", ")}
          </p>
          <p className="text-sm">
            Drivers: {state.users.filter((u) => u.role === "driver" && u.associationId === a.id).length}
          </p>
        </Card>
      ))}
    </div>
  );
}
