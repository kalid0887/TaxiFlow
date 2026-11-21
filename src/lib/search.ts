import { remainingSeats } from "./pricing";
import type { AppState, BookingType, Route, Vehicle } from "./types";

export function matchingTaxis(
  state: AppState,
  originStationId: string,
  destStationId: string,
) {
  const routes = state.routes.filter(
    (r) => r.originStationId === originStationId && r.destStationId === destStationId,
  );
  const matches: { vehicle: Vehicle; route: Route }[] = [];
  for (const route of routes) {
    for (const vehicle of state.vehicles) {
      if (!vehicle.operatingRouteIds.includes(route.id)) continue;
      if (!vehicle.available) continue;
      matches.push({ vehicle, route });
    }
  }
  return matches;
}

export function canOfferEmptyPickup(
  vehicle: Vehicle,
  originStationId: string,
  type: BookingType,
) {
  if (type !== "empty_pickup") return vehicle.currentStationId === originStationId || remainingSeats(vehicle) > 0;
  return vehicle.currentStationId !== originStationId;
}

export function returnDemand(state: AppState, destStationId: string, originStationId: string) {
  const waiting = state.queue.filter(
    (q) => q.stationId === destStationId && q.destinationStationId === originStationId && q.status === "waiting",
  );
  const pending = state.bookings.filter(
    (b) =>
      b.originStationId === destStationId &&
      b.destStationId === originStationId &&
      (b.status === "pending" || b.status === "confirmed"),
  );
  return { waiting, pending };
}
