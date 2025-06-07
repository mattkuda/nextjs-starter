'use client'

import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Sparkles } from 'lucide-react'
import { Slider } from "@/components/ui/slider"
import { motion } from 'framer-motion'
import { WORKER_TYPES, HEADER_HEIGHT } from '../lib/constants'
import { toast } from "@/hooks/use-toast"
import { CopyButton } from './CopyButton'

interface Ticket {
    title: string
    desc: string
    points?: number | null
}

interface TicketCreatorResponse {
    tickets: Ticket[]
}

const devInitialState = {
    projectContext: 'Add a comprehensive search and filtering system to the internal tool. Users need to be able to search through records using keywords and apply multiple filters like categories, date ranges, and status. The search should update results in real-time and include advanced features like saving favorite searches. Include appropriate loading states, error handling, and a well-designed no results experience.',
    ticketPreferences: 'Each ticket should only have a "Background" and "Acceptance Criteria" section',
    workerType: 'developer',
    numberOfTickets: 8,
    includePoints: true,
    isCustomCount: false,
    customTicketCount: 5,
    output: null as TicketCreatorResponse | null,
    isLoading: false,
}

const prodInitialState = {
    projectContext: '',
    ticketPreferences: '',
    workerType: 'developer',
    numberOfTickets: 3,
    includePoints: true,
    isCustomCount: false,
    customTicketCount: 5,
    output: null as TicketCreatorResponse | null,
    isLoading: false,
}

const initialState = process.env.NODE_ENV === 'development' ? devInitialState : prodInitialState

