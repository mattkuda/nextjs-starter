'use client'

import Image from 'next/image'
import { AnimatedArrowButton } from "@/components/ui/animated-arrow-button"
import { TechStackCarousel } from './tech-stack-carousel'

export function HeroSection() {

    return (
        <div className="relative bg-background">
            {/* Main Hero Content */}
            <div className="relative px-4 pt-20 sm:px-6 lg:px-8 lg:pt-32 pb-0">
                <div className="mx-auto max-w-7xl text-center">
                    <div className="opacity-0 animate-fade-in">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                            Stop coding boilerplate<br />
                            Start <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">selling subscriptions</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                            The only Next.js starter you need. Auth, payments, database, and AI included. Launch your startup this weekend.
                        </p>
                    </div>
                    <div className="opacity-0 animate-fade-in [animation-delay:400ms] [animation-fill-mode:forwards]">
                        <AnimatedArrowButton color="gradient" href="/sign-up" size="large" className="mt-10 mb-16">
                            Get Started Today
                        </AnimatedArrowButton>
                    </div>
                </div>
            </div>
            {/* Tech Stack Carousel */}
            <div className="pb-16">
                <TechStackCarousel />
            </div>
            {/* App Screenshot */}
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20">
                <div className="border-8 border-border rounded-xl shadow-2xl opacity-0 animate-slide-up [animation-delay:800ms] [animation-fill-mode:forwards] dark:shadow-gray-900/50">
                    <div className="overflow-hidden rounded-lg bg-card relative">
                        <Image
                            src="/dashboard-screenshot-light.png"
                            alt="NextJS Starter Dashboard"
                            width={1500}
                            height={900}
                            className="w-full max-w-[90vw] object-contain block dark:hidden"
                        />
                        <Image
                            src="/dashboard-screenshot-dark.png"
                            alt="NextJS Starter Dashboard"
                            width={1500}
                            height={900}
                            className="w-full max-w-[90vw] object-contain hidden dark:block"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}