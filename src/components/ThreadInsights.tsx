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
import { motion } from 'framer-motion';
import { ThreadInsightsResponse } from '../types'
import { MAX_INSTRUCTIONS_LENGTH, MAX_THREAD_CONTEXT_LENGTH, THREAD_TYPE, THREAD_TYPE_EMOJIS } from '../lib/constants'
import { toast } from "@/hooks/use-toast"
import { CopyButton } from './CopyButton'
import { HEADER_HEIGHT } from '../lib/constants';

const spinAnimation = "animate-spin";
const devInitialState = {
  input: `
  Alice: "Hey team, I've been reviewing the new Q1 product roadmap, and I think we're trying to tackle too much at once. The feature set for Project Falcon is ambitious, but it's unclear how we'll resource it. Any thoughts?"

Bob: "I agree with Alice. We need to prioritize. Falcon is critical, but without clear ownership and timelines, we might miss the release deadline. Should we consider trimming some of the less impactful features?"

Charlie: "Good points, but we should also think about the marketing implications. If we launch Falcon with fewer features, will it still differentiate us from competitors? We've already promised a lot to stakeholders."

Alice: "True, but the risk of overpromising and underdelivering is high. Maybe we can reframe the launch as an MVP and add features in future updates?"

Dana: "I'm in favor of the MVP approach. It reduces risk, and we can collect feedback from early adopters. But we'll need to align with stakeholders on the adjusted scope."

Bob: "Alright, but let's nail down specifics. Which features should we keep for the MVP, and who's owning what? I can draft a list for everyone to review."

Charlie: "I can help with the feature prioritization. Looking at our competitor analysis, I think the AI-powered recommendations and real-time collaboration features are must-haves for the MVP."

Alice: "Good call, Charlie. Those features align well with our core value proposition. We should also keep the dashboard analytics – that's been a major pain point for our enterprise customers."

Dana: "I've just spoken with the dev team. They estimate we can deliver those three core features within the Q1 timeline if we start now. The integration work for the AI component might be tricky though."

Bob: "That's helpful context. I can take ownership of the dashboard analytics, and I suggest we get Eva from the AI team involved for the recommendations feature."

Charlie: "Marketing-wise, this actually gives us a stronger narrative. We can position it as a focused solution that does a few things exceptionally well, rather than a jack-of-all-trades."

Alice: "Perfect. Let's document this and schedule a meeting with stakeholders. I'll prepare a presentation comparing our original scope with the MVP approach, highlighting the benefits."

Dana: "I'll work on a revised timeline with clear milestones. We should also plan our beta testing strategy – I have a few key customers in mind who'd be perfect for early feedback."

Bob: "Great plan. One more thing – should we consider a phased rollout? We could release the dashboard analytics first, then add the AI features in a major update a few weeks later."

Charlie: "That's smart thinking, Bob. It would give us more time to perfect the AI component, and we could generate buzz twice with two launch moments."

Alice: "I support that approach. It also gives us a fallback position if we hit any unexpected issues with the AI integration. Dana, can you adjust the timeline to reflect this phased strategy?"

Dana: "Already on it. I'll share the updated project plan by EOD. We should also start thinking about success metrics for each phase."
`,
  instructions: 'Suggest a clear next step for the team to move forward, emphasizing prioritization and stakeholder alignment.',
  threadType: THREAD_TYPE.WORK_THREAD,
  tone: 'casual',
  replyLength: 'medium',
  variations: '3',
  useEmojis: false,
  output: null,
  isLoading: false,
  copiedIndex: null,
  isCustomLength: false,
  customSentences: 5,
}

const prodInitialState = {
  input: '',
  instructions: '',
  threadType: THREAD_TYPE.WORK_THREAD,
  tone: 'casual',
  replyLength: 'medium',
  variations: '3',
  useEmojis: false,
  output: null,
  isLoading: false,
  copiedIndex: null,
  isCustomLength: false,
  customSentences: 5,
}

const initialState = process.env.NODE_ENV === 'development' ? devInitialState : prodInitialState

function isInputValid(threadContext: string, instructions: string) {
  return threadContext.length <= MAX_THREAD_CONTEXT_LENGTH &&
    instructions.length <= MAX_INSTRUCTIONS_LENGTH;
}

