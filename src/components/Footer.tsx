import Link from 'next/link'
import { Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold text-gray-800">
              NextJS Starter
            </Link>
          </div>
          <nav className="mb-4 md:mb-0">
            <ul className="flex space-x-6">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-800">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-800">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-800">
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <Twitter size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

