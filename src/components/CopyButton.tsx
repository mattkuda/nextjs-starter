import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Check, Copy } from 'lucide-react'

export function CopyButton({ text, displayText }: { text: string, displayText?: string }) {
    const [tooltipText, setTooltipText] = useState('Copy Text');
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setTooltipText('Text Copied');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
    }

    if (displayText != null && displayText != "") {
        return (
            <Button
                variant="ghost"
                onClick={() => copyToClipboard(text)}
            >
                {isCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
                {displayText}
            </Button>
        )

    }
    return (
        <TooltipProvider delayDuration={0} skipDelayDuration={0}>
            <Tooltip delayDuration={0}>
                <TooltipTrigger
                    onMouseLeave={() => setTimeout(() => setTooltipText('Copy Text'), 100)}
                    onClick={(event) => {
                        event.preventDefault();
                    }}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(text)}
                        className="h-8 w-8 rounded-full hover:bg-muted group"
                    >
                        {isCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent
                    onPointerDownOutside={(event) => {
                        event.preventDefault();
                    }}                            >
                    <p className="text-white">{tooltipText}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}