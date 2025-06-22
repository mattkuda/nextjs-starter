'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import { UpgradeModal } from "@/components/UpgradeModal"
import { User } from "@/types"
import { CREDITS_LIMITS, SubscriptionStatus, PLANS } from '../../lib/constants'
import { useQueryClient } from '@tanstack/react-query'
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
    Calendar,
    Zap,
    AlertTriangle,
    Check,
    Trash2,
    RefreshCw,
    ChevronDown,
    ArrowUpRight,
    Users
} from 'lucide-react'
import { toast } from 'sonner'

interface SubscriptionDetailsProps {
    user: User | null
}

export function SubscriptionDetails({ user }: SubscriptionDetailsProps) {
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
    const [isUpgrading, setIsUpgrading] = useState(false)
    const queryClient = useQueryClient()

    const handleUpgrade = async (plan: 'starter' | 'pro' | 'max') => {
        setIsUpgrading(true)
        try {
            const response = await fetch('/api/upgradePlan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clerkId: user?.clerk_user_id,
                    userId: user?.id,
                    plan: plan,
                    billing: 'monthly'
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Error upgrading plan:', error);
            toast.error('Failed to upgrade plan. Please try again.')
        } finally {
            setIsUpgrading(false)
        }
    }

    const handleCancelSubscription = async () => {
        try {
            const response = await fetch('/api/cancelSubscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscriptionId: user?.stripe_subscription_id }),
            });

            if (!response.ok) {
                throw new Error('Failed to cancel subscription');
            }

            setIsCancelModalOpen(false)

            // Refresh user data to show updated cancellation status
            queryClient.invalidateQueries({ queryKey: ['user'] });

            toast.success("Subscription cancelled", {
                description: "Your subscription has been cancelled. You will retain access until your current billing period ends.",
            })
        } catch (error) {
            console.error('Error canceling subscription:', error);
            toast.error('Failed to cancel subscription. Please try again.')
        }
    }

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch('/api/deleteAccount', { method: 'POST' });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }

            setIsDeleteModalOpen(false)

            toast.success("Account deleted", {
                description: "Your account has been successfully deleted. You will be redirected shortly.",
            })

            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);

        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('Failed to delete account. Please try again.')
        }
    }

    const getPlanDetails = (status: SubscriptionStatus) => {
        const plan = PLANS.find(p => p.id === status.toLowerCase())

        if (plan) {
            const IconComponent = plan.icon
            let color = 'bg-gray-100 text-gray-700 border-gray-200'

            switch (plan.id) {
                case 'starter':
                    color = 'bg-primary/70 border-primary/20'
                    break
                case 'pro':
                    color = 'bg-secondary/70 border-secondary/20'
                    break
                case 'max':
                    color = 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200'
                    break
            }

            return {
                name: plan.name,
                icon: <IconComponent className="h-4 w-4" />,
                credits: plan.credits,
                monthlyPrice: plan.monthlyPrice,
                yearlyPrice: plan.yearlyPrice,
                features: plan.features,
                color: color
            }
        }

        // Fallback for FREE status
        return {
            name: 'Free',
            icon: <Users className="h-4 w-4" />,
            credits: 5,
            monthlyPrice: 0,
            yearlyPrice: 0,
            features: ['5 total credits', 'Basic features', 'Email support'],
            color: 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    const statusInfo = getPlanDetails(user?.subscription_status || SubscriptionStatus.FREE)
    const maxCredits = user?.max_credits || CREDITS_LIMITS[user?.subscription_status as keyof typeof CREDITS_LIMITS] || 0
    const remainingCredits = user?.credits || 0  // remaining credits from API
    const usedCredits = user?.credits_used || 0  // used credits from API
    // Progress bar shows remaining credits percentage
    const creditsPercentage = maxCredits > 0 ? (remainingCredits / maxCredits) * 100 : 0

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }



    return (
        <div className="space-y-6">
            {/* Current Plan Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <CardTitle className="text-lg">Current Plan</CardTitle>
                            <Badge className={statusInfo.color}>
                                {statusInfo.icon}
                                <span className="ml-1">{statusInfo.name}</span>
                            </Badge>
                        </div>
                        {user?.is_cancel_scheduled && (
                            <Badge variant="destructive" className="flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Cancellation Scheduled
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Credits Usage */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Zap className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-foreground">Credits</span>
                            </div>
                            <span className="text-sm font-semibold text-foreground">
                                {remainingCredits} / {maxCredits} remaining
                            </span>
                        </div>
                        <div className="space-y-2">
                            <Progress value={creditsPercentage} className="h-3" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{usedCredits} used</span>
                                <span>{Math.round(creditsPercentage)}% remaining</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Subscription Details */}
                    <div className="space-y-3">
                        {/* For paid subscriptions */}
                        {user?.subscription_status !== SubscriptionStatus.FREE && user?.subscription_end_date && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">
                                        {user?.is_cancel_scheduled
                                            ? 'Subscription expires on'
                                            : 'Credits and subscription renew on'
                                        }
                                    </span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {formatDate(user?.subscription_end_date || null)}
                                </span>
                            </div>
                        )}

                        {/* For free users only - show credits reset info */}
                        {user?.subscription_status === SubscriptionStatus.FREE && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Credits reset</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    Never (one-time allocation)
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Upgrade Options */}
            {user?.subscription_status === SubscriptionStatus.FREE && (
                <Card>
                    <CardHeader>
                        <CardTitle>Upgrade Your Plan</CardTitle>
                        <CardDescription>
                            Get more credits and unlock premium features
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {PLANS.map((plan) => {
                                const IconComponent = plan.icon
                                const isPopular = plan.isPopular
                                const colorMap = {
                                    starter: 'text-blue-500',
                                    pro: 'text-purple-500',
                                    max: 'text-orange-500'
                                }

                                return (
                                    <div
                                        key={plan.id}
                                        className={`border rounded-lg p-4 hover:border-primary transition-colors ${isPopular ? 'border-primary' : ''
                                            }`}
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <IconComponent className={`h-4 w-4 ${colorMap[plan.id]}`} />
                                                    <h4 className="font-medium">{plan.name}</h4>
                                                </div>
                                                {isPopular && <Badge>Most Popular</Badge>}
                                            </div>
                                            <p className="text-2xl font-bold">
                                                ${plan.monthlyPrice.toFixed(2)}
                                                <span className="text-sm font-normal text-muted-foreground">/month</span>
                                            </p>
                                            <p className="text-sm text-muted-foreground">{plan.credits} credits/month</p>
                                            <Button
                                                size="sm"
                                                className="w-full"
                                                onClick={() => handleUpgrade(plan.id)}
                                                disabled={isUpgrading}
                                            >
                                                {isUpgrading ? 'Processing...' : `Upgrade to ${plan.name}`}
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Account Management */}
            <Card>
                <CardHeader>
                    <CardTitle>Account Management</CardTitle>
                    <CardDescription>
                        Manage your subscription and account settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {user?.subscription_status !== SubscriptionStatus.FREE && (
                        <>
                            {user?.subscription_status !== SubscriptionStatus.MAX && (
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium">Upgrade Plan</h4>
                                        <p className="text-sm text-muted-foreground">Get more credits and features</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="group"
                                        onClick={() => setIsUpgradeModalOpen(true)}
                                        disabled={isUpgrading}
                                    >
                                        Upgrade Plan
                                        <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                                    </Button>
                                </div>
                            )}



                            {user?.is_cancel_scheduled && (
                                <div className="flex items-center justify-between p-4 border rounded-lg border-orange-200 bg-orange-50">
                                    <div>
                                        <h4 className="font-medium">Subscription Cancellation Scheduled</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Your subscription will end on {formatDate(user?.subscription_end_date || null)}
                                        </p>
                                    </div>
                                    <div className="flex items-center text-orange-600">
                                        <Check className="h-4 w-4 mr-2" />
                                        <span className="text-sm font-medium">Cancelled</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <Separator />

                    {/* Danger Zone - Collapsible */}
                    <Collapsible>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 rounded-lg transition-colors">
                            <div>
                                <h4 className="font-medium text-left">Advanced Settings</h4>
                                <p className="text-sm text-muted-foreground text-left">Manage subscription and account deletion</p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-4 pt-4">
                            {user?.subscription_status !== SubscriptionStatus.FREE && !user?.is_cancel_scheduled && (
                                <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
                                    <div>
                                        <h4 className="font-medium">Cancel Subscription</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Your subscription will remain active until {formatDate(user?.subscription_end_date || null)}
                                        </p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        onClick={() => setIsCancelModalOpen(true)}
                                    >
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            )}

                            <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
                                <div>
                                    <h4 className="font-medium text-destructive">Delete Account</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Permanently delete your account and all associated data
                                    </p>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={() => setIsDeleteModalOpen(true)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </CardContent>
            </Card>

            {/* Confirmation Modals */}
            <ConfirmationModal
                title="Cancel Subscription"
                description={`Are you sure you want to cancel your subscription? You will retain access until ${formatDate(user?.subscription_end_date || null)}.`}
                actionLabel="Confirm Cancellation"
                onConfirm={handleCancelSubscription}
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
            />

            <ConfirmationModal
                title="Delete Account"
                description="Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data."
                actionLabel="Delete Account"
                onConfirm={handleDeleteAccount}
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                currentSubscriptionStatus={user?.subscription_status}
            />
        </div>
    )
}
