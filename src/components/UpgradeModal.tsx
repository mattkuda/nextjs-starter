"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PricingSection } from "@/components/landing/pricing-section"
import { SubscriptionStatus } from "@/lib/constants"

interface UpgradeModalProps {
    isOpen: boolean
    onClose: () => void
    currentSubscriptionStatus?: SubscriptionStatus
}

export function UpgradeModal({ isOpen, onClose, currentSubscriptionStatus }: UpgradeModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl flex flex-col p-0">
                <DialogHeader className="hidden">
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-auto">
                    <PricingSection
                        isWaitlistMode={false}
                        currentSubscriptionStatus={currentSubscriptionStatus}
                        isModal={true}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

