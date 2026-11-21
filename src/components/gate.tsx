"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { roleHome, useCurrentUser } from "@/lib/store";

export function GuestOnly({ children }: { children: ReactNode }) {
  const user = useCurrentUser();
  const router = useRouter();
  useEffect(() => {
    if (user) router.replace(roleHome(user.role));
  }, [user, router]);
  return <>{children}</>;
}
