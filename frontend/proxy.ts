import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";

  const subdomain = host.split(".")[0];

  if (subdomain == "app") {
    if (request.nextUrl.pathname == "") {
      return NextResponse.rewrite(new URL("/dashboard", request.url));
    }

    switch (request.nextUrl.pathname) {
      case "/drafts":
        return NextResponse.rewrite(new URL("/drafts", request.url));
      case "/published":
        return NextResponse.rewrite(new URL("/published", request.url));
      case "/unpublished":
        return NextResponse.rewrite(new URL("/unpublished", request.url));
      case "/templates":
        return NextResponse.rewrite(new URL("/templates", request.url));
      case "/settings":
        return NextResponse.rewrite(new URL("/settings", request.url));
      case "/subdomains":
        return NextResponse.rewrite(new URL("/subdomains", request.url));
      case "/dashboard":
        return NextResponse.rewrite(new URL("/dashboard", request.url));
      case "/trash":
        return NextResponse.rewrite(new URL("/trash", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
