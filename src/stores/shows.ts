import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getAllShows } from '@/services/tvMazeApi'
import type { TVMazeShow } from '@/types/api'

export const useShowsStore = defineStore('shows', () => {
  const shows = ref<TVMazeShow[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

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
    const grouped: Record<string, TVMazeShow[]> = {}
    allGenres.value.forEach((genre) => {
      grouped[genre] = shows.value
        .filter((show) => show.genres.includes(genre))
        .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
    })
    return grouped
  })

  const fetchAllShows = async () => {
    loading.value = true
    error.value = null
    try {
      const tvShows = await getAllShows()
      shows.value = tvShows
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
