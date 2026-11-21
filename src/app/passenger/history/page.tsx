"use client";

import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { Button, Card, StatusPill } from "@/components/ui";
import { money } from "@/lib/pricing";
import { useCurrentUser, useStore } from "@/lib/store";

export default function HistoryPage() {
  const { state } = useStore();
  const user = useCurrentUser();
  const mine = state.bookings.filter((b) => b.passengerId === user?.id);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <div className="space-y-4">
        <h1 className="text-4xl">Booking history</h1>
        {mine.map((b) => {
          const route = state.routes.find((r) => r.id === b.routeId);
          const rated = state.ratings.some((r) => r.bookingId === b.id);
          return (
            <Card key={b.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{route?.name}</p>
                <p className="text-sm text-[var(--muted)]">
                  {new Date(b.createdAt).toLocaleString()} · {money(b.total, state.pricing.currency)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status={b.status} />
                {b.status === "completed" && !rated ? (
                  <Button href={`/passenger/rate/${b.id}`}>Rate driver</Button>
                ) : null}
                {b.status === "completed" && rated ? <span className="text-sm text-[var(--muted)]">Rated</span> : null}
              </div>
            </Card>
          );
        })}
      </div>
      <div>
        <AdSlot placement="history" />
        <Link className="mt-4 block text-sm underline" href="/passenger/complaints">
          File a complaint
        </Link>
      </div>
    </div>
  );
}
