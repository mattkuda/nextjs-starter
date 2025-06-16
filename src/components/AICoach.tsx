'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import axios from 'axios';
import { ArrowUp, RotateCcw } from 'lucide-react'
import { cn } from '../lib/utils'
import { toast } from "@/hooks/use-toast"
import ReactMarkdown from 'react-markdown'
import { CopyButton } from './CopyButton'
import { motion } from 'framer-motion'

interface Message {
    // id: string
    content: string
    role: 'assistant' | 'user'
    timestamp: Date
}

interface AICoachResponse {
    response: string
    error?: string
}

const devInitialState = {
    messages: [],
    input: 'How to build a web dev agency?',
    isLoading: false,
    isError: false,
}

const prodInitialState = {
    messages: [],
    input: '',
    isLoading: false,
    isError: false,
}

const initialState = process.env.NODE_ENV === 'development' ? devInitialState : prodInitialState

function TypewriterEffect({ content, onComplete }: { content: string; onComplete: () => void }) {
    const [displayedContent, setDisplayedContent] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const words = content.split(' ')

    useEffect(() => {
        if (currentIndex < words.length) {
            const timer = setTimeout(() => {
                setDisplayedContent(prev => prev + (currentIndex === 0 ? '' : ' ') + words[currentIndex])
                setCurrentIndex(prev => prev + 1)
            }, 15)
            return () => clearTimeout(timer)
        } else {
            setIsComplete(true)
            onComplete()
        }
    }, [words, currentIndex, onComplete])

    return (
        <div className="flex flex-col space-y-1">
            <div className={`rounded-lg p-3 bg-muted`}>
                <ReactMarkdown
                    className="text-foreground prose prose-sm max-w-none"
                    components={{
                        strong: (props: React.ComponentPropsWithoutRef<'strong'>) => <span className="font-semibold">{props.children}</span>,
                        em: (props: React.ComponentPropsWithoutRef<'em'>) => <span className="italic">{props.children}</span>,
                        code: (props: React.ComponentPropsWithoutRef<'code'>) => (
                            <code className="bg-accent rounded px-1 py-0.5 text-sm">{props.children}</code>
                        ),
                        ul: (props: React.ComponentPropsWithoutRef<'ul'>) => <ul className="list-disc pl-4 my-2">{props.children}</ul>,
                        ol: (props: React.ComponentPropsWithoutRef<'ol'>) => <ol className="list-decimal pl-4 my-2">{props.children}</ol>,
                        li: (props: React.ComponentPropsWithoutRef<'li'>) => <li className="my-1">{props.children}</li>,
                    }}
                >
                    {displayedContent}
                </ReactMarkdown>
            </div>
            {isComplete && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 ml-1"
                >
                    <CopyButton text={content} />
                </motion.div>
            )}
        </div>
    )
}

export function AICoach() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState(initialState.input)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async () => {
        if (!input.trim()) return

        const userMessage: Message = {
            content: input,
            role: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)
        setIsError(false)

        try {
            const conversationHistory = messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }))

            const { data } = await axios.post<AICoachResponse>(
                '/api/aiCoach',
                {
                    message: userMessage.content,
                    conversationHistory
                }
            )

            if (data.error) {
                throw new Error(data.error)
            }

            const assistantMessage: Message = {
                // id: (Date.now() + 1).toString(),
                content: data.response,
                role: 'assistant',
                timestamp: new Date()
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            console.error('Error generating reply:', error)
            setIsError(true)
            toast({
                title: "Error",
                description: "There was an error generating your response. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value)
    }

    return (
        <div className="flex flex-col h-full bg-card shadow-md rounded-lg border">
            {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-foreground">What can I help with?</h2>
                    </div>
                    <div className="w-full max-w-lg">
                        <Textarea
                            value={input}
                            onChange={handleTextareaChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Message AI Coach..."
                            className="w-full resize-none bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring rounded-md"
                            rows={3}
                        />
                        <Button
                            onClick={() => handleSendMessage()}
                            disabled={!input.trim()}
                            className="w-full mt-3"
                        >
                            Send
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.timestamp.getTime()}
                                className={`flex gap-3 text-sm ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.role === 'assistant' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/ai-avatar.png" alt="AI" />
                                        <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className="flex-[0_1_auto] max-w-[80%] space-y-2">
                                    {isError && !isLoading && (
                                        <div className="flex gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src="/ai-avatar.png" alt="AI" />
                                                <AvatarFallback>AI</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-[0_1_auto] max-w-[80%]">
                                                <div className="rounded-lg p-4 bg-red-50 border border-red-200">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-red-600">There was an error generating your response.</p>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={handleSendMessage}
                                                            className="text-red-600 hover:text-red-500 hover:bg-red-50"
                                                        >
                                                            <RotateCcw className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {message.role === 'assistant' ? (
                                        <TypewriterEffect
                                            content={message.content}
                                            onComplete={() => { }}
                                        />
                                    ) : (
                                        <div className="rounded-lg p-3 bg-primary/10 border border-primary/20">
                                            <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                    )}
                                </div>
                                {message.role === 'user' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/user-avatar.png" alt="User" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/ai-avatar.png" alt="AI" />
                                    <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                                <div className="flex items-center">
                                    <div className="flex space-x-2">
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]" />
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    {/* Input Container */}
                    <div className="border-t bg-card p-4">
                        <div className="relative flex items-end">
                            <Textarea
                                value={input}
                                onChange={handleTextareaChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Message AI Coach..."
                                className="min-h-[44px] max-h-24 w-full resize-none bg-muted px-3 py-3 pr-14 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring overflow-y-auto"
                            />
                            <div className="absolute right-2 bottom-4 flex items-center gap-2">
                                <Button
                                    size="icon"
                                    onClick={() => handleSendMessage()}
                                    disabled={isLoading || !input.trim()}
                                    className={cn(
                                        "rounded-full p-2",
                                        (!input.trim() || isLoading) && "opacity-50"
                                    )}
                                >
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <p className="mt-2 text-[11px] text-muted-foreground">
                            AI Coach can make mistakes. Consider checking important information.
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}
