import { auth, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { RouteAccessMap } from './lib/settings';
import { NextResponse } from 'next/server';

// Creamos matchers con sus roles permitidos
const matchers = Object.keys(RouteAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: RouteAccessMap[route],
}));

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth(); // ✅ Se resuelve la promesa

  const role = (sessionClaims?.metadata as { role?: string })?.role;

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && (!role || !allowedRoles.includes(role))) {
      return NextResponse.redirect(new URL(`/${role || 'unauthorized'}`, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
