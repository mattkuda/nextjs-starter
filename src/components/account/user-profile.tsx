'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
        additional_context: user?.additional_context,
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
                    <label htmlFor="additional_context" className="block text-sm font-medium text-foreground mb-2">Additional Context</label>
                    <Textarea
                        id="additional_context"
                        value={formData.additional_context || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, additional_context: e.target.value }))}
                        className="bg-background border-input"
                        rows={5}
                        placeholder="Provide additional context about yourself that can help when using AI features..."
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

