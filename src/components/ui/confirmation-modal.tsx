import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface ConfirmationModalProps {
    title: string
    description: string
    actionLabel: string
    onConfirm: () => void
    isOpen: boolean
    onClose: () => void
}

export function ConfirmationModal({
    title,
    description,
    actionLabel,
    onConfirm,
    isOpen,
    onClose
}: ConfirmationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm}>{actionLabel}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

