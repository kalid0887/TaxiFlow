"use client";

import { useState } from "react";
import { Button, Card, Field, StatusPill, inputClass } from "@/components/ui";
import { useCurrentUser, useStore } from "@/lib/store";

export default function AssocQueuePage() {
  const { state, manageQueue } = useStore();
  const user = useCurrentUser();
  const assoc = state.associations.find((a) => a.id === user?.associationId);
  const [stationId, setStation] = useState(assoc?.stationIds[0] ?? "st-green");
  const tickets = state.queue.filter((q) => q.stationId === stationId);
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Station queues</h1>
      <Field label="Station">
        <select className={inputClass} value={stationId} onChange={(e) => setStation(e.target.value)}>
          {assoc?.stationIds.map((id) => (
            <option key={id} value={id}>
              {state.stations.find((s) => s.id === id)?.name}
            </option>
          ))}
        </select>
      </Field>
      {tickets.map((t) => (
        <Card key={t.id} className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold">
              #{t.position} {state.users.find((u) => u.id === t.passengerId)?.name} ({t.priority})
            </p>
            <p className="text-sm text-[var(--muted)]">
              To {state.stations.find((s) => s.id === t.destinationStationId)?.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={t.status} />
            {t.status === "waiting" ? <Button onClick={() => manageQueue(t.id, "boarding")}>Board</Button> : null}
            {t.status === "boarding" ? <Button onClick={() => manageQueue(t.id, "departed")}>Departed</Button> : null}
            {t.status === "waiting" ? (
              <Button variant="ghost" onClick={() => manageQueue(t.id, "cancelled")}>
                Remove
              </Button>
            ) : null}
          </div>
        </Card>
      ))}
    </div>
  );
}
