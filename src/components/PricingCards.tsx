'use client'

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckIcon, ArrowRightIcon, Rocket, Star, Crown } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import axios from "axios"

export function PricingCards() {
    const [isYearly, setIsYearly] = useState(false)
    const { user } = useUser()

    const handleSubscribe = async (plan: 'starter' | 'pro' | 'max') => {
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
                userId: user.id,
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

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            monthlyPrice: 9.99,
            yearlyPrice: 99.9,
            credits: 100,
            description: 'Perfect for individuals getting started with AI-powered workflows.',
            icon: <Rocket className="h-5 w-5" />,
            features: [
                'Access to all core features',
                '100 monthly credits',
                'Basic AI assistance',
                'Email support',
                'Standard processing speed'
            ]
        },
        {
            id: 'pro',
            name: 'Pro',
            monthlyPrice: 19.99,
            yearlyPrice: 199.9,
            credits: 500,
            description: 'Ideal for professionals and small teams with higher usage needs.',
            isPopular: true,
            icon: <Star className="h-5 w-5" />,
            features: [
                'Everything in Starter',
                '500 monthly credits',
                'Advanced AI assistance',
                'Priority email support',
                'Advanced tone options',
                'Faster processing speed',
                'Custom templates'
            ]
        },
        {
            id: 'max',
            name: 'Max',
            monthlyPrice: 49.99,
            yearlyPrice: 499.9,
            credits: 2000,
            description: 'For power users and teams that need maximum capacity.',
            icon: <Crown className="h-5 w-5" />,
            features: [
                'Everything in Pro',
                '2,000 monthly credits',
                'Premium AI assistance',
                'Phone & priority support',
                'Advanced integrations',
                'Custom AI models',
                'Team collaboration',
                'Analytics dashboard'
            ]
        }
    ]

    const getSavingsAmount = (monthlyPrice: number) => {
        const annualCost = monthlyPrice * 12
        const yearlyPrice = monthlyPrice * 10
        return annualCost - yearlyPrice
    }

    return (
        <div className="w-full">
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8">
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

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        className={`bg-background rounded-lg p-8 border ${plan.isPopular ? 'border-2 border-primary relative' : ''
                            }`}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                    >
                        {plan.isPopular && (
                            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                                MOST POPULAR
                            </Badge>
                        )}
                        <div className="flex items-center space-x-2 mb-2">
                            {plan.icon}
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
                        <Button
                            className={`w-full mb-6 ${plan.isPopular
                                ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white'
                                : 'bg-primary hover:bg-primary/90 text-white'
                                }`}
                            variant={plan.isPopular ? 'default' : 'default'}
                            onClick={() => handleSubscribe(plan.id as 'starter' | 'pro' | 'max')}
                        >
                            Get {plan.name} Plan
                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </Button>
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
                    </motion.div>
                ))}
            </div>
        </div>
    )
} 