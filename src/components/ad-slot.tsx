"use client";

import { useStore } from "@/lib/store";
import type { Advertisement } from "@/lib/types";

export function AdSlot({ placement }: { placement: Advertisement["placement"] }) {
  const { state } = useStore();
  const today = new Date().toISOString().slice(0, 10);
  const ads = state.ads.filter(
    (a) => a.active && a.placement === placement && a.startDate <= today && a.endDate >= today,
  );
  if (ads.length === 0) return null;
  return (
    <aside className="space-y-3" aria-label="Advertisements">
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.link}
          target="_blank"
          rel="noreferrer"
          className="block rounded-2xl border border-dashed border-[var(--line)] bg-[var(--mist)] p-4 hover:border-[var(--amber)]"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Advertisement</p>
          <p className="mt-1 font-semibold">{ad.title}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">{ad.description}</p>
        </a>
      ))}
    </aside>
  );
}
