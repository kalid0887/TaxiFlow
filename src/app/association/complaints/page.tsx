"use client";

import { useState } from "react";
import { Button, Card, Field, StatusPill, inputClass } from "@/components/ui";
import { useCurrentUser, useStore } from "@/lib/store";

export default function AssocComplaintsPage() {
  const { state, reviewComplaint } = useStore();
  const user = useCurrentUser();
  const items = state.complaints.filter((c) => c.associationId === user?.associationId);
  const [notes, setNotes] = useState<Record<string, string>>({});
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Complaints</h1>
      {items.map((c) => (
        <Card key={c.id} className="space-y-3">
          <div className="flex justify-between">
            <p className="font-semibold capitalize">{c.category.replace("_", " ")}</p>
            <StatusPill status={c.status} />
          </div>
          <p className="text-sm">{c.details}</p>
          <p className="text-xs text-[var(--muted)]">
            {state.users.find((u) => u.id === c.passengerId)?.name} about{" "}
            {state.users.find((u) => u.id === c.driverId)?.name}
          </p>
          <Field label="Note">
            <input className={inputClass} value={notes[c.id] ?? c.adminNote ?? ""} onChange={(e) => setNotes((n) => ({ ...n, [c.id]: e.target.value }))} />
          </Field>
          <div className="flex gap-2">
            <Button onClick={() => reviewComplaint(c.id, "reviewing", notes[c.id] ?? "")}>Reviewing</Button>
            <Button variant="secondary" onClick={() => reviewComplaint(c.id, "resolved", notes[c.id] ?? "")}>
              Resolve
            </Button>
            <Button variant="ghost" onClick={() => reviewComplaint(c.id, "dismissed", notes[c.id] ?? "")}>
              Dismiss
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
