'use client'

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"
import { SubscriptionStatus, PLANS } from "@/lib/constants"
import { Users } from "lucide-react"

interface PlanStatusCardProps {
    subscriptionStatus?: SubscriptionStatus
    isClickable?: boolean
    onUpgradeClick?: () => void
    isLoading?: boolean
}

export function PlanStatusCard({ subscriptionStatus, isClickable = true, onUpgradeClick, isLoading = false }: PlanStatusCardProps) {

    const getPlanInfo = () => {
        // Find the plan from centralized config
        const plan = PLANS.find(p => p.id === subscriptionStatus?.toLowerCase())

        if (plan) {
            const IconComponent = plan.icon
            let color = 'text-muted-foreground'

            switch (plan.id) {
                case 'starter':
                    color = 'text-blue-500'
                    break
                case 'pro':
                    color = 'text-purple-500'
                    break
                case 'max':
                    color = 'text-orange-500'
                    break
            }

            return {
                icon: IconComponent,
                name: `${plan.name} Plan`,
                description: `${plan.credits} monthly credits`,
                color: color,
                canUpgrade: plan.id !== 'max'
            }
        }

        // Fallback for FREE status
        return {
            icon: Users,
            name: 'Free Plan',
            description: '5 total credits',
            color: 'text-muted-foreground',
            canUpgrade: true
        }
    }

    const planInfo = getPlanInfo()
    const IconComponent = planInfo.icon

    const handleUpgradeClick = () => {
        if (planInfo.canUpgrade && isClickable && onUpgradeClick) {
            onUpgradeClick()
        }
    }

    if (isLoading) {
        return (
            <Card className="bg-muted/30">
                <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                        <div className="flex-1">
                            <div className="h-4 bg-muted animate-pulse rounded mb-1 w-20" />
                            <div className="h-3 bg-muted animate-pulse rounded w-32" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-muted/30">
            <CardContent className="p-3">
                <div className="flex items-center gap-2">
                    <IconComponent className={`h-4 w-4 ${planInfo.color}`} />
                    <div className="flex-1">
                        <p className="text-sm font-medium">{planInfo.name}</p>
                        {planInfo.canUpgrade && isClickable ? (
                            <button
                                onClick={handleUpgradeClick}
                                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                            >
                                Upgrade for more features
                                <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                            </button>
                        ) : (
                            <p className="text-xs text-muted-foreground">{planInfo.description}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 