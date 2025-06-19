'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-background flex justify-center items-center">
            <SignIn
                path="/sign-in"
                routing="path"
                signUpUrl="/sign-up"
                fallbackRedirectUrl="/dashboard"
                signUpFallbackRedirectUrl="/sign-up"
            />
        </div>
    );
}
