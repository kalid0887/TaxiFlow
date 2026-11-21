"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card, ErrorText, Field, SuccessText, inputClass } from "@/components/ui";
import { useStore } from "@/lib/store";

const dims = ["driving", "punctuality", "cleanliness", "safety", "service"] as const;

export default function RatePage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { rateTrip, state } = useStore();
  const router = useRouter();
  const [scores, setScores] = useState({ driving: 5, punctuality: 5, cleanliness: 5, safety: 5, service: 5, comment: "" });
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const booking = state.bookings.find((b) => b.id === bookingId);
  return (
    <Card className="max-w-xl space-y-4">
      <h1 className="text-3xl">Rate this trip</h1>
      <p className="text-sm text-[var(--muted)]">Booking {booking?.id ?? bookingId}</p>
      {dims.map((d) => (
        <Field key={d} label={d}>
          <input
            className={inputClass}
            type="number"
            min={1}
            max={5}
            value={scores[d]}
            onChange={(e) => setScores((s) => ({ ...s, [d]: Number(e.target.value) }))}
          />
        </Field>
      ))}
      <Field label="Comment">
        <textarea className={inputClass} value={scores.comment} onChange={(e) => setScores((s) => ({ ...s, comment: e.target.value }))} />
      </Field>
      <ErrorText message={error} />
      <SuccessText message={ok} />
      <Button
        onClick={() => {
          const msg = rateTrip(bookingId, scores);
          setError(msg);
          if (!msg) {
            setOk("Thank you. Your rating is saved in this demo.");
            setTimeout(() => router.push("/passenger/history"), 800);
          }
        }}
      >
        Submit rating
      </Button>
    </Card>
  );
}
