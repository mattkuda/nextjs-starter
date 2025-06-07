import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AICoach } from '@/components/AICoach'
import { MessageCircle } from 'lucide-react'

export default function AiCoachPage() {
    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100vh-126px)] scroll-disable">
                <div className="flex-shrink-0">
                    <h1 className="text-3xl font-bold mb-4 flex items-center">
                        <MessageCircle className="w-6 h-6 mr-2" />
                        AI Coach
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Chat with an AI coach on any work-related topic to get feedback and suggestions.
                    </p>
                </div>
                <div className="flex-1 min-h-0">
                    <AICoach />
                </div>
            </div>
        </DashboardLayout>
    )
}

