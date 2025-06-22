'use client'

import Image from 'next/image'

const techLogos = [
    { name: 'Next.js', src: '/tech-logos/nextjs.png', alt: 'Next.js Logo', invertInDarkMode: true },
    { name: 'Supabase', src: '/tech-logos/supabase.png', alt: 'Supabase Logo', invertInDarkMode: true },
    { name: 'Stripe', src: '/tech-logos/stripe.png', alt: 'Stripe Logo', invertInDarkMode: false },
    { name: 'OpenAI', src: '/tech-logos/open-ai.png', alt: 'OpenAI Logo', invertInDarkMode: true },
    { name: 'Clerk', src: '/tech-logos/clerk.png', alt: 'Clerk Logo', invertInDarkMode: true },
    { name: 'Cursor', src: '/tech-logos/cursor.png', alt: 'Cursor Logo', invertInDarkMode: false },
]

export function TechStackCarousel() {
    return (
        <div className="opacity-0 animate-fade-in [animation-delay:1200ms] [animation-fill-mode:forwards]">
            <div className="relative w-full overflow-hidden">
                <div
                    className="flex animate-scroll-left-visible gap-12 items-center py-8"
                    style={{ transform: 'translateX(0)' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.animationPlayState = 'paused'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.animationPlayState = 'running'
                    }}
                >
                    {/* First set */}
                    {techLogos.map((logo, index) => (
                        <div
                            key={`logo-${index}`}
                            className="flex-shrink-0 flex items-center justify-center"
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={120}
                                height={40}
                                className={`h-10 w-auto object-contain transition-all duration-300 dark:grayscale ${logo.invertInDarkMode ? 'dark:invert ' : ''
                                    }`}
                            />
                        </div>
                    ))}

                    {/* Duplicate for seamless loop */}
                    {techLogos.map((logo, index) => (
                        <div
                            key={`logo-duplicate-${index}`}
                            className="flex-shrink-0 flex items-center justify-center"
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={120}
                                height={40}
                                className={`h-10 w-auto object-contain transition-all duration-300 dark:grayscale ${logo.invertInDarkMode ? 'dark:invert' : ''
                                    }`}
                            />
                        </div>
                    ))}

                    {/* Triple for better seamless loop */}
                    {techLogos.map((logo, index) => (
                        <div
                            key={`logo-triple-${index}`}
                            className="flex-shrink-0 flex items-center justify-center"
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={120}
                                height={40}
                                className={`h-10 w-auto object-contain transition-all duration-300 ${logo.invertInDarkMode ? 'dark:invert' : ''
                                    }`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
