"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PricingSection } from "@/components/landing/pricing-section"

interface UpgradeModalProps {
    isOpen: boolean
    onClose: () => void
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
                <div className="flex flex-col justify-between items-center p-6 border-b gap-6">
                    <h2 className="text-4xl font-bold">Upgrade to Pro</h2>
                </div>
                <div className="flex-1 overflow-auto p-6">
                    <PricingSection isWaitlistMode={false} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

