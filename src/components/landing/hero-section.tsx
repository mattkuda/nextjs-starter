'use client'

import Image from 'next/image'
import { AnimatedArrowButton } from "@/components/ui/animated-arrow-button"

export function HeroSection() {
    return (
        <div className="relative bg-white">
            <div className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-32 lg:pb-16">
                <div className="mx-auto max-w-7xl text-center">
                    <div className="opacity-0 animate-fade-in">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Your AI Companion To<br />
                            Help You <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Code Anything</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                            NextJS Starter creates detailed documentation for your AI coding projects and eliminates setup time with pre-integrated services.
                        </p>
                    </div>
                    <div className="opacity-0 animate-fade-in [animation-delay:400ms] [animation-fill-mode:forwards]">
                        <AnimatedArrowButton color="gradient" href="/sign-up" size="large" className="mt-10">
                            Get Started Today
                        </AnimatedArrowButton>
                        <p className="mt-4 text-sm text-gray-500">No credit card required</p>
                    </div>
                </div>
            </div>
            {/* App Screenshot */}
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8">
                <div className="border-8 border-gray-200 rounded-xl shadow-2xl opacity-0 animate-slide-up [animation-delay:800ms] [animation-fill-mode:forwards]">
                    <div className="overflow-hidden rounded-lg bg-white">
                        <div className="h-[400px]">
                            <Image
                                src="/DemoScreenshot.png"
                                alt="NextJS Starter Dashboard"
                                width={2880}
                                height={1620}
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 