import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ArrowLeftRight } from 'lucide-react'
import { ToneConverter } from '@/components/ToneConverter'
export default function ToneConverterPage() {
    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-4 flex items-center">
                <ArrowLeftRight className="w-6 h-6 mr-2" />
                Tone Converter
            </h1>
            <p className="text-gray-600 mb-8">Convert your message's tone while preserving its meaning.</p>
            <ToneConverter />
        </DashboardLayout>
    )
} 