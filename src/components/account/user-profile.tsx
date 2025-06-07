'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User } from '@/types'
import { SaveIcon, CheckIcon } from 'lucide-react'
import { CircularProgress } from '@mui/material'

interface UserProfileProps {
    user?: User | null
}

export function UserProfile({ user }: UserProfileProps) {
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        first_name: user?.first_name,
        last_name: user?.last_name,
        job_title: user?.job_title,
        organization_name: user?.organization_name,
    })

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const res = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error('Failed to save changes')
            setSaveSuccess(true)
            setTimeout(() => {
                setSaveSuccess(false)
            }, 3000)
        } catch (error) {
            console.error('Error updating user data:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Profile Details</h2>
            <p className="text-sm text-gray-500">These details are used to identify you in threads and better understand the context.</p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm text-gray-700 font-bold">Name</label>
                    <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    />
                </div>
                <div>
                    <label htmlFor="last_name" className="block text-sm text-gray-700 font-bold">Last Name</label>
                    <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    />
                </div>
                <div>
                    <label htmlFor="job_title" className="block text-sm text-gray-700 font-bold">Job Title</label>
                    <Input
                        id="job_title"
                        value={formData.job_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                    />
                </div>
                <div>
                    <label htmlFor="organization_name" className="block text-sm text-gray-700 font-bold">Organization Name</label>
                    <Input
                        id="organization_name"
                        value={formData.organization_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, organization_name: e.target.value }))}
                    />
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="font-bold bg-gradient-to-r from-rose-200 via-pink-200 to-fuchsia-200 text-black hover:opacity-90 disabled:opacity-50"
                >
                    {isSaving ? (
                        <CircularProgress
                            size={16}
                            className="mr-2"
                            sx={{ color: 'currentColor' }}
                        />
                    ) : saveSuccess ? (
                        <CheckIcon className="h-4 w-4 mr-2" />
                    ) : (
                        <SaveIcon className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? 'Saving...' : saveSuccess ? 'Saved' : 'Save Profile'}
                </Button>
            </div>
        </div>
    )
}

