'use client'

import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { ReactNode } from 'react'

interface AnimatedSectionProps {
    children: ReactNode
    className?: string
    delay?: number
    id?: string
}

export function AnimatedSection({ children, className = '', delay = 0, id }: AnimatedSectionProps) {
    const { ref, isInView } = useInView({ threshold: 0.1 })

    return (
        <motion.section
            ref={ref}
            id={id}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.25, 0.25, 0.25, 0.75]
            }}
            className={className}
        >
            {children}
        </motion.section>
    )
} 