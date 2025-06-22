'use client'

import Image from 'next/image'
import { PricingCards } from '@/components/PricingCards'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import axios from 'axios'
import { User } from "@/types"
import { SubscriptionStatus } from '@/lib/constants'

export default function OnboardingPage() {
    const { data: userData, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const { data } = await axios.get<User>('/api/user')
            return data;
        },
        staleTime: 1000 * 60 * 5,
        retry: 2,
    })

    // Redirect to dashboard if user already has a subscription
    useEffect(() => {
        if (!isLoading && userData && userData.subscription_status !== SubscriptionStatus.FREE) {
            // Add a small delay to ensure smooth transition
            setTimeout(() => {
                window.location.href = '/dashboard'
            }, 100);
        }
    }, [isLoading, userData])

    // Show loading while checking subscription status
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="relative p-4 sm:p-6 lg:p-8 ">
                <div className="mx-auto max-w-7xl">
                    {/* Logo and Brand */}
                    <div className="text-center mb-16">
                        <div className="opacity-0 animate-fade-in flex items-center justify-center mb-8">
                            <Image src="/icon.png" alt="Logo" width={48} height={48} className="mr-4" />
                            <div className="text-3xl font-bold text-foreground">
                                NextJS Starter
                            </div>
                        </div>

                        {/* Hero Text */}
                        <div className="opacity-0 animate-fade-in [animation-delay:200ms] [animation-fill-mode:forwards]">
                            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                                Stop coding boilerplate.<br />
                                Start <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Selling Subscriptions</span>
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                                The only Next.js starter you need. Auth, payments, database, and AI included. Launch your startup this weekend.
                            </p>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="opacity-0 animate-fade-in [animation-delay:400ms] [animation-fill-mode:forwards] -mt-8">
                        <PricingCards />
                    </div>
                </div>
            </div>
        </div>
    )
} 