"use client"

import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { TweetsSection } from '@/components/landing/tweets-section'
import { PricingSection } from "@/components/landing/pricing-section"
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
            <PricingSection />
            <FaqSection />
            <TestimonialsSection />
            <CtaSection />
            <Footer />
        </div>
    )
} 