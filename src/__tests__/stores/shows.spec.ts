import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useShowsStore } from '@/stores/shows'
import type { TVMazeShow } from '@/types/api'

// Mock the API service
vi.mock('@/services/tvMazeApi', () => ({
  getAllShows: vi.fn(),
}))
import { getAllShows as apiGetAllShows } from '@/services/tvMazeApi'
const mockGetAllShows = vi.mocked(apiGetAllShows)

const mockShows: TVMazeShow[] = [
  {
    id: 1,
    name: 'Test Show 1',
    type: 'Scripted',
    language: 'English',
    genres: ['Drama'],
    status: 'Running',
    runtime: 60,
    averageRuntime: 60,
    premiered: '2020-01-01',
    ended: null,
    officialSite: 'https://example.com',
    schedule: {
      time: '21:00',
      days: ['Monday'],
    },
    rating: {
      average: 8.5,
    },
    weight: 100,
    network: null,
    webChannel: null,
    dvdCountry: null,
    externals: {
      tvrage: null,
      thetvdb: 12345,
      imdb: 'tt1234567',
    },
    image: {
      medium: 'https://example.com/medium1.jpg',
      original: 'https://example.com/original1.jpg',
    },
    summary: '<p>Test summary 1</p>',
    updated: 1234567890,
    _links: {
      self: { href: 'https://api.tvmaze.com/shows/1' },
      previousepisode: { href: 'https://api.tvmaze.com/episodes/123' },
    },
  },
  {
    id: 2,
    name: 'Test Show 2',
    type: 'Scripted',
    language: 'English',
    genres: ['Comedy', 'Drama'],
    status: 'Ended',
    runtime: 30,
    averageRuntime: 30,
    premiered: '2019-01-01',
    ended: '2023-01-01',
    officialSite: 'https://example2.com',
    schedule: {
      time: '20:00',
      days: ['Tuesday'],
    },
    rating: {
      average: 7.8,
    },
    weight: 90,
    network: null,
    webChannel: null,
    dvdCountry: null,
    externals: {
      tvrage: null,
      thetvdb: 12346,
      imdb: 'tt1234568',
    },
    image: {
      medium: 'https://example.com/medium2.jpg',
      original: 'https://example.com/original2.jpg',
    },
    summary: '<p>Test summary 2</p>',
    updated: 1234567891,
    _links: {
      self: { href: 'https://api.tvmaze.com/shows/2' },
      previousepisode: { href: 'https://api.tvmaze.com/episodes/124' },
    },
  },
  {
    id: 3,
    name: 'Test Show 3',
    type: 'Scripted',
    language: 'English',
    genres: ['Thriller'],
    status: 'Running',
    runtime: 45,
    averageRuntime: 45,
    premiered: '2021-01-01',
    ended: null,
    officialSite: 'https://example3.com',
    schedule: {
      time: '22:00',
      days: ['Wednesday'],
    },
    rating: {
      average: 9.0,
    },
    weight: 95,
    network: null,
    webChannel: null,
    dvdCountry: null,
    externals: {
      tvrage: null,
      thetvdb: 12347,
      imdb: 'tt1234569',
    },
    image: {
      medium: 'https://example.com/medium3.jpg',
      original: 'https://example.com/original3.jpg',
    },
    summary: '<p>Test summary 3</p>',
    updated: 1234567892,
    _links: {
      self: { href: 'https://api.tvmaze.com/shows/3' },
      previousepisode: { href: 'https://api.tvmaze.com/episodes/125' },
    },
  },
]

