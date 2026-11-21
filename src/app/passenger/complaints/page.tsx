"use client";

import { useState } from "react";
import { Button, Card, ErrorText, Field, StatusPill, SuccessText, inputClass } from "@/components/ui";
import { useCurrentUser, useStore } from "@/lib/store";
import type { ComplaintCategory } from "@/lib/types";

export default function ComplaintsPage() {
  const { state, fileComplaint } = useStore();
  const user = useCurrentUser();
  const [category, setCategory] = useState<ComplaintCategory>("overcharging");
  const [driverId, setDriverId] = useState(state.users.find((u) => u.role === "driver")?.id ?? "");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const mine = state.complaints.filter((c) => c.passengerId === user?.id);
  const drivers = state.users.filter((u) => u.role === "driver");
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4">
        <h1 className="text-3xl">Report a problem</h1>
        <Field label="Category">
          <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as ComplaintCategory)}>
            <option value="overcharging">Overcharging</option>
            <option value="unsafe_driving">Unsafe driving</option>
            <option value="disrespect">Disrespectful behavior</option>
            <option value="discrimination">Discrimination</option>
            <option value="lost_property">Lost property</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Driver">
          <select className={inputClass} value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="What happened">
          <textarea className={inputClass} rows={4} value={details} onChange={(e) => setDetails(e.target.value)} />
        </Field>
        <ErrorText message={error} />
        <SuccessText message={ok} />
        <Button
          onClick={() => {
            const msg = fileComplaint({ category, details, driverId });
            setError(msg);
            setOk(msg ? null : "Report submitted. Association admins will review it.");
          }}
        >
          Submit report
        </Button>
      </Card>
      <div className="space-y-3">
        <h2 className="text-2xl">Your reports</h2>
        {mine.map((c) => (
          <Card key={c.id}>
            <div className="flex justify-between">
              <p className="font-medium capitalize">{c.category.replace("_", " ")}</p>
              <StatusPill status={c.status} />
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">{c.details}</p>
            {c.adminNote ? <p className="mt-2 text-sm">Admin note: {c.adminNote}</p> : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
