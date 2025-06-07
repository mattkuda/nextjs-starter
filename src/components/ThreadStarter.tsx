'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Sparkles } from 'lucide-react'
import { Slider } from "@/components/ui/slider"
import { motion } from 'framer-motion';
import axios from 'axios'
import { CopyButton } from './CopyButton'
import { HEADER_HEIGHT } from '../lib/constants';

interface ThreadStarterResponse {
    suggestedStarters: string[];
}

const spinAnimation = "animate-spin";
const devInitialState = {
    instructions: 'Suggest a clear next step for the team to move launch or business card template boosting alrogitm, emphasizing prioritization and stakeholder alignment.',
    threadType: 'announcement',
    tone: 'casual',
    variationLength: 'medium',
    variations: '3',
    useEmojis: false,
    output: null,
    isLoading: false,
    copiedIndex: null,
    isCustomLength: false,
    customSentences: 5,
}

const prodInitialState = {
    instructions: '',
    threadType: 'announcement',
    tone: 'casual',
    variationLength: 'medium',
    variations: '3',
    useEmojis: false,
    output: null,
    isLoading: false,
    copiedIndex: null,
    isCustomLength: false,
    customSentences: 5,
}

const initialState = process.env.NODE_ENV === 'development' ? devInitialState : prodInitialState

