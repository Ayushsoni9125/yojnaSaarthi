import { aj } from "@/lib/arcjet";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Rate-limit API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Allow cron and admin scraper API routes without rate limits
    if (
      request.nextUrl.pathname.startsWith("/api/cron") ||
      request.nextUrl.pathname.startsWith("/api/scraper")
    ) {
      return NextResponse.next();
    }

    try {
      const decision = await aj.protect(request, { requested: 1 });

      if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
          return NextResponse.json(
            {
              success: false,
              message: "Too many requests. Please slow down and try again later.",
            },
            { status: 429 }
          );
        }

        if (decision.reason.isBot()) {
          return NextResponse.json(
            {
              success: false,
              message: "Automated bot access is forbidden.",
            },
            { status: 403 }
          );
        }

        return NextResponse.json(
          {
            success: false,
            message: "Access denied by security shield.",
          },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error("Arcjet proxy protection error:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
