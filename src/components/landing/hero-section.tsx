'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { AnimatedButton } from "@/components/ui/animated-arrow-button"
import { AnimatedCounter } from "@/components/ui/animated-counter"

interface HeroSectionProps {
    isWaitlistMode?: boolean
}

/**
 * Hero section that adapts based on waitlist mode
 * Set NEXT_PUBLIC_WAITLIST_MODE=true in environment to enable waitlist mode
 * Set NEXT_PUBLIC_WAITLIST_MODE=false or omit to enable regular mode
 */
export function HeroSection({ isWaitlistMode = process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true' }: HeroSectionProps) {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleWaitlistSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("You're on the waitlist!", {
                    description: "We'll notify you when OptYou launches.",
                })
                setEmail("")
            } else {
                toast.error("Error", {
                    description: data.error || "Failed to join waitlist. Please try again.",
                })
            }
        } catch (error) {
            console.error('Waitlist signup error:', error)
            toast.error("Error", {
                description: "Something went wrong. Please try again.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleGetStarted = () => {
        // Navigate to sign up or dashboard based on auth state
        window.location.href = '/sign-up'
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80">
            <div className="container px-4 py-16 md:px-6 lg:py-20 text-center -mt-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                        {isWaitlistMode ? "🚀 Become an early adopter" : "🚀 Start optimizing today"}
                    </Badge>
                </motion.div>
                <motion.h1
                    className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    <span className="whitespace-nowrap">Get actionable health advice</span>
                    <br />
                    Live until <AnimatedCounter />
                </motion.h1>
                <motion.p
                    className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                    OptYou connects your Garmin, WHOOP, and other wearables into one intelligent dashboard. See patterns, hit goals, and optimize your performance without the spreadsheet chaos.
                </motion.p>

                {isWaitlistMode ? (
                    <motion.form
                        onSubmit={handleWaitlistSignup}
                        className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row max-w-lg mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
                    >
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1"
                            required
                        />
                        <AnimatedButton disabled={isSubmitting} type="submit">
                            Join Waitlist
                        </AnimatedButton>
                    </motion.form>
                ) : (
                    <motion.div
                        className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row max-w-lg mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
                    >
                        <AnimatedButton onClick={handleGetStarted}>
                            Get Started Free
                        </AnimatedButton>
                        <Button variant="outline" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                            View Pricing
                        </Button>
                    </motion.div>
                )}

                <motion.p
                    className="mt-4 text-sm text-muted-foreground"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                >
                    {isWaitlistMode
                        ? "✨ Free for early adopters • 🔒 No credit card required"
                        : "✨ Free forever plan • 🔒 No credit card required"
                    }
                </motion.p>
            </div>
        </section>
    )
} 