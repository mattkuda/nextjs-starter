'use client'

import { AnimatedArrowButton } from "@/components/ui/animated-arrow-button"

export function CtaSection() {
    return (
        <div className="py-16 bg-muted/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                    Launch your SaaS <span className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">this weekend</span>
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                    Everything you need in one Next.js starter: Clerk auth, Stripe billing, Supabase database, OpenAI integration. Stop building, start selling.
                </p>
                <div className="text-center mt-8">
                    <div className="opacity-0 animate-fade-in [animation-delay:400ms] [animation-fill-mode:forwards]">
                        <AnimatedArrowButton href="/sign-up" size="large" color="gradient">
                            Get started for free
                        </AnimatedArrowButton>
                    </div>
                </div>
            </div>
        </div>
    )
}