import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdminUser } from "@/lib/admin";
import { isClerkConfigured } from "@/lib/env";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isClerkConfigured()) {
    notFound();
  }

  await requireAdminUser();

  return <>{children}</>;
}
