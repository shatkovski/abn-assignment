import type { TVMazeShow } from '@/types/api'

const BASE_URL = 'https://api.tvmaze.com'

export async function getAllShows(): Promise<TVMazeShow[]> {
  try {
    const response = await fetch(`${BASE_URL}/shows`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching shows:', error)
    throw error
  }
}
