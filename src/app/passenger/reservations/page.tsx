"use client";

import { Button, Card, ErrorText, StatusPill } from "@/components/ui";
import { money } from "@/lib/pricing";
import { useCurrentUser, useStore } from "@/lib/store";
import { useState } from "react";

export default function ReservationsPage() {
  const { state, cancelBooking } = useStore();
  const user = useCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const mine = state.bookings.filter((b) => b.passengerId === user?.id && b.status !== "completed");
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Reservations</h1>
      <p className="text-sm text-[var(--muted)]">
        Pending means the driver has not accepted yet. Confirmed means a seat is held for you.
      </p>
      <ErrorText message={error} />
      {mine.map((b) => {
        const route = state.routes.find((r) => r.id === b.routeId);
        const vehicle = state.vehicles.find((v) => v.id === b.vehicleId);
        return (
          <Card key={b.id} className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{route?.name}</p>
              <StatusPill status={b.status} />
            </div>
            <p className="text-sm text-[var(--muted)]">
              {vehicle?.plate} · {b.seats} seat(s) · {b.type.replace("_", " ")} · departs{" "}
              {new Date(b.departureTime).toLocaleString()}
            </p>
            <p className="text-sm">
              Fare {money(b.baseFare, state.pricing.currency)} + empty pickup{" "}
              {money(b.emptyPickupCharge, state.pricing.currency)} + fee{" "}
              {money(b.serviceFee, state.pricing.currency)} ={" "}
              <strong>{money(b.total, state.pricing.currency)}</strong>
            </p>
            {(b.status === "pending" || b.status === "confirmed") && (
              <Button
                variant="danger"
                onClick={() => {
                  const msg = cancelBooking(b.id);
                  setError(msg);
                }}
              >
                Cancel reservation
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
}
