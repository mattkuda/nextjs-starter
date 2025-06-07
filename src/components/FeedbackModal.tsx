'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink } from 'lucide-react'
import Link from "next/link"

interface FeedbackModalProps {
    isOpen: boolean
    onClose: () => void
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">We Value Your Feedback! 🎯</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <p className="text-center text-gray-600">
                        As we continue to grow NextJS Starter, your feedback helps us improve and better serve our community.
                    </p>

                    <div className="flex flex-col gap-4">
                        <Link
                            href="https://twitter.com/mattkuda"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                variant="outline"
                                className="w-full justify-between hover:bg-[#1DA1F2]/10"
                            >
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                                        <polygon fill="#616161" points="41,6 9.929,42 6.215,42 37.287,6"></polygon><polygon fill="#fff" fill-rule="evenodd" points="31.143,41 7.82,7 16.777,7 40.1,41" clip-rule="evenodd"></polygon><path fill="#616161" d="M15.724,9l20.578,30h-4.106L11.618,9H15.724 M17.304,6H5.922l24.694,36h11.382L17.304,6L17.304,6z"></path>
                                    </svg>
                                    <span>Reach out on X (Twitter)</span>
                                </div>
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </Link>

                        <Link
                            href="https://docs.google.com/forms/d/e/1FAIpQLScDqQyyMaz3-YojI6YO0xM5pkwxZBwkvPd21ZEtGaN_V7qCHA/viewform?usp=header"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                variant="outline"
                                className="w-full justify-between hover:bg-blue-50"
                            >
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 48 48"
                                    >
                                        <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                    </svg>
                                    <span>Submit via Google Form</span>
                                </div>
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <p className="text-center text-sm text-gray-500">
                        Your input directly shapes the future of NextJS Starter. Thank you for being part of our journey!
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

