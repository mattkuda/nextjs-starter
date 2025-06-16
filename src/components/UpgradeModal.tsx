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
            <DialogContent className="max-w-7xl flex flex-col p-0">
                <div className="flex-1 overflow-auto">
                    <PricingSection isWaitlistMode={false} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

