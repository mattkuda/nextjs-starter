'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function FaqSection() {
    return (
        <div id="faq" className="py-24 bg-background">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-2 text-foreground">
                    Frequently Asked Questions
                </h2>
                <p className="text-center text-muted-foreground mb-12">
                    Everything you need to know about NextJS Starter and building with our kit
                </p>
                <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="item-1" className="bg-card shadow-sm ring-1 ring-border rounded-lg px-6">
                        <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                            What is NextJS Starter and how does it work?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4">
                            NextJS Starter is a modern, batteries-included starter kit built with Next.js and TypeScript.
                            It eliminates setup time by pre-integrating authentication (Clerk), database (Supabase),
                            payments (Stripe), OpenAI access, and Shadcn UI components. Just clone and start building.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="bg-card shadow-sm ring-1 ring-border rounded-lg px-6">
                        <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                            What services are pre-integrated?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4">
                            We include Clerk for authentication, Supabase for database, Stripe for payments,
                            OpenAI API wrapper, Shadcn UI components, ESLint + Prettier setup, TypeScript strict mode,
                            and optimized folder structure for scalability.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="bg-card shadow-sm ring-1 ring-border rounded-lg px-6">
                        <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                            Can I customize the components and styling?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4">
                            Absolutely! The starter kit uses Shadcn UI with Tailwind CSS, making it easy to customize.
                            All components are built with modern practices and can be modified to fit your brand and requirements.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4" className="bg-card shadow-sm ring-1 ring-border rounded-lg px-6">
                        <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                            Do I need to set up environment variables?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4">
                            Yes, but we make it easy! The kit includes a comprehensive .env.example file with all required
                            environment variables. Simply copy it to .env and add your API keys for the services you want to use.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5" className="bg-card shadow-sm ring-1 ring-border rounded-lg px-6">
                        <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                            Is this suitable for production apps?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4">
                            Yes! The starter kit is built with production-ready practices including TypeScript strict mode,
                            proper error handling, security best practices, and scalable folder structure. Many developers
                            use it as the foundation for their SaaS products.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6" className="bg-card shadow-sm ring-1 ring-border rounded-lg px-6">
                        <AccordionTrigger className="text-left text-lg hover:no-underline py-4">
                            Do you provide documentation and support?
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4">
                            Yes! The kit includes comprehensive documentation, setup guides, and example implementations.
                            Our community is also available to help with questions and share best practices.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}