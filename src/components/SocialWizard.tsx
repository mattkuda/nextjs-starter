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
import { motion } from 'framer-motion'
import axios from 'axios'
import { CopyButton } from './CopyButton'
import { HEADER_HEIGHT } from '../lib/constants'
import { toast } from '../hooks/use-toast'

interface SocialWizardResponse {
    suggestedPosts: string[];
}

const spinAnimation = "animate-spin"
const devInitialState = {
    instructions: 'Create me a post announcing my new Saas, FlowThread for simplifying work communication with AI.',
    platform: 'twitter',
    tone: 'casual',
    variationLength: 'medium',
    variations: '3',
    useEmojis: true,
    useHashtags: true,
    output: null,
    isLoading: false,
    isCustomLength: false,
    customSentences: 3,
}
const prodInitialState = {
    instructions: '',
    platform: 'instagram',
    tone: 'casual',
    variationLength: 'medium',
    variations: '3',
    useEmojis: true,
    useHashtags: true,
    output: null,
    isLoading: false,
    isCustomLength: false,
    customSentences: 3,
}

const initialState = process.env.NODE_ENV === 'development' ? devInitialState : prodInitialState

export function SocialWizard() {
    const [instructions, setInstructions] = useState(initialState.instructions)
    const [platform, setPlatform] = useState(initialState.platform)
    const [tone, setTone] = useState(initialState.tone)
    const [variationLength, setVariationLength] = useState(initialState.variationLength)
    const [isCustomLength, setIsCustomLength] = useState(false)
    const [customSentences, setCustomSentences] = useState(3)
    const [variations, setVariations] = useState(initialState.variations)
    const [useEmojis, setUseEmojis] = useState(initialState.useEmojis)
    const [useHashtags, setUseHashtags] = useState(initialState.useHashtags)
    const [output, setOutput] = useState<SocialWizardResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const summaryRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (output && summaryRef.current) {
            setTimeout(() => {
                const summaryElement = summaryRef.current
                if (summaryElement) {
                    const elementRect = summaryElement.getBoundingClientRect()
                    const absoluteElementTop = elementRect.top + window.pageYOffset
                    const middle = absoluteElementTop - HEADER_HEIGHT - 24

                    window.scrollTo({
                        top: middle,
                        behavior: 'smooth'
                    })
                }
            }, 300)
        }
    }, [output])

    const handleSubmit = async () => {
        if (!instructions) return

        setIsLoading(true)
        try {
            const response = await axios.post('/api/socialWizard', {
                instructions,
                platform,
                tone,
                variationLength,
                customSentences: isCustomLength ? customSentences : null,
                variations: parseInt(variations),
                useEmojis,
                useHashtags
            })

            const data: SocialWizardResponse = response.data
            setOutput(data)
        } catch (error) {
            console.error('Error generating posts:', error)
            setOutput(null);

            if (axios.isAxiosError(error)) {
                toast({
                    title: "Error",
                    description: error.response?.data?.error || error.message,
                    variant: "destructive",
                    duration: 5000,
                });
            } else {
                toast({
                    title: "Error",
                    description: "An unexpected error occurred",
                    variant: "destructive",
                    duration: 5000,
                });
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setInstructions(initialState.instructions)
        setPlatform(initialState.platform)
        setTone(initialState.tone)
        setVariationLength(initialState.variationLength)
        setVariations(initialState.variations)
        setUseEmojis(initialState.useEmojis)
        setUseHashtags(initialState.useHashtags)
        setOutput(null)
        setIsCustomLength(initialState.isCustomLength)
        setCustomSentences(initialState.customSentences)
    }

    return (
        <div className="mx-auto">
            <div className="bg-white shadow-md rounded-lg p-6 space-y-8">
                <div className="flex gap-6">
                    <div className="w-[35%] space-y-6">
                        <div className="mt-2">
                            <Label>Platform</Label>
                            <Select value={platform} onValueChange={setPlatform}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="instagram">📸 Instagram</SelectItem>
                                    <SelectItem value="twitter">🐦 Twitter</SelectItem>
                                    <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                                    <SelectItem value="tiktok">📱 TikTok</SelectItem>
                                    <SelectItem value="facebook">👥 Facebook</SelectItem>
                                    <SelectItem value="pinterest">📌 Pinterest</SelectItem>
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
                                    <SelectItem value="casual">🗨️ Casual</SelectItem>
                                    <SelectItem value="professional">💼 Professional</SelectItem>
                                    <SelectItem value="funny">😂 Funny</SelectItem>
                                    <SelectItem value="inspirational">✨ Inspirational</SelectItem>
                                    <SelectItem value="educational">📚 Educational</SelectItem>
                                    <SelectItem value="promotional">🎯 Promotional</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Post Length</Label>
                            <RadioGroup
                                value={isCustomLength ? 'custom' : variationLength}
                                onValueChange={(value) => {
                                    if (value === 'custom') {
                                        setIsCustomLength(true)
                                    } else {
                                        setIsCustomLength(false)
                                    }
                                    setVariationLength(value)
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
                                        <span className="text-xs text-gray-500 ml-2">(3-4 sentences)</span>
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
                                        max={10}
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

                        <div className="flex flex-row space-x-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="emoji-toggle"
                                    checked={useEmojis}
                                    onCheckedChange={setUseEmojis}
                                />
                                <Label htmlFor="emoji-toggle">Use Emojis</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="hashtag-toggle"
                                    checked={useHashtags}
                                    onCheckedChange={setUseHashtags}
                                />
                                <Label htmlFor="hashtag-toggle">Add Hashtags</Label>
                            </div>
                        </div>
                    </div>

                    <div className="w-px bg-gray-200" />

                    <div className="flex-1 space-y-6">
                        <div>
                            <p className="font-semibold mb-2">What's your post about?</p>
                            <Textarea
                                placeholder="Describe your post content..."
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
                                        {output ? 'Generate New Posts' : 'Generate Posts'}
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
                            <h3 className="text-lg font-semibold mb-2">Generated Posts</h3>
                            <div className="space-y-4">
                                {output.suggestedPosts.map((post: string, index: number) => (
                                    <div key={index} className="bg-white p-4 rounded-md shadow-sm relative">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium text-gray-500">Variation {index + 1}</span>
                                            <CopyButton text={post} />
                                        </div>
                                        <p className="mt-2 whitespace-pre-line">{post}</p>
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