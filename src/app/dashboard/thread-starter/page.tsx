import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ThreadStarter } from '@/components/ThreadStarter'
import { Rocket } from 'lucide-react'

export default function ThreadStarterPage() {
    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-4 flex items-center">
                <Rocket className="w-6 h-6 mr-2" />
                Thread Starter
            </h1>
            <p className="text-gray-600 mb-8">Generate actionable ways to kick off any discussion.</p>
            <ThreadStarter />
        </DashboardLayout>
    )
}

