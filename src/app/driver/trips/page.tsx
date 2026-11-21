"use client";

import { Button, Card, StatusPill } from "@/components/ui";
import { useCurrentUser, useStore } from "@/lib/store";

export default function TripsPage() {
  const { state, completeBooking } = useStore();
  const user = useCurrentUser();
  const trips = state.bookings.filter((b) => b.driverId === user?.id);
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Manage trips</h1>
      {trips.map((b) => (
        <Card key={b.id} className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold">{state.routes.find((r) => r.id === b.routeId)?.name}</p>
            <p className="text-sm text-[var(--muted)]">{b.seats} seats · {new Date(b.departureTime).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill status={b.status} />
            {b.status === "confirmed" ? <Button onClick={() => completeBooking(b.id)}>Mark completed</Button> : null}
          </div>
        </Card>
      ))}
    </div>
  );
}
