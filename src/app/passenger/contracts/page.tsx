"use client";

import { useState } from "react";
import { Button, Card, ErrorText, Field, StatusPill, SuccessText, inputClass } from "@/components/ui";
import { useCurrentUser, useStore } from "@/lib/store";
import type { ContractRequest } from "@/lib/types";

export default function ContractsPage() {
  const { state, submitContract } = useStore();
  const user = useCurrentUser();
  const [form, setForm] = useState<Omit<ContractRequest, "id" | "status" | "createdAt" | "userId">>({
    organization: "",
    kind: "school",
    origin: "",
    destination: "",
    schedule: "",
    passengers: 10,
  });
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const mine = state.contracts.filter((c) => c.userId === user?.id);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4">
        <h1 className="text-3xl">Contract transportation</h1>
        <p className="text-sm text-[var(--muted)]">For families, schools, companies, and events. An administrator replies in-app.</p>
        <Field label="Organization">
          <input className={inputClass} value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
        </Field>
        <Field label="Type">
          <select className={inputClass} value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as ContractRequest["kind"] })}>
            {["family", "school", "university", "company", "organization", "event"].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </Field>
        <Field label="Origin">
          <input className={inputClass} value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
        </Field>
        <Field label="Destination">
          <input className={inputClass} value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
        </Field>
        <Field label="Schedule">
          <input className={inputClass} value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} />
        </Field>
        <Field label="Passengers">
          <input className={inputClass} type="number" min={1} value={form.passengers} onChange={(e) => setForm({ ...form, passengers: Number(e.target.value) })} />
        </Field>
        <ErrorText message={error} />
        <SuccessText message={ok} />
        <Button
          onClick={() => {
            const msg = submitContract(form);
            setError(msg);
            setOk(msg ? null : "Request submitted for review.");
          }}
        >
          Submit request
        </Button>
      </Card>
      <div className="space-y-3">
        {mine.map((c) => (
          <Card key={c.id}>
            <div className="flex justify-between">
              <p className="font-semibold">{c.organization}</p>
              <StatusPill status={c.status} />
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {c.origin} → {c.destination} · {c.schedule}
            </p>
            {c.response ? <p className="mt-2 text-sm">{c.response}</p> : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
