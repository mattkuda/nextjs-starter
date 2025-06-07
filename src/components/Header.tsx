'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { useAuth, useUser } from '@clerk/nextjs';
import { ArrowRightIcon, Boxes, ChevronRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react'

export function Header() {

  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${isScrolled ? 'bg-white/50 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 flex items-center">
          <Boxes className="h-6 w-6 mr-2" />
          NextJS Starter
        </Link>
        <nav>
          {!isSignedIn && (
            <ul className="flex space-x-6 items-center">
              <li>
                <Link href="#features" className="text-black hover:text-gray-800">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-black hover:text-gray-800">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="text-black hover:text-gray-800">
                  Sign In
                </Link>
              </li>
              <li>
                <Button className="bg-black text-white hover:bg-gray-800 rounded-full text-md" asChild>
                  <Link href="/sign-up">
                    Get started for free
                    <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                </Button>
              </li>
            </ul>
          )}
          {isSignedIn && user && (
            <ul className="flex space-x-6 items-center">
              <li>
                <div className="flex items-center">
                  <Link href="/dashboard" className="text-gray-600 hover:text-gray-800 flex items-center bg-white/70 backdrop-blur-sm shadow-sm rounded px-4 py-2">
                    Go to Dashboard
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  )
}

