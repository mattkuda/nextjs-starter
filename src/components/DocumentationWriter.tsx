'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from "@/components/ui/slider"
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { DocumentationResponse } from '../types';
import { Download, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown'
import { CopyButton } from './CopyButton';
import { handleDownloadDocx } from '../lib/handleDownloadDocx';
import { MAX_DOCUMENT_INSTRUCTIONS_LENGTH, HEADER_HEIGHT } from '../lib/constants';

const devInitialState = {
    instructions: `Write a comprehensive technical document for a software company outlining the features and implementation details of ClearDesk - an internal tool for managing customer support requests. The document should cover:

Required Features:
- Ticket management system with priority levels and SLA tracking
- Real-time chat integration with Slack and Microsoft Teams
- Automated ticket routing based on agent expertise and workload
- Custom workflow builder for different support processes
- Analytics dashboard with KPIs and team performance metrics
- Knowledge base integration with AI-powered article suggestions
- Multi-language support (English, Spanish, French, German)

Technical Requirements:
- Cloud-native architecture using AWS services
- Real-time synchronization across multiple instances
- Integration with existing SSO system
- Support for handling 10,000+ daily tickets
- 99.99% uptime SLA requirement
- GDPR and SOC 2 compliance measures
- API-first design for future extensibility

Please include implementation timeline, resource requirements, and technical architecture diagrams.`,
    tone: 'neutral',
    docType: 'technical',
    variationLength: 'medium',
    docLength: 'medium',
    isCustomLength: false,
    customParagraphs: 5,
    customSections: 'Introduction, Proposed Solution, Tech Stack, Features, Timeline, Open Questions, Next Steps',
    useCustomSections: true,
    output: null,
    isLoading: false,
}

const prodInitialState = {
    instructions: '',
    tone: 'neutral',
    docType: 'technical',
    variationLength: 'medium',
    docLength: 'medium',
    isCustomLength: false,
    customParagraphs: 5,
    customSections: 'Introduction, Proposed Solution, Tech Stack, Features, Timeline, Open Questions, Next Steps',
    useCustomSections: true,
    output: null,
    isLoading: false,
}

const initialState = process.env.NODE_ENV === 'development' ? devInitialState : prodInitialState;

export function DocumentationWriter() {
    const [instructions, setInstructions] = useState(initialState.instructions);
    const [tone, setTone] = useState(initialState.tone);
    const [docType, setDocType] = useState(initialState.docType);
    const [variationLength, setVariationLength] = useState(initialState.variationLength);
    const [docLength, setDocLength] = useState(initialState.docLength);
    const [isCustomLength, setIsCustomLength] = useState(initialState.isCustomLength);
    const [customParagraphs, setCustomParagraphs] = useState(initialState.customParagraphs);
    const [customSections, setCustomSections] = useState(initialState.customSections);
    const [useCustomSections, setUseCustomSections] = useState(initialState.useCustomSections);
    const [output, setOutput] = useState<DocumentationResponse | null>(initialState.output);
    const [isLoading, setIsLoading] = useState(initialState.isLoading);
    const outputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (output && outputRef.current) {
            setTimeout(() => {
                const outputElement = outputRef.current;
                if (outputElement) {
                    const elementRect = outputElement.getBoundingClientRect();
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

    const documentTypes = [
        { value: "technical", label: "🛠️ Technical" },
        { value: "marketing", label: "📈 Marketing" },
        { value: "product", label: "📦 Product" },
        { value: "sales", label: "💼 Sales" },
        { value: "support", label: "🤝 Customer Support" },
    ]

    const handleSubmit = async () => {
        if (!instructions) return;

        setIsLoading(true);
        try {
            const response = await axios.post('/api/documentationWriter', {
                instructions,
                docType,
                tone,
                docLength,
                useCustomSections,
                customSections
            });

            const data: DocumentationResponse = response.data;
            setOutput(data);
        } catch (error) {
            console.error('Error generating document:', error);
            setOutput(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setInstructions('');
        setTone('neutral');
        setDocType('technical');
        setDocLength('medium');
        setCustomSections('');
        setUseCustomSections(false);
        setOutput(null);
    };

    const instructionsValid = instructions.length <= MAX_DOCUMENT_INSTRUCTIONS_LENGTH;

    return (
        <div className="mx-auto">
            <div className="bg-white shadow-md rounded-lg p-6 space-y-8">
                <div className="flex gap-6">
                    {/* Sidebar Inputs */}
                    <div className="w-[35%] space-y-6">
                        <div>
                            <Label>Document Type</Label>
                            <Select value={docType} onValueChange={setDocType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select tone" />
                                </SelectTrigger>
                                <SelectContent>
                                    {documentTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
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
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Document Length</Label>
                            <RadioGroup
                                value={isCustomLength ? 'custom' : variationLength}
                                onValueChange={(value) => {
                                    if (value === 'custom') {
                                        setIsCustomLength(true)
                                    } else {
                                        setIsCustomLength(false)
                                        setVariationLength(value)
                                    }
                                }}
                                className="grid grid-cols-2 gap-2"
                            >
                                <div className="flex items-center space-x-2 p-2 rounded-md">
                                    <RadioGroupItem value="short" id="short" />
                                    <Label htmlFor="short" className="text-sm text-gray-600">
                                        Short
                                        <span className="text-xs text-gray-500 ml-2">(1-4 paragraphs)</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-2 rounded-md">
                                    <RadioGroupItem value="medium" id="medium" />
                                    <Label htmlFor="medium" className="text-sm text-gray-600">
                                        Medium
                                        <span className="text-xs text-gray-500 ml-2">(5-9 paragraphs)</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-2 rounded-md">
                                    <RadioGroupItem value="long" id="long" />
                                    <Label htmlFor="long" className="text-sm text-gray-600">
                                        Long
                                        <span className="text-xs text-gray-500 ml-2">(10+ paragraphs)</span>
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
                                        <span className="text-sm text-gray-600">Number of paragraphs: {customParagraphs}</span>
                                    </div>
                                    <Slider
                                        value={[customParagraphs]}
                                        onValueChange={([value]: number[]) => setCustomParagraphs(value)}
                                        max={50}
                                        min={1}
                                        step={1}
                                        className="w-half"
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <Label>Custom Sections</Label>
                            <Textarea
                                placeholder="e.g., Introduction, Key Points, Conclusion"
                                value={customSections}
                                onChange={(e) => setCustomSections(e.target.value)}
                                className="h-20"
                            />
                            <div className="flex items-center space-x-2 mt-2">
                                <Switch id="section-toggle" checked={useCustomSections} onCheckedChange={setUseCustomSections} />
                                <Label htmlFor="section-toggle">Use these sections only</Label>
                            </div>
                        </div>
                    </div>
                    {/* Divider */}
                    <div className="w-px bg-gray-200" />
                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        <div>
                            <Label>What do you want to write?</Label>
                            <Textarea
                                placeholder="Provide instructions or details about the document..."
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                className={`h-96 ${!instructionsValid ?
                                    "border-red-500 focus-visible:ring-red-500" : ""
                                    }`}
                            />
                            <div className="flex justify-end">
                                <p className={`text-xs ${!instructionsValid ?
                                    "text-red-500" : "text-gray-500"
                                    }`}>
                                    {instructions.length}/{MAX_DOCUMENT_INSTRUCTIONS_LENGTH}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            {output && (
                                <Button variant="ghost" onClick={handleReset}>
                                    Reset
                                </Button>
                            )}
                            <Button
                                onClick={handleSubmit}
                                className="font-bold bg-gradient-to-r from-rose-200 via-pink-200 to-fuchsia-200 text-black hover:opacity-90"
                                disabled={isLoading || !instructionsValid}
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <Sparkles className={`w-4 h-4 mr-2 animate-spin`} />
                                        Generating...
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Generate Document
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Output */}
                {isLoading ? (
                    <div className="space-y-6 border-t pt-8">
                        <Skeleton className="w-3/4 h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-5/6 h-4" />
                    </div>
                ) : (
                    output && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6 border-t pt-8"
                            ref={outputRef}
                        >
                            <div className="flex justify-end space-x-2">
                                <CopyButton text={output.document} />
                                <Button variant="outline" onClick={() => handleDownloadDocx(output)}>
                                    <Download className={`w-4 h-4 mr-2`} />
                                    Download Doc
                                </Button>
                            </div>
                            <div className="prose prose-sm max-w-none">
                                <ReactMarkdown
                                    components={{
                                        // Headers
                                        h1: (props) => <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />,
                                        h2: (props) => <h2 className="text-xl font-semibold mb-3 mt-5" {...props} />,
                                        h3: (props) => <h3 className="text-lg font-medium mb-2 mt-4" {...props} />,

                                        // Lists
                                        ul: (props) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                                        ol: (props) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
                                        li: (props) => <li className="text-gray-700" {...props} />,

                                        // Paragraphs and text
                                        p: (props) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                                        strong: (props) => <strong className="font-semibold" {...props} />,
                                        em: (props) => <em className="italic" {...props} />,

                                        // Code blocks
                                        code: (props) => (
                                            <code className="bg-gray-100 rounded px-1.5 py-0.5 text-sm font-mono" {...props} />
                                        ),
                                        pre: (props) => (
                                            <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto mb-4" {...props} />
                                        ),

                                        // Horizontal rule
                                        hr: () => <hr className="my-8 border-gray-200" />,

                                        // Links
                                        a: (props) => (
                                            <a
                                                className="text-blue-600 hover:underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                {...props}
                                            />
                                        ),

                                        // Blockquotes
                                        blockquote: (props) => (
                                            <blockquote
                                                className="border-l-4 border-gray-200 pl-4 italic my-4 text-gray-600"
                                                {...props}
                                            />
                                        ),
                                    }}
                                >
                                    {output.document}
                                </ReactMarkdown>
                            </div>

                        </motion.div>
                    )
                )}
            </div>
        </div>
    );
}
