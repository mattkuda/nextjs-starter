'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { useAuth, useUser } from '@clerk/nextjs';
import { ArrowRightIcon, ChevronRightIcon, Moon, Sun, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export function Header() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      const headerHeight = 80 // Approximate header height
      const targetPosition = targetElement.offsetTop - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }

    // Close mobile menu if open
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${isScrolled ? 'bg-white/50 backdrop-blur-sm shadow-sm dark:bg-background/80' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <Image
              src="/icon-black-outline.png"
              alt="NextJS Starter Logo"
              width={24}
              height={24}
              className="mr-2 dark:invert"
            />
            <span className="hidden sm:inline">NextJS Starter</span>
          </Link>

          {/* Navigation Links - Center (Desktop only) */}
          <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex space-x-8 items-center">
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleNavClick(e, '#how-it-works')}
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleNavClick(e, '#features')}
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => handleNavClick(e, '#pricing')}
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </nav>

          {/* Right Side - Mobile & Desktop */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle - Always visible */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            )}

            {!isSignedIn && (
              <>
                {/* Sign In - Hidden on mobile */}
                <Link href="/sign-in" className="hidden sm:inline text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  Sign In
                </Link>
                {/* Get Started Button - Always visible */}
                <Button asChild className="justify-between rounded-full text-sm sm:text-md px-3 sm:px-4">
                  <Link href="/sign-up">
                    Get started
                    <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                </Button>
              </>
            )}

            {isSignedIn && user && (
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-sm rounded-lg px-3 sm:px-4 py-2 transition-colors text-sm sm:text-base">
                <span className="hidden sm:inline">Go to Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
                <ArrowRightIcon className="w-4 h-4 ml-1 sm:ml-2" />
              </Link>
            )}

            {/* Mobile Menu Button - Only visible on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="pt-4">
              <ul className="space-y-3">
                <li>
                  <a
                    href="#how-it-works"
                    onClick={(e) => handleNavClick(e, '#how-it-works')}
                    className="block text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors py-2 cursor-pointer"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    onClick={(e) => handleNavClick(e, '#features')}
                    className="block text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors py-2 cursor-pointer"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    onClick={(e) => handleNavClick(e, '#pricing')}
                    className="block text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors py-2 cursor-pointer"
                  >
                    Pricing
                  </a>
                </li>
                {!isSignedIn && (
                  <li className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href="/sign-in"
                      className="block text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