export function TicketCreator() {
    const [projectContext, setProjectContext] = useState(initialState.projectContext)
    const [ticketPreferences, setTicketPreferences] = useState(initialState.ticketPreferences)
    const [workerType, setWorkerType] = useState(initialState.workerType)
    const [numberOfTickets, setNumberOfTickets] = useState(initialState.numberOfTickets)
    const [includePoints, setIncludePoints] = useState(initialState.includePoints)
    const [isCustomCount, setIsCustomCount] = useState(initialState.isCustomCount)
    const [customTicketCount, setCustomTicketCount] = useState(initialState.customTicketCount)
    const [output, setOutput] = useState<TicketCreatorResponse | null>(initialState.output)
    const [isLoading, setIsLoading] = useState(initialState.isLoading)
    const outputRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (output && outputRef.current) {
            setTimeout(() => {
                const summaryElement = outputRef.current;
                if (summaryElement) {
                    const elementRect = summaryElement.getBoundingClientRect();
                    const absoluteElementTop = elementRect.top + window.pageYOffset;
                    const middle = absoluteElementTop - HEADER_HEIGHT - 24; // 24px additional padding

                    window.scrollTo({
                        top: middle,
                        behavior: 'smooth'
                    });
                }
            }, 300);
        }
    }, [output]);

    const handleGenerateTickets = async () => {
        if (!projectContext) return

        setIsLoading(true)
        try {
            const { data } = await axios.post<TicketCreatorResponse>('/api/ticketCreator', {
                projectContext,
                ticketPreferences,
                workerType,
                numberOfTickets: isCustomCount ? customTicketCount : numberOfTickets,
                includePoints,
            })

            setOutput(data)
        } catch (error) {
            console.error('Error generating tickets:', error)
            toast({
                title: "Error",
                description: "Failed to generate tickets. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setProjectContext(initialState.projectContext)
        setTicketPreferences(initialState.ticketPreferences)
        setWorkerType(initialState.workerType)
        setNumberOfTickets(initialState.numberOfTickets)
        setIncludePoints(initialState.includePoints)
        setIsCustomCount(initialState.isCustomCount)
        setCustomTicketCount(initialState.customTicketCount)
        setOutput(initialState.output)
    }

    return (
        <div className="mx-auto">
            <div className="bg-white shadow-md rounded-lg p-6 space-y-8">
                <div className="flex gap-6">
                    {/* Left sidebar */}
                    <div className="w-[35%] space-y-6">
                        <div>
                            <Label>Assign To</Label>
                            <Select value={workerType} onValueChange={setWorkerType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select worker type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(WORKER_TYPES).map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.emoji} {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Number of Tickets</Label>
                            <RadioGroup
                                value={isCustomCount ? 'custom' : numberOfTickets.toString()}
                                onValueChange={(value) => {
                                    if (value === 'custom') {
                                        setIsCustomCount(true)
                                    } else {
                                        setIsCustomCount(false)
                                        setNumberOfTickets(parseInt(value))
                                    }
                                }}
                                className="grid grid-cols-2 gap-2"
                            >
                                <div className="flex items-center space-x-2 p-2">
                                    <RadioGroupItem value="3" id="three" />
                                    <Label htmlFor="three">3 Tickets</Label>
                                </div>
                                <div className="flex items-center space-x-2 p-2">
                                    <RadioGroupItem value="5" id="five" />
                                    <Label htmlFor="five">5 Tickets</Label>
                                </div>
                                <div className="flex items-center space-x-2 p-2">
                                    <RadioGroupItem value="8" id="eight" />
                                    <Label htmlFor="eight">8 Tickets</Label>
                                </div>
                                <div className="flex items-center space-x-2 p-2">
                                    <RadioGroupItem value="custom" id="custom" />
                                    <Label htmlFor="custom">Custom</Label>
                                </div>
                            </RadioGroup>
                            {isCustomCount && (
                                <div className="mt-2 space-y-2 p-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            Number of tickets: {customTicketCount}
                                        </span>
                                    </div>
                                    <Slider
                                        value={[customTicketCount]}
                                        onValueChange={([value]) => setCustomTicketCount(value)}
                                        max={20}
                                        min={1}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="points-toggle"
                                checked={includePoints}
                                onCheckedChange={setIncludePoints}
                            />
                            <Label htmlFor="points-toggle">Include Story Points</Label>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px bg-gray-200" />

                    {/* Main content */}
                    <div className="flex-1 space-y-6">
                        <div>
                            <Label>What are we building tickets for?</Label>
                            <Textarea
                                placeholder="Describe the project, feature, or initiative..."
                                value={projectContext}
                                onChange={(e) => setProjectContext(e.target.value)}
                                className="h-48"
                            />
                        </div>
                        <div>
                            <Label>Preferences for ticket formatting</Label>
                            <Textarea
                                placeholder="Any specific preferences for how tickets should be structured or written..."
                                value={ticketPreferences}
                                onChange={(e) => setTicketPreferences(e.target.value)}
                                className="h-24"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            {output && (
                                <Button variant="ghost" onClick={handleReset}>
                                    Reset
                                </Button>
                            )}
                            <Button
                                onClick={handleGenerateTickets}
                                className="font-bold bg-gradient-to-r from-rose-200 via-pink-200 to-fuchsia-200 text-black hover:opacity-90"
                                disabled={isLoading || !projectContext.trim()}
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                                        Generating...
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Generate Tickets
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Output */}
                {output && (
                    <motion.div
                        ref={outputRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6 border-t pt-8"
                    >
                        <div className="space-y-4">
                            {output.tickets.map((ticket, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="border border-fuchsia-200 p-4 rounded-lg"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-500">Ticket {index + 1}</span>
                                            {ticket?.points != null && ticket?.points > 0 && (
                                                <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                                                    {ticket.points} {ticket.points > 1 ? 'points' : 'point'}
                                                </span>
                                            )}
                                        </div>
                                        <CopyButton text={ticket.title + '\n' + ticket.desc + (ticket.points ? '\n' + "Points: " + ticket.points : '')} />
                                    </div>
                                    <h3 className="text-lg font-semibold">{ticket.title}</h3>
                                    <p className="text-gray-700">{ticket.desc}</p>
                                </motion.div>
                            ))}
                            {output?.tickets?.length > 0 && (
                                <div className="flex justify-end space-x-2">
                                    <CopyButton text={output.tickets.map(ticket => ticket.title + '\n' + ticket.desc + (ticket.points ? '\n' + "Points: " + ticket.points : '')).join('\n')} displayText="Copy All" />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}