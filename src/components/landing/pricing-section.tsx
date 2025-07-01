'use client'

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckIcon, ArrowRightIcon } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { SubscriptionStatus, PLANS, PlanId } from "@/lib/constants"

interface PricingSectionProps {
    isWaitlistMode?: boolean
    currentSubscriptionStatus?: SubscriptionStatus
    isModal?: boolean
}

/**
 * Pricing section that adapts based on waitlist mode and subscription status
 * In waitlist mode: shows pricing and waitlist CTAs
 * In regular mode: shows actual pricing and sign-up CTAs
 * When currentSubscriptionStatus is provided: shows current plan status and upgrade options
 */
export function PricingSection({
    isWaitlistMode = false,
    currentSubscriptionStatus,
    isModal = false
}: PricingSectionProps) {
    const [isYearly, setIsYearly] = useState(false)
    const { user } = useUser()

    const scrollToEmail = () => {
        const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
        if (emailInput) {
            emailInput.scrollIntoView({ behavior: 'smooth' })
            emailInput.focus()
        }
    }

    const handleSubscribe = async (plan: PlanId) => {
        // If user is not logged in, redirect to sign-up with plan parameters
        if (!user) {
            const billingPeriod = isYearly ? 'yearly' : 'monthly'
            window.location.href = `/sign-up?plan=${plan}&billing=${billingPeriod}`
            return
        }

        try {
            const billingPeriod = isYearly ? 'yearly' : 'monthly'
            const response = await axios.post('/api/upgradePlan', {
                clerkId: user.id,
                userId: user.id, // You might need to get the actual user ID from your database
                email: user.primaryEmailAddress?.emailAddress,
                plan: plan,
                billing: billingPeriod,
            });

            const data = response.data;
            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe Checkout
            }
        } catch (error) {
            console.error('Error starting subscription:', error);
        }
    }

    const getSavingsAmount = (monthlyPrice: number) => {
        const annualCost = monthlyPrice * 12
        const yearlyPrice = monthlyPrice * 10 // 10 months pricing
        return annualCost - yearlyPrice
    }

    // Helper function to determine plan hierarchy for comparison
    const getPlanLevel = (status: SubscriptionStatus) => {
        switch (status) {
            case SubscriptionStatus.FREE: return 0
            case SubscriptionStatus.STARTER: return 1
            case SubscriptionStatus.PRO: return 2
            case SubscriptionStatus.MAX: return 3
            default: return 0
        }
    }

    // Helper function to get plan status for each plan
    const getPlanStatus = (planId: string) => {
        if (!currentSubscriptionStatus) return 'available'

        const currentLevel = getPlanLevel(currentSubscriptionStatus)
        const planLevel = getPlanLevel(planId as SubscriptionStatus)

        if (currentLevel === planLevel) return 'current'
        if (planLevel > currentLevel) return 'upgrade'
        return 'downgrade' // We'll hide these
    }

    // Helper function to get button text and state
    const getButtonConfig = (planId: string) => {
        const status = getPlanStatus(planId)

        switch (status) {
            case 'current':
                return {
                    text: 'Current Plan',
                    disabled: true,
                    variant: 'secondary' as const
                }
            case 'upgrade':
                return {
                    text: `Upgrade to ${planId.charAt(0).toUpperCase() + planId.slice(1)}`,
                    disabled: false,
                    variant: 'default' as const
                }
            case 'downgrade':
                return {
                    text: `Downgrade to ${planId.charAt(0).toUpperCase() + planId.slice(1)}`,
                    disabled: false,
                    variant: 'outline' as const,
                    hidden: true // We'll hide downgrade options
                }
            default:
                return {
                    text: isWaitlistMode ? 'Join Waitlist' : `Get ${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
                    disabled: false,
                    variant: 'default' as const
                }
        }
    }

    const content = (
        <div className="container p-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                    Pricing
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Simple pricing, powerful results
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    {isWaitlistMode
                        ? "Choose the plan that fits your workflow needs. Join the waitlist for early access."
                        : "Choose the plan that fits your workflow needs."
                    }
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center mt-8 mb-8">
                    <Tabs
                        value={isYearly ? 'yearly' : 'monthly'}
                        onValueChange={(value) => setIsYearly(value === 'yearly')}
                        className="w-96"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="monthly" className="text-sm font-medium">
                                Monthly
                            </TabsTrigger>
                            <TabsTrigger value="yearly" className="text-sm font-medium">
                                <span className="flex items-center">
                                    Yearly
                                    <Badge className="ml-2 bg-green-100 text-green-700 text-xs whitespace-nowrap">
                                        2 months free
                                    </Badge>
                                </span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Dynamic grid based on filtered plans */}
            {(() => {
                const filteredPlans = PLANS.filter(plan => {
                    // Hide downgrade options when showing current subscription status
                    if (currentSubscriptionStatus) {
                        const buttonConfig = getButtonConfig(plan.id)
                        return !buttonConfig.hidden
                    }
                    return true
                })

                const gridCols = currentSubscriptionStatus
                    ? `grid-cols-1 md:grid-cols-${Math.min(filteredPlans.length, 3)}`
                    : 'grid-cols-1 md:grid-cols-3'

                return (
                    <div className={`grid ${gridCols} gap-8 max-w-7xl mx-auto`}>
                        {filteredPlans.map((plan, index) => {
                            const buttonConfig = getButtonConfig(plan.id)
                            const planStatus = getPlanStatus(plan.id)
                            const IconComponent = plan.icon

                            // Determine if this plan should be highlighted as the recommended upgrade
                            const planId = plan.id as PlanId
                            const isRecommendedUpgrade = currentSubscriptionStatus && planStatus === 'upgrade' &&
                                (plan.isPopular ||
                                    (currentSubscriptionStatus === SubscriptionStatus.FREE && planId === 'starter') ||
                                    (currentSubscriptionStatus === SubscriptionStatus.STARTER && planId === 'pro') ||
                                    (currentSubscriptionStatus === SubscriptionStatus.PRO && planId === 'max'))

                            const cardBorderClass = planStatus === 'current'
                                ? 'border-2 border-muted-foreground/30 bg-muted/20' // Subtle styling for current plan
                                : isRecommendedUpgrade
                                    ? 'border-2 border-primary shadow-lg shadow-primary/20' // Highlight recommended upgrade
                                    : planStatus === 'upgrade'
                                        ? 'border-2 border-primary/50 hover:border-primary transition-colors' // primary highlight for other upgrades
                                        : plan.isPopular && !currentSubscriptionStatus
                                            ? 'border-2 border-primary' // Original popular styling for unauthenticated
                                            : 'border hover:border-muted-foreground/50 transition-colors' // Default styling

                            const CardComponent = isModal ? 'div' : motion.div
                            const cardProps = isModal
                                ? {}
                                : {
                                    initial: { opacity: 0, y: 50 },
                                    whileInView: { opacity: 1, y: 0 },
                                    viewport: { once: true, margin: "-100px" },
                                    transition: { duration: 0.6, delay: 0.1 * (index + 1) }
                                }

                            return (
                                <CardComponent
                                    key={plan.id}
                                    className={`bg-background rounded-lg p-8 relative flex flex-col ${cardBorderClass}`}
                                    {...cardProps}
                                >
                                    {planStatus === 'current' && (
                                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-muted text-muted-foreground">
                                            CURRENT PLAN
                                        </Badge>
                                    )}
                                    {isRecommendedUpgrade && (
                                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                                            RECOMMENDED
                                        </Badge>
                                    )}
                                    {planStatus === 'upgrade' && !isRecommendedUpgrade && (
                                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                                            UPGRADE
                                        </Badge>
                                    )}
                                    {plan.isPopular && !currentSubscriptionStatus && (
                                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                                            MOST POPULAR
                                        </Badge>
                                    )}
                                    <div className="flex items-center space-x-2 mb-2">
                                        <IconComponent className="h-5 w-5" />
                                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                                    </div>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">
                                            ${isYearly ? (plan.yearlyPrice / 12).toFixed(2) : plan.monthlyPrice.toFixed(2)}
                                        </span>
                                        <span className="text-muted-foreground">/month</span>
                                        {isYearly && (
                                            <div className="text-sm text-muted-foreground mt-1">
                                                billed as ${plan.yearlyPrice.toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground mb-6">
                                        {plan.description}
                                    </p>
                                    <div className="flex-grow">
                                        <ul className="space-y-3">
                                            {isYearly && (
                                                <li className="flex items-center">
                                                    <CheckIcon className="h-4 w-4 text-primary mr-3" />
                                                    <span className="text-sm font-medium text-primary">
                                                        Save ${getSavingsAmount(plan.monthlyPrice).toFixed(2)}
                                                    </span>
                                                </li>
                                            )}
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-center">
                                                    <CheckIcon className="h-4 w-4 text-primary mr-3" />
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <Button
                                        className={`w-full h-12 text-base mt-6 ${planStatus === 'current'
                                            ? 'bg-muted hover:bg-muted text-muted-foreground cursor-not-allowed'
                                            : isRecommendedUpgrade
                                                ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg'
                                                : planStatus === 'upgrade'
                                                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                                    : plan.isPopular && !currentSubscriptionStatus
                                                        ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white'
                                                        : 'bg-primary hover:bg-primary/90 text-white'
                                            }`}
                                        variant={buttonConfig.variant}
                                        disabled={buttonConfig.disabled}
                                        onClick={
                                            buttonConfig.disabled
                                                ? undefined
                                                : isWaitlistMode
                                                    ? scrollToEmail
                                                    : () => handleSubscribe(plan.id)
                                        }
                                    >
                                        {buttonConfig.text}
                                        {!buttonConfig.disabled && <ArrowRightIcon className="ml-2 h-4 w-4" />}
                                    </Button>
                                </CardComponent>
                            )
                        })}
                    </div>
                )
            })()}
        </div>
    )

    if (isModal) {
        return (
            <div className="bg-muted/30 py-8">
                {content}
            </div>
        )
    }

    return (
        <AnimatedSection id="pricing" className="bg-muted/30">
            {content}
        </AnimatedSection>
    )
}