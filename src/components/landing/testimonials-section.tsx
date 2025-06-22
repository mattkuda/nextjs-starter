'use client'

import Image from 'next/image'
import { TESTIMONIALS } from '@/lib/constants'

export function TestimonialsSection() {
    return (
        <div id="testimonials" className="py-24 bg-background">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold tracking-tight text-center mb-4 text-foreground">
                    Loved by Developers
                </h2>
                <p className="text-center text-muted-foreground mb-16">
                    Join thousands of developers who ship faster with our starter kit
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {TESTIMONIALS.map((testimonial) => (
                        <div
                            key={testimonial.name}
                            className="relative bg-card rounded-xl p-6 shadow-sm border border-border transform hover:-translate-y-1 transition-all duration-300"
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
                                    <h3 className="font-semibold text-foreground">
                                        {testimonial.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                            <p className="text-foreground text-lg">
                                {testimonial.message}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}