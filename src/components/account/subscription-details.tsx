'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import { User } from "@/types"
import { CREDITS_LIMITS, SubscriptionStatus } from '../../lib/constants'
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
    Calendar,
    Zap,
    AlertTriangle,
    Check,
    Trash2,
    RefreshCw,
    Rocket,
    Crown,
    Star,
    ChevronDown
} from 'lucide-react'
import { toast } from 'sonner'

interface SubscriptionDetailsProps {
    user: User | null
}

export function SubscriptionDetails({ user }: SubscriptionDetailsProps) {
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isUpgrading, setIsUpgrading] = useState(false)

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
            await fetch('/api/cancelSubscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscriptionId: user?.stripe_subscription_id }),
            });
            setIsCancelModalOpen(false)
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
            await fetch('/api/deleteAccount', { method: 'POST' });
            setIsDeleteModalOpen(false)
            toast.success("Account deleted", {
                description: "Your account has been successfully deleted.",
            })
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('Failed to delete account. Please try again.')
        }
    }

    const getSubscriptionStatusInfo = () => {
        switch (user?.subscription_status) {
            case SubscriptionStatus.STARTER:
                return {
                    label: 'Starter Plan',
                    color: 'bg-blue-100 text-blue-700 border-blue-200',
                    icon: <Rocket className="h-4 w-4" />
                }
            case SubscriptionStatus.PRO:
                return {
                    label: 'Pro Plan',
                    color: 'bg-purple-100 text-purple-700 border-purple-200',
                    icon: <Star className="h-4 w-4" />
                }
            case SubscriptionStatus.MAX:
                return {
                    label: 'Max Plan',
                    color: 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200',
                    icon: <Crown className="h-4 w-4" />
                }
            default:
                return {
                    label: 'Free Plan',
                    color: 'bg-gray-100 text-gray-700 border-gray-200',
                    icon: <Zap className="h-4 w-4" />
                }
        }
    }

    const statusInfo = getSubscriptionStatusInfo()
    const maxCredits = CREDITS_LIMITS[user?.subscription_status as keyof typeof CREDITS_LIMITS] || 0
    const currentCredits = user?.credits || 0
    const creditsUsed = maxCredits - currentCredits
    // Progress bar shows remaining credits (should decrease as credits are used)
    const creditsPercentage = maxCredits > 0 ? (currentCredits / maxCredits) * 100 : 0

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getNextResetDate = () => {
        if (user?.subscription_status !== SubscriptionStatus.FREE && user?.subscription_end_date) {
            // For paid users, credits reset on the subscription renewal date
            return formatDate(user.subscription_end_date)
        }
        // For free users, credits reset monthly (first of each month)
        const now = new Date()
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        return nextMonth.toLocaleDateString('en-US', {
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
                                <span className="ml-1">{statusInfo.label}</span>
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
                <CardContent className="space-y-4">
                    {/* Credits Usage */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground">Credits</span>
                            <span className="text-sm text-muted-foreground">
                                {currentCredits} / {maxCredits} remaining
                            </span>
                        </div>
                        <Progress value={creditsPercentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                            {creditsUsed} of {maxCredits} credits used this period
                        </p>
                    </div>

                    <Separator />

                    {/* Subscription Details */}
                    <div className="space-y-3">
                        {user?.subscription_status !== SubscriptionStatus.FREE && user?.subscription_end_date && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">
                                        {user?.is_cancel_scheduled ? 'Expires on' : 'Renews on'}
                                    </span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {formatDate(user?.subscription_end_date || null)}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Credits reset</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {getNextResetDate()}
                            </span>
                        </div>
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
                            <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Rocket className="h-4 w-4 text-blue-500" />
                                        <h4 className="font-medium">Starter</h4>
                                    </div>
                                    <p className="text-2xl font-bold">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                                    <p className="text-sm text-muted-foreground">100 credits/month</p>
                                    <Button
                                        size="sm"
                                        className="w-full"
                                        onClick={() => handleUpgrade('starter')}
                                        disabled={isUpgrading}
                                    >
                                        {isUpgrading ? 'Processing...' : 'Upgrade to Starter'}
                                    </Button>
                                </div>
                            </div>
                            <div className="border rounded-lg p-4 hover:border-primary transition-colors border-primary">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Star className="h-4 w-4 text-purple-500" />
                                            <h4 className="font-medium">Pro</h4>
                                        </div>
                                        <Badge>Most Popular</Badge>
                                    </div>
                                    <p className="text-2xl font-bold">$19.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                                    <p className="text-sm text-muted-foreground">500 credits/month</p>
                                    <Button
                                        size="sm"
                                        className="w-full"
                                        onClick={() => handleUpgrade('pro')}
                                        disabled={isUpgrading}
                                    >
                                        {isUpgrading ? 'Processing...' : 'Upgrade to Pro'}
                                    </Button>
                                </div>
                            </div>
                            <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Crown className="h-4 w-4 text-orange-500" />
                                        <h4 className="font-medium">Max</h4>
                                    </div>
                                    <p className="text-2xl font-bold">$49.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                                    <p className="text-sm text-muted-foreground">2,000 credits/month</p>
                                    <Button
                                        size="sm"
                                        className="w-full"
                                        onClick={() => handleUpgrade('max')}
                                        disabled={isUpgrading}
                                    >
                                        {isUpgrading ? 'Processing...' : 'Upgrade to Max'}
                                    </Button>
                                </div>
                            </div>
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
                                        onClick={() => handleUpgrade(user?.subscription_status === SubscriptionStatus.STARTER ? 'pro' : 'max')}
                                        disabled={isUpgrading}
                                    >
                                        <Zap className="h-4 w-4 mr-2" />
                                        {isUpgrading ? 'Processing...' : 'Upgrade'}
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
        </div>
    )
}
