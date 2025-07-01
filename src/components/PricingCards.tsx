'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckIcon, ArrowRightIcon } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { PLANS, PlanId } from "@/lib/constants"

interface PricingCardsProps {
    isWaitlistMode?: boolean
}

export function PricingCards({ isWaitlistMode = false }: PricingCardsProps) {
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
                userId: user.id,
                email: user.primaryEmailAddress?.emailAddress,
                plan: plan,
                billing: billingPeriod,
            });

            const data = response.data;
            if (data.url) {
                window.location.href = data.url;
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

    return (
        <div className="space-y-8">
            {/* Billing Toggle */}
            <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2 bg-muted p-1 rounded-lg">
                    <button
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!isYearly ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        onClick={() => setIsYearly(false)}
                    >
                        Monthly
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${isYearly ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        onClick={() => setIsYearly(true)}
                    >
                        Yearly
                        <Badge className="ml-2 bg-green-100 text-green-700 text-xs">
                            2 months free
                        </Badge>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PLANS.map((plan) => {
                    const IconComponent = plan.icon

                    return (
                        <Card
                            key={plan.id}
                            className={`relative flex flex-col ${plan.isPopular ? 'border-2 border-primary shadow-lg' : ''
                                }`}
                        >
                            {plan.isPopular && (
                                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                                    MOST POPULAR
                                </Badge>
                            )}
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <IconComponent className="h-5 w-5" />
                                    <CardTitle>{plan.name}</CardTitle>
                                </div>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold">
                                        ${isYearly ? (plan.yearlyPrice / 12).toFixed(2) : plan.monthlyPrice.toFixed(2)}
                                    </span>
                                    <span className="text-muted-foreground">/month</span>
                                    {isYearly && (
                                        <div className="text-sm text-muted-foreground mt-1">
                                            billed as ${plan.yearlyPrice.toFixed(2)}
                                        </div>
                                    )}
                                </div>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="space-y-3">
                                    {isYearly && (
                                        <li className="flex items-center">
                                            <CheckIcon className="h-4 w-4 text-primary mr-3" />
                                            <span className="text-sm font-medium text-primary">
                                                Save ${getSavingsAmount(plan.monthlyPrice).toFixed(2)}
                                            </span>
                                        </li>
                                    )}
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <CheckIcon className="h-4 w-4 text-primary mr-3" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className={`w-full h-12 text-base ${plan.isPopular
                                        ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white'
                                        : 'bg-primary hover:bg-primary/90 text-white'
                                        }`}
                                    onClick={isWaitlistMode ? scrollToEmail : () => handleSubscribe(plan.id)}
                                >
                                    {isWaitlistMode ? 'Join Waitlist' : `Get ${plan.name} Plan`}
                                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
} 