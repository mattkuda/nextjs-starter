'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
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
