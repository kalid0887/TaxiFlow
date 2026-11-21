"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GuestOnly } from "@/components/gate";
import { Button, Card, ErrorText, Field, IconBus, inputClass } from "@/components/ui";
import { roleHome, useStore } from "@/lib/store";

export default function RegisterPage() {
  const { register } = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"passenger" | "driver">("passenger");
  const [error, setError] = useState<string | null>(null);

  return (
    <GuestOnly>
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
        <a href="/" className="mb-6 flex items-center gap-2 text-sm text-[var(--muted)]">
          <IconBus className="h-5 w-5" /> Back to TaxiFlow
        </a>
        <Card>
          <h1 className="text-3xl">Create account</h1>
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const msg = register({ name, email, phone, password, role });
              setError(msg);
              if (!msg) router.push(roleHome(role));
            }}
          >
            <Field label="Full name">
              <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <Field label="Email">
              <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field>
            <Field label="Phone">
              <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </Field>
            <Field label="Password">
              <input className={inputClass} type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
            </Field>
            <Field label="I am a">
              <select className={inputClass} value={role} onChange={(e) => setRole(e.target.value as "passenger" | "driver")}>
                <option value="passenger">Passenger</option>
                <option value="driver">Taxi driver</option>
              </select>
            </Field>
            <ErrorText message={error} />
            <Button type="submit">Register</Button>
          </form>
          <p className="mt-4 text-sm">
            Already registered? <a className="underline" href="/login">Sign in</a>
          </p>
        </Card>
      </div>
    </GuestOnly>
  );
}
