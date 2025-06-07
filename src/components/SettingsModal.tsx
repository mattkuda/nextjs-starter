'use client'

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile } from '@/components/account/user-profile'
// import { UsageOverview } from '@/components/account/usage-overview'
import { SubscriptionDetails } from '@/components/account/subscription-details'
import { User } from "@/types"
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
    defaultTab?: 'profile' | 'billing' | 'settings'
}

export function SettingsModal({ isOpen, onClose, defaultTab = 'profile' }: SettingsModalProps) {
    const { data: userData } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const { data } = await axios.get<User>('/api/user')
            return data
        }
    })

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-2xl w-full h-[60vh] overflow-y-auto bg-white p-8 rounded-md">
                <Tabs defaultValue={defaultTab} className="w-full h-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="billing">Plan & Billing</TabsTrigger>
                        {/* <TabsTrigger value="settings">Settings</TabsTrigger> */}
                    </TabsList>
                    <TabsContent value="profile" className="space-y-4">
                        <UserProfile user={userData} />
                    </TabsContent>
                    <TabsContent value="billing" className="space-y-4">
                        <SubscriptionDetails user={userData || null} />
                    </TabsContent>
                    <TabsContent value="settings" className="space-y-4">
                        {/* Add settings content here */}
                        <div className="bg-white p-4 rounded-lg border">
                            <h3 className="text-lg font-semibold mb-4">Settings</h3>
                            {/* Add settings options */}
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
} 
