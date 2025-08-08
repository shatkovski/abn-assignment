import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getAllShows } from '@/services/tvMazeApi'
import type { TVMazeShow } from '@/types/api'
import type { TVShow } from '@/types/store'

export const useShowsStore = defineStore('shows', () => {
  const shows = ref<TVShow[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Transform TVMaze API data to simplified store format
  const transformShow = (tvShow: TVMazeShow): TVShow => ({
    id: tvShow.id,
    name: tvShow.name,
    genres: tvShow.genres,
    rating: tvShow.rating?.average || null,
    image: tvShow.image?.medium || null,
    status: tvShow.status,
    premiered: tvShow.premiered,
  })

  // Get all unique genres from shows
  const allGenres = computed(() => {
    const genres = new Set<string>()
    shows.value.forEach((show) => {
      show.genres.forEach((genre) => genres.add(genre))
    })
    return Array.from(genres).sort()
  })

  // Group shows by genre and sort by rating
  const showsByGenre = computed(() => {
    const grouped: Record<string, TVShow[]> = {}
    allGenres.value.forEach((genre) => {
      grouped[genre] = shows.value
        .filter((show) => show.genres.includes(genre))
        .sort((a, b) => {
          return (b.rating || 0) - (a.rating || 0)
        })
    })
    return grouped
  })

  const fetchAllShows = async () => {
    loading.value = true
    error.value = null
    try {
      const tvShows = await getAllShows()
      shows.value = tvShows.map(transformShow)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch shows'
    } finally {
      loading.value = false
    }
  }

  return {
    shows,
    loading,
    error,
    fetchAllShows,
    allGenres,
    showsByGenre,
  }
})
