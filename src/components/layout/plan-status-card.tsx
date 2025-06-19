'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Crown, ZapIcon, ArrowUpRight, Zap, Sparkle } from "lucide-react"
import { SubscriptionStatus } from "@/lib/constants"

interface PlanStatusCardProps {
    subscriptionStatus?: SubscriptionStatus
    isClickable?: boolean
    onUpgradeClick?: () => void
    isLoading?: boolean
}

export function PlanStatusCard({ subscriptionStatus, isClickable = true, onUpgradeClick, isLoading = false }: PlanStatusCardProps) {

    const getPlanInfo = () => {
        switch (subscriptionStatus) {
            case SubscriptionStatus.STARTER:
                return {
                    icon: Sparkle,
                    name: 'Starter Plan',
                    description: '100 monthly credits',
                    color: 'text-blue-500',
                    canUpgrade: true
                }
            case SubscriptionStatus.PRO:
                return {
                    icon: Zap,
                    name: 'Pro Plan',
                    description: '500 monthly credits',
                    color: 'text-purple-500',
                    canUpgrade: true
                }
            case SubscriptionStatus.MAX:
                return {
                    icon: Crown,
                    name: 'Max Plan',
                    description: 'All features unlocked',
                    color: 'text-orange-500',
                    canUpgrade: false
                }
            default:
                return {
                    icon: ZapIcon,
                    name: 'Free Plan',
                    description: '5 total credits',
                    color: 'text-muted-foreground',
                    canUpgrade: true
                }
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
                                <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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