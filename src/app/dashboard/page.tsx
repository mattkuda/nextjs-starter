'use client'

import { Dashboard } from '../../components/Dashboard'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { Home } from 'lucide-react'

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                    <Home className="w-7 h-7 mr-3 text-primary" />
                    Dashboard
                </h1>
                <p className="text-muted-foreground">Welcome back! Here's an overview of your account and recent activity.</p>
            </div>
            <Dashboard />
        </DashboardLayout>
    )
}