describe('Shows Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockGetAllShows.mockClear()
  })

  describe('State', () => {
    it('has initial state', () => {
      const store = useShowsStore()

      expect(store.shows).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })
  })

  describe('Actions', () => {
    it('fetches all shows successfully', async () => {
      const store = useShowsStore()
      mockGetAllShows.mockResolvedValue(mockShows)

      await store.fetchAllShows()

      expect(store.shows).toEqual(mockShows)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
      expect(mockGetAllShows).toHaveBeenCalledTimes(1)
    })

    it('handles fetch error', async () => {
      const store = useShowsStore()
      const errorMessage = 'Failed to fetch shows'
      mockGetAllShows.mockRejectedValue(new Error(errorMessage))

      await store.fetchAllShows()

      expect(store.shows).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMessage)
    })

    it('sets loading state during fetch', async () => {
      const store = useShowsStore()
      let resolvePromise: (value: TVMazeShow[]) => void
      const promise = new Promise<TVMazeShow[]>((resolve) => {
        resolvePromise = resolve
      })
      mockGetAllShows.mockReturnValue(promise)

      const fetchPromise = store.fetchAllShows()

      expect(store.loading).toBe(true)

      resolvePromise!(mockShows)
      await fetchPromise

      expect(store.loading).toBe(false)
    })
  })

  describe('Computed Properties', () => {
    it('computes all genres correctly', () => {
      const store = useShowsStore()
      store.shows = mockShows

      expect(store.allGenres).toEqual(['Comedy', 'Drama', 'Thriller'])
    })

    it('returns empty array for genres when no shows', () => {
      const store = useShowsStore()
      store.shows = []

      expect(store.allGenres).toEqual([])
    })

    it('computes shows by genre correctly', () => {
      const store = useShowsStore()
      store.shows = mockShows

      expect(store.showsByGenre['Drama']).toHaveLength(2)
      expect(store.showsByGenre['Comedy']).toHaveLength(1)
      expect(store.showsByGenre['Thriller']).toHaveLength(1)
    })

    it('returns empty array for non-existent genre', () => {
      const store = useShowsStore()
      store.shows = mockShows

      expect(store.showsByGenre['NonExistent']).toBeUndefined()
    })

    it('handles shows with multiple genres', () => {
      const store = useShowsStore()
      store.shows = mockShows

      // Show 2 has both Comedy and Drama genres
      expect(store.showsByGenre['Drama']?.some((s) => s.id === mockShows[0].id)).toBe(true)
      expect(store.showsByGenre['Drama']?.some((s) => s.id === mockShows[1].id)).toBe(true)
      expect(store.showsByGenre['Comedy']?.some((s) => s.id === mockShows[1].id)).toBe(true)
    })

    it('sorts genres alphabetically', () => {
      const store = useShowsStore()
      store.shows = mockShows

      expect(store.allGenres).toEqual(['Comedy', 'Drama', 'Thriller'])
    })

    it('removes duplicate genres', () => {
      const store = useShowsStore()
      store.shows = mockShows

      const dramaShows = store.showsByGenre['Drama']
      expect(dramaShows).toHaveLength(2)
      expect(dramaShows[0].id).toBe(1)
      expect(dramaShows[1].id).toBe(2)
    })
  })

  describe('Error Handling', () => {
    it('clears error when fetch succeeds after error', async () => {
      const store = useShowsStore()
      store.error = 'Previous error'

      mockGetAllShows.mockResolvedValue(mockShows)
      await store.fetchAllShows()

      expect(store.error).toBe(null)
    })

    it('preserves shows when fetch fails', async () => {
      const store = useShowsStore()
      store.shows = mockShows

      mockGetAllShows.mockRejectedValue(new Error('Network error'))
      await store.fetchAllShows()

      expect(store.shows).toEqual(mockShows)
    })
  })

  describe('Edge Cases', () => {
    it('handles shows without genres', () => {
      const store = useShowsStore()
      const showWithoutGenres = { ...mockShows[0], genres: [] }
      store.shows = [showWithoutGenres]

      expect(store.allGenres).toEqual([])
      expect(store.showsByGenre).toEqual({})
    })

    it('handles empty shows array', () => {
      const store = useShowsStore()
      store.shows = []

      expect(store.allGenres).toEqual([])
      expect(store.showsByGenre).toEqual({})
    })
  })
})
