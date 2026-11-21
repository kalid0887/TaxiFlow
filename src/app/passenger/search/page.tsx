"use client";

import { useMemo, useState } from "react";
import { AdSlot } from "@/components/ad-slot";
import { CityMap } from "@/components/city-map";
import { Button, Card, ErrorText, Field, SuccessText, inputClass } from "@/components/ui";
import { money, quoteEmptyPickup, quoteShared, remainingSeats } from "@/lib/pricing";
import { matchingTaxis } from "@/lib/search";
import { useCurrentUser, useStore } from "@/lib/store";
import type { BookingType } from "@/lib/types";

export default function SearchPage() {
  const { state, requestBooking, saveDraft } = useStore();
  const user = useCurrentUser();
  const draft = (state.bookingDrafts[user?.id ?? "guest"] ?? {}) as {
    originStationId?: string;
    destStationId?: string;
    seats?: number;
  };
  const [originStationId, setOrigin] = useState(draft.originStationId ?? "st-green");
  const [destStationId, setDest] = useState(draft.destStationId ?? "st-work");
  const [seats, setSeats] = useState(draft.seats ?? 1);
  const [departureTime, setDeparture] = useState("2026-11-21T17:00");
  const [type, setType] = useState<BookingType>("shared");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});

  const results = useMemo(
    () => matchingTaxis(state, originStationId, destStationId),
    [state, originStationId, destStationId],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <div className="space-y-6">
        <h1 className="text-4xl">Find a taxi</h1>
        <Card className="grid gap-4 md:grid-cols-2">
          <Field label="Pickup station">
            <select className={inputClass} value={originStationId} onChange={(e) => setOrigin(e.target.value)}>
              {state.stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.area})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Destination">
            <select className={inputClass} value={destStationId} onChange={(e) => setDest(e.target.value)}>
              {state.stations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.area})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Seats">
            <input
              className={inputClass}
              type="number"
              min={1}
              max={19}
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
            />
          </Field>
          <Field label="Preferred departure">
            <input className={inputClass} type="datetime-local" value={departureTime} onChange={(e) => setDeparture(e.target.value)} />
          </Field>
          <Field label="Service type">
            <select className={inputClass} value={type} onChange={(e) => setType(e.target.value as BookingType)}>
              <option value="shared">Shared taxi on route</option>
              <option value="empty_pickup">Empty pickup (taxi comes to me)</option>
            </select>
          </Field>
          <div className="flex items-end">
            <Button
              onClick={() =>
                saveDraft({ originStationId, destStationId, seats, departureTime, type, savedAt: new Date().toISOString() })
              }
            >
              Save draft offline
            </Button>
          </div>
        </Card>
        {type === "empty_pickup" ? (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm">
            Empty pickup is for when no taxi is at your station. You pay the regular seat fare plus a
            separate empty-travel charge. The booking stays pending until the driver accepts.
          </p>
        ) : null}
        <CityMap stations={state.stations} vehicles={state.vehicles} highlightIds={[originStationId, destStationId]} />
        <ErrorText message={error} />
        <SuccessText message={ok} />
        <div className="space-y-4">
          {results.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No association currently lists this origin and destination as a route.</p>
          ) : null}
          {results.map(({ vehicle, route }) => {
            const driver = state.users.find((u) => u.id === vehicle.driverId);
            const left = remainingSeats(vehicle);
            const empty = type === "empty_pickup" && vehicle.currentStationId !== originStationId;
            const quote = empty
              ? quoteEmptyPickup(route, seats, vehicle, state.stations, originStationId, state.pricing)
              : quoteShared(route, seats, state.pricing);
            const disabledShared = type === "shared" && left < seats;
            const needsEmpty = type === "empty_pickup" && vehicle.currentStationId === originStationId;
            return (
              <Card key={vehicle.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{vehicle.plate} · {vehicle.model}</p>
                    <p className="text-sm text-[var(--muted)]">
                      Driver {driver?.name} · {left} of {vehicle.capacity} seats open · now at{" "}
                      {state.stations.find((s) => s.id === vehicle.currentStationId)?.name}
                    </p>
                  </div>
                  <p className="text-sm font-medium">{route.name}</p>
                </div>
                <dl className="mt-4 grid gap-2 text-sm md:grid-cols-3">
                  <div className="rounded-xl bg-[var(--mist)] p-3">
                    <dt className="text-xs text-[var(--muted)]">Transportation fare</dt>
                    <dd className="text-lg font-semibold">{money(quote.baseFare, state.pricing.currency)}</dd>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-3">
                    <dt className="text-xs text-[var(--muted)]">Empty pickup charge</dt>
                    <dd className="text-lg font-semibold">{money(quote.emptyPickupCharge, state.pricing.currency)}</dd>
                    {quote.emptyDistanceKm > 0 ? (
                      <p className="text-xs text-[var(--muted)]">{quote.emptyDistanceKm} km empty travel</p>
                    ) : (
                      <p className="text-xs text-[var(--muted)]">No empty travel</p>
                    )}
                  </div>
                  <div className="rounded-xl bg-[var(--ink)] p-3 text-[var(--cream)]">
                    <dt className="text-xs text-white/70">Total (incl. {state.pricing.serviceFeePercent}% fee)</dt>
                    <dd className="text-lg font-semibold">{money(quote.total, state.pricing.currency)}</dd>
                  </div>
                </dl>
                {needsEmpty ? (
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    This taxi is already at your station. Choose shared taxi instead of empty pickup.
                  </p>
                ) : null}
                <label className="mt-4 flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!accepted[vehicle.id]}
                    onChange={(e) => setAccepted((a) => ({ ...a, [vehicle.id]: e.target.checked }))}
                  />
                  I agree to pay {money(quote.total, state.pricing.currency)}. No card is charged in this demo.
                </label>
                <div className="mt-4">
                  <Button
                    disabled={disabledShared || needsEmpty}
                    onClick={() => {
                      setError(null);
                      setOk(null);
                      const msg = requestBooking({
                        originStationId,
                        destStationId,
                        seats,
                        departureTime: new Date(departureTime).toISOString(),
                        type: empty ? "empty_pickup" : "shared",
                        vehicleId: vehicle.id,
                        priceAccepted: !!accepted[vehicle.id],
                      });
                      if (msg) setError(msg);
                      else setOk("Request sent. It is pending until the driver accepts.");
                    }}
                  >
                    {disabledShared ? "Not enough seats" : "Request reservation"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      <AdSlot placement="search_results" />
    </div>
  );
}
