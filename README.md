# TaxiFlow

Web demo of a shared-taxi platform for passengers, drivers, taxi associations, and a system administrator.

**Tagline:** Connecting People. Organizing Transportation. Moving Communities.

This is a Next.js app with in-browser demo data. It is not connected to live taxis, payments, SMS, or GPS.

## Run locally

```bash
cd ~/Projects/TaxiFlow
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo accounts

Password for all of these: `demo1234`

| Role | Email |
| --- | --- |
| Passenger | passenger@taxiflow.demo |
| Driver | driver@taxiflow.demo |
| Association admin | association@taxiflow.demo |
| System admin | admin@taxiflow.demo |

## How to test core flows

1. Sign in as the passenger. Search Green Hill → Worktown, tick the price agreement, request seats.
2. Sign out, sign in as the driver. Accept or reject the request. Seats are held on pending and released on reject.
3. For empty pickup, search as a passenger with service type “Empty pickup” while the taxi is at another station. Confirm the extra charge is listed separately.
4. Driver → Return demand shows queue and bookings heading the opposite way.
5. Association admin can board/remove queue tickets and review complaints.
6. System admin can change empty-pickup pricing; new passenger quotes use the new rates.

Data is stored in `localStorage` under `taxiflow.state.v1`. Use **Reset demo data** on the admin overview to restore the seed.

## Not connected yet

- Card or mobile-money payments
- SMS / USSD telecom sessions
- Live maps / GPS tracking
- Multi-device backend database
