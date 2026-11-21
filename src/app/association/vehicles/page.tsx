"use client";

import { useState } from "react";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { remainingSeats } from "@/lib/pricing";
import { useCurrentUser, useStore } from "@/lib/store";

export default function VehiclesPage() {
  const { state, updateVehicle } = useStore();
  const user = useCurrentUser();
  const vehicles = state.vehicles.filter((v) => v.associationId === user?.associationId);
  const [capacity, setCapacity] = useState<Record<string, number>>({});
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Vehicles</h1>
      {vehicles.map((v) => (
        <Card key={v.id} className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-semibold">{v.plate} · {v.model}</p>
            <p className="text-sm text-[var(--muted)]">
              {state.users.find((u) => u.id === v.driverId)?.name} · {remainingSeats(v)} seats left of {v.capacity}
            </p>
          </div>
          <div className="flex items-end gap-2">
            <Field label="Capacity">
              <input
                className={inputClass}
                type="number"
                min={v.reservedSeats}
                value={capacity[v.id] ?? v.capacity}
                onChange={(e) => setCapacity((c) => ({ ...c, [v.id]: Number(e.target.value) }))}
              />
            </Field>
            <Button onClick={() => updateVehicle({ vehicleId: v.id, capacity: capacity[v.id] ?? v.capacity })}>Update</Button>
          </div>
        </Card>
      ))}
      <p className="text-sm text-[var(--muted)]">
        Capacity cannot drop below seats already reserved. New vehicle registration against a live association database is a later backend step.
      </p>
    </div>
  );
}
