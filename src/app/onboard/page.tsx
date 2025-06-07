'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import axios from 'axios'
import { useAuth, useUser } from '@clerk/nextjs'
import { CircularProgress } from '@mui/material'
import { Boxes } from 'lucide-react'

interface OnboardingForm {
    firstName: string
    lastName: string
    jobTitle: string
    organizationName: string
}

export default function OnboardPage() {
    const router = useRouter()
    const { userId } = useAuth();
    const [isLoading, setIsLoading] = useState(false)
    const { user, isLoaded } = useUser();
    const [form, setForm] = useState<OnboardingForm>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        jobTitle: '',
        organizationName: '',
    })

    useEffect(() => {
        if (user) {
            setForm((prevForm) => ({
                ...prevForm,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
            }))
        }
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await axios.post('/api/onboard', {
                userId,
                ...form
            })
            router.push('/dashboard') // Only happens if the API call succeeds
        } catch (error) {
            console.error('Onboarding error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <div className="absolute top-8 left-8 hidden md:block text-xl font-semibold">
                <Boxes className="h-6 w-6 mr-2" />
                NextJS Starter
            </div>
            <div className="flex items-center justify-center p-4 min-h-screen">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
                    <div className="space-y-2 mb-8">
                        <h1 className="text-2xl font-semibold">Create your account</h1>
                        <p className="text-gray-500">
                            We need some basic details curate your experience.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name *</Label>
                            <Input
                                id="firstName"
                                placeholder="Enter your first name"
                                value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                disabled={!isLoaded}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name *</Label>
                            <Input
                                id="lastName"
                                placeholder="Enter your last name"
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                disabled={!isLoaded}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jobTitle">Job function *</Label>
                            <Input
                                id="jobTitle"
                                placeholder="e.g. Software Engineer, Product Manager, etc."
                                value={form.jobTitle}
                                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="organizationName">Organization name *</Label>
                            <Input
                                id="organizationName"
                                placeholder="e.g. Google, Meta, etc."
                                value={form.organizationName}
                                onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full font-semibold h-10 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <CircularProgress
                                    size={16}
                                    sx={{
                                        color: 'white',
                                        marginRight: '8px'
                                    }}
                                />
                            ) : (
                                'Create account'
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
} 