'use client'

import { AnimatedSection } from "@/components/ui/animated-section"
import { Badge } from "@/components/ui/badge"
import { SimplePricingCards } from "@/components/SimplePricingCards"

export function LandingPagePricingSection() {
    return (
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
    )
}
