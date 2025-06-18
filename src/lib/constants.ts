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
        emoji: '��'
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
        name: "Peter",
        role: "QA Engineer",
        message: "Finally, an AI tool that actually understands the context of the conversation! This is exactly what we've been waiting for.",
        imageUrl: "/peter.png"
    },
    {
        name: "Jill",
        role: "Private Consultant",
        message: "Saves me hours of time reading through Slack threads each week. I'm able to get the information I need in seconds.",
        imageUrl: "/jill.png"
    },
    {
        name: "Erik",
        role: "Product Manager",
        message: "I can't image life without NextJS Starter. It's a game-changer for my team.",
        imageUrl: "/erik.png"
    }
];