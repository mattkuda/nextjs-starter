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
import { MessageSquare, Lightbulb, BookOpen, TicketIcon, HelpCircle, User as UserIcon, Rocket, Boxes, MessageCircle, ArrowLeftRight, LogOut, ChevronDown, Clock, ZapIcon, Crown, BadgeCheck } from 'lucide-react'
import { UpgradeModal } from '../UpgradeModal'
import { FeedbackModal } from '../FeedbackModal'
import { SubscriptionStatus } from '../../lib/constants'
import { User } from "@/types"
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { SettingsModal } from '../SettingsModal'
import { useClerk } from "@clerk/nextjs";
import { toast } from '../../hooks/use-toast'

interface NavItem {
    label: string
    href: string
    icon: React.ElementType
}

const navItems: NavItem[] = [
    { label: 'Thread Insights', href: '/dashboard', icon: Lightbulb },
    { label: 'Thread Starter', href: '/dashboard/thread-starter', icon: Rocket },
    { label: 'Docs Writer', href: '/dashboard/documentation-writer', icon: BookOpen },
    { label: 'Ticket Creator', href: '/dashboard/ticket-creator', icon: TicketIcon },
    { label: 'Tone Converter', href: '/dashboard/tone-converter', icon: ArrowLeftRight },
    { label: 'Social Wizard', href: '/dashboard/social-wizard', icon: BadgeCheck },
    { label: 'AI Coach', href: '/dashboard/ai-coach', icon: MessageCircle },
]

interface DashboardLayoutProps {
    children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname()
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
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
            <div className="min-h-screen flex bg-gray-100">
                {/* Fixed Sidebar */}
                <nav className="w-64 bg-white shadow-sm min-h-screen fixed left-0 flex flex-col pt-14">
                    <div className="flex-1">
                        <div className="px-4 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Tools
                        </div>
                        <ul className="py-2 space-y-3">
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 ${pathname === item.href ? 'bg-gray-100 text-blue-600' : ''
                                            }`}
                                    >
                                        <item.icon className="h-5 w-5 mr-3" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-auto">
                        <div className="py-3 border-t border-gray-200">
                            <ul className="py-4 space-y-3">
                                <li key="feedback">
                                    <div
                                        onClick={() => setIsFeedbackModalOpen(true)}
                                        className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <MessageSquare className="h-5 w-5 mr-3" />
                                        Feedback
                                    </div>
                                </li>
                                <li key="get-started">
                                    <Link
                                        href={"/get-started"}
                                        className={`flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100`}
                                    >
                                        <HelpCircle className="h-5 w-5 mr-3" />
                                        Get Started
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                {/* Main Content Area */}
                <div className="flex-1 ml-64 bg-gray-100">
                    {/* Top Header - moved outside and made full width */}
                    <div className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-r from-brand1-100 via-brand2-100 to-brand3-100 shadow-sm">
                        <div className="px-4 py-2 flex justify-between items-center">
                            <div className="text-xl font-bold text-gray-800 flex items-center">
                                <Boxes className="h-5 w-5 mr-2" />
                                NextJS Starter
                            </div>
                            <div className="flex items-center gap-2">
                                {isLoading ? (
                                    <div className="h-9 w-24 animate-pulse bg-gray-200 rounded" />
                                ) : userData?.subscription_status !== SubscriptionStatus.PRO ? (
                                    <Button variant="outline" onClick={() => setIsUpgradeModalOpen(true)}>
                                        <ZapIcon className="h-5 w-5 mr-2" />
                                        Upgrade to Pro
                                    </Button>
                                ) : (
                                    <div className="flex items-center">
                                        <Crown className="h-5 w-5 mr-2 text-gray-500" />
                                        <span className="text-sm text-gray-600">You're on the pro plan</span>
                                    </div>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="border-width-0 outline-none hover:bg-gray-500/10 px-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
                                        >
                                            <div className="flex items-center gap-2 border-width-0 p-2 rounded-md">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-brand2-500 to-brand3-500">
                                                    <span className="text-md font-semibold text-white">{initials}</span>
                                                </div>
                                                <ChevronDown className="h-5 w-5" />
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[250px]" align="end">
                                        <div className="flex flex-col items-center gap-4 p-2">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-brand2-500 to-brand3-500">
                                                <span className="text-xl font-semibold text-white">
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
                                        {/* <DropdownMenuItem
                                            onClick={() => {
                                                setActiveSettingsTab('settings')
                                                setSettingsOpen(true)
                                            }}
                                            className="hover:cursor-pointer"
                                        >
                                            <Settings className="mr-3 h-4 w-4" />
                                            Settings
                                        </DropdownMenuItem> */}
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
                    {/* Content Area - added padding top for header */}
                    <div className="pt-14 bg-gray-100">
                        <div className="max-w-6xl mx-auto px-4 py-8">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
            <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
            <SettingsModal
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                defaultTab={activeSettingsTab}
            />
        </>
    )
}
