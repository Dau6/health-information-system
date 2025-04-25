import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/health",
  "/api/public(.*)"
]);

export default clerkMiddleware({
  afterAuth(auth, req) {
    // If the route is public, allow access
    if (isPublicRoute(req.url)) {
      return;
    }

    // If the user is not signed in and the route is not public, redirect to sign-in
    if (!auth.userId) {
      const baseUrl = req.url.includes('localhost') ? 
        `http://${req.headers.get('host')}` : 
        `https://${req.headers.get('host')}`;
      
      const signInUrl = new URL('/sign-in', baseUrl);
      signInUrl.searchParams.set('redirect_url', req.url);
      return Response.redirect(signInUrl);
    }
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 