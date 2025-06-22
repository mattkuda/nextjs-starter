"use client"

import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { TweetsSection } from '@/components/landing/tweets-section'
import { LandingPagePricingSection } from '@/components/landing/landing-page-pricing-section'
import { FaqSection } from '@/components/landing/faq-section'
import { CtaSection } from '@/components/landing/cta-section'
import { Header } from '@/components/Header'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <HeroSection />
            <HowItWorksSection />
            <TweetsSection />
            <FeaturesSection />
            <LandingPagePricingSection />
            <FaqSection />
            <TestimonialsSection />
            <CtaSection />
            <Footer />
        </div>
    )
}