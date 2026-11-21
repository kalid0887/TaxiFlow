"use client";

import { useState } from "react";
import { Button, Card, Field, StatusPill, inputClass } from "@/components/ui";
import { useStore } from "@/lib/store";
import type { Advertisement } from "@/lib/types";

export default function AdsPage() {
  const { state, upsertAd } = useStore();
  const [form, setForm] = useState<Omit<Advertisement, "id">>({
    title: "",
    description: "",
    imageLabel: "Promo",
    link: "https://example.com",
    placement: "passenger_home",
    active: true,
    startDate: "2026-11-21",
    endDate: "2026-12-31",
  });
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4">
        <h1 className="text-3xl">Advertisements</h1>
        <Field label="Title">
          <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Description">
          <textarea className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field label="Link">
          <input className={inputClass} value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
        </Field>
        <Field label="Placement">
          <select className={inputClass} value={form.placement} onChange={(e) => setForm({ ...form, placement: e.target.value as Advertisement["placement"] })}>
            <option value="passenger_home">Passenger home</option>
            <option value="search_results">Search results</option>
            <option value="history">History</option>
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start">
            <input className={inputClass} type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </Field>
          <Field label="End">
            <input className={inputClass} type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Active
        </label>
        <Button
          onClick={() => {
            if (!form.title || !form.description) return;
            upsertAd(form);
          }}
        >
          Publish ad
        </Button>
      </Card>
      <div className="space-y-3">
        {state.ads.map((ad) => (
          <Card key={ad.id} className="space-y-2">
            <div className="flex justify-between">
              <p className="font-semibold">{ad.title}</p>
              <StatusPill status={ad.active ? "active" : "offline"} />
            </div>
            <p className="text-sm text-[var(--muted)]">{ad.description}</p>
            <p className="text-xs">
              {ad.placement} · {ad.startDate} to {ad.endDate}
            </p>
            <Button variant="ghost" onClick={() => upsertAd({ ...ad, active: !ad.active })}>
              {ad.active ? "Deactivate" : "Activate"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
