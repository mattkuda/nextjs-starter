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

    // ✅ Allow API requests to pass through
    if (isApiRoute(req)) {
        return NextResponse.next();
    }

    // ✅ Handle public routes
    if (isPublicRoute(req)) {
        // If authenticated and accessing sign-in/sign-up, redirect to dashboard
        if (userId && shouldRedirectToDashboard(req)) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        // If authenticated and visiting the homepage, redirect to dashboard
        if (userId && pathname === "/") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
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
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
