import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toolsApi } from '../api/client'

export default function SubmitTool() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    language: '',
    github_url: '',
    website_url: '',
    tags: '',
    installation_guide: '',
    usage_example: '',
    author: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const tool = await toolsApi.createTool({
        ...formData,
        github_url: formData.github_url || undefined,
        website_url: formData.website_url || undefined,
        language: formData.language || undefined,
        tags: formData.tags || undefined,
        installation_guide: formData.installation_guide || undefined,
        usage_example: formData.usage_example || undefined,
        author: formData.author || undefined,
      })
      navigate(`/tool/${tool.id}`)
    } catch (error: any) {
      console.error('Error submitting tool:', error)
      alert(error.response?.data?.detail || 'Failed to submit tool. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Submit a Security Tool</h1>
      
      <form onSubmit={handleSubmit} className="bg-hacker-gray border border-gray-800 rounded-lg p-8 space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Tool Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green"
            placeholder="e.g., Nmap"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green"
            placeholder="Brief description of what the tool does..."
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Category *</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green"
            placeholder="e.g., Network, Web, Exploitation"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Language</label>
            <input
              type="text"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green"
              placeholder="e.g., Python, C++"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Author</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green"
              placeholder="Tool author/creator"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">GitHub URL</label>
          <input
            type="url"
            value={formData.github_url}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green"
            placeholder="https://github.com/..."
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Website URL</label>
          <input
            type="url"
            value={formData.website_url}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green"
            placeholder="e.g., network, scanner, reconnaissance"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Installation Guide</label>
          <textarea
            value={formData.installation_guide}
            onChange={(e) => setFormData({ ...formData, installation_guide: e.target.value })}
            rows={3}
            className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green font-mono text-sm"
            placeholder="Installation commands..."
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Usage Example</label>
          <textarea
            value={formData.usage_example}
            onChange={(e) => setFormData({ ...formData, usage_example: e.target.value })}
            rows={3}
            className="w-full bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-hacker-green font-mono text-sm"
            placeholder="Example command or code snippet..."
          />
        </div>

        <div className="flex items-center space-x-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-hacker-green text-black px-6 py-2 rounded font-semibold hover:bg-green-400 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Tool'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-800 text-white px-6 py-2 rounded font-semibold hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

