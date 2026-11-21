"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedState } from "./demo-data";
import { uid } from "./ids";
import { quoteEmptyPickup, quoteShared, remainingSeats } from "./pricing";
import type {
  Advertisement,
  AppState,
  BookingType,
  ComplaintCategory,
  ContractRequest,
  DeliveryRequest,
  PricingSettings,
  QueuePriority,
  Role,
} from "./types";

const KEY = "taxiflow.state.v1";

function loadState(): AppState {
  if (typeof window === "undefined") return seedState;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedState;
    return { ...seedState, ...JSON.parse(raw) } as AppState;
  } catch {
    return seedState;
  }
}

function persist(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "passenger" | "driver";
};

type SearchInput = {
  originStationId: string;
  destStationId: string;
  seats: number;
  departureTime: string;
  type: BookingType;
};

const StoreContext = createContext<{
  state: AppState;
  resetDemo: () => void;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  register: (input: RegisterInput) => string | null;
  requestBooking: (input: SearchInput & { vehicleId: string; priceAccepted: boolean }) => string | null;
  respondBooking: (bookingId: string, accept: boolean) => string | null;
  cancelBooking: (bookingId: string) => string | null;
  completeBooking: (bookingId: string) => string | null;
  setDriverAvailability: (available: boolean) => void;
  updateVehicle: (patch: { vehicleId?: string; plate?: string; model?: string; capacity?: number; operatingRouteIds?: string[]; currentStationId?: string }) => string | null;
  rateTrip: (bookingId: string, scores: { driving: number; punctuality: number; cleanliness: number; safety: number; service: number; comment: string }) => string | null;
  fileComplaint: (input: { category: ComplaintCategory; details: string; driverId?: string; bookingId?: string }) => string | null;
  reviewComplaint: (id: string, status: "reviewing" | "resolved" | "dismissed", adminNote: string) => void;
  joinQueue: (input: { stationId: string; destinationStationId: string; seats: number; priority: QueuePriority }) => string | null;
  manageQueue: (ticketId: string, status: "boarding" | "departed" | "cancelled") => void;
  upsertAd: (ad: Omit<Advertisement, "id"> & { id?: string }) => void;
  updatePricing: (pricing: PricingSettings) => void;
  submitContract: (input: Omit<ContractRequest, "id" | "status" | "createdAt" | "userId">) => string | null;
  respondContract: (id: string, status: "reviewing" | "offered" | "declined", response: string) => void;
  submitDelivery: (input: Omit<DeliveryRequest, "id" | "status" | "createdAt" | "userId">) => string | null;
  updateDelivery: (id: string, status: DeliveryRequest["status"]) => void;
  markRead: (id: string) => void;
  saveDraft: (draft: Record<string, unknown>) => void;
} | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(seedState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) persist(state);
  }, [state, hydrated]);

  const api = useMemo(() => {
    const notify = (prev: AppState, userId: string, title: string, body: string, href?: string): AppState => ({
      ...prev,
      notifications: [
        {
          id: uid("n"),
          userId,
          title,
          body,
          read: false,
          createdAt: new Date().toISOString(),
          href,
        },
        ...prev.notifications,
      ],
    });

    return {
      resetDemo: () => setState(seedState),
      login: (email: string, password: string) => {
        const user = state.users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
        );
        if (!user) return "Email or password is incorrect.";
        setState((s) => ({ ...s, currentUserId: user.id }));
        return null;
      },
      logout: () => setState((s) => ({ ...s, currentUserId: null })),
      register: (input: RegisterInput) => {
        if (!input.name.trim() || !input.email.trim() || !input.phone.trim()) {
          return "Name, email, and phone are required.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return "Enter a valid email address.";
        if (input.password.length < 8) return "Password must be at least 8 characters.";
        if (state.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
          return "That email is already registered.";
        }
        const id = uid("u");
        setState((s) => ({
          ...s,
          currentUserId: id,
          users: [
            ...s.users,
            {
              id,
              name: input.name.trim(),
              email: input.email.trim(),
              phone: input.phone.trim(),
              password: input.password,
              role: input.role,
              associationId: input.role === "driver" ? "assoc-unity" : undefined,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
        return null;
      },
      requestBooking: (input) => {
        const user = state.users.find((u) => u.id === state.currentUserId);
        if (!user || user.role !== "passenger") return "Log in as a passenger to reserve seats.";
        if (!input.priceAccepted) return "Accept the displayed total price before sending the request.";
        if (input.seats < 1) return "Choose at least one seat.";
        const vehicle = state.vehicles.find((v) => v.id === input.vehicleId);
        if (!vehicle || !vehicle.available) return "That taxi is not available.";
        const route = state.routes.find(
          (r) =>
            r.id ===
            vehicle.operatingRouteIds.find((rid) => {
              const rt = state.routes.find((x) => x.id === rid);
              return rt?.originStationId === input.originStationId && rt?.destStationId === input.destStationId;
            }),
        );
        if (!route) return "This taxi does not operate that route.";
        if (remainingSeats(vehicle) < input.seats) {
          return `Only ${remainingSeats(vehicle)} seats remain on this taxi.`;
        }
        const quote =
          input.type === "empty_pickup"
            ? quoteEmptyPickup(
                route,
                input.seats,
                vehicle,
                state.stations,
                input.originStationId,
                state.pricing,
              )
            : quoteShared(route, input.seats, state.pricing);
        const bookingId = uid("b");
        setState((s) => {
          let next = {
            ...s,
            vehicles: s.vehicles.map((v) =>
              v.id === vehicle.id ? { ...v, reservedSeats: v.reservedSeats + input.seats } : v,
            ),
            bookings: [
              {
                id: bookingId,
                passengerId: user.id,
                vehicleId: vehicle.id,
                driverId: vehicle.driverId,
                routeId: route.id,
                originStationId: input.originStationId,
                destStationId: input.destStationId,
                seats: input.seats,
                status: "pending" as const,
                type: input.type,
                ...quote,
                departureTime: input.departureTime,
                createdAt: new Date().toISOString(),
                priceAccepted: true,
              },
              ...s.bookings,
            ],
          };
          next = notify(
            next,
            vehicle.driverId,
            input.type === "empty_pickup" ? "Empty pickup request" : "New seat request",
            `${user.name} requested ${input.seats} seat(s). Status stays pending until you accept.`,
            "/driver/requests",
          );
          next = notify(
            next,
            user.id,
            "Request sent",
            "Your reservation is pending driver acceptance. No payment is collected in this demo.",
            "/passenger/reservations",
          );
          return next;
        });
        return null;
      },
      respondBooking: (bookingId, accept) => {
        const booking = state.bookings.find((b) => b.id === bookingId);
        if (!booking) return "Booking not found.";
        if (booking.status !== "pending") return "This request was already handled.";
        const driver = state.users.find((u) => u.id === state.currentUserId);
        if (!driver || driver.id !== booking.driverId) return "Only the assigned driver can respond.";
        setState((s) => {
          let next: AppState = {
            ...s,
            bookings: s.bookings.map((b) =>
              b.id === bookingId
                ? {
                    ...b,
                    status: accept ? "confirmed" : "rejected",
                    acceptedAt: accept ? new Date().toISOString() : b.acceptedAt,
                  }
                : b,
            ),
            vehicles: accept
              ? s.vehicles
              : s.vehicles.map((v) =>
                  v.id === booking.vehicleId
                    ? { ...v, reservedSeats: Math.max(0, v.reservedSeats - booking.seats) }
                    : v,
                ),
          };
          next = notify(
            next,
            booking.passengerId,
            accept ? "Reservation confirmed" : "Request declined",
            accept
              ? "The driver accepted. Show this confirmation at the station."
              : "The driver declined. Seats were released. Try another taxi.",
            "/passenger/reservations",
          );
          return next;
        });
        return null;
      },
      cancelBooking: (bookingId) => {
        const booking = state.bookings.find((b) => b.id === bookingId);
        const user = state.users.find((u) => u.id === state.currentUserId);
        if (!booking || !user) return "Booking not found.";
        if (booking.passengerId !== user.id) return "You can only cancel your own reservations.";
        if (booking.status !== "pending" && booking.status !== "confirmed") {
          return "This booking can no longer be cancelled.";
        }
        const minutes =
          (new Date(booking.departureTime).getTime() - Date.now()) / 60000;
        if (booking.status === "confirmed" && minutes < state.pricing.cancellationWindowMinutes) {
          return `Confirmed trips cannot be cancelled within ${state.pricing.cancellationWindowMinutes} minutes of departure.`;
        }
        setState((s) => {
          let next: AppState = {
            ...s,
            bookings: s.bookings.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b)),
            vehicles: s.vehicles.map((v) =>
              v.id === booking.vehicleId
                ? { ...v, reservedSeats: Math.max(0, v.reservedSeats - booking.seats) }
                : v,
            ),
          };
          next = notify(next, booking.driverId, "Passenger cancelled", `${user.name} cancelled a reservation.`, "/driver/requests");
          return next;
        });
        return null;
      },
      completeBooking: (bookingId) => {
        const booking = state.bookings.find((b) => b.id === bookingId);
        if (!booking || booking.driverId !== state.currentUserId) return "Only the driver can complete this trip.";
        if (booking.status !== "confirmed") return "Only confirmed trips can be completed.";
        setState((s) => {
          let next: AppState = {
            ...s,
            bookings: s.bookings.map((b) =>
              b.id === bookingId
                ? { ...b, status: "completed", completedAt: new Date().toISOString() }
                : b,
            ),
            vehicles: s.vehicles.map((v) =>
              v.id === booking.vehicleId
                ? {
                    ...v,
                    reservedSeats: Math.max(0, v.reservedSeats - booking.seats),
                    currentStationId: booking.destStationId,
                    status: "idle",
                  }
                : v,
            ),
          };
          next = notify(next, booking.passengerId, "Trip completed", "You can now rate this driver.", `/passenger/rate/${booking.id}`);
          return next;
        });
        return null;
      },
      setDriverAvailability: (available) => {
        const id = state.currentUserId;
        setState((s) => ({
          ...s,
          vehicles: s.vehicles.map((v) => (v.driverId === id ? { ...v, available, status: available ? "idle" : "offline" } : v)),
        }));
      },
      updateVehicle: (patch) => {
        const user = state.users.find((u) => u.id === state.currentUserId);
        if (!user || (user.role !== "driver" && user.role !== "association_admin")) {
          return "You cannot update this vehicle.";
        }
        setState((s) => ({
          ...s,
          vehicles: s.vehicles.map((v) => {
            const owned =
              user.role === "driver" ? v.driverId === user.id : v.associationId === user.associationId;
            if (!owned) return v;
            if (patch.vehicleId && v.id !== patch.vehicleId) return v;
            const { vehicleId, ...rest } = patch;
            void vehicleId;
            const capacity = rest.capacity ?? v.capacity;
            if (capacity < v.reservedSeats) return v;
            return { ...v, ...rest, capacity };
          }),
        }));
        return null;
      },
      rateTrip: (bookingId, scores) => {
        const booking = state.bookings.find((b) => b.id === bookingId);
        if (!booking || booking.passengerId !== state.currentUserId) return "You can only rate your completed trips.";
        if (booking.status !== "completed") return "Rate a trip after it is completed.";
        if (state.ratings.some((r) => r.bookingId === bookingId)) return "You already rated this trip.";
        const values = [scores.driving, scores.punctuality, scores.cleanliness, scores.safety, scores.service];
        if (values.some((n) => n < 1 || n > 5)) return "Each rating must be between 1 and 5.";
        setState((s) => ({
          ...s,
          ratings: [
            {
              id: uid("r"),
              bookingId,
              passengerId: booking.passengerId,
              driverId: booking.driverId,
              ...scores,
              createdAt: new Date().toISOString(),
            },
            ...s.ratings,
          ],
        }));
        return null;
      },
      fileComplaint: (input) => {
        const user = state.users.find((u) => u.id === state.currentUserId);
        if (!user) return "Log in to submit a report.";
        if (input.details.trim().length < 10) return "Please describe the issue in at least 10 characters.";
        const driver = state.users.find((u) => u.id === input.driverId);
        setState((s) => ({
          ...s,
          complaints: [
            {
              id: uid("c"),
              passengerId: user.id,
              driverId: input.driverId,
              bookingId: input.bookingId,
              category: input.category,
              details: input.details.trim(),
              status: "open",
              associationId: driver?.associationId,
              createdAt: new Date().toISOString(),
            },
            ...s.complaints,
          ],
        }));
        return null;
      },
      reviewComplaint: (id, status, adminNote) => {
        setState((s) => ({
          ...s,
          complaints: s.complaints.map((c) => (c.id === id ? { ...c, status, adminNote } : c)),
        }));
      },
      joinQueue: (input) => {
        const user = state.users.find((u) => u.id === state.currentUserId);
        if (!user || user.role !== "passenger") return "Passengers join the station queue.";
        const waiting = state.queue.filter((q) => q.stationId === input.stationId && q.status === "waiting");
        const position = waiting.length + 1;
        setState((s) => ({
          ...s,
          queue: [
            ...s.queue,
            {
              id: uid("q"),
              ...input,
              passengerId: user.id,
              position,
              status: "waiting",
              createdAt: new Date().toISOString(),
            },
          ],
        }));
        return null;
      },
      manageQueue: (ticketId, status) => {
        setState((s) => {
          const ticket = s.queue.find((q) => q.id === ticketId);
          const queue = s.queue.map((q) => (q.id === ticketId ? { ...q, status } : q));
          const waiting = queue
            .filter((q) => q.stationId === ticket?.stationId && q.status === "waiting")
            .sort((a, b) => a.position - b.position)
            .map((q, i) => ({ ...q, position: i + 1 }));
          return {
            ...s,
            queue: queue.map((q) => waiting.find((w) => w.id === q.id) ?? q),
          };
        });
      },
      upsertAd: (ad) => {
        setState((s) => {
          if (ad.id) {
            return { ...s, ads: s.ads.map((a) => (a.id === ad.id ? { ...a, ...ad, id: ad.id } : a)) };
          }
          return { ...s, ads: [{ ...ad, id: uid("ad"), active: ad.active }, ...s.ads] };
        });
      },
      updatePricing: (pricing) => setState((s) => ({ ...s, pricing })),
      submitContract: (input) => {
        const userId = state.currentUserId;
        if (!userId) return "Log in first.";
        if (!input.organization || !input.origin || !input.destination || !input.schedule) {
          return "Organization, locations, and schedule are required.";
        }
        if (input.passengers < 1) return "Passenger count is required.";
        setState((s) => ({
          ...s,
          contracts: [
            {
              ...input,
              id: uid("ct"),
              userId,
              status: "submitted",
              createdAt: new Date().toISOString(),
            },
            ...s.contracts,
          ],
        }));
        return null;
      },
      respondContract: (id, status, response) => {
        setState((s) => ({
          ...s,
          contracts: s.contracts.map((c) => (c.id === id ? { ...c, status, response } : c)),
        }));
      },
      submitDelivery: (input) => {
        const userId = state.currentUserId;
        if (!userId) return "Log in first.";
        if (!input.pickup || !input.dropoff) return "Pickup and drop-off are required.";
        setState((s) => ({
          ...s,
          deliveries: [
            { ...input, id: uid("d"), userId, status: "submitted", createdAt: new Date().toISOString() },
            ...s.deliveries,
          ],
        }));
        return null;
      },
      updateDelivery: (id, status) => {
        setState((s) => ({
          ...s,
          deliveries: s.deliveries.map((d) => (d.id === id ? { ...d, status } : d)),
        }));
      },
      markRead: (id) => {
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }));
      },
      saveDraft: (draft) => {
        const userId = state.currentUserId ?? "guest";
        setState((s) => ({ ...s, bookingDrafts: { ...s.bookingDrafts, [userId]: draft } }));
      },
    };
  }, [state]);

  return <StoreContext.Provider value={{ state, ...api }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function useCurrentUser() {
  const { state } = useStore();
  return state.users.find((u) => u.id === state.currentUserId) ?? null;
}

export function roleHome(role: Role) {
  if (role === "driver") return "/driver";
  if (role === "association_admin") return "/association";
  if (role === "system_admin") return "/admin";
  return "/passenger";
}
