import { useState, useEffect } from 'react'
import { toolsApi, ToolListResponse } from '../api/client'
import ToolCard from '../components/ToolCard'

export default function Home() {
  const [tools, setTools] = useState<ToolListResponse[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [stats, setStats] = useState<{
    total_tools: number
    total_ratings: number
    categories: number
    average_rating?: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    language: '',
    sort_by: 'rating',
  })

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const [toolsData, categoriesData, statsData] = await Promise.all([
        toolsApi.getTools({
          search: filters.search || undefined,
          category: filters.category || undefined,
          language: filters.language || undefined,
          sort_by: filters.sort_by,
        }),
        toolsApi.getCategories(),
        toolsApi.getStats(),
      ])
      setTools(toolsData)
      setCategories(categoriesData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Stats Banner */}
      {stats && (
        <div className="bg-hacker-gray border border-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-hacker-green">{stats.total_tools}</div>
              <div className="text-gray-400 text-sm">Total Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-hacker-green">{stats.total_ratings}</div>
              <div className="text-gray-400 text-sm">Total Ratings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-hacker-green">{stats.categories}</div>
              <div className="text-gray-400 text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-hacker-green">
                {stats.average_rating?.toFixed(1) || 'N/A'}
              </div>
              <div className="text-gray-400 text-sm">Avg Rating</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-hacker-gray border border-gray-800 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search tools..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green"
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Language (e.g., Python)"
            value={filters.language}
            onChange={(e) => setFilters({ ...filters, language: e.target.value })}
            className="bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green"
          />
          <select
            value={filters.sort_by}
            onChange={(e) => setFilters({ ...filters, sort_by: e.target.value })}
            className="bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green"
          >
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
            <option value="created_at">Sort by Newest</option>
          </select>
        </div>
      </div>

      {/* Tools Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-hacker-green text-xl">Loading tools...</div>
        </div>
      ) : tools.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-xl">No tools found. Try adjusting your filters.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  )
}

