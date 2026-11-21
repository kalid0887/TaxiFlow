"use client";

import type { Station, Vehicle } from "@/lib/types";

export function CityMap({
  stations,
  vehicles,
  highlightIds = [],
}: {
  stations: Station[];
  vehicles: Vehicle[];
  highlightIds?: string[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[#dfece6]">
      <svg viewBox="0 0 100 100" className="h-64 w-full md:h-80" role="img" aria-label="City station map">
        <path d="M8 40 C30 32, 50 55, 92 38" stroke="#9bb8ad" strokeWidth="3.5" fill="none" />
        <path d="M20 12 C28 40, 40 50, 55 92" stroke="#c9d9c4" strokeWidth="6" fill="none" />
        <path d="M5 70 H95" stroke="#b7c9b8" strokeWidth="2.2" fill="none" />
        {stations.map((s) => {
          const hot = highlightIds.includes(s.id);
          const parked = vehicles.filter((v) => v.currentStationId === s.id && v.available);
          return (
            <g key={s.id}>
              <circle cx={s.x} cy={s.y} r={hot ? 5.2 : 3.6} fill={hot ? "#f5b400" : "#0f3d3e"} />
              <text x={s.x + 4.5} y={s.y - 3} fontSize="3.2" fill="#1a1a18">
                {s.name}
              </text>
              {parked.length > 0 ? (
                <text x={s.x + 4.5} y={s.y + 2.2} fontSize="2.6" fill="#3b5348">
                  {parked.length} taxi{parked.length === 1 ? "" : "s"}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      <p className="border-t border-[var(--line)] bg-white px-4 py-2 text-xs text-[var(--muted)]">
        Schematic station map for demo routing — not live GPS. Live maps would need a map provider key.
      </p>
    </div>
  );
}
