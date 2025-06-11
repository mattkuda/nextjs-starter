'use client'

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckIcon, ArrowRightIcon } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"

interface PricingSectionProps {
    isWaitlistMode?: boolean
}

/**
 * Pricing section that adapts based on waitlist mode
 * In waitlist mode: shows "Free" pricing and waitlist CTAs
 * In regular mode: shows actual pricing and sign-up CTAs
 */
export function PricingSection({ isWaitlistMode = false }: PricingSectionProps) {
    const scrollToEmail = () => {
        const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement
        if (emailInput) {
            emailInput.scrollIntoView({ behavior: 'smooth' })
            emailInput.focus()
        }
    }

    const handleGetStarted = (plan: 'free' | 'pro') => {
        // Navigate to sign up with plan parameter
        window.location.href = `/sign-up?plan=${plan}`
    }

    return (
        <AnimatedSection id="pricing" className="py-16 md:py-24 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        Pricing
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Simple pricing, powerful results
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        {isWaitlistMode
                            ? "Start free, upgrade when you're ready. No hidden fees, no lock-in contracts."
                            : "Choose the plan that fits your workflow needs."
                        }
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <motion.div
                        className="bg-background rounded-lg p-8 border"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h3 className="text-2xl font-bold mb-2">Free</h3>
                        <div className="mb-6">
                            <span className="text-4xl font-bold">$0</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <p className="text-muted-foreground mb-6">
                            Perfect for trying out NextJS Starter's AI-powered features and basic workflows.
                        </p>
                        <Button
                            className="w-full mb-6"
                            variant="outline"
                            onClick={isWaitlistMode ? scrollToEmail : () => handleGetStarted('free')}
                        >
                            {isWaitlistMode ? 'Join Waitlist' : 'Get Started'}
                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </Button>
                        <ul className="space-y-3">
                            <li className="flex items-center">
                                <CheckIcon className="h-4 w-4 text-primary mr-3" />
                                <span className="text-sm">Access to all core features</span>
                            </li>
                            <li className="flex items-center">
                                <CheckIcon className="h-4 w-4 text-primary mr-3" />
                                <span className="text-sm">5 total credits included</span>
                            </li>
                            <li className="flex items-center">
                                <CheckIcon className="h-4 w-4 text-primary mr-3" />
                                <span className="text-sm">Basic AI assistance</span>
                            </li>
                            <li className="flex items-center">
                                <CheckIcon className="h-4 w-4 text-primary mr-3" />
                                <span className="text-sm">Community support</span>
                            </li>
                        </ul>
                    </motion.div>
                    <motion.div
                        className="bg-background rounded-lg p-8 border-2 border-primary relative"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                            MOST POPULAR
                        </Badge>
                        <h3 className="text-2xl font-bold mb-2">Pro</h3>
                        <div className="mb-6">
                            <span className="text-4xl font-bold">$4.99</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                        <p className="text-muted-foreground mb-6">
                            Unlock the full potential with advanced features and higher usage limits.
                        </p>
                        <Button
                            className="w-full mb-6 bg-primary hover:bg-primary/90"
                            onClick={isWaitlistMode ? scrollToEmail : () => handleGetStarted('pro')}
                        >
                            {isWaitlistMode ? 'Join Waitlist' : 'Get Started'}
                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </Button>
                        <ul className="space-y-3">
                            <li className="flex items-center">
                                <CheckIcon className="h-4 w-4 text-primary mr-3" />
                                <span className="text-sm">Everything in Free</span>
                            </li>
                            <li className="flex items-center">
                                <CheckIcon className="h-4 w-4 text-primary mr-3" />
                                <span className="text-sm">1,000 credits per month</span>
                            </li>
                            <li className="flex items-center">
                                <CheckIcon className="h-4 w-4 text-primary mr-3" />
                                <span className="text-sm">Advanced AI assistance</span>
                            </li>
                            <li className="flex items-center">
                                <CheckIcon className="h-4 w-4 text-primary mr-3" />
                                <span className="text-sm">Priority email support</span>
                            </li>
                            <li className="flex items-center">
                                <CheckIcon className="h-4 w-4 text-primary mr-3" />
                                <span className="text-sm">Advanced tone options</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </AnimatedSection>
    )
} 