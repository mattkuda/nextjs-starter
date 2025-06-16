'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import { User } from "@/types"
import { CREDITS_LIMITS, SubscriptionStatus } from '../../lib/constants'
// import { CREDITS_LIMITS } from '../../lib/constants'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { ZapIcon } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface SubscriptionDetailsProps {
    user: User | null
}

export function SubscriptionDetails({ user }: SubscriptionDetailsProps) {
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    async function handleUpgrade() {
        try {
            const response = await fetch('/api/upgradePlan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clerkId: user?.clerk_user_id, userId: user?.id }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe Checkout
            }
        } catch (error) {
            console.error('Error upgrading to Pro:', error);
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
            toast({
                title: "Subscription cancelled",
                description: "Your subscription has been cancelled. You will retain access until your current billing period ends.",
                className: "bg-green-100 border-green-200",
            })
        } catch (error) {
            console.error('Error canceling subscription:', error);
        }
    }

    const handleDeleteAccount = async () => {
        try {
            await fetch('/api/deleteAccount', { method: 'POST' });
            setIsDeleteModalOpen(false)
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    }

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Subscription Details</h2>
            <p>Credits remaining: {user?.credits}</p>
            {user?.subscription_status === SubscriptionStatus.FREE && (
                <>
                    <p>You're on the Free Plan. Upgrade to unlock premium features.</p>
                    <Button
                        className="w-full mt-4 bg-gradient-to-r from-brand1-200 via-brand2-200 to-brand3-200 text-gray-800 hover:opacity-90 font-semibold"
                        onClick={handleUpgrade}>
                        <ZapIcon className="h-5 w-5 mr-2" />
                        Upgrade to Pro
                    </Button>
                </>
            )}
            <p>
                {user?.subscription_end_date && new Date(user.subscription_end_date) > new Date()
                    ? user?.is_cancel_scheduled
                        ? `Your Pro Plan will end on ${new Date(user.subscription_end_date).toLocaleDateString()}.`
                        : `Your Pro Plan will renew on ${new Date(user.subscription_end_date).toLocaleDateString()}. Your credits will reset to ${CREDITS_LIMITS[user?.subscription_status as keyof typeof CREDITS_LIMITS]}.`
                    : ``}
            </p>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger>Manage Account</AccordionTrigger>
                    <AccordionContent>
                        <div className="my-2">
                            <div className="space-y-2">
                                {/* <Button variant="outline" className="w-full">Update Payment Method</Button> */}
                                {user?.subscription_end_date && new Date(user.subscription_end_date) > new Date() && <Button
                                    onClick={() => setIsCancelModalOpen(true)}
                                    variant="outline"
                                    className="w-full text-red-600 hover:text-red-700"
                                    disabled={user?.is_cancel_scheduled}
                                >
                                    {user?.is_cancel_scheduled ? "Subscription cancellation scheduled" : "Cancel Subscription"}
                                </Button>}
                            </div>
                            <Button
                                onClick={() => setIsDeleteModalOpen(true)}
                                variant="outline"
                                className="w-full text-red-600 hover:text-red-700 mt-4"
                            >
                                Delete Account
                            </Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <ConfirmationModal
                title="Cancel Subscription"
                description={`Are you sure you want to cancel your subscription? You will retain access until ${user?.subscription_end_date ? new Date(user.subscription_end_date).toLocaleDateString() : 'your current billing period ends'
                    }.`}
                actionLabel="Confirm Cancellation"
                onConfirm={handleCancelSubscription}
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
            />

            <ConfirmationModal
                title="Delete Account"
                description="Are you sure you want to delete your account? This action cannot be undone."
                actionLabel="Delete Account"
                onConfirm={handleDeleteAccount}
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        </div>
    )
}
