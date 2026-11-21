"use client";

import { Card } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function AdminUsersPage() {
  const { state } = useStore();
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Users</h1>
      {state.users.map((u) => (
        <Card key={u.id} className="flex flex-wrap justify-between gap-2">
          <div>
            <p className="font-semibold">{u.name}</p>
            <p className="text-sm text-[var(--muted)]">{u.email} · {u.phone}</p>
          </div>
          <p className="text-sm capitalize">{u.role.replace("_", " ")}</p>
        </Card>
      ))}
    </div>
  );
}
