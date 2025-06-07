import Link from 'next/link'

export function Hero() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-orange-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Transform Slack Threads into Clear Replies and Actionable Summaries
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Leverage AI to simplify communication and stay organized
        </p>
        <Link
          href="#demo"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300"
        >
          Try Demo
        </Link>
      </div>
    </div>
  )
}

