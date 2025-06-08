import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
    threshold?: number
    rootMargin?: string
    triggerOnce?: boolean
}

export function useInView(options: UseInViewOptions = {}) {
    const [isInView, setIsInView] = useState(false)
    const [hasTriggered, setHasTriggered] = useState(false)
    const ref = useRef<HTMLElement>(null)

    const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                const inView = entry.isIntersecting
                setIsInView(inView)

                if (inView && triggerOnce && !hasTriggered) {
                    setHasTriggered(true)
                }
            },
            { threshold, rootMargin }
        )

        observer.observe(element)

        return () => {
            observer.unobserve(element)
        }
    }, [threshold, rootMargin, triggerOnce, hasTriggered])

    return {
        ref,
        isInView: triggerOnce ? (hasTriggered || isInView) : isInView
    }
} 