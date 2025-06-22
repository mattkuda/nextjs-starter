'use client'

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { DownloadIcon, SettingsIcon, RocketIcon } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"

export function HowItWorksSection() {
    const steps = [
        {
            icon: DownloadIcon,
            step: "Step 1",
            title: "Clone and Install",
            description: "Download the starter kit, run npm install, and copy the environment variables. All dependencies and configurations are pre-setup for you."
        },
        {
            icon: SettingsIcon,
            step: "Step 2",
            title: "Configure Services",
            description: "Add your API keys for Clerk, Supabase, Stripe, and OpenAI. Customize the theme colors and branding to match your project."
        },
        {
            icon: RocketIcon,
            step: "Step 3",
            title: "Build and Deploy",
            description: "Start coding your unique features on top of the solid foundation. Deploy to Vercel with one click and scale as you grow."
        }
    ]

    return (
        <AnimatedSection id="how-it-works" className="py-16 md:py-24">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        How it works
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                        From idea to deployed app in 3 simple steps
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Skip the boilerplate setup and focus on building what makes your product unique
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.step}
                            className="text-center"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <div className="mx-auto mb-6 h-48 w-80 bg-gradient-to-br from-muted/50 to-muted rounded-lg flex items-center justify-center">
                                <step.icon className="h-16 w-16 text-primary" />
                            </div>
                            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                                {step.step}
                            </Badge>
                            <h3 className="text-xl font-semibold mb-4 text-foreground">{step.title}</h3>
                            <p className="text-muted-foreground">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div >
        </AnimatedSection >
    )
} 