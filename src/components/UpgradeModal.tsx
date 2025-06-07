"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PricingDisplay } from "./PricingDisplay"
import { SubscriptionStatus } from "@/lib/constants"

interface UpgradeModalProps {
    isOpen: boolean
    onClose: () => void
    currentPlan: SubscriptionStatus
}

export function UpgradeModal({ isOpen, onClose, currentPlan }: UpgradeModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
                <div className="flex flex-col justify-between items-center p-6 border-b gap-6">
                    <h2 className="text-4xl font-bold">Upgrade to Pro</h2>
                </div>
                <div className="flex-1 overflow-auto p-6">
                    <PricingDisplay variant="modal" currentPlan={currentPlan} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

