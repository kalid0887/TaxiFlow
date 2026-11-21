"use client";

import Link from "next/link";
import { CityMap } from "@/components/city-map";
import { Button, Card, IconBus } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const { state } = useStore();
  return (
    <div>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <IconBus className="h-8 w-8" />
          <span className="font-[family-name:var(--font-display)] text-2xl">TaxiFlow</span>
        </div>
        <div className="flex gap-2">
          <Button href="/login" variant="ghost">
            Sign in
          </Button>
          <Button href="/register" variant="secondary">
            Create account
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-6 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted)]">
            Shared taxi, organized
          </p>
          <h1 className="mt-3 text-5xl leading-[1.05] md:text-6xl">
            Connecting People. Organizing Transportation. Moving Communities.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-[var(--muted)]">
            TaxiFlow works with the 14–19 seat shared taxis already running your city’s
            routes. Passengers reserve seats. Drivers fill outbound and return trips.
            Associations keep station queues honest.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/register">Ride as a passenger</Button>
            <Button href="/login" variant="secondary">
              Driver / association login
            </Button>
          </div>
        </div>
        <CityMap stations={state.stations} vehicles={state.vehicles} />
      </section>

      <section className="border-y border-[var(--line)] bg-white py-14">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 md:grid-cols-3">
          {[
            {
              title: "Reserve a seat",
              body: "Search a route, see remaining seats, and wait for the driver to accept. Nothing is confirmed until they do.",
            },
            {
              title: "Empty pickup, priced clearly",
              body: "If a taxi must travel empty to reach you, the extra charge is shown separately from the regular fare before you agree.",
            },
            {
              title: "Return trips that pay",
              body: "After arriving in Working Area B, drivers see who is waiting to go back to Residential Area A.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <h2 className="text-2xl">{item.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl">Demo accounts</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Password for every demo user: <code>demo1234</code>. Data lives in this browser only.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            ["Passenger", "passenger@taxiflow.demo"],
            ["Driver", "driver@taxiflow.demo"],
            ["Association", "association@taxiflow.demo"],
            ["System admin", "admin@taxiflow.demo"],
          ].map(([role, email]) => (
            <Card key={email}>
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{role}</p>
              <p className="mt-2 text-sm font-medium">{email}</p>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-sm text-[var(--muted)]">
          SMS, USSD, live GPS, and card payments are prepared as settings only — they are not
          connected to a telecom or payment provider.
        </p>
        <p className="mt-6 text-sm">
          <Link href="/login" className="underline">
            Sign in to start
          </Link>
        </p>
      </section>
    </div>
  );
}
