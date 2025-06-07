"use client"

import Image from 'next/image'
import { Header } from '@/components/Header'
import { Lightbulb, Rocket, BookOpen, TicketIcon, ArrowLeftRight, BadgeCheck, MessageCircle } from 'lucide-react'
import { Footer } from '../components/Footer'
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { AnimatedArrowButton } from "@/components/ui/animated-arrow-button"
import { TESTIMONIALS } from '@/lib/constants'
import { PricingDisplay } from '@/components/PricingDisplay'

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Gradient Animation */}
      <div className="relative">
        <BackgroundGradientAnimation
          containerClassName="absolute inset-0 -z-10"
        />
        <Header />
        <div className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-32 lg:pb-16">
          <div className="mx-auto max-w-7xl text-center">
            <div className="opacity-0 animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-lg">
                Your personal AI assistant <br /> for a smarter workday.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 drop-shadow">
                NextJS Starter takes care of the details, so you don't have to.
              </p>
            </div>
            <div className="opacity-0 animate-fade-in [animation-delay:400ms] [animation-fill-mode:forwards]">
              <AnimatedArrowButton href="/sign-up" size="large" className="mt-10">
                Get started for free
              </AnimatedArrowButton>
              <p className="mt-4 text-sm text-white/70 drop-shadow">No credit card required</p>
            </div>
          </div>
        </div>
        {/* App Screenshot */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          <div className="overflow-hidden rounded-t-xl bg-white opacity-0 animate-slide-up [animation-delay:800ms] [animation-fill-mode:forwards]">
            {/* Browser Chrome */}
            {/* <div className="bg-gray-100 border-b border-gray-200 rounded-t-xl">
              <div className="flex items-center px-4 py-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                </div>
                <div className="mx-4 flex-1">
                  <div className="w-full max-w-2xl mx-auto bg-white rounded-md h-7 flex items-center px-3">
                    <div className="w-4 h-4 rounded-full bg-gray-200 mr-2" />
                    <div className="h-3 w-64 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            </div> */}
            {/* Screenshot */}
            <div className="h-[500px]">
              <Image
                src="/DemoScreenshot.png"
                alt="NextJS Starter Dashboard"
                width={2880}
                height={1620}
                className="w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Replace white background with subtle mesh gradient */}
      <div className="relative bg-white bg-[radial-gradient(at_40%_20%,rgba(255,173,102,0.05)_0px,transparent_50%),radial-gradient(at_80%_0%,rgba(255,99,178,0.05)_0px,transparent_50%),radial-gradient(at_0%_50%,rgba(173,92,255,0.05)_0px,transparent_50%)]">
        {/* Key Features Section */}
        <div id="features" className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-8">
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Transform the Way You Work
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  NextJS Starter gives you the tools to streamline and elevate your workflows.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-gray-200 p-4 flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-blue-100 rounded p-2">
                      <Lightbulb className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="font-semibold">Extract key insights</h3>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-orange-100 rounded p-2">
                      <Rocket className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="font-semibold">Kickstart discussions</h3>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-purple-100 rounded p-2">
                      <BookOpen className="w-6 h-6 text-purple-500" />
                    </div>
                    <h3 className="font-semibold">Create clear documentation</h3>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-green-100 rounded p-2">
                      <TicketIcon className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="font-semibold">Structure tickets</h3>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-red-100 rounded p-2">
                      <ArrowLeftRight className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="font-semibold">Perfect your tone</h3>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-indigo-100 rounded p-2">
                      <BadgeCheck className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h3 className="font-semibold">Craft social posts</h3>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-pink-100 rounded p-2">
                      <MessageCircle className="w-6 h-6 text-pink-500" />
                    </div>
                    <h3 className="font-semibold">Get personalized guidance</h3>
                  </div>
                </div>
                <h3 className="text-center mt-4">And more...</h3>
              </div>
              <div className="relative">
                <Image
                  src="/DemoScreenshot.png"
                  alt="Transform Feature"
                  width={1404}
                  height={1872}
                  className="rounded-xl shadow-xl ring-1 ring-gray-400/10"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Testimonials Section */}
        <div id="testimonials" className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold tracking-tight text-center mb-4">
              Loved by Professionals
            </h2>
            <p className="text-center text-gray-600 mb-16">
              Join the community of professionals already using our platform
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {TESTIMONIALS.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="relative bg-white rounded-xl p-6 shadow-sm transform hover:-translate-y-1 transition-all duration-300
                    before:absolute before:inset-0 before:-z-10 before:rounded-xl before:bg-gradient-to-r 
                    before:from-brand1/25 before:via-brand2/25 before:to-brand3/25 before:blur-xl
                    before:opacity-0 hover:before:opacity-100 before:transition-opacity"
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
                  <p className="text-gray-900 text-lg">
                    {testimonial.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Pricing Section */}
        <PricingDisplay />
        {/* FAQ Section */}
        <div id="faq" className="py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Everything you need to know about NextJS Starter and our services.
            </p>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                  What is NextJS Starter and how does it work?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  NextJS Starter is an AI-powered platform that helps you streamline communication workflows.
                  It uses advanced AI to help generate replies, summarize discussions, create documentation,
                  and structure tickets. Simply input your text or context, and our AI will help you craft
                  the perfect response or document.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                  How do credits work?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  Credits are used each time you generate content with our AI. Free accounts start with 5
                  total credits, while Pro accounts receive 1,000 credits per month. Different features may
                  use different amounts of credits depending on the complexity and length of the generation.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                  Can I upgrade or downgrade my plan at any time?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  Yes! You can upgrade to Pro or downgrade to Basic at any time. When upgrading, you'll
                  immediately get access to all Pro features. If you downgrade, you'll maintain Pro access
                  until the end of your current billing period.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                  Do you offer refunds?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  We offer a 7-day money-back guarantee for Pro subscriptions. If you're not satisfied
                  with our service, contact our support team within 7 days of your purchase for a full refund.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                  How secure is my data?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  We take data security seriously. All data is encrypted in transit and at rest. We don't
                  store your generated content longer than necessary, and we never use your data to train
                  our AI models. For more details, please review our privacy policy.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6" className="bg-white shadow-sm ring-1 ring-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                  Do you offer customer support?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  Yes! Free users have access to our help center and community forums. Pro users get
                  priority email support with guaranteed response times within 24 hours on business days.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        {/* Productivity Section */}
        <div className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Supercharge Your <span className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-2 bg-gradient-to-r from-brand1 via-brand2 to-brand3 text-transparent bg-clip-text">Productivity</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              NextJS Starter is your AI-powered ally for seamless communication and workflows.
            </p>
            <div className="text-center mt-4">
              <div className="opacity-0 animate-fade-in [animation-delay:400ms] [animation-fill-mode:forwards]">
                <AnimatedArrowButton href="/sign-up" size="large" color="gradient">
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
