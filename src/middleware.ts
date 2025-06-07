import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/get-started(.*)',
])

const isApiRoute = createRouteMatcher(['/api(.*)'])

// Add a new matcher specifically for routes that should redirect to dashboard
const shouldRedirectToDashboard = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    const client = await clerkClient();
    const { pathname } = req.nextUrl;

    // Allow API routes without redirects
    if (isApiRoute(req)) {
        return NextResponse.next();
    }

    // If user is not signed in and trying to access a protected route
    if (!userId && !isPublicRoute(req)) {
        return NextResponse.redirect(new URL('/sign-in', req.url))
    }

    // Handle onboarding flow
    if (userId) {
        const user = await client.users.getUser(userId)
        const hasCompletedOnboarding = user?.publicMetadata?.hasCompletedOnboarding

        // If user hasn't completed onboarding
        if (!hasCompletedOnboarding) {
            // Allow access to onboarding page
            if (pathname === '/onboard') {
                return NextResponse.next()
            }

            // Redirect to onboarding from any other page
            if (!isPublicRoute(req)) {
                return NextResponse.redirect(new URL('/onboard', req.url))
            }
        }

        // If user has completed onboarding, don't let them access onboarding page again
        if (hasCompletedOnboarding && pathname === '/onboard') {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }

        // Modify the redirect condition to only redirect from sign-in/sign-up pages
        if (shouldRedirectToDashboard(req)) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        // Match all routes except static files and Next.js internals
        '/((?!_next|[^?]*\\.(?:html?|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)', // Include API routes
    ],
};
