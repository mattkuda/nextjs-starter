"use client"

import Image from 'next/image'

const tweets = [
    {
        url: 'https://x.com/MattKuda/status/1931450482859422037',
        author: {
            name: 'Matt Kuda',
            handle: '@MattKuda',
            avatar: 'https://pbs.twimg.com/profile_images/1929289830971633666/GkPVsupo_400x400.jpg',
            verified: true
        },
        content: 'This NextJS starter kit saved me 2 weeks of setup time. Authentication, payments, and deployment all configured perfectly!',
    },
    {
        url: 'https://x.com/MattKuda/status/1931450482859422037',
        author: {
            name: 'Matt Kuda',
            handle: '@MattKuda',
            avatar: 'https://pbs.twimg.com/profile_images/1929289830971633666/GkPVsupo_400x400.jpg',
            verified: true
        },
        content: 'Clean architecture, modern stack, zero config headaches. This starter kit is exactly what every developer needs! 🚀',
    },
    {
        url: 'https://x.com/MattKuda/status/1931450482859422037',
        author: {
            name: 'Matt Kuda',
            handle: '@MattKuda',
            avatar: 'https://pbs.twimg.com/profile_images/1929289830971633666/GkPVsupo_400x400.jpg',
            verified: true
        },
        content: 'From idea to production in minutes, not days. The best NextJS starter I\'ve used - everything just works!',
    },
    {
        url: 'https://x.com/MattKuda/status/1931450482859422037',
        author: {
            name: 'Matt Kuda',
            handle: '@MattKuda',
            avatar: 'https://pbs.twimg.com/profile_images/1929289830971633666/GkPVsupo_400x400.jpg',
            verified: true
        },
        content: 'Finally! A starter kit with actually good documentation and examples. Shipped my MVP in record time ⚡',
    },
    {
        url: 'https://x.com/MattKuda/status/1931450482859422037',
        author: {
            name: 'Matt Kuda',
            handle: '@MattKuda',
            avatar: 'https://pbs.twimg.com/profile_images/1929289830971633666/GkPVsupo_400x400.jpg',
            verified: true
        },
        content: 'TypeScript, Tailwind, Shadcn, Auth - everything I need in one place. This starter kit is pure gold! ✨',
    },
    {
        url: 'https://x.com/MattKuda/status/1931450482859422037',
        author: {
            name: 'Matt Kuda',
            handle: '@MattKuda',
            avatar: 'https://pbs.twimg.com/profile_images/1929289830971633666/GkPVsupo_400x400.jpg',
            verified: true
        },
        content: 'Highly customizable yet perfectly structured. This NextJS starter strikes the perfect balance! 💯',
    },
    {
        url: 'https://x.com/MattKuda/status/1931450482859422037',
        author: {
            name: 'Matt Kuda',
            handle: '@MattKuda',
            avatar: 'https://pbs.twimg.com/profile_images/1929289830971633666/GkPVsupo_400x400.jpg',
            verified: true
        },
        content: 'Blazing fast performance out of the box. The optimization work done here is incredible! 🔥',
    },
    {
        url: 'https://x.com/MattKuda/status/1931450482859422037',
        author: {
            name: 'Matt Kuda',
            handle: '@MattKuda',
            avatar: 'https://pbs.twimg.com/profile_images/1929289830971633666/GkPVsupo_400x400.jpg',
            verified: true
        },
        content: 'Best developer experience I\'ve had with any starter. Clean code, great patterns, everything makes sense!',
    }
]

function TweetCard({ tweet }: { tweet: typeof tweets[0] }) {
    return (
        <div className="flex-shrink-0" style={{ width: '300px', height: '250px' }}>
            <div className="bg-card rounded-xl p-6 h-full flex flex-col border border-border hover:border-border/80 transition-colors">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <Image
                        src={tweet.author.avatar}
                        alt={tweet.author.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground text-[15px] truncate">
                                {tweet.author.name}
                            </span>
                            {tweet.author.verified && (
                                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.33-2.19c1.4.46 2.91.2 3.92-.81s1.26-2.52.8-3.91c1.31-.67 2.2-1.91 2.2-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                                </svg>
                            )}
                        </div>
                        <div className="text-muted-foreground text-[15px] truncate">
                            {tweet.author.handle}
                        </div>
                    </div>
                    <a
                        href={tweet.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 hover:bg-accent rounded-full p-2 transition-all duration-200 cursor-pointer z-20 relative"
                        title="View tweet"
                    >
                        <svg className="w-5 h-5 text-muted-foreground hover:text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <p className="text-foreground text-[15px] leading-relaxed whitespace-pre-wrap">
                        {tweet.content}
                    </p>
                </div>
            </div>
        </div>
    )
}

export function TweetsSection() {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-foreground mb-4">
                        What People Are Saying
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of satisfied users who have transformed their workflow.
                    </p>
                </div>
            </div>

            <div className="relative overflow-hidden">
                <div
                    className="flex animate-scroll-left-visible gap-6"
                    style={{ transform: 'translateX(0)' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.animationPlayState = 'paused'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.animationPlayState = 'running'
                    }}
                >
                    {/* First set */}
                    {tweets.map((tweet, index) => (
                        <TweetCard key={`tweet-${index}`} tweet={tweet} />
                    ))}

                    {/* Duplicate for seamless loop */}
                    {tweets.map((tweet, index) => (
                        <TweetCard key={`tweet-duplicate-${index}`} tweet={tweet} />
                    ))}

                    {/* Triple for better seamless loop */}
                    {tweets.map((tweet, index) => (
                        <TweetCard key={`tweet-triple-${index}`} tweet={tweet} />
                    ))}
                </div>

                {/* Gradient overlays */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none z-10" />
            </div>
        </section>
    )
}