import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AIChat } from '@/components/AIChat'
import { MessageCircle } from 'lucide-react'

export default function AiChatPage() {
    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100vh-126px)] scroll-disable">
                <div className="flex-shrink-0">
                    <h1 className="text-3xl font-bold mb-2 flex items-center">
                        <MessageCircle className="w-7 h-7 mr-3 text-primary" />
                        AI Chat
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        Chat with AI on any topic to get intelligent responses, feedback, and assistance.
                    </p>
                </div>
                <div className="flex-1 min-h-0">
                    <AIChat />
                </div>
            </div>
        </DashboardLayout>
    )
}