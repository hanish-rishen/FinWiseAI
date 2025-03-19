import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Check for demo mode in localStorage (client-side only)
  const isDemoMode = req.cookies.get("demo_mode")?.value === "true";

  // Create a response object
  const res = NextResponse.next();

  // Skip auth check in demo mode
  if (isDemoMode && req.nextUrl.pathname.startsWith("/dashboard")) {
    return res;
  }

  // Create the Supabase client
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Check if the user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // If no session and accessing a protected route
    if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
      console.log("No session found, redirecting to sign-in");

      // Create a URL for the sign-in page with the current URL as a redirect parameter
      const redirectUrl = new URL("/sign-in", req.url);
      redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);

      // Return a redirect response
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  } catch (error) {
    console.error("Middleware error:", error);

    // If there's an error, still redirect to sign-in for protected routes
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      const redirectUrl = new URL("/sign-in", req.url);
      redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
