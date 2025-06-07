import { MessageSquare, FileText, CheckSquare } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Smart Replies',
    description: 'Generate contextually relevant responses to Slack threads with AI assistance.',
  },
  {
    icon: FileText,
    title: 'Thread Summaries',
    description: 'Quickly grasp the key points of lengthy discussions with AI-powered summaries.',
  },
  {
    icon: CheckSquare,
    title: 'Task Extraction',
    description: 'Automatically identify and extract actionable items from your conversations.',
  },
]

export function FeatureHighlights() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-100 text-blue-600 mb-4">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

