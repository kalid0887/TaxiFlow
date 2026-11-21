"use client";

import { useState } from "react";
import { Button, Card, ErrorText, Field, StatusPill, SuccessText, inputClass } from "@/components/ui";
import { useCurrentUser, useStore } from "@/lib/store";
import type { DeliveryRequest } from "@/lib/types";

export default function DeliveriesPage() {
  const { state, submitDelivery } = useStore();
  const user = useCurrentUser();
  const [form, setForm] = useState<Omit<DeliveryRequest, "id" | "status" | "createdAt" | "userId">>({
    kind: "document",
    pickup: "",
    dropoff: "",
    notes: "",
    scheduledFor: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const mine = state.deliveries.filter((d) => d.userId === user?.id);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4">
        <h1 className="text-3xl">Delivery request</h1>
        <p className="text-sm text-[var(--muted)]">
          Deliveries are kept separate from passenger seat bookings. Do not send cash, hazardous goods, or unverified parcels.
        </p>
        <Field label="Type">
          <select className={inputClass} value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as DeliveryRequest["kind"] })}>
            <option value="document">Document</option>
            <option value="small_package">Small package</option>
            <option value="shop_to_customer">Shop to customer</option>
            <option value="business_to_customer">Business to customer</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </Field>
        <Field label="Pickup">
          <input className={inputClass} value={form.pickup} onChange={(e) => setForm({ ...form, pickup: e.target.value })} />
        </Field>
        <Field label="Drop-off">
          <input className={inputClass} value={form.dropoff} onChange={(e) => setForm({ ...form, dropoff: e.target.value })} />
        </Field>
        <Field label="Notes / handling">
          <textarea className={inputClass} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </Field>
        <ErrorText message={error} />
        <SuccessText message={ok} />
        <Button
          onClick={() => {
            const msg = submitDelivery(form);
            setError(msg);
            setOk(msg ? null : "Delivery request recorded. Assignment is demo-only.");
          }}
        >
          Submit delivery
        </Button>
      </Card>
      <div className="space-y-3">
        {mine.map((d) => (
          <Card key={d.id}>
            <div className="flex justify-between">
              <p className="font-semibold capitalize">{d.kind.replaceAll("_", " ")}</p>
              <StatusPill status={d.status} />
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {d.pickup} → {d.dropoff}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
