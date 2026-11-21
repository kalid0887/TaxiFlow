"use client";

import { Button, Card, StatusPill } from "@/components/ui";
import { money } from "@/lib/pricing";
import { useCurrentUser, useStore } from "@/lib/store";

export default function RequestsPage() {
  const { state, respondBooking } = useStore();
  const user = useCurrentUser();
  const requests = state.bookings.filter((b) => b.driverId === user?.id && b.status === "pending");
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Incoming reservations</h1>
      {requests.length === 0 ? <p className="text-sm text-[var(--muted)]">No pending requests.</p> : null}
      {requests.map((b) => {
        const passenger = state.users.find((u) => u.id === b.passengerId);
        const origin = state.stations.find((s) => s.id === b.originStationId);
        const dest = state.stations.find((s) => s.id === b.destStationId);
        return (
          <Card key={b.id} className="space-y-3">
            <div className="flex justify-between gap-2">
              <p className="font-semibold">{passenger?.name} · {b.seats} seat(s)</p>
              <StatusPill status={b.status} />
            </div>
            <p className="text-sm">
              {origin?.name} → {dest?.name}
            </p>
            {b.type === "empty_pickup" ? (
              <p className="rounded-xl bg-amber-50 p-3 text-sm">
                Empty pickup: travel about {b.emptyDistanceKm} km without passengers to {origin?.name}. Extra charge{" "}
                {money(b.emptyPickupCharge, state.pricing.currency)}. You may accept or reject.
              </p>
            ) : null}
            <p className="text-sm text-[var(--muted)]">Passenger agreed to {money(b.total, state.pricing.currency)}.</p>
            <div className="flex gap-2">
              <Button onClick={() => respondBooking(b.id, true)}>Accept</Button>
              <Button variant="danger" onClick={() => respondBooking(b.id, false)}>
                Reject
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
