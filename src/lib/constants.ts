import { Sparkles, Zap, Crown } from "lucide-react"

export enum SubscriptionStatus {
    FREE = 'free',
    STARTER = 'starter',
    PRO = 'pro',
    MAX = 'max',
    CANCELED = 'canceled'
}

export const CREDITS_LIMITS = {
    [SubscriptionStatus.FREE]: 5,
    [SubscriptionStatus.STARTER]: 100,
    [SubscriptionStatus.PRO]: 500,
    [SubscriptionStatus.MAX]: 2000,
    [SubscriptionStatus.CANCELED]: 0,
} as const

export enum THREAD_TYPE {
    WORK_THREAD = 'Work Thread',
    EMAIL = 'Email',
    TEXT = 'Text',
    SOCIAL_MEDIA = 'Social Media',
    VERBAL_SCRIPT = 'Verbal Script',
    OTHER = 'Other',
}

export const THREAD_TYPE_EMOJIS = {
    [THREAD_TYPE.WORK_THREAD]: '💼',
    [THREAD_TYPE.EMAIL]: '📧',
    [THREAD_TYPE.TEXT]: '📝',
    [THREAD_TYPE.SOCIAL_MEDIA]: '💬',
    [THREAD_TYPE.VERBAL_SCRIPT]: '🗣️',
    [THREAD_TYPE.OTHER]: '⚙️',
}

export const HEADER_HEIGHT = 52;

export const MAX_THREAD_CONTEXT_LENGTH = 10000;
export const MAX_INSTRUCTIONS_LENGTH = 1000;
export const MAX_DOCUMENT_INSTRUCTIONS_LENGTH = 10000;

export const GPT_SUPPORTED_LANGUAGES = [
    'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Awadhi', 'Azerbaijani', 'Bashkir', 'Basque', 'Belarusian', 'Bengali', 'Bhojpuri', 'Bosnian', 'Brazilian Portuguese', 'Bulgarian', 'Burmese', 'Cantonese (Yue)', 'Catalan', 'Chhattisgarhi', 'Croatian', 'Czech', 'Danish', 'Dogri', 'Dutch', 'English', 'Estonian', 'Faroese', 'Finnish', 'French', 'Galician', 'Georgian', 'German', 'Greek', 'Gujarati', 'Haryanvi', 'Hindi', 'Hungarian', 'Icelandic', 'Indonesian', 'Irish', 'Italian', 'Japanese', 'Javanese', 'Kannada', 'Kashmiri', 'Kazakh', 'Konkani', 'Korean', 'Kyrgyz', 'Latvian', 'Lithuanian', 'Macedonian', 'Maithili', 'Malay', 'Malayalam', 'Maltese', 'Mandarin Chinese', 'Marathi', 'Marwari', 'Min Nan', 'Moldovan', 'Mongolian', 'Montenegrin', 'Nepali', 'Norwegian', 'Oriya', 'Pashto', 'Persian (Farsi)', 'Polish', 'Portuguese', 'Punjabi', 'Rajasthani', 'Romanian', 'Russian', 'Sanskrit', 'Santali', 'Serbian', 'Sindhi', 'Sinhala', 'Slovak', 'Slovenian', 'Somali', 'Spanish', 'Swahili', 'Swedish', 'Tagalog', 'Tajik', 'Tamil', 'Tatar', 'Telugu', 'Thai', 'Turkish', 'Turkmen', 'Ukrainian', 'Urdu', 'Uzbek', 'Vietnamese', 'Welsh', 'Wu',]

export interface WorkerType {
    value: string
    label: string
    emoji: string
}

export const WORKER_TYPES: Record<string, WorkerType> = {
    DEVELOPER: {
        value: 'developer',
        label: 'Developers',
        emoji: '👨‍💻'
    },
    DESIGNER: {
        value: 'designer',
        label: 'Designers',
        emoji: '🎨'
    },
    PM: {
        value: 'product_manager',
        label: 'Product Managers',
        emoji: '📊'
    },
    SUPPORT: {
        value: 'customer_support',
        label: 'Customer Support',
        emoji: '🎧'
    },
    QA: {
        value: 'qa',
        label: 'QA Engineers',
        emoji: '🔍'
    },
    MARKETING: {
        value: 'marketing',
        label: 'Marketing',
        emoji: ''
    }
} as const

export interface Testimonial {
    name: string;
    role: string;
    message: string;
    imageUrl: string;
}

export const TESTIMONIALS: Testimonial[] = [
    {
        name: "Jesse",
        role: "Web Developer",
        message: "Finally, a boilerplate that actually works. I'm able to get shipping the sauced in seconds.",
        imageUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "Jill",
        role: "Staff Software Engineer",
        message: "Saves me hours of time setting up my SaaS. Works great with Cursor.",
        imageUrl: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "Erik",
        role: "AI Content Creator",
        message: "I can't image life without NextJS Starter. It's a game-changer for my team.",
        imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
];

export const PLANS = [
    {
        id: 'starter' as const,
        name: 'Starter',
        monthlyPrice: 9.99,
        yearlyPrice: 99.9, // 10 months pricing (2 months free)
        credits: 100,
        description: 'Perfect for individuals getting started with AI-powered workflows.',
        icon: Sparkles,
        isPopular: false,
        features: [
            'Access to all core features',
            '100 monthly credits',
            'Basic AI assistance',
            'Email support',
            'Standard processing speed'
        ]
    },
    {
        id: 'pro' as const,
        name: 'Pro',
        monthlyPrice: 19.99,
        yearlyPrice: 199.9, // 10 months pricing (2 months free)
        credits: 500,
        description: 'Ideal for professionals and small teams with higher usage needs.',
        isPopular: true,
        icon: Zap,
        features: [
            'Everything in Starter',
            '500 monthly credits',
            'Advanced AI assistance',
            'Priority email support',
            'Advanced tone options',
            'Faster processing speed',
            'Custom templates'
        ]
    },
    {
        id: 'max' as const,
        name: 'Max',
        monthlyPrice: 49.99,
        yearlyPrice: 499.9, // 10 months pricing (2 months free)
        credits: 2000,
        description: 'For power users and teams that need maximum capacity.',
        icon: Crown,
        isPopular: false,
        features: [
            'Everything in Pro',
            '2,000 monthly credits',
            'Premium AI assistance',
            'Phone & priority support',
            'Advanced integrations',
            'Custom AI models',
            'Team collaboration',
            'Analytics dashboard'
        ]
    }
] as const

export type PlanId = typeof PLANS[number]['id']