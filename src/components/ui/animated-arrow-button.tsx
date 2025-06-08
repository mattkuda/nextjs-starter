"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface AnimatedArrowButtonProps {
    href: string
    children: React.ReactNode
    size?: "medium" | "large"
    className?: string
    color?: string
    textColor?: string
}

export function AnimatedArrowButton({
    href,
    children,
    size = "medium",
    className,
    color = "primary",
    textColor = "white",
}: AnimatedArrowButtonProps) {
    const sizeClasses = {
        large: "h-14 text-xl",
        medium: "h-12 text-base",
    }

    const arrowSizeClasses = {
        large: "w-6 h-6",
        medium: "w-4 h-4 -mr-2",
    }

    return (
        <Link
            href={href}
            className={cn(
                "relative inline-flex overflow-hidden rounded-full",
                size === "large" && "shadow-[0_8px_16px_-6px_rgba(0,0,0,0.2)]",
                size === "large" && "hover:shadow-[0_12px_20px_-8px_rgba(0,0,0,0.3)]",
                size === "large" && "transition-shadow duration-200",
                "group",
                sizeClasses[size],
                textColor === "white" ? "text-white" : "text-" + textColor,
                color === "gradient" ? "bg-gradient-to-r from-primary to-secondary" : "bg-" + color,
                className
            )}
        >
            <span className={`inline-flex h-full w-full cursor-pointer items-center justify-center px-${size === "large" ? "8" : "6"} py-5 ${size == "large" && "font-semibold"}`}>
                {children}
                <span className={cn("ml-2 relative flex items-center justify-center", arrowSizeClasses[size])}>
                    <span
                        className={`absolute top-[calc(50%+${size === "large" ? "1.25px" : "-1.25px"})] right-1/2 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-3 group-hover:translate-x-1`}
                    />
                    <span
                        className="absolute right-1/2 top-1/2 border-t-[2.5px] border-r-[2.5px] border-white rotate-45 -translate-y-1/2 transition-all duration-300 group-hover:translate-x-1"
                        style={{ width: size === "large" ? "10px" : "8px", height: size === "large" ? "10px" : "8px" }}
                    />
                </span>
            </span>
        </Link>
    )
} 