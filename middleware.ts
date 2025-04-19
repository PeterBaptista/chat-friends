import type { Session } from "better-auth/types";
import { type NextRequest, NextResponse } from "next/server";

import {
  authRoutes,
  protectedRoutes,
  publicRoutes,
  REDIRECT_DEFAULT_AUTHENTICATED_ROUTE,
  userRoutes,
} from "./config/routes";

import axios from "axios";

function isRouteMatch(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    // Exact match
    if (route === pathname) return true;
    // Check if it's a nested route (e.g., /organization/accept-invitations/[id])
    if (pathname.startsWith(`${route}/`)) return true;
    return false;
  });
}

export async function middleware(request: NextRequest) {
  const protocol = request.nextUrl.protocol;
  const host = request.headers.get("host");
  const baseURL = `${protocol}//${host}`;

  const { data: session } = await axios<Session>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
    {
      baseURL: baseURL,
      headers: {
        // Get the cookie from the request
        cookie: request.headers.get("cookie") || "",
        host: host || "",
      },
    }
  );

  // Get the current path
  const path = request.nextUrl.pathname;

  const isProtectedRoute = isRouteMatch(path, protectedRoutes);
  const isPublicRoute = isRouteMatch(path, publicRoutes);
  const isAuthRoute = isRouteMatch(path, authRoutes);
  const isUserRoute = isRouteMatch(path, userRoutes);

  /**
   * If route is public, give access.
   */
  if (isPublicRoute) {
    return NextResponse.next();
  }

  /**
   * If route is protected and user is not signed in return user to login page.
   * Returned user must have proper callback url when redirected to login page.
   */

  if (isAuthRoute) {
    // If auth route and user is authenticated redirect user to dashboard.
    if (session) {
      return NextResponse.redirect(
        new URL(REDIRECT_DEFAULT_AUTHENTICATED_ROUTE, request.nextUrl)
      );
    }
    // If authRoute and not authenticated, allow access
    return NextResponse.next();
  }

  if (isProtectedRoute || isUserRoute) {
    if (!session) {
      return NextResponse.redirect(new URL(`/login`, request.nextUrl));
    }
    // If protectedRoute and user is authenticated, give access
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except for:
    // - API routes
    // - Next.js static files
    // - Next.js image optimization files
    // - Static assets (fonts, images)
    // - Metadata files

    "/((?!api|_next/static|_next/image|fonts/|images/|favicon.ico|sitemap.xml|robots.txt|manifest.json|opengraph-image).*)",
  ],
};
