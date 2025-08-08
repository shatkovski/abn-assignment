import type { TVMazeShow, TVMazeEpisode } from '@/types/api'

const BASE_URL = 'https://api.tvmaze.com'

async function fetchFromAPI<T>(endpoint: string, errorMessage: string): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  } catch (error) {
    console.error(errorMessage, error)
    throw error
  }
}

export async function getAllShows(): Promise<TVMazeShow[]> {
  return fetchFromAPI<TVMazeShow[]>('/shows', 'Error fetching shows')
}

export async function getShowById(id: number): Promise<TVMazeShow> {
  return fetchFromAPI<TVMazeShow>(`/shows/${id}`, 'Error fetching show details')
}

export async function getShowEpisodes(id: number): Promise<TVMazeEpisode[]> {
  return fetchFromAPI<TVMazeEpisode[]>(`/shows/${id}/episodes`, 'Error fetching show episodes')
}

export async function searchShows(query: string): Promise<TVMazeShow[]> {
  const results = await fetchFromAPI<{ show: TVMazeShow }[]>(
    `/search/shows?q=${encodeURIComponent(query)}`,
    'Error searching shows',
  )
  return results.map((result) => result.show)
}
