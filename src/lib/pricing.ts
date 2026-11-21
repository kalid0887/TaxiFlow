import type { PricingSettings, Route, Station, Vehicle } from "./types";

export function stationById(stations: Station[], id: string) {
  return stations.find((s) => s.id === id);
}

export function distanceBetween(a: Station, b: Station) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.round(Math.sqrt(dx * dx + dy * dy) * 0.32);
}

export function emptyPickupCharge(
  emptyKm: number,
  pricing: PricingSettings,
) {
  return Math.max(pricing.minEmptyCharge, Math.round(emptyKm * pricing.emptyPickupPerKm));
}

export function quoteShared(route: Route, seats: number, pricing: PricingSettings) {
  const baseFare = route.baseFare * seats;
  const serviceFee = Math.round(baseFare * (pricing.serviceFeePercent / 100));
  return {
    baseFare,
    emptyPickupCharge: 0,
    emptyDistanceKm: 0,
    serviceFee,
    total: baseFare + serviceFee,
  };
}

export function quoteEmptyPickup(
  route: Route,
  seats: number,
  vehicle: Vehicle,
  stations: Station[],
  pickupStationId: string,
  pricing: PricingSettings,
) {
  const current = stationById(stations, vehicle.currentStationId);
  const pickup = stationById(stations, pickupStationId);
  const emptyDistanceKm =
    current && pickup ? Math.max(1, distanceBetween(current, pickup)) : route.distanceKm;
  const extra = emptyPickupCharge(emptyDistanceKm, pricing);
  const baseFare = route.baseFare * seats;
  const serviceFee = Math.round((baseFare + extra) * (pricing.serviceFeePercent / 100));
  return {
    baseFare,
    emptyPickupCharge: extra,
    emptyDistanceKm,
    serviceFee,
    total: baseFare + extra + serviceFee,
  };
}

export function remainingSeats(vehicle: Vehicle) {
  return Math.max(0, vehicle.capacity - vehicle.reservedSeats);
}

export function money(amount: number, currency = "ETB") {
  return `${currency} ${amount.toFixed(0)}`;
}
