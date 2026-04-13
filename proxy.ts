import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { isClerkConfigured } from "@/lib/env";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const clerkProxy = clerkMiddleware(async (auth, request) => {
  if (isAdminRoute(request)) {
    await auth.protect();
  }
});

export default function proxy(
  request: Parameters<typeof clerkProxy>[0],
  event: Parameters<typeof clerkProxy>[1],
) {
  if (!isClerkConfigured()) {
    return NextResponse.next();
  }

  return clerkProxy(request, event);
}

export const config = {
  matcher: ["/admin(.*)", "/sign-in(.*)"],
};
