'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-background flex justify-center items-center">
            <SignUp
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                signInFallbackRedirectUrl="/dashboard"
                fallbackRedirectUrl="/onboarding"
            />
        </div>
    );
}