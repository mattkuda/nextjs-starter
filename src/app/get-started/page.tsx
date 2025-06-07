"use client"

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Image from 'next/image'
import { MessageCircle, FileText, Ticket, Brain, Settings, CreditCard, Wand2, Megaphone, Sparkles } from 'lucide-react'
import { AnimatedArrowButton } from '../../components/ui/animated-arrow-button'

export default function GetStartedPage() {
    return (
        <div className="min-h-screen">
            <Header />
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-gray-50 to-white">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            Getting Started with FlowThread
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Learn how to use our powerful AI tools to enhance your workflow
                        </p>
                    </div>
                </div>
            </div>

            {/* Feature Sections */}
            <div className="space-y-32 py-16">
                {/* Thread Assistant */}
                <section className="relative">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-blue-50 rounded-3xl p-8 lg:p-16">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <MessageCircle className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Thread Assistant</h2>
                                    </div>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Generate intelligent replies and summarize discussions with our AI-powered assistant.
                                        Perfect for managing complex conversations and ensuring clear communication.
                                    </p>
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                                            </div>
                                            <span>Summarize long threads instantly</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                                            </div>
                                            <span>Generate contextual replies</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                                            </div>
                                            <span>Multiple tone options</span>
                                        </li>
                                    </ul>
                                    <AnimatedArrowButton href="/dashboard" color="blue-600">
                                        Try Thread Assistant
                                    </AnimatedArrowButton>
                                </div>
                                <div className="relative">
                                    <Image
                                        src="/DemoScreenshot.png"
                                        alt="Thread Assistant Demo"
                                        width={1404}
                                        height={1872}
                                        className="rounded-xl shadow-xl ring-1 ring-gray-400/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Thread Starter */}
                <section className="relative">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-pink-50 rounded-3xl p-8 lg:p-16">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="order-2 lg:order-1">
                                    <Image
                                        src="/DemoScreenshot.png"
                                        alt="Thread Starter Demo"
                                        width={1404}
                                        height={1872}
                                        className="rounded-xl shadow-xl ring-1 ring-gray-400/10"
                                    />
                                </div>
                                <div className="order-1 lg:order-2">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-pink-100 p-2 rounded-lg">
                                            <Sparkles className="h-6 w-6 text-pink-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Thread Starter</h2>
                                    </div>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Kickstart meaningful discussions with AI-generated conversation starters.
                                        Perfect for brainstorming, feedback sessions, and team discussions.
                                    </p>
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-pink-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-pink-600" />
                                            </div>
                                            <span>Context-aware suggestions</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-pink-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-pink-600" />
                                            </div>
                                            <span>Multiple discussion formats</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-pink-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-pink-600" />
                                            </div>
                                            <span>Customizable focus areas</span>
                                        </li>
                                    </ul>
                                    <AnimatedArrowButton href="/dashboard" color="pink-600">
                                        Try Thread Starter
                                    </AnimatedArrowButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tone Converter */}
                <section className="relative">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-teal-50 rounded-3xl p-8 lg:p-16">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-teal-100 p-2 rounded-lg">
                                            <Wand2 className="h-6 w-6 text-teal-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Tone Converter</h2>
                                    </div>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Transform your text into the perfect tone for any situation.
                                        From formal to friendly, get multiple variations that match your needs.
                                    </p>
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-teal-600" />
                                            </div>
                                            <span>Multiple tone options</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-teal-600" />
                                            </div>
                                            <span>Language preservation</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-teal-600" />
                                            </div>
                                            <span>Context-aware adjustments</span>
                                        </li>
                                    </ul>
                                    <AnimatedArrowButton href="/dashboard" color="teal-600">
                                        Try Tone Converter
                                    </AnimatedArrowButton>
                                </div>
                                <div className="relative">
                                    <Image
                                        src="/DemoScreenshot.png"
                                        alt="Tone Converter Demo"
                                        width={1404}
                                        height={1872}
                                        className="rounded-xl shadow-xl ring-1 ring-gray-400/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Social Wizard */}
                <section className="relative">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-rose-50 rounded-3xl p-8 lg:p-16">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="order-2 lg:order-1">
                                    <Image
                                        src="/DemoScreenshot.png"
                                        alt="Social Wizard Demo"
                                        width={1404}
                                        height={1872}
                                        className="rounded-xl shadow-xl ring-1 ring-gray-400/10"
                                    />
                                </div>
                                <div className="order-1 lg:order-2">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-rose-100 p-2 rounded-lg">
                                            <Megaphone className="h-6 w-6 text-rose-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Social Wizard</h2>
                                    </div>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Create engaging social media content optimized for each platform.
                                        From LinkedIn to Twitter, craft the perfect post every time.
                                    </p>
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-rose-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-rose-600" />
                                            </div>
                                            <span>Platform-specific formatting</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-rose-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-rose-600" />
                                            </div>
                                            <span>Hashtag optimization</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-rose-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-rose-600" />
                                            </div>
                                            <span>Emoji suggestions</span>
                                        </li>
                                    </ul>
                                    <AnimatedArrowButton href="/dashboard" color="rose-600">
                                        Try Social Wizard
                                    </AnimatedArrowButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Documentation Writer */}
                <section className="relative">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-purple-50 rounded-3xl p-8 lg:p-16">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="order-2 lg:order-1">
                                    <Image
                                        src="/DemoScreenshot.png"
                                        alt="Documentation Writer Demo"
                                        width={1404}
                                        height={1872}
                                        className="rounded-xl shadow-xl ring-1 ring-gray-400/10"
                                    />
                                </div>
                                <div className="order-1 lg:order-2">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-purple-100 p-2 rounded-lg">
                                            <FileText className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Documentation Writer</h2>
                                    </div>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Transform conversations and notes into well-structured documentation automatically.
                                        Save time while maintaining consistency across your documentation.
                                    </p>
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-purple-600" />
                                            </div>
                                            <span>Auto-generate structured docs</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-purple-600" />
                                            </div>
                                            <span>Extract key points</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-purple-600" />
                                            </div>
                                            <span>Create action items</span>
                                        </li>
                                    </ul>
                                    <AnimatedArrowButton href="/dashboard" color="purple-600">
                                        Try Documentation Writer
                                    </AnimatedArrowButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Continue with similar sections for:
        - Jira Ticket Creator (Green theme)
        - AI Coach (Orange theme)
        - Profile Settings (Gray theme)
        - Plan & Billing (Blue theme)
        */}

                {/* Jira Ticket Creator */}
                <section className="relative">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-green-50 rounded-3xl p-8 lg:p-16">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <Ticket className="h-6 w-6 text-green-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Jira Ticket Creator</h2>
                                    </div>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Convert discussions into well-structured Jira tickets automatically.
                                        Maintain consistency and save time in your project management workflow.
                                    </p>
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-green-600" />
                                            </div>
                                            <span>Auto-generate ticket structure</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-green-600" />
                                            </div>
                                            <span>Smart tag suggestions</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-green-600" />
                                            </div>
                                            <span>Priority recommendations</span>
                                        </li>
                                    </ul>
                                    <AnimatedArrowButton href="/dashboard" color="green-600">
                                        Try Ticket Creator
                                    </AnimatedArrowButton>
                                </div>
                                <div className="relative">
                                    <Image
                                        src="/DemoScreenshot.png"
                                        alt="Ticket Creator Demo"
                                        width={1404}
                                        height={1872}
                                        className="rounded-xl shadow-xl ring-1 ring-gray-400/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AI Coach */}
                <section className="relative">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-orange-50 rounded-3xl p-8 lg:p-16">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="order-2 lg:order-1">
                                    <Image
                                        src="/DemoScreenshot.png"
                                        alt="AI Coach Demo"
                                        width={1404}
                                        height={1872}
                                        className="rounded-xl shadow-xl ring-1 ring-gray-400/10"
                                    />
                                </div>
                                <div className="order-1 lg:order-2">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-orange-100 p-2 rounded-lg">
                                            <Brain className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">AI Coach</h2>
                                    </div>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Get personalized feedback and suggestions on your communication.
                                        Improve your writing and communication skills with AI-powered guidance.
                                    </p>
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-orange-600" />
                                            </div>
                                            <span>Real-time writing feedback</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-orange-600" />
                                            </div>
                                            <span>Style improvement suggestions</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-orange-600" />
                                            </div>
                                            <span>Interactive learning</span>
                                        </li>
                                    </ul>
                                    <AnimatedArrowButton href="/dashboard" color="orange-600">
                                        Try AI Coach
                                    </AnimatedArrowButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Settings & Profile */}
                <section className="relative">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-gray-50 rounded-3xl p-8 lg:p-16">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-gray-100 p-2 rounded-lg">
                                            <Settings className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Settings & Profile</h2>
                                    </div>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Manage your account settings and customize your experience.
                                        Keep your profile up to date and control your preferences.
                                    </p>
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-gray-600" />
                                            </div>
                                            <span>Update profile information</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-gray-600" />
                                            </div>
                                            <span>Customize preferences</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-gray-600" />
                                            </div>
                                            <span>Manage notifications</span>
                                        </li>
                                    </ul>
                                    <AnimatedArrowButton href="/dashboard/settings" color="gray-600">
                                        Get Started
                                    </AnimatedArrowButton>
                                </div>
                                <div className="relative">
                                    <Image
                                        src="/DemoScreenshot.png"
                                        alt="Settings Demo"
                                        width={1404}
                                        height={1872}
                                        className="rounded-xl shadow-xl ring-1 ring-gray-400/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Plan & Billing */}
                <section className="relative">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-indigo-50 rounded-3xl p-8 lg:p-16">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="order-2 lg:order-1">
                                    <Image
                                        src="/DemoScreenshot.png"
                                        alt="Plan & Billing Demo"
                                        width={1404}
                                        height={1872}
                                        className="rounded-xl shadow-xl ring-1 ring-gray-400/10"
                                    />
                                </div>
                                <div className="order-1 lg:order-2">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-indigo-100 p-2 rounded-lg">
                                            <CreditCard className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Plan & Billing</h2>
                                    </div>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Manage your subscription and monitor your credit usage.
                                        Upgrade or modify your plan to match your needs.
                                    </p>
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-indigo-600" />
                                            </div>
                                            <span>View available credits</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-indigo-600" />
                                            </div>
                                            <span>Manage subscription</span>
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <div className="h-2 w-2 rounded-full bg-indigo-600" />
                                            </div>
                                            <span>Update billing info</span>
                                        </li>
                                    </ul>
                                    <AnimatedArrowButton href="/dashboard/settings" color="indigo-600">
                                        Get Started
                                    </AnimatedArrowButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Productivity Section */}
                <div className="bg-white py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Supercharge your <span className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-2 bg-gradient-to-r from-brand1 via-brand2 to-brand3 text-transparent bg-clip-text">Productivity</span>
                            {/* <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-2 bg-gradient-to-r from-brand1 via-brand2 to-brand3 text-transparent bg-clip-text"> */}

                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                            FlowThread is your AI-powered ally for seamless communication and workflows.
                        </p>
                        <div className="text-center mt-4">
                            <div className="opacity-0 animate-fade-in [animation-delay:400ms] [animation-fill-mode:forwards]">
                                <AnimatedArrowButton href="/signup" size="large" color="gradient">
                                    Get started for free
                                </AnimatedArrowButton>
                                <p className="mt-4 text-sm text-gray-600">No credit card required</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
} 