import { Link } from 'react-router-dom'
import { ToolListResponse } from '../api/client'

interface ToolCardProps {
  tool: ToolListResponse
}

export default function ToolCard({ tool }: ToolCardProps) {
  const renderStars = (rating?: number) => {
    if (!rating) return null
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={
              i < fullStars
                ? 'text-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'text-yellow-400 opacity-50'
                : 'text-gray-600'
            }
          >
            ★
          </span>
        ))}
        <span className="text-gray-400 text-sm ml-1">({rating.toFixed(1)})</span>
      </div>
    )
  }

  return (
    <Link to={`/tool/${tool.id}`}>
      <div className="bg-hacker-gray border border-gray-800 rounded-lg p-6 hover:border-hacker-green transition-all cursor-pointer h-full">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white hover:text-hacker-green transition-colors">
            {tool.name}
          </h3>
          {tool.github_url && (
            <a
              href={tool.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-400 hover:text-hacker-green"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}
        </div>
        
        <p className="text-gray-400 mb-4 line-clamp-2">{tool.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-sm">
              {tool.category}
            </span>
            {tool.language && (
              <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-sm">
                {tool.language}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {tool.tags?.split(',').slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-hacker-green/20 text-hacker-green px-2 py-0.5 rounded"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            {renderStars(tool.average_rating)}
            {tool.rating_count > 0 && (
              <span className="text-gray-500 text-sm">
                {tool.rating_count} {tool.rating_count === 1 ? 'rating' : 'ratings'}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

