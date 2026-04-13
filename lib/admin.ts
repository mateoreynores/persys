import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import {
  getClerkAdminEmails,
  getClerkAdminUserIds,
  hasClerkAdminRestrictions,
  isClerkConfigured,
} from "@/lib/env";

function isAuthorizedAdmin(input: { userId: string; emailAddresses: string[] }) {
  const adminUserIds = getClerkAdminUserIds();
  const adminEmails = getClerkAdminEmails();

  if (adminUserIds.length === 0 && adminEmails.length === 0) {
    return true;
  }

  if (adminUserIds.includes(input.userId)) {
    return true;
  }

  return input.emailAddresses.some((email) => adminEmails.includes(email));
}

export async function requireAdminUser() {
  if (!isClerkConfigured()) {
    return null;
  }

  const session = await auth();
  if (!session.userId) {
    redirect("/sign-in?redirect_url=/admin");
  }

  if (hasClerkAdminRestrictions()) {
    const user = await currentUser();

    if (!user) {
      redirect("/sign-in?redirect_url=/admin");
    }

    const emailAddresses = user.emailAddresses
      .map((emailAddress) => emailAddress.emailAddress.trim().toLowerCase())
      .filter(Boolean);

    if (
      !isAuthorizedAdmin({
        userId: session.userId,
        emailAddresses,
      })
    ) {
      redirect("/admin-access-denied");
    }
  }

  return session;
}
