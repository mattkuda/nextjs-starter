"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, Monitor } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="sm" disabled>
                <Sun className="h-4 w-4" />
            </Button>
        )
    }

    const getThemeIcon = () => {
        switch (theme) {
            case "dark":
                return <Moon className="h-4 w-4" />
            case "system":
                return <Monitor className="h-4 w-4" />
            default:
                return <Sun className="h-4 w-4" />
        }
    }

    const getThemeLabel = () => {
        switch (theme) {
            case "dark":
                return "Dark"
            case "system":
                return "System"
            default:
                return "Light"
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                    {getThemeIcon()}
                    <span className="ml-2">{getThemeLabel()}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 