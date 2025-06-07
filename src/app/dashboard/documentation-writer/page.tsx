import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { DocumentationWriter } from '@/components/DocumentationWriter'
import { BookOpen } from 'lucide-react'

export default function DocumentationWriterPage() {
    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-4 flex items-center">
                <BookOpen className="w-6 h-6 mr-2" />
                Documentation Writer
            </h1>
            <p className="text-gray-600 mb-8">Summarize threads into clean, professional documentation.</p>
            <DocumentationWriter />
        </DashboardLayout>
    )
}

