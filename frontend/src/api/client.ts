import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Tool {
  id: number
  name: string
  description: string
  category: string
  language?: string
  github_url?: string
  website_url?: string
  tags?: string
  installation_guide?: string
  usage_example?: string
  author?: string
  created_at: string
  updated_at: string
  average_rating?: number
  rating_count: number
  ratings?: Rating[]
}

export interface Rating {
  id: number
  tool_id: number
  user_name: string
  rating: number
  comment?: string
  created_at: string
}

export interface ToolListResponse {
  id: number
  name: string
  description: string
  category: string
  language?: string
  tags?: string
  average_rating?: number
  rating_count: number
  github_url?: string
}

export const toolsApi = {
  getTools: async (params?: {
    skip?: number
    limit?: number
    category?: string
    language?: string
    search?: string
    sort_by?: string
  }) => {
    const response = await apiClient.get<ToolListResponse[]>('/api/tools', { params })
    return response.data
  },
  
  getTool: async (id: number) => {
    const response = await apiClient.get<Tool>(`/api/tools/${id}`)
    return response.data
  },
  
  createTool: async (tool: {
    name: string
    description: string
    category: string
    language?: string
    github_url?: string
    website_url?: string
    tags?: string
    installation_guide?: string
    usage_example?: string
    author?: string
  }) => {
    const response = await apiClient.post<Tool>('/api/tools', tool)
    return response.data
  },
  
  createRating: async (toolId: number, rating: {
    user_name: string
    rating: number
    comment?: string
  }) => {
    const response = await apiClient.post<Rating>(`/api/tools/${toolId}/ratings`, rating)
    return response.data
  },
  
  getTrending: async (limit?: number) => {
    const response = await apiClient.get<ToolListResponse[]>('/api/tools/trending', {
      params: { limit }
    })
    return response.data
  },
  
  getCategories: async () => {
    const response = await apiClient.get<string[]>('/api/categories')
    return response.data
  },
  
  getStats: async () => {
    const response = await apiClient.get<{
      total_tools: number
      total_ratings: number
      categories: number
      average_rating?: number
    }>('/api/stats')
    return response.data
  },
}

