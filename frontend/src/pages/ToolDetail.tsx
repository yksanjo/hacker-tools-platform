import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toolsApi, Tool, Rating } from '../api/client'

export default function ToolDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [ratingForm, setRatingForm] = useState({
    user_name: '',
    rating: 5,
    comment: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      loadTool()
    }
  }, [id])

  const loadTool = async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await toolsApi.getTool(parseInt(id))
      setTool(data)
    } catch (error) {
      console.error('Error loading tool:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !ratingForm.user_name) return

    setSubmitting(true)
    try {
      await toolsApi.createRating(parseInt(id), ratingForm)
      setRatingForm({ user_name: '', rating: 5, comment: '' })
      await loadTool() // Reload to show new rating
    } catch (error) {
      console.error('Error submitting rating:', error)
      alert('Failed to submit rating. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={i < rating ? 'text-yellow-400 text-xl' : 'text-gray-600 text-xl'}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-hacker-green text-xl">Loading tool details...</div>
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-xl">Tool not found</div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-hacker-green hover:underline"
        >
          Go back to home
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tool Header */}
      <div className="bg-hacker-gray border border-gray-800 rounded-lg p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{tool.name}</h1>
            {tool.author && (
              <p className="text-gray-400">by {tool.author}</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {tool.github_url && (
              <a
                href={tool.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded flex items-center space-x-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </a>
            )}
            {tool.website_url && (
              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded flex items-center space-x-2 transition-colors"
              >
                <span>Website</span>
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded">
            {tool.category}
          </span>
          {tool.language && (
            <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded">
              {tool.language}
            </span>
          )}
          {tool.average_rating && (
            <div className="flex items-center space-x-2">
              {renderStars(Math.round(tool.average_rating))}
              <span className="text-gray-400">
                {tool.average_rating.toFixed(1)} ({tool.rating_count} ratings)
              </span>
            </div>
          )}
        </div>

        <p className="text-gray-300 text-lg mb-4">{tool.description}</p>

        {tool.tags && (
          <div className="flex flex-wrap gap-2">
            {tool.tags.split(',').map((tag, idx) => (
              <span
                key={idx}
                className="bg-hacker-green/20 text-hacker-green px-3 py-1 rounded text-sm"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Installation Guide */}
      {tool.installation_guide && (
        <div className="bg-hacker-gray border border-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Installation</h2>
          <pre className="bg-black p-4 rounded text-green-400 overflow-x-auto">
            <code>{tool.installation_guide}</code>
          </pre>
        </div>
      )}

      {/* Usage Example */}
      {tool.usage_example && (
        <div className="bg-hacker-gray border border-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Usage Example</h2>
          <pre className="bg-black p-4 rounded text-green-400 overflow-x-auto">
            <code>{tool.usage_example}</code>
          </pre>
        </div>
      )}

      {/* Ratings Section */}
      <div className="bg-hacker-gray border border-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Community Ratings</h2>
        
        {tool.ratings && tool.ratings.length > 0 ? (
          <div className="space-y-4 mb-6">
            {tool.ratings.map((rating) => (
              <div key={rating.id} className="border-b border-gray-800 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{rating.user_name}</span>
                  <div className="flex items-center space-x-2">
                    {renderStars(rating.rating)}
                    <span className="text-gray-400 text-sm">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {rating.comment && (
                  <p className="text-gray-300">{rating.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mb-6">No ratings yet. Be the first to rate this tool!</p>
        )}

        {/* Rating Form */}
        <form onSubmit={handleSubmitRating} className="border-t border-gray-800 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Add Your Rating</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={ratingForm.user_name}
              onChange={(e) => setRatingForm({ ...ratingForm, user_name: e.target.value })}
              required
              className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green"
            />
            <div>
              <label className="block text-gray-300 mb-2">Rating</label>
              <select
                value={ratingForm.rating}
                onChange={(e) => setRatingForm({ ...ratingForm, rating: parseInt(e.target.value) })}
                className="bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green"
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'star' : 'stars'}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Your review (optional)"
              value={ratingForm.comment}
              onChange={(e) => setRatingForm({ ...ratingForm, comment: e.target.value })}
              rows={4}
              className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-hacker-green text-black px-6 py-2 rounded font-semibold hover:bg-green-400 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


