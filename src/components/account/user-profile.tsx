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
        <div className="space-y-6">
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">These details are used to identify you in threads and better understand the context.</p>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-foreground mb-2">First Name</label>
                        <Input
                            id="first_name"
                            value={formData.first_name || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                            className="bg-background border-input"
                        />
                    </div>
                    <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                        <Input
                            id="last_name"
                            value={formData.last_name || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                            className="bg-background border-input"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="job_title" className="block text-sm font-medium text-foreground mb-2">Job Title</label>
                    <Input
                        id="job_title"
                        value={formData.job_title || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                        className="bg-background border-input"
                    />
                </div>
                <div>
                    <label htmlFor="organization_name" className="block text-sm font-medium text-foreground mb-2">Organization Name</label>
                    <Input
                        id="organization_name"
                        value={formData.organization_name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, organization_name: e.target.value }))}
                        className="bg-background border-input"
                    />
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
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

