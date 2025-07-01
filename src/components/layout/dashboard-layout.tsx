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
import { Home, MessageCircle, Settings, User as UserIcon, LogOut, ChevronDown, Clock, Map, Camera } from 'lucide-react'
import { UpgradeModal } from '../UpgradeModal'
import { User } from "@/types"
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useClerk } from "@clerk/nextjs";
import { ThemeToggle } from '../ui/theme-toggle'
import { PlanStatusCard } from './plan-status-card'
import Image from 'next/image'
import { toast } from "sonner"
import { SubscriptionStatus } from '@/lib/constants'

interface NavItem {
    label: string
    href: string
    icon: React.ElementType
}
const navItems: NavItem[] = [
    { label: 'AI Chat', href: '/dashboard/ai-chat', icon: MessageCircle },
    { label: 'Project Planner', href: '/dashboard/project-planner', icon: Map, },
    { label: 'Image Generator', href: '/dashboard/image-generator', icon: Camera },
]

interface DashboardLayoutProps {
    children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname()
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const { data: userData, isLoading, refetch } = useQuery({
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
                toast.success("Welcome to Pro! 🎉", {
                    description: "You now have access to all premium features.",
                    className: "bg-green-100 border-green-200",
                    duration: 5000,
                });

            }, 100);

            // Remove success param to prevent retriggering
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);

            // Poll for updated subscription status after successful payment
            const pollForUpdate = async () => {
                let attempts = 0;
                const maxAttempts = 10; // Poll for up to 30 seconds

                const poll = async () => {
                    attempts++;
                    await refetch();

                    if (attempts < maxAttempts) {
                        setTimeout(poll, 3000); // Poll every 3 seconds
                    }
                };

                setTimeout(poll, 2000); // Start polling after 2 seconds
            };

            pollForUpdate();
        }
    }, [refetch]);

    // Enhanced subscription status checking with race condition handling
    useEffect(() => {
        if (typeof window === "undefined") return;

        const params = new URLSearchParams(window.location.search);
        const successParam = params.get('success');

        // Don't redirect if payment was just successful - give webhook time to process
        if (successParam === 'true') {
            return;
        }

        // If user data is loaded and shows FREE status, do additional verification
        // to handle potential race conditions
        if (!isLoading && userData && userData.subscription_status === SubscriptionStatus.FREE) {
            // Check if this is a new user (created recently) who might have just subscribed
            const userCreatedAt = new Date(userData.created_at);
            const now = new Date();
            const timeSinceCreation = now.getTime() - userCreatedAt.getTime();
            const isRecentUser = timeSinceCreation < 5 * 60 * 1000; // 5 minutes

            if (isRecentUser) {
                // For recent users, do an additional subscription status check
                // with retry logic to handle webhook processing delays

                const verifySubscription = async () => {
                    try {
                        const response = await axios.get('/api/subscription-status');
                        const { subscription_status } = response.data;

                        if (subscription_status !== SubscriptionStatus.FREE) {
                            // Subscription found! Refetch user data to update UI
                            await refetch();
                            return;
                        }
                    } catch (error) {
                        console.error('Error verifying subscription:', error);
                    }

                    // If still no subscription after verification, redirect to onboarding
                    window.location.href = '/onboarding';
                };

                // Delay the verification slightly to allow for webhook processing
                setTimeout(verifySubscription, 1000);
            } else {
                // For older users, redirect immediately
                window.location.href = '/onboarding';
            }
        }
    }, [isLoading, userData, refetch])

    const initials = userData?.first_name && userData?.last_name ? userData?.first_name?.charAt(0).toUpperCase() + userData?.last_name?.charAt(0).toUpperCase() : userData?.email?.charAt(0).toUpperCase()

    return (
        <>
            <div className="min-h-screen flex bg-background">
                {/* Fixed Sidebar */}
                <nav className="w-64 bg-card border-r min-h-screen fixed left-0 flex flex-col pt-[calc(4rem-4px)] z-10">
                    <div className="flex-1">
                        {/* Dashboard - Primary Navigation */}
                        <ul className="py-2 space-y-1">
                            <li>
                                <Link
                                    href="/dashboard"
                                    className={`flex items-center px-4 py-2.5 mx-2 text-foreground hover:bg-accent rounded-lg transition-colors ${pathname === '/dashboard' ? 'bg-primary/10 text-primary border border-primary/20' : ''
                                        }`}
                                >
                                    <Home className="h-5 w-5 mr-3" />
                                    Dashboard
                                </Link>
                            </li>
                        </ul>

                        {/* Separator */}
                        <div className="border-b border-border mx-4 my-0"></div>

                        {/* Feature Navigation */}
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
                    <div className="px-4 pb-2">
                        <ThemeToggle />
                    </div>
                    <div className="mt-auto p-4 space-y-4">
                        {/* Plan Status */}
                        <PlanStatusCard
                            subscriptionStatus={userData?.subscription_status}
                            onUpgradeClick={() => setIsUpgradeModalOpen(true)}
                            isLoading={isLoading}
                        />

                        {/* Settings */}
                        <Link
                            href="/dashboard/settings"
                            className={`flex items-center px-2 py-2.5 text-foreground hover:bg-accent rounded-lg transition-colors ${pathname === '/dashboard/settings' ? 'bg-primary/10 text-primary border border-primary/20' : ''
                                }`}
                        >
                            <Settings className="h-4 w-4 mr-3" />
                            Settings
                        </Link>
                    </div>
                </nav>

                {/* Main Content Area */}
                <div className="flex-1 ml-64 bg-background">
                    {/* Top Header - clean white background */}
                    <div className="fixed top-0 left-0 right-0 z-20 bg-background">
                        <div className="flex">
                            {/* Logo section - unified with sidebar */}
                            <div className="w-64 bg-card border-r px-4 py-3 flex items-center">
                                <div className="text-xl font-bold text-foreground flex items-center">
                                    <Image src="/icon.png" alt="Logo" width={32} height={32} className="mr-2" />
                                    NextJS Starter
                                </div>
                            </div>
                            {/* Right section */}
                            <div className="flex-1 px-4 py-3 flex justify-end items-center border-b">
                                <div className="flex items-center gap-2">
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
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard/settings" className="hover:cursor-pointer">
                                                    <UserIcon className="mr-3 h-4 w-4" />
                                                    Profile
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/dashboard/settings?tab=billing" className="hover:cursor-pointer">
                                                    <Clock className="mr-3 h-4 w-4" />
                                                    Plan & Billing
                                                </Link>
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
            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                currentSubscriptionStatus={userData?.subscription_status}
            />
        </>
    )
}
