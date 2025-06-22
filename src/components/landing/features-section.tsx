'use client'

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ShieldIcon,
    DatabaseIcon,
    CreditCardIcon,
    BrainCircuitIcon,
    PaletteIcon,
    CodeIcon,
    ArrowRightIcon
} from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"

export function FeaturesSection() {
    const features = [
        {
            icon: ShieldIcon,
            title: "Full-Stack Authentication",
            description: "Clerk integration with prebuilt sign-in, sign-up, and user profile components. Route protection included out of the box."
        },
        {
            icon: DatabaseIcon,
            title: "Database Ready",
            description: "Supabase integration with client wrapper and examples. Supports both server-side and client-side usage patterns."
        },
        {
            icon: CreditCardIcon,
            title: "Payment Processing",
            description: "Stripe integration with checkout sessions, webhooks, and subscription management for monthly and yearly plans."
        },
        {
            icon: BrainCircuitIcon,
            title: "OpenAI Integration",
            description: "Server-side API wrapper for OpenAI chat completions. Build AI features without the complexity of direct API management."
        },
        {
            icon: PaletteIcon,
            title: "Modern UI Components",
            description: "Shadcn UI with Tailwind CSS. Preconfigured components, theming system, and responsive design patterns."
        },
        {
            icon: CodeIcon,
            title: "Developer Experience",
            description: "TypeScript strict mode, ESLint + Prettier, file-based routing, and optimized folder structure for scalability."
        }
    ]

    const scrollToHero = () => {
        const heroSection = document.querySelector('section:first-of-type')
        if (heroSection) {
            heroSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <AnimatedSection id="features" className="py-16 md:py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        Features
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl max-w-3xl mx-auto text-foreground">
                        Everything you need to build modern web applications
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Stop reinventing the wheel. Start with a solid foundation that includes all the essential services and tools.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            className="text-center"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <div className="mx-auto mb-4 h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <feature.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    )
} 