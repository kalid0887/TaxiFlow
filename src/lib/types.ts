export type Role =
  | "passenger"
  | "driver"
  | "association_admin"
  | "system_admin";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "cancelled"
  | "completed";

export type BookingType = "shared" | "empty_pickup";

export type QueuePriority =
  | "standard"
  | "elderly"
  | "pregnant"
  | "disability"
  | "assistance";

export type ComplaintCategory =
  | "overcharging"
  | "unsafe_driving"
  | "disrespect"
  | "discrimination"
  | "lost_property"
  | "other";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  associationId?: string;
  assistanceNeeds?: QueuePriority;
  createdAt: string;
}

export interface Association {
  id: string;
  name: string;
  stationIds: string[];
  contactPhone: string;
}

export interface Station {
  id: string;
  name: string;
  area: string;
  x: number;
  y: number;
}

export interface Route {
  id: string;
  associationId: string;
  name: string;
  originStationId: string;
  destStationId: string;
  stopIds: string[];
  distanceKm: number;
  durationMin: number;
  baseFare: number;
}

export interface Vehicle {
  id: string;
  associationId: string;
  driverId: string;
  plate: string;
  model: string;
  capacity: number;
  reservedSeats: number;
  status: "idle" | "boarding" | "en_route" | "offline";
  currentStationId: string;
  operatingRouteIds: string[];
  available: boolean;
}

export interface PricingSettings {
  currency: string;
  emptyPickupPerKm: number;
  minEmptyCharge: number;
  serviceFeePercent: number;
  cancellationFee: number;
  cancellationWindowMinutes: number;
  priorityBoardingEnabled: boolean;
}

export interface Booking {
  id: string;
  passengerId: string;
  vehicleId: string;
  driverId: string;
  routeId: string;
  originStationId: string;
  destStationId: string;
  seats: number;
  status: BookingStatus;
  type: BookingType;
  baseFare: number;
  emptyPickupCharge: number;
  serviceFee: number;
  total: number;
  emptyDistanceKm: number;
  departureTime: string;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  priceAccepted: boolean;
  notes?: string;
}

export interface Rating {
  id: string;
  bookingId: string;
  passengerId: string;
  driverId: string;
  driving: number;
  punctuality: number;
  cleanliness: number;
  safety: number;
  service: number;
  comment: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  passengerId: string;
  driverId?: string;
  bookingId?: string;
  category: ComplaintCategory;
  details: string;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  associationId?: string;
  adminNote?: string;
  createdAt: string;
}

export interface QueueTicket {
  id: string;
  stationId: string;
  passengerId: string;
  destinationStationId: string;
  seats: number;
  priority: QueuePriority;
  position: number;
  status: "waiting" | "boarding" | "departed" | "cancelled";
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageLabel: string;
  link: string;
  placement: "passenger_home" | "search_results" | "history";
  active: boolean;
  startDate: string;
  endDate: string;
}

export interface ContractRequest {
  id: string;
  userId: string;
  organization: string;
  kind: "family" | "school" | "university" | "company" | "organization" | "event";
  origin: string;
  destination: string;
  schedule: string;
  passengers: number;
  status: "submitted" | "reviewing" | "offered" | "declined";
  response?: string;
  createdAt: string;
}

export interface DeliveryRequest {
  id: string;
  userId: string;
  kind: "document" | "small_package" | "shop_to_customer" | "business_to_customer" | "scheduled";
  pickup: string;
  dropoff: string;
  notes: string;
  scheduledFor?: string;
  status: "submitted" | "assigned" | "in_transit" | "delivered" | "cancelled";
  createdAt: string;
}

export interface AppState {
  users: User[];
  associations: Association[];
  stations: Station[];
  routes: Route[];
  vehicles: Vehicle[];
  bookings: Booking[];
  ratings: Rating[];
  complaints: Complaint[];
  queue: QueueTicket[];
  notifications: NotificationItem[];
  ads: Advertisement[];
  contracts: ContractRequest[];
  deliveries: DeliveryRequest[];
  pricing: PricingSettings;
  currentUserId: string | null;
  bookingDrafts: Record<string, unknown>;
}
