"use client";

import { Stat } from "@/components/ui";
import { useCurrentUser, useStore } from "@/lib/store";

export default function AssociationHome() {
  const { state } = useStore();
  const user = useCurrentUser();
  const id = user?.associationId;
  const drivers = state.users.filter((u) => u.role === "driver" && u.associationId === id);
  const vehicles = state.vehicles.filter((v) => v.associationId === id);
  const bookings = state.bookings.filter((b) => vehicles.some((v) => v.id === b.vehicleId));
  const complaints = state.complaints.filter((c) => c.associationId === id && c.status === "open");
  return (
    <div className="space-y-6">
      <h1 className="text-4xl">{state.associations.find((a) => a.id === id)?.name}</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Registered drivers" value={drivers.length} />
        <Stat label="Vehicles" value={vehicles.length} />
        <Stat label="Active taxis" value={vehicles.filter((v) => v.available).length} />
        <Stat label="Open complaints" value={complaints.length} />
        <Stat label="Reservations" value={bookings.length} />
        <Stat label="Completed trips" value={bookings.filter((b) => b.status === "completed").length} />
        <Stat label="Passengers on platform" value={state.users.filter((u) => u.role === "passenger").length} />
      </div>
    </div>
  );
}
