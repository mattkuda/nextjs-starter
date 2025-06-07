'use client'

import { ThreadInsights } from '../../components/ThreadInsights'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { Lightbulb } from 'lucide-react'

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-4 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2" />
                Thread Insights
            </h1>
            <p className="text-gray-600 mb-8">Summarize threads, detect action items, and generate impactful replies.</p>
            <ThreadInsights />
        </DashboardLayout>
    )
}

