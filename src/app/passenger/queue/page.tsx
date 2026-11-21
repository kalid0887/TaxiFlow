"use client";

import { useState } from "react";
import { Button, Card, ErrorText, Field, StatusPill, inputClass } from "@/components/ui";
import { useCurrentUser, useStore } from "@/lib/store";
import type { QueuePriority } from "@/lib/types";

export default function QueuePage() {
  const { state, joinQueue } = useStore();
  const user = useCurrentUser();
  const [stationId, setStation] = useState("st-green");
  const [destinationStationId, setDest] = useState("st-work");
  const [seats, setSeats] = useState(1);
  const [priority, setPriority] = useState<QueuePriority>(user?.assistanceNeeds ?? "standard");
  const [error, setError] = useState<string | null>(null);
  const tickets = state.queue
    .filter((q) => q.stationId === stationId && q.status === "waiting")
    .sort((a, b) => {
      const rank = (p: QueuePriority) =>
        state.pricing.priorityBoardingEnabled && p !== "standard" ? 0 : 1;
      return rank(a.priority) - rank(b.priority) || a.position - b.position;
    });
  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Station queue</h1>
      <Card className="grid gap-4 md:grid-cols-2">
        <Field label="Station">
          <select className={inputClass} value={stationId} onChange={(e) => setStation(e.target.value)}>
            {state.stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Going to">
          <select className={inputClass} value={destinationStationId} onChange={(e) => setDest(e.target.value)}>
            {state.stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Seats">
          <input className={inputClass} type="number" min={1} value={seats} onChange={(e) => setSeats(Number(e.target.value))} />
        </Field>
        <Field label="Assistance">
          <select className={inputClass} value={priority} onChange={(e) => setPriority(e.target.value as QueuePriority)}>
            <option value="standard">Standard</option>
            <option value="elderly">Elderly</option>
            <option value="pregnant">Pregnant</option>
            <option value="disability">Disability</option>
            <option value="assistance">Other assistance</option>
          </select>
        </Field>
        <ErrorText message={error} />
        <Button
          onClick={() => {
            const msg = joinQueue({ stationId, destinationStationId, seats, priority });
            setError(msg);
          }}
        >
          Take a queue number
        </Button>
      </Card>
      <div className="space-y-3">
        {tickets.map((t) => {
          const passenger = state.users.find((u) => u.id === t.passengerId);
          return (
            <Card key={t.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold">#{t.position} {passenger?.name}</p>
                <p className="text-sm text-[var(--muted)]">
                  To {state.stations.find((s) => s.id === t.destinationStationId)?.name} · {t.priority}
                </p>
              </div>
              <StatusPill status={t.status} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
