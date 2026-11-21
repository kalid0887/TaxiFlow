"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GuestOnly } from "@/components/gate";
import { Button, Card, ErrorText, Field, IconBus, inputClass } from "@/components/ui";
import { roleHome, useStore } from "@/lib/store";

const demos = [
  ["Passenger", "passenger@taxiflow.demo"],
  ["Driver", "driver@taxiflow.demo"],
  ["Association", "association@taxiflow.demo"],
  ["Admin", "admin@taxiflow.demo"],
];

export default function LoginPage() {
  const { login, state } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("passenger@taxiflow.demo");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState<string | null>(null);

  return (
    <GuestOnly>
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
        <a href="/" className="mb-6 flex items-center gap-2 text-sm text-[var(--muted)]">
          <IconBus className="h-5 w-5" /> Back to TaxiFlow
        </a>
        <Card>
          <h1 className="text-3xl">Sign in</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Use a demo account or an account you registered.</p>
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const user = state.users.find(
                (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
              );
              const msg = login(email, password);
              setError(msg);
              if (!msg && user) router.push(roleHome(user.role));
            }}
          >
            <Field label="Email">
              <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            </Field>
            <Field label="Password">
              <input className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
            </Field>
            <ErrorText message={error} />
            <Button type="submit">Continue</Button>
          </form>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {demos.map(([label, value]) => (
              <button
                key={value}
                className="rounded-xl border border-[var(--line)] px-3 py-2 text-left text-xs hover:bg-[var(--mist)]"
                onClick={() => {
                  setEmail(value);
                  setPassword("demo1234");
                }}
              >
                <span className="block font-semibold">{label}</span>
                {value}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm">
            New here? <a className="underline" href="/register">Create an account</a>
          </p>
        </Card>
      </div>
    </GuestOnly>
  );
}