export function ThreadInsights() {
  const [input, setInput] = useState(initialState.input)
  const [instructions, setInstructions] = useState(initialState.instructions)
  const [tone, setTone] = useState('neutral')
  const [threadType, setThreadType] = useState<THREAD_TYPE>(THREAD_TYPE.WORK_THREAD)
  const [replyLength, setReplyLength] = useState('medium')
  const [isCustomLength, setIsCustomLength] = useState(false);
  const [customSentences, setCustomSentences] = useState(5);
  const [variations, setVariations] = useState('3')
  const [useEmojis, setUseEmojis] = useState(true)
  const [output, setOutput] = useState<ThreadInsightsResponse | null>(null)
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

  const handleGenerateInsights = async () => {
    if (!input) return

    setIsLoading(true)
    try {
      const { data } = await axios.post<ThreadInsightsResponse>(
        '/api/threadInsights',
        {
          threadType,
          threadContext: input,
          instructions: instructions || undefined,
          tone,
          replyLength,
          customSentences,
          variations: parseInt(variations),
          useEmojis
        }
      );

      setOutput(data)
    } catch (error) {
      console.error('Error generating reply:', error)
      setOutput(null)

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
    setInput(initialState.input);
    setInstructions(initialState.instructions);
    setThreadType(initialState.threadType);
    setTone(initialState.tone);
    setReplyLength(initialState.replyLength);
    setVariations(initialState.variations);
    setUseEmojis(initialState.useEmojis);
    setOutput(null);
    setIsCustomLength(initialState.isCustomLength);
    setCustomSentences(initialState.customSentences);
  };

  const isValid = isInputValid(input, instructions);

  return (
    <div id="demo">
      <div className="mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 space-y-8">
          <div className="flex gap-6">
            <div className="w-[35%] space-y-6">
              <div className="mt-2">
                <Label>Thread Type</Label>
                <Select value={threadType} onValueChange={(value) => setThreadType(value as THREAD_TYPE)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select thread type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(THREAD_TYPE).map((type) => (
                      <SelectItem key={type} value={type}>{THREAD_TYPE_EMOJIS[type]} {type}</SelectItem>
                    ))}
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
                <Label>Reply Length</Label>
                <RadioGroup
                  value={isCustomLength ? 'custom' : replyLength}
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      setIsCustomLength(true)
                    } else {
                      setIsCustomLength(false)
                      setReplyLength(value)
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
                <p className="font-semibold mb-2 h-24px">What's the thread context?</p>
                <Textarea
                  placeholder="Paste your thread or message context here"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className={`h-48 ${input.length > MAX_THREAD_CONTEXT_LENGTH ?
                    "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                />
                <div className="flex justify-end">
                  <p className={`text-xs ${input.length > MAX_THREAD_CONTEXT_LENGTH ?
                    "text-red-500" : "text-gray-500"
                    }`}>
                    {input.length}/{MAX_THREAD_CONTEXT_LENGTH}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">What do you want the reply to say? (optional)</p>
                <Textarea
                  placeholder="The reply should... "
                  value={instructions}
                  rows={4}
                  onChange={(e) => setInstructions(e.target.value)}
                  className={`h-24 ${instructions.length > MAX_INSTRUCTIONS_LENGTH ?
                    "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                />
                <div className="flex justify-end">
                  <p className={`text-xs ${instructions.length > MAX_INSTRUCTIONS_LENGTH ?
                    "text-red-500" : "text-gray-500"
                    }`}>
                    {instructions.length}/{MAX_INSTRUCTIONS_LENGTH}
                  </p>
                </div>
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
                  onClick={handleGenerateInsights}
                  className="font-bold bg-gradient-to-r from-rose-200 via-pink-200 to-fuchsia-200 text-black hover:opacity-90 disabled:opacity-50"
                  disabled={isLoading || !isValid}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Sparkles className={`w-4 h-4 mr-2 ${spinAnimation}`} />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 mr-2" />
                      {output ? 'Re-Generate Reply' : 'Generate Reply'}
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {output && output?.summary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 border-t pt-8"
            >
              <motion.div
                ref={summaryRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="border border-rose-200 p-4 rounded-lg"
              >
                <h3 className="text-lg font-semibold mb-2 flex">
                  Summary
                </h3>
                <p>{output.summary}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="border border-pink-200 p-4 rounded-lg"
              >
                <h3 className="text-lg font-semibold mb-2">Recommended Actions</h3>
                <p>
                  {output.recommendedAction}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="border border-fuchsia-200 p-4 rounded-lg"
              >
                <h3 className="text-lg font-semibold mb-2">Replies</h3>
                <div className="space-y-4">
                  {output.replies.map((reply, index) => (
                    <div key={index} className="bg-white p-4 rounded-md shadow-sm relative">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-500">Variation {index + 1}</span>
                        <CopyButton text={reply} />
                      </div>
                      <p className="mt-2">{reply}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div >
  )
}