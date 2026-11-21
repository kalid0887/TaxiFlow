"use client";

import { useState } from "react";
import { Button, Card, Field, SuccessText, inputClass } from "@/components/ui";
import { useCurrentUser, useStore } from "@/lib/store";

export default function VehiclePage() {
  const { state, updateVehicle } = useStore();
  const user = useCurrentUser();
  const vehicle = state.vehicles.find((v) => v.driverId === user?.id);
  const [plate, setPlate] = useState(vehicle?.plate ?? "");
  const [model, setModel] = useState(vehicle?.model ?? "");
  const [capacity, setCapacity] = useState(vehicle?.capacity ?? 14);
  const [station, setStation] = useState(vehicle?.currentStationId ?? "st-green");
  const [ok, setOk] = useState<string | null>(null);
  if (!vehicle) {
    return <p>No vehicle is linked to this driver yet. An association administrator can register one.</p>;
  }
  return (
    <Card className="max-w-xl space-y-4">
      <h1 className="text-3xl">Vehicle</h1>
      <Field label="Plate">
        <input className={inputClass} value={plate} onChange={(e) => setPlate(e.target.value)} />
      </Field>
      <Field label="Model">
        <input className={inputClass} value={model} onChange={(e) => setModel(e.target.value)} />
      </Field>
      <Field label="Passenger capacity (14–19 typical)">
        <input className={inputClass} type="number" min={vehicle.reservedSeats} max={30} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
      </Field>
      <Field label="Current station">
        <select className={inputClass} value={station} onChange={(e) => setStation(e.target.value)}>
          {state.stations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>
      <SuccessText message={ok} />
      <Button
        onClick={() => {
          updateVehicle({ plate, model, capacity, currentStationId: station });
          setOk("Vehicle updated.");
        }}
      >
        Save vehicle
      </Button>
    </Card>
  );
}
