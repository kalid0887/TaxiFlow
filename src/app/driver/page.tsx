"use client";

import { Button, Card, Stat, StatusPill } from "@/components/ui";
import { remainingSeats } from "@/lib/pricing";
import { useCurrentUser, useStore } from "@/lib/store";

export default function DriverHome() {
  const { state, setDriverAvailability } = useStore();
  const user = useCurrentUser();
  const vehicle = state.vehicles.find((v) => v.driverId === user?.id);
  const incoming = state.bookings.filter((b) => b.driverId === user?.id && b.status === "pending");
  const trips = state.bookings.filter((b) => b.driverId === user?.id && b.status === "confirmed");
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">{user?.name}</h1>
          <p className="text-[var(--muted)]">{vehicle?.plate} · {vehicle?.model}</p>
        </div>
        <Button variant={vehicle?.available ? "ghost" : "secondary"} onClick={() => setDriverAvailability(!vehicle?.available)}>
          {vehicle?.available ? "Set unavailable" : "Set available"}
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Capacity" value={vehicle?.capacity ?? 0} />
        <Stat label="Reserved" value={vehicle?.reservedSeats ?? 0} />
        <Stat label="Open seats" value={vehicle ? remainingSeats(vehicle) : 0} />
        <Stat label="Pending requests" value={incoming.length} />
      </div>
      <Card>
        <p className="text-sm text-[var(--muted)]">Current station</p>
        <p className="text-xl font-semibold">
          {state.stations.find((s) => s.id === vehicle?.currentStationId)?.name ?? "No vehicle yet"}
        </p>
        {vehicle ? <StatusPill status={vehicle.status} /> : <p className="mt-2 text-sm">Ask your association to register a vehicle against your account.</p>}
      </Card>
      <div className="flex gap-3">
        <Button href="/driver/requests">Review {incoming.length} request(s)</Button>
        <Button href="/driver/return" variant="secondary">
          Return-trip demand
        </Button>
        <Button href="/driver/trips" variant="ghost">
          {trips.length} active trip(s)
        </Button>
      </div>
    </div>
  );
}
