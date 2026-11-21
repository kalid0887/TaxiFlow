"use client";

import { useState } from "react";
import { Button, Card, Field, StatusPill, inputClass } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function AssocContractsPage() {
  const { state, respondContract, updateDelivery } = useStore();
  const [response, setResponse] = useState<Record<string, string>>({});
  return (
    <div className="space-y-6">
      <h1 className="text-4xl">Contracts and deliveries</h1>
      {state.contracts.map((c) => (
        <Card key={c.id} className="space-y-3">
          <div className="flex justify-between">
            <p className="font-semibold">{c.organization}</p>
            <StatusPill status={c.status} />
          </div>
          <p className="text-sm text-[var(--muted)]">
            {c.origin} → {c.destination} · {c.passengers} passengers · {c.schedule}
          </p>
          <Field label="Response">
            <input className={inputClass} value={response[c.id] ?? c.response ?? ""} onChange={(e) => setResponse((r) => ({ ...r, [c.id]: e.target.value }))} />
          </Field>
          <div className="flex gap-2">
            <Button onClick={() => respondContract(c.id, "offered", response[c.id] ?? "We can cover this route.")}>Offer</Button>
            <Button variant="ghost" onClick={() => respondContract(c.id, "declined", response[c.id] ?? "Cannot cover this schedule.")}>
              Decline
            </Button>
          </div>
        </Card>
      ))}
      {state.deliveries.map((d) => (
        <Card key={d.id} className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold">{d.pickup} → {d.dropoff}</p>
            <p className="text-sm text-[var(--muted)]">{d.kind.replaceAll("_", " ")}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill status={d.status} />
            <Button onClick={() => updateDelivery(d.id, d.status === "submitted" ? "assigned" : "in_transit")}>Advance</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
