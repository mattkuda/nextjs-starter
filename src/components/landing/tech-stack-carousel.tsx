'use client'

import Image from 'next/image'

const techLogos = [
    { name: 'Next.js', src: '/tech-logos/nextjs.png', alt: 'Next.js Logo' },
    { name: 'Supabase', src: '/tech-logos/supabase.png', alt: 'Supabase Logo' },
    { name: 'Stripe', src: '/tech-logos/stripe.png', alt: 'Stripe Logo' },
    { name: 'OpenAI', src: '/tech-logos/open-ai.png', alt: 'OpenAI Logo' },
    { name: 'Clerk', src: '/tech-logos/clerk.png', alt: 'Clerk Logo' },
    { name: 'Cursor', src: '/tech-logos/cursor.png', alt: 'Cursor Logo' },
    { name: 'Tailwind', src: '/tech-logos/tailwind.png', alt: 'Tailwind Logo' },
    { name: 'React', src: '/tech-logos/react.png', alt: 'React Logo' },
];


export function TechStackCarousel() {
    return (
        <div className="opacity-0 animate-fade-in [animation-delay:1200ms] [animation-fill-mode:forwards]">
            <div className="relative w-full overflow-hidden">
                <div className="flex gap-12 items-center py-8 animate-scroll-infinite">
                    {/* First set */}
                    {techLogos.map((logo, index) => (
                        <div
                            key={`logo-set1-${index}`}
                            className="flex-shrink-0 flex items-center justify-center"
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={120}
                                height={40}
                                className="h-10 w-auto object-contain transition-all duration-300 dark:grayscale dark:invert"
                            />
                        </div>
                    ))}
                    {/* Second set for seamless loop */}
                    {techLogos.map((logo, index) => (
                        <div
                            key={`logo-set2-${index}`}
                            className="flex-shrink-0 flex items-center justify-center"
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={120}
                                height={40}
                                className="h-10 w-auto object-contain transition-all duration-300 dark:grayscale dark:invert"
                            />
                        </div>
                    ))}
                    {/* Third set for seamless loop */}
                    {techLogos.map((logo, index) => (
                        <div
                            key={`logo-set3-${index}`}
                            className="flex-shrink-0 flex items-center justify-center"
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={120}
                                height={40}
                                className="h-10 w-auto object-contain transition-all duration-300 dark:grayscale dark:invert"
                            />
                        </div>
                    ))}
                    {/* Fourth set for seamless loop */}
                    {techLogos.map((logo, index) => (
                        <div
                            key={`logo-set4-${index}`}
                            className="flex-shrink-0 flex items-center justify-center"
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={120}
                                height={40}
                                className="h-10 w-auto object-contain transition-all duration-300 dark:grayscale dark:invert"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
