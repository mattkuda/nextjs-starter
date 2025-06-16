'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, MessageCircle, Settings, User as UserIcon, LogOut, ChevronDown, Clock, ZapIcon, Crown } from 'lucide-react'
import { UpgradeModal } from '../UpgradeModal'
import { SubscriptionStatus } from '../../lib/constants'
import { User } from "@/types"
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { SettingsModal } from '../SettingsModal'
import { useClerk } from "@clerk/nextjs";
import { toast } from '../../hooks/use-toast'
import { ThemeToggle } from '../ui/theme-toggle'
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'

interface NavItem {
    label: string
    href: string
    icon: React.ElementType
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'AI Chat', href: '/dashboard/ai-chat', icon: MessageCircle },
]

interface DashboardLayoutProps {
    children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname()
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'billing' | 'settings'>('profile')
    const { data: userData, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const { data } = await axios.get<User>('/api/user')

            return data;
        },
        staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
        retry: 2, // Retry failed requests twice
    })

    const { signOut } = useClerk();

    const handleLogout = () => {
        signOut(() => {
            // Redirect to home page after signing out
            window.location.href = "/";
        });
    }

    useEffect(() => {
        if (typeof window === "undefined") return; // Ensure this only runs on client

        const params = new URLSearchParams(window.location.search);
        const successParam = params.get('success');

        if (successParam === 'true') {
            setTimeout(() => {
                toast({
                    title: "Welcome to Pro! 🎉",
                    description: "You now have access to all premium features.",
                    className: "bg-green-100 border-green-200",
                    duration: 5000,
                });
            }, 100); // Small delay for hydration issues

            // Remove success param to prevent retriggering
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, []);

    const initials = userData?.first_name && userData?.last_name ? userData?.first_name?.charAt(0).toUpperCase() + userData?.last_name?.charAt(0).toUpperCase() : userData?.email?.charAt(0).toUpperCase()

    return (
        <>
            <div className="min-h-screen flex bg-background">
                {/* Fixed Sidebar */}
                <nav className="w-64 bg-card border-r min-h-screen fixed left-0 flex flex-col pt-16 z-10">
                    <div className="flex-1">
                        <div className="px-4 py-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Main
                        </div>
                        <ul className="py-2 space-y-1">
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center px-4 py-2.5 mx-2 text-foreground hover:bg-accent rounded-lg transition-colors ${pathname === item.href ? 'bg-primary/10 text-primary border border-primary/20' : ''
                                            }`}
                                    >
                                        <item.icon className="h-5 w-5 mr-3" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Theme Toggle */}
                    <div className="px-2">
                        <ThemeToggle />
                    </div>
                    <div className="mt-auto p-4 space-y-4">
                        {/* Plan Status */}
                        <Card className="bg-muted/30">
                            <CardContent className="p-3">
                                <div className="flex items-center gap-2">
                                    {userData?.subscription_status === SubscriptionStatus.PRO ? (
                                        <>
                                            <Crown className="h-4 w-4 text-primary" />
                                            <div>
                                                <p className="text-sm font-medium">Pro Plan</p>
                                                <p className="text-xs text-muted-foreground">All features unlocked</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <ZapIcon className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Free Plan</p>
                                                <p className="text-xs text-muted-foreground">Limited features</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>


                        {/* Settings */}
                        <Button
                            variant="ghost"
                            className="w-full justify-start px-2"
                            onClick={() => {
                                setActiveSettingsTab('profile')
                                setSettingsOpen(true)
                            }}
                        >
                            <Settings className="h-4 w-4 mr-3" />
                            Settings
                        </Button>
                    </div>
                </nav>

                {/* Main Content Area */}
                <div className="flex-1 ml-64 bg-background">
                    {/* Top Header - clean white background */}
                    <div className="fixed top-0 left-0 right-0 z-20 bg-background border-b">
                        <div className="flex">
                            {/* Logo section with border */}
                            <div className="w-64 bg-card border-r px-4 py-3 flex items-center">
                                <div className="text-xl font-bold text-foreground flex items-center">
                                    <Image src="/icon.png" alt="Logo" width={32} height={32} className="mr-2" />
                                    NextJS Starter
                                </div>
                            </div>
                            {/* Right section */}
                            <div className="flex-1 px-4 py-3 flex justify-end items-center">
                                <div className="flex items-center gap-2">
                                    {isLoading ? (
                                        <div className="h-9 w-24 animate-pulse bg-muted rounded" />
                                    ) : userData?.subscription_status !== SubscriptionStatus.PRO ? (
                                        <Button onClick={() => setIsUpgradeModalOpen(true)}>
                                            <ZapIcon className="h-4 w-4 mr-2" />
                                            Upgrade to Pro
                                        </Button>
                                    ) : null}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
                                            >
                                                <div className="flex items-center gap-2 p-1 rounded-md">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                                                        <span className="text-sm font-semibold text-primary-foreground">{initials}</span>
                                                    </div>
                                                    <ChevronDown className="h-4 w-4" />
                                                </div>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-[250px]" align="end">
                                            <div className="flex flex-col items-center gap-4 p-2">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                                                    <span className="text-xl font-semibold text-primary-foreground">
                                                        {initials}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="font-semibold">{userData?.first_name} {userData?.last_name}</span>
                                                    <span className="text-sm text-muted-foreground">{userData?.email}</span>
                                                </div>
                                            </div>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setActiveSettingsTab('profile')
                                                    setSettingsOpen(true)
                                                }}
                                                className="hover:cursor-pointer"
                                            >
                                                <UserIcon className="mr-3 h-4 w-4" />
                                                Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setActiveSettingsTab('billing')
                                                    setSettingsOpen(true)
                                                }}
                                                className="hover:cursor-pointer"
                                            >
                                                <Clock className="mr-3 h-4 w-4" />
                                                Plan & Billing
                                            </DropdownMenuItem>
                                            <div className="border-t">
                                                <DropdownMenuItem onClick={() => handleLogout()} className="hover:cursor-pointer">
                                                    <LogOut className="mr-3 h-4 w-4" />
                                                    Log out
                                                </DropdownMenuItem>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Content Area - with top padding for header */}
                    <div className="pt-16 bg-background min-h-screen">
                        <div className="px-6 py-8">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
            <SettingsModal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                defaultTab={activeSettingsTab}
            />
        </>
    )
}