export function ThreadStarter() {
    const [instructions, setInstructions] = useState(initialState.instructions)
    const [tone, setTone] = useState('neutral')
    const [threadType, setThreadType] = useState('announcement')
    const [variationLength, setvariationLength] = useState('medium')
    const [isCustomLength, setIsCustomLength] = useState(false);
    const [customSentences, setCustomSentences] = useState(5);
    const [variations, setVariations] = useState('3')
    const [useEmojis, setUseEmojis] = useState(true)
    const [output, setOutput] = useState<ThreadStarterResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const summaryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (output && summaryRef.current) {
            setTimeout(() => {
                const summaryElement = summaryRef.current;
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

    const handleSubmit = async () => {
        if (!instructions) return

        setIsLoading(true)
        try {
            const response = await axios.post('/api/threadStarter', {
                instructions: instructions || undefined,
                threadType,
                tone,
                replyLength: variationLength,
                customSentences,
                variations: parseInt(variations),
                useEmojis
            })

            const data: ThreadStarterResponse = response.data
            setOutput(data)
        } catch (error) {
            console.error('Error generating response:', error)
            setOutput(null)
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setInstructions(initialState.instructions);
        setTone(initialState.tone);
        setThreadType(initialState.threadType);
        setvariationLength(initialState.variationLength);
        setVariations(initialState.variations);
        setUseEmojis(initialState.useEmojis);
        setOutput(null);
        setIsCustomLength(initialState.isCustomLength);
        setCustomSentences(initialState.customSentences);
    };

    return (
        <div className="mx-auto">
            <div className="bg-white shadow-md rounded-lg p-6 space-y-8">
                <div className="flex gap-6">
                    <div className="w-[35%] space-y-6">
                        <div className="mt-2">
                            <Label>Thread Type</Label>
                            <Select value={threadType} onValueChange={setThreadType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select thread type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="announcement">📣 Announcement</SelectItem>
                                    <SelectItem value="question">💬 Question</SelectItem>
                                    <SelectItem value="request">🤝 Request</SelectItem>
                                    <SelectItem value="update">🔄 Update</SelectItem>
                                    <SelectItem value="clarification">🔍 Clarification</SelectItem>
                                    <SelectItem value="celebration">🥳 Celebration</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mt-2">
                            <Label>Tone</Label>
                            <Select value={tone} onValueChange={setTone}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select tone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="neutral">⚖️ Neutral</SelectItem>
                                    <SelectItem value="professional">💼 Professional</SelectItem>
                                    <SelectItem value="casual">🗨️ Casual</SelectItem>
                                    <SelectItem value="persuasive">🧲 Persuasive</SelectItem>
                                    <SelectItem value="empathetic">❤️ Empathetic</SelectItem>
                                    <SelectItem value="assertive">📣 Assertive</SelectItem>
                                    <SelectItem value="inspirational">🌟 Inspirational</SelectItem>
                                    <SelectItem value="enthusiastic">🎉 Enthusiastic</SelectItem>
                                    <SelectItem value="analytical">📊 Analytical</SelectItem>
                                    <SelectItem value="humorous">😂 Humorous</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Message Length</Label>
                            <RadioGroup
                                value={isCustomLength ? 'custom' : variationLength}
                                onValueChange={(value) => {
                                    if (value === 'custom') {
                                        setIsCustomLength(true)
                                    } else {
                                        setIsCustomLength(false)
                                        setvariationLength(value)
                                    }
                                }}
                                className="grid grid-cols-2 gap-2"
                            >
                                <div className="flex items-center space-x-2 p-2 rounded-md">
                                    <RadioGroupItem value="short" id="short" />
                                    <Label htmlFor="short" className="text-sm text-gray-600">
                                        Short
                                        <span className="text-xs text-gray-500 ml-2">(1-2 sentences)</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-2 rounded-md">
                                    <RadioGroupItem value="medium" id="medium" />
                                    <Label htmlFor="medium" className="text-sm text-gray-600">
                                        Medium
                                        <span className="text-xs text-gray-500 ml-2">(3-5 sentences)</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-2 rounded-md">
                                    <RadioGroupItem value="long" id="long" />
                                    <Label htmlFor="long" className="text-sm text-gray-600">
                                        Long
                                        <span className="text-xs text-gray-500 ml-2">(5+ sentences)</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-2 rounded-md">
                                    <RadioGroupItem value="custom" id="custom" />
                                    <Label htmlFor="custom" className="text-sm text-gray-600">
                                        Custom
                                        <span className="text-xs text-gray-500 ml-2">(Set length)</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                            {isCustomLength && (
                                <div className="mt-2 space-y-2 p-2 rounded-md">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Number of sentences: {customSentences}</span>
                                    </div>
                                    <Slider
                                        value={[customSentences]}
                                        onValueChange={([value]: number[]) => setCustomSentences(value)}
                                        max={20}
                                        min={1}
                                        step={1}
                                        className="w-half"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <Label>Variations</Label>
                            <RadioGroup
                                value={variations}
                                onValueChange={setVariations}
                                className="flex space-x-2 p-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="1" id="one-variation" />
                                    <Label htmlFor="one-variation">1</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="3" id="three-variations" />
                                    <Label htmlFor="three-variations">3</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="5" id="five-variations" />
                                    <Label htmlFor="five-variations">5</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="emoji-toggle"
                                    checked={useEmojis}
                                    onCheckedChange={setUseEmojis}
                                />
                                <Label htmlFor="emoji-toggle">Use Emojis</Label>
                            </div>
                        </div>
                    </div>

                    <div className="w-px bg-gray-200" />

                    <div className="flex-1 space-y-6">
                        <div>
                            <p className="font-semibold mb-2 h-24px">What do you want to say?</p>
                            <Textarea
                                placeholder="The thread should... "
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                className="h-96"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            {output && (
                                <Button
                                    variant="ghost"
                                    onClick={handleReset}
                                    className="font-semibold"
                                >
                                    Reset
                                </Button>
                            )}
                            <Button
                                onClick={handleSubmit}
                                className="font-bold bg-gradient-to-r from-rose-200 via-pink-200 to-fuchsia-200 text-black hover:opacity-90"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <Sparkles className={`w-4 h-4 mr-2 ${spinAnimation}`} />
                                        Generating...
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        {output ? 'Re-Generate Messages' : 'Generate Messages'}
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {output && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6 border-t pt-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="border border-fuchsia-200 p-4 rounded-lg"
                        >
                            <h3 className="text-lg font-semibold mb-2">Thread Starters</h3>
                            <div className="space-y-4">
                                {output.suggestedStarters.map((starter: string, index: number) => (
                                    <div key={index} className="bg-white p-4 rounded-md shadow-sm relative">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium text-gray-500">Variation {index + 1}</span>
                                            <CopyButton text={starter} />
                                        </div>
                                        <p className="mt-2">{starter}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}