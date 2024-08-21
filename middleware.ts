import { type NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname !== "/" && !req.nextUrl.searchParams.has("name")) {
    // TODO: Fix req.nextUrl.pathname.slice(1) returns join
    return NextResponse.redirect(new URL("/join/?roomId=" + req.nextUrl.pathname.slice(1), req.url));
  } else {
    return NextResponse.rewrite("/" + req.nextUrl.pathname.slice(1));
  }
}
