"use client";

import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { CityMap } from "@/components/city-map";
import { Button, Card, StatusPill } from "@/components/ui";
import { useCurrentUser, useStore } from "@/lib/store";

export default function PassengerHome() {
  const { state, markRead } = useStore();
  const user = useCurrentUser();
  const mine = state.bookings.filter((b) => b.passengerId === user?.id);
  const notes = state.notifications.filter((n) => n.userId === user?.id).slice(0, 5);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-[var(--muted)]">Welcome back</p>
          <h1 className="text-4xl">{user?.name}</h1>
          <p className="mt-2 max-w-xl text-[var(--muted)]">
            Search a route, reserve seats, or request an empty pickup if no taxi is at your station.
          </p>
          <div className="mt-4">
            <Button href="/passenger/search">Search transportation</Button>
          </div>
        </div>
        <CityMap stations={state.stations} vehicles={state.vehicles} />
        <section>
          <h2 className="mb-3 text-2xl">My reservations</h2>
          <div className="space-y-3">
            {mine.filter((b) => b.status === "pending" || b.status === "confirmed").map((b) => {
              const route = state.routes.find((r) => r.id === b.routeId);
              return (
                <Card key={b.id} className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{route?.name}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {b.seats} seat(s) · {b.type.replace("_", " ")}
                    </p>
                  </div>
                  <StatusPill status={b.status} />
                </Card>
              );
            })}
            {mine.filter((b) => b.status === "pending" || b.status === "confirmed").length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No active reservations. Search a taxi to get started.</p>
            ) : null}
          </div>
        </section>
      </div>
      <div className="space-y-6">
        <AdSlot placement="passenger_home" />
        <Card>
          <h2 className="text-lg font-semibold">Notifications</h2>
          <ul className="mt-3 space-y-3">
            {notes.map((n) => (
              <li key={n.id}>
                <button className="text-left text-sm" onClick={() => markRead(n.id)}>
                  <span className="font-medium">{n.title}</span>
                  <span className="mt-0.5 block text-[var(--muted)]">{n.body}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
        <Link className="text-sm underline" href="/passenger/complaints">
          Report a problem
        </Link>
      </div>
    </div>
  );
}
