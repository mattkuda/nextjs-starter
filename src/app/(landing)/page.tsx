"use client"

import Image from 'next/image'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { AnimatedArrowButton } from "@/components/ui/animated-arrow-button"
import { PricingSection } from "@/components/landing/pricing-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { TESTIMONIALS } from '@/lib/constants'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-white">
                <Header />
                <div className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-32 lg:pb-16">
                    <div className="mx-auto max-w-7xl text-center">
                        <div className="opacity-0 animate-fade-in">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                Your AI Companion To<br />
                                Help You <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Code Anything</span>
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
                                NextJS Starter creates detailed documentation for your AI coding projects and eliminates setup time with pre-integrated services.
                            </p>
                        </div>
                        <div className="opacity-0 animate-fade-in [animation-delay:400ms] [animation-fill-mode:forwards]">
                            <AnimatedArrowButton color="gradient" href="/sign-up" size="large" className="mt-10">
                                Get Started Today
                            </AnimatedArrowButton>
                            <p className="mt-4 text-sm text-gray-500">No credit card required</p>
                        </div>
                    </div>
                </div>
                {/* App Screenshot */}
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8">
                    <div className="border-8 border-gray-200 rounded-xl shadow-2xl opacity-0 animate-slide-up [animation-delay:800ms] [animation-fill-mode:forwards]">
                        <div className="overflow-hidden rounded-lg bg-white">
                            <div className="h-[400px]">
                                <Image
                                    src="/DemoScreenshot.png"
                                    alt="NextJS Starter Dashboard"
                                    width={2880}
                                    height={1620}
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background for remaining sections */}
            <div className="relative bg-gray-50">

                {/* Features Section */}
                <FeaturesSection />

                {/* How It Works Section */}
                <HowItWorksSection />

                {/* Testimonials Section */}
                <div id="testimonials" className="py-24 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold tracking-tight text-center mb-4 text-gray-900">
                            Loved by Developers
                        </h2>
                        <p className="text-center text-gray-600 mb-16">
                            Join thousands of developers who ship faster with our starter kit
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {TESTIMONIALS.map((testimonial) => (
                                <div
                                    key={testimonial.name}
                                    className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-200 transform hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="relative w-12 h-12">
                                            <Image
                                                src={testimonial.imageUrl}
                                                alt={testimonial.name}
                                                fill
                                                className="rounded-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {testimonial.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-lg">
                                        {testimonial.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <PricingSection isWaitlistMode={false} />

                {/* FAQ Section */}
                <div id="faq" className="py-24 bg-white">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-2 text-gray-900">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-center text-gray-600 mb-12">
                            Everything you need to know about NextJS Starter and building with our kit
                        </p>
                        <Accordion type="single" collapsible className="space-y-4">
                            <AccordionItem value="item-1" className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg px-6">
                                <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                                    What is NextJS Starter and how does it work?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 pb-4">
                                    NextJS Starter is a modern, batteries-included starter kit built with Next.js and TypeScript.
                                    It eliminates setup time by pre-integrating authentication (Clerk), database (Supabase),
                                    payments (Stripe), OpenAI access, and Shadcn UI components. Just clone and start building.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg px-6">
                                <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                                    What services are pre-integrated?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 pb-4">
                                    We include Clerk for authentication, Supabase for database, Stripe for payments,
                                    OpenAI API wrapper, Shadcn UI components, ESLint + Prettier setup, TypeScript strict mode,
                                    and optimized folder structure for scalability.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg px-6">
                                <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                                    Can I customize the components and styling?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 pb-4">
                                    Absolutely! The starter kit uses Shadcn UI with Tailwind CSS, making it easy to customize.
                                    All components are built with modern practices and can be modified to fit your brand and requirements.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4" className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg px-6">
                                <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                                    Do I need to set up environment variables?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 pb-4">
                                    Yes, but we make it easy! The kit includes a comprehensive .env.example file with all required
                                    environment variables. Simply copy it to .env and add your API keys for the services you want to use.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5" className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg px-6">
                                <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                                    Is this suitable for production apps?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 pb-4">
                                    Yes! The starter kit is built with production-ready practices including TypeScript strict mode,
                                    proper error handling, security best practices, and scalable folder structure. Many developers
                                    use it as the foundation for their SaaS products.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-6" className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg px-6">
                                <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                                    Do you provide documentation and support?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 pb-4">
                                    Yes! The kit includes comprehensive documentation, setup guides, and example implementations.
                                    Our community is also available to help with questions and share best practices.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>

                {/* Final CTA Section */}
                <div className="py-16 bg-gray-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
                            Start Building Your Next Project
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                            Stop wasting time on boilerplate. Start with a solid foundation and ship faster.
                        </p>
                        <div className="text-center mt-8">
                            <div className="opacity-0 animate-fade-in [animation-delay:400ms] [animation-fill-mode:forwards]">
                                <AnimatedArrowButton href="/sign-up" size="large" color="gradient">
                                    Get started for free
                                </AnimatedArrowButton>
                                <p className="mt-4 text-sm text-gray-500">No credit card required</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
} 