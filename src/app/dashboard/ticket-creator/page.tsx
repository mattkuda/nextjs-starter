import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { TicketCreator } from '@/components/TicketCreator'
import { TicketIcon } from 'lucide-react'

export default function JiraTicketCreatorPage() {
    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-4 flex items-center">
                <TicketIcon className="w-6 h-6 mr-2" />
                Ticket Creator
            </h1>
            <p className="text-gray-600 mb-8">Turn ideas or thread summaries into clear, structured tickets for your project.</p>
            <TicketCreator />
        </DashboardLayout>
    )
}

