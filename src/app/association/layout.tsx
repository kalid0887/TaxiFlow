"use client";

import { AppShell } from "@/components/shell";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <AppShell role="association_admin">{children}</AppShell>;
}
