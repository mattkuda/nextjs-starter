'use client'

import { AnimatedArrowButton } from "@/components/ui/animated-arrow-button"

export function CtaSection() {
    return (
        <div className="py-16 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
                    Start Building Your Next Project
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                    Stop wasting time on boilerplate. Start with a solid foundation and ship faster.
                </p>
                <div className="text-center mt-8">
                    <div className="opacity-0 animate-fade-in [animation-delay:400ms] [animation-fill-mode:forwards]">
                        <AnimatedArrowButton href="/sign-up" size="large" color="gradient">
                            Get started for free
                        </AnimatedArrowButton>
                        <p className="mt-4 text-sm text-gray-500">No credit card required</p>
                    </div>
                </div>
            </div>
        </div>
    )
} 