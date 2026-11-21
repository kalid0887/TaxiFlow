"use client";

import { Card, StatusPill } from "@/components/ui";
import { returnDemand } from "@/lib/search";
import { useCurrentUser, useStore } from "@/lib/store";

export default function ReturnPage() {
  const { state } = useStore();
  const user = useCurrentUser();
  const vehicle = state.vehicles.find((v) => v.driverId === user?.id);
  const route = state.routes.find((r) => vehicle?.operatingRouteIds.includes(r.id) && r.originStationId === vehicle?.currentStationId);
  const opposite = state.routes.find(
    (r) => r.originStationId === route?.destStationId && r.destStationId === route?.originStationId,
  );
  const here = vehicle?.currentStationId ?? "st-work";
  const backTo = opposite?.destStationId ?? "st-green";
  const demand = returnDemand(state, here, backTo);
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Return-trip coordination</h1>
      <p className="max-w-2xl text-sm text-[var(--muted)]">
        This is not empty pickup. After you arrive, these passengers want seats back toward{" "}
        {state.stations.find((s) => s.id === backTo)?.name}. Accept requests from Incoming reservations.
      </p>
      <Card>
        <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Queue demand at your station</p>
        <p className="mt-1 text-3xl">{demand.waiting.reduce((n, q) => n + q.seats, 0)} seats waiting</p>
      </Card>
      {demand.pending.map((b) => (
        <Card key={b.id} className="flex justify-between">
          <p>
            {state.users.find((u) => u.id === b.passengerId)?.name} · {b.seats} seats to{" "}
            {state.stations.find((s) => s.id === b.destStationId)?.name}
          </p>
          <StatusPill status={b.status} />
        </Card>
      ))}
      {demand.waiting.map((q) => (
        <Card key={q.id}>
          <p>
            Queue #{q.position} {state.users.find((u) => u.id === q.passengerId)?.name} · {q.seats} seats
          </p>
        </Card>
      ))}
    </div>
  );
}
