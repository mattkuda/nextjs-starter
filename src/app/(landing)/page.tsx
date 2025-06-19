"use client"

import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { TweetsSection } from '@/components/landing/tweets-section'
import { SimplePricingCards } from "@/components/SimplePricingCards"
import { AnimatedSection } from "@/components/ui/animated-section"
import { Badge } from "@/components/ui/badge"
import { FaqSection } from '@/components/landing/faq-section'
import { CtaSection } from '@/components/landing/cta-section'
import { Header } from '@/components/Header'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <HeroSection />
            <HowItWorksSection />
            <TweetsSection />
            <FeaturesSection />
            <AnimatedSection id="pricing" className="bg-muted/30">
                <div className="container p-4 md:px-6 mx-auto">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                            Pricing
                        </Badge>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Simple pricing, powerful results
                        </h2>
                    </div>
                    <SimplePricingCards />
                </div>
            </AnimatedSection>
            <FaqSection />
            <TestimonialsSection />
            <CtaSection />
            <Footer />
        </div>
    )
} 