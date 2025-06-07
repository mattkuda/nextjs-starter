"use client"

import Link from 'next/link'
import { Check, Globe, Rocket } from 'lucide-react'
import { CREDITS_LIMITS, SubscriptionStatus } from '@/lib/constants'
import { Button } from './ui/button'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useAuth, useUser } from '@clerk/nextjs'
import { User } from '../types'

interface PricingDisplayProps {
    variant?: 'page' | 'modal'
    currentPlan?: SubscriptionStatus
}

export function PricingDisplay({ variant = 'page', currentPlan }: PricingDisplayProps) {
    const isModal = variant === 'modal'
    const Container = isModal ? 'div' : 'section'

    const freePlanFeatures = [
        'Access to all core features',
        'Profile details',
        `${CREDITS_LIMITS[SubscriptionStatus.FREE]} total credits`,
    ]

    const proPlanFeatures = [
        'Everything in Basic, plus:',
        `${CREDITS_LIMITS[SubscriptionStatus.PRO]} credits per month`,
        'Advanced tone options (10+)',
        'AI Coach access',
        'Downloadable documents',
        'Up to 5 reply variations',
        'Priority customer support',
    ]

    const { userId } = useAuth();
    const { user } = useUser();

    const { data: userData } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const { data } = await axios.get<User>('/api/user')
            return data
        },
        enabled: !!userId
    })

    async function handleUpgrade() {
        try {
            const response = await axios.post('/api/upgradePlan', {
                clerkId: userData?.clerk_id,
                userId: userData?.id,
                email: user?.primaryEmailAddress?.emailAddress,
            });

            const data = response.data;
            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe Checkout
            }
        } catch (error) {
            console.error('Error upgrading to Pro:', error);
        }
    }

    const commonButtonStyles = "w-full rounded-full px-6 py-6 text-lg font-semibold transition-all duration-200"
    const primaryButtonStyles = `${commonButtonStyles} bg-gradient-to-br from-brand1 via-brand2 to-brand3 text-white hover:opacity-90`
    const secondaryButtonStyles = `${commonButtonStyles} bg-gray-50 text-gray-900 hover:bg-gray-100`

    return (
        <Container className={isModal ? '' : 'py-24'} id={isModal ? undefined : 'pricing'}>
            <div className={`mx-auto max-w-7xl ${isModal ? 'p-0' : 'px-4 sm:px-6 lg:px-8'}`}>
                {!isModal && (
                    <>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">
                            Simple Pricing for Your Needs
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-gray-600 pb-12 text-center">
                            No hidden fees, no complex plans. Just straightforward pricing for your needs.
                        </p>
                    </>
                )}

                <div className={`grid grid-cols-1 gap-8 ${isModal ? 'lg:grid-cols-2' : 'lg:grid-cols-2 lg:gap-12'}`}>
                    {/* Free Plan */}
                    <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-200 flex flex-col h-full">
                        <div>
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-gray-100 p-2">
                                    <Globe className="h-8 w-8 text-gray-500" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900">Free Plan</h3>
                            </div>
                            <p className="mt-4 text-gray-600">
                                Perfect for trying out NextJS Starter's AI-powered features and basic workflows.
                            </p>
                            <div className="mt-6 flex items-baseline">
                                <span className="text-5xl font-bold tracking-tight">$0</span>
                                <span className="ml-1 text-lg text-gray-600">forever</span>
                            </div>
                            <ul className="mt-8 space-y-4">
                                {freePlanFeatures.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200">
                                            <div className="h-2 w-2 rounded-full bg-gray-400" />
                                        </div>
                                        <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-auto pt-8">
                            {isModal ? (
                                currentPlan === SubscriptionStatus.FREE && (
                                    <Button
                                        className={secondaryButtonStyles}
                                        disabled
                                    >
                                        Current Plan
                                    </Button>
                                )
                            ) : (
                                <Button asChild className={secondaryButtonStyles}>
                                    <Link href="/sign-up">
                                        Start for free
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-200 flex flex-col h-full">
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-gradient-to-br from-brand1 via-brand2 to-brand3 p-2">
                                        <Rocket className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-900">Pro Plan</h3>
                                </div>
                                <span className="rounded-full bg-brand2/10 px-4 py-1 text-sm text-brand2 font-medium">
                                    Most Popular
                                </span>
                            </div>
                            <p className="mt-4 text-gray-600">
                                Unlock the full potential with advanced features and higher usage limits.
                            </p>
                            <div className="mt-6 flex items-baseline">
                                <span className="text-5xl font-bold tracking-tight text-gray-900">$4.99</span>
                                <span className="ml-1 text-lg text-gray-600">per month</span>
                            </div>
                            <ul className="mt-8 space-y-4">
                                {proPlanFeatures.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand1 via-brand2 to-brand3">
                                            <Check className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-auto pt-8">
                            {isModal ? (
                                <Button
                                    className={primaryButtonStyles}
                                    disabled={currentPlan === SubscriptionStatus.PRO}
                                    onClick={handleUpgrade}
                                >
                                    {currentPlan === SubscriptionStatus.PRO ? 'Current Plan' : 'Upgrade to Pro'}
                                </Button>
                            ) : (
                                <Button asChild className={primaryButtonStyles}>
                                    <Link href="/sign-up">
                                        Get Pro
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
} 