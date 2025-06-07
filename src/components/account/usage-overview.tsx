'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { User } from "@/types"
import { SubscriptionStatus, CREDITS_LIMITS } from "@/lib/constants"

interface UsageOverviewProps {
    user: User | null
}

export function UsageOverview({ user }: UsageOverviewProps) {
    const {
        credits,
        subscription_status = SubscriptionStatus.FREE,
        subscription_end_date
    } = user || {};

    const percentage = credits ? (credits) / CREDITS_LIMITS[subscription_status] * 100 : 0


    return (
        <Card>
            <CardHeader>
                <CardTitle>Usage Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Progress value={percentage} className="w-full" />
                    <p className="mt-2 text-sm text-gray-600">
                        {(credits || 0)}/{CREDITS_LIMITS[subscription_status]} {subscription_status === SubscriptionStatus.PRO ? "pro" : "free"} credits remaining
                    </p>
                </div>
                {subscription_status === SubscriptionStatus.PRO ? (
                    <p className="text-sm text-gray-600">
                        Resets on {subscription_end_date ? new Date(subscription_end_date).toLocaleDateString() : "N/A"}
                    </p>
                ) : (
                    <p className="text-sm text-gray-600">
                        You are on the Free Plan. Upgrade to Pro to unlock {CREDITS_LIMITS[SubscriptionStatus.PRO]} threads per month.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

