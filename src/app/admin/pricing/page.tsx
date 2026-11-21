"use client";

import { useState } from "react";
import { Button, Card, Field, SuccessText, inputClass } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function PricingPage() {
  const { state, updatePricing } = useStore();
  const [form, setForm] = useState(state.pricing);
  const [ok, setOk] = useState<string | null>(null);
  return (
    <Card className="max-w-xl space-y-4">
      <h1 className="text-3xl">Platform pricing</h1>
      <p className="text-sm text-[var(--muted)]">Only the system administrator can change these rules. They apply to new quotes immediately.</p>
      <Field label="Currency code">
        <input className={inputClass} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
      </Field>
      <Field label="Empty pickup per km">
        <input className={inputClass} type="number" value={form.emptyPickupPerKm} onChange={(e) => setForm({ ...form, emptyPickupPerKm: Number(e.target.value) })} />
      </Field>
      <Field label="Minimum empty charge">
        <input className={inputClass} type="number" value={form.minEmptyCharge} onChange={(e) => setForm({ ...form, minEmptyCharge: Number(e.target.value) })} />
      </Field>
      <Field label="Service fee %">
        <input className={inputClass} type="number" value={form.serviceFeePercent} onChange={(e) => setForm({ ...form, serviceFeePercent: Number(e.target.value) })} />
      </Field>
      <Field label="Cancellation window (minutes)">
        <input className={inputClass} type="number" value={form.cancellationWindowMinutes} onChange={(e) => setForm({ ...form, cancellationWindowMinutes: Number(e.target.value) })} />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.priorityBoardingEnabled}
          onChange={(e) => setForm({ ...form, priorityBoardingEnabled: e.target.checked })}
        />
        Priority boarding for elderly, pregnant, and disabled passengers
      </label>
      <SuccessText message={ok} />
      <Button
        onClick={() => {
          updatePricing(form);
          setOk("Pricing saved for this browser demo.");
        }}
      >
        Save pricing
      </Button>
    </Card>
  );
}
