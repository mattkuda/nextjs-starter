import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { SocialWizard } from '@/components/SocialWizard'
import { BadgeCheck } from 'lucide-react'

export default function SocialWizardPage() {
    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-4 flex items-center">
                <BadgeCheck className="w-6 h-6 mr-2" />
                Social Wizard
            </h1>
            <p className="text-gray-600 mb-8">Create engaging social media posts tailored to your platform and style.</p>
            <SocialWizard />
        </DashboardLayout>
    )
} 