import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = [
    "/",
    "/pricing",
    "/blog",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/get-started(.*)",
    "/onboarding(.*)",
];

const isPublicRoute = createRouteMatcher(publicRoutes);
const isApiRoute = createRouteMatcher(["/api(.*)"]);
const shouldRedirectToDashboard = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const shouldRedirectToSignIn = createRouteMatcher([
    "/dashboard(.*)",
    "/settings(.*)",
    "/timer(.*)",
    "/workouts(.*)",
    "/goals(.*)",
    "/insights(.*)",
    "/journal(.*)",
]);

// List of API routes that don't need authentication
const publicApiRoutes = [
    "/api/auth/webhook",
    "/api/payments/webhook",
];

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    const { pathname } = req.nextUrl;

    // 🚫 Block auth routes in production (before Clerk processing)
    const authRoutes = ['/sign-in', '/sign-up', '/dashboard', '/app']
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    // Allow auth routes only in development or when enable auth is true
    const isProduction = process.env.IS_PRODUCTION === 'true'
    const authEnabled = process.env.ENABLE_AUTH === 'true'

    if (isAuthRoute && isProduction && !authEnabled) {
        // Redirect to landing page with a message
        const url = req.nextUrl.clone()
        url.pathname = '/'
        url.searchParams.set('message', 'coming-soon')
        return NextResponse.redirect(url)
    }

    // ✅ Handle API routes
    if (isApiRoute(req)) {
        // Allow public API routes without authentication
        if (publicApiRoutes.some(route => pathname.startsWith(route))) {
            return NextResponse.next();
        }

        // Require authentication for all other API routes
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        return NextResponse.next();
    }

    // ✅ Handle public routes
    if (isPublicRoute(req)) {
        // If authenticated and accessing sign-in/sign-up, redirect to onboarding
        // (since new users should go to onboarding, and existing users will be redirected from there if they have a subscription)
        if (userId && shouldRedirectToDashboard(req)) {
            return NextResponse.redirect(new URL("/onboarding", req.url));
        }

        // If authenticated and visiting the homepage, redirect to onboarding
        if (userId && pathname === "/") {
            return NextResponse.redirect(new URL("/onboarding", req.url));
        }

        return NextResponse.next();
    }

    // ✅ Handle protected routes
    if (!userId && shouldRedirectToSignIn(req)) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
