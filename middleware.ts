import { type NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname !== "/" && req.nextUrl.pathname !== "/join" && req.nextUrl.pathname !== "/debug" && !req.nextUrl.searchParams.has("name")) {
    return NextResponse.redirect(new URL("/join?roomId=" + req.nextUrl.pathname.slice(1), req.url));
  } else if (req.nextUrl.pathname !== "/" && req.nextUrl.pathname !== "/join") {
    return NextResponse.rewrite(new URL("/" + req.nextUrl.pathname.slice(1), req.url));
  }

  return NextResponse.next();
}
