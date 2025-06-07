'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Sparkles, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { ToneConverterResponse } from '../types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GPT_SUPPORTED_LANGUAGES } from '../lib/constants'
import { CopyButton } from './CopyButton'

const devInitialState = {
    tone: 'professional',
    language: 'English',
    input: `Hi Marketing team,

Just wanted to let you know that I looked at the latest campaign numbers and they're not great. The click-through rates are way below what we expected, and we're burning through our ad budget pretty fast. We need to fix this ASAP before the quarter ends.

I think we should jump on a call tomorrow to figure out what's going wrong and make some changes. This is pretty urgent.

Let me know when you're free.

Thanks,
Alex`,
    output: null,
    isLoading: false,
    currentVariation: 0,
}

const MAX_TONE_CONTEXT_LENGTH = 2000

const prodInitialState = {
    tone: 'neutral',
    language: 'English',
    input: '',
    output: null,
    isLoading: false,
    currentVariation: 0,
}

const initialState = process.env.NODE_ENV === 'development' ? devInitialState : prodInitialState

export function ToneConverter() {
    const [tone, setTone] = useState(initialState.tone)
    const [language, setLanguage] = useState(initialState.language)
    const [input, setInput] = useState(initialState.input)
    const [output, setOutput] = useState<ToneConverterResponse | null>(initialState.output)
    const [isLoading, setIsLoading] = useState(initialState.isLoading)
    const [currentVariation, setCurrentVariation] = useState(initialState.currentVariation)

    const handleGenerate = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post('/api/toneConverter', {
                text: input,
                tone: tone,
                language: language,
                variations: 3,
            })
            setOutput(response.data)
        } catch (error) {
            console.error('Error converting tone:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="mx-auto">
            <div className="bg-white shadow-md rounded-lg p-6 space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">Tone :</span>
                        <Select defaultValue="neutral" value={tone} onValueChange={setTone}>
                            <SelectTrigger className="w-[200px]">
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
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">Language :</span>
                        <Select defaultValue="English" value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                {GPT_SUPPORTED_LANGUAGES.map((language) => (
                                    <SelectItem key={language} value={language}>{language}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div>
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter your text here..."
                                className="min-h-[200px]"
                            />
                            <div className="flex justify-end">
                                <p className={`text-xs ${input.length > MAX_TONE_CONTEXT_LENGTH ?
                                    "text-red-500" : "text-gray-500"
                                    }`}>
                                    {input.length}/{MAX_TONE_CONTEXT_LENGTH}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex">
                            <Button
                                onClick={handleGenerate}
                                className="w-full font-bold bg-gradient-to-r from-rose-200 via-pink-200 to-fuchsia-200 text-black hover:opacity-90 disabled:opacity-50"
                                disabled={isLoading || !input || input.length > MAX_TONE_CONTEXT_LENGTH}
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <Sparkles className={`w-4 h-4 mr-2 animate-spin"`} />
                                        Converting...
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Convert
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                    <div className="relative min-h-[200px]">
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="w-3/4 h-4" />
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-5/6 h-4" />
                            </div>
                        ) : output ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                <p className="text-gray-700">{output.convertedTexts[currentVariation]}</p>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setCurrentVariation((prev) =>
                                                prev === 0 ? output.convertedTexts.length - 1 : prev - 1
                                            )}
                                            disabled={output.convertedTexts.length <= 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm text-gray-500">
                                            Variation {currentVariation + 1} of {output.convertedTexts.length}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setCurrentVariation((prev) =>
                                                prev === output.convertedTexts.length - 1 ? 0 : prev + 1
                                            )}
                                            disabled={output.convertedTexts.length <= 1}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CopyButton text={output.convertedTexts[currentVariation]} />
                                        <Button variant="ghost" size="icon" onClick={handleGenerate}>
                                            <RotateCcw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                Your converted text will appear here
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

