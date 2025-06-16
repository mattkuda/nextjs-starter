'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <SignUp
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                signInFallbackRedirectUrl="/dashboard"
                fallbackRedirectUrl="/dashboard"
            />
        </div>
    );
}
