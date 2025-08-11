import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'
import { getAllShows, getShowById, getShowEpisodes, searchShows } from '@/services/tvMazeApi'
import type { TVMazeShow, TVMazeEpisode } from '@/types/api'

// Mock fetch globally
global.fetch = vi.fn()
const fetchMock = global.fetch as Mock

describe('TVMaze API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getAllShows', () => {
    it('fetches all shows successfully', async () => {
      const mockShows: TVMazeShow[] = [
        {
          id: 1,
          name: 'Test Show',
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
            medium: 'https://example.com/medium.jpg',
            original: 'https://example.com/original.jpg',
          },
          summary: '<p>Test summary</p>',
          updated: 1234567890,
          _links: {
            self: { href: 'https://api.tvmaze.com/shows/1' },
            previousepisode: { href: 'https://api.tvmaze.com/episodes/123' },
          },
        },
      ]

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockShows),
      }

      fetchMock.mockResolvedValue(mockResponse)

      const result = await getAllShows()

      expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows')
      expect(result).toEqual(mockShows)
    })

    it('handles fetch error', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      }

      fetchMock.mockResolvedValue(mockResponse)

      await expect(getAllShows()).rejects.toThrow('HTTP error! status: 500')
    })

    it('handles network error', async () => {
      fetchMock.mockRejectedValue(new Error('Network error'))

      await expect(getAllShows()).rejects.toThrow('Network error')
    })

    it('handles JSON parsing error', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      }

      fetchMock.mockResolvedValue(mockResponse)

      await expect(getAllShows()).rejects.toThrow('Invalid JSON')
    })
  })

  describe('getShowById', () => {
    it('fetches show by ID successfully', async () => {
      const mockShow: TVMazeShow = {
        id: 1,
        name: 'Test Show',
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
          medium: 'https://example.com/medium.jpg',
          original: 'https://example.com/original.jpg',
        },
        summary: '<p>Test summary</p>',
        updated: 1234567890,
        _links: {
          self: { href: 'https://api.tvmaze.com/shows/1' },
          previousepisode: { href: 'https://api.tvmaze.com/episodes/123' },
        },
      }

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockShow),
      }

      fetchMock.mockResolvedValue(mockResponse)

      const result = await getShowById(1)

      expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows/1')
      expect(result).toEqual(mockShow)
    })

    it('handles show not found', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
      }

      fetchMock.mockResolvedValue(mockResponse)

      await expect(getShowById(999)).rejects.toThrow('HTTP error! status: 404')
    })

    it('handles network error', async () => {
      fetchMock.mockRejectedValue(new Error('Network error'))

      await expect(getShowById(1)).rejects.toThrow('Network error')
    })
  })

  describe('getShowEpisodes', () => {
    it('fetches show episodes successfully', async () => {
      const mockEpisodes: TVMazeEpisode[] = [
        {
          id: 1,
          url: 'https://api.tvmaze.com/episodes/1',
          name: 'Pilot',
          season: 1,
          number: 1,
          type: 'regular',
          airdate: '2020-01-01',
          airtime: '21:00',
          airstamp: '2020-01-01T21:00:00-05:00',
          runtime: 60,
          rating: { average: 8.5 },
          image: {
            medium: 'https://example.com/episode1.jpg',
            original: 'https://example.com/episode1-original.jpg',
          },
          summary: '<p>Episode summary</p>',
          _links: {
            self: { href: 'https://api.tvmaze.com/episodes/1' },
          },
        },
      ]

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockEpisodes),
      }

      fetchMock.mockResolvedValue(mockResponse)

      const result = await getShowEpisodes(1)

      expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows/1/episodes')
      expect(result).toEqual(mockEpisodes)
    })

    it('handles episodes not found', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
      }

      fetchMock.mockResolvedValue(mockResponse)

      await expect(getShowEpisodes(999)).rejects.toThrow('HTTP error! status: 404')
    })

    it('handles network error', async () => {
      fetchMock.mockRejectedValue(new Error('Network error'))

      await expect(getShowEpisodes(1)).rejects.toThrow('Network error')
    })
  })

  describe('searchShows', () => {
    it('searches shows successfully', async () => {
      const mockShow: TVMazeShow = {
        id: 1,
        name: 'Test Show',
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
          medium: 'https://example.com/medium.jpg',
          original: 'https://example.com/original.jpg',
        },
        summary: '<p>Test summary</p>',
        updated: 1234567890,
        _links: {
          self: { href: 'https://api.tvmaze.com/shows/1' },
          previousepisode: { href: 'https://api.tvmaze.com/episodes/123' },
        },
      }

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue([{ show: mockShow }]),
      }

      fetchMock.mockResolvedValue(mockResponse)

      const result = await searchShows('test')

      expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/search/shows?q=test')
      expect(result).toEqual([mockShow])
    })

    it('handles search with no results', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue([]),
      }

      fetchMock.mockResolvedValue(mockResponse)

      const result = await searchShows('nonexistent')

      expect(result).toEqual([])
    })

    it('handles search error', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      }

      fetchMock.mockResolvedValue(mockResponse)

      await expect(searchShows('test')).rejects.toThrow('HTTP error! status: 500')
    })

    it('handles network error', async () => {
      fetchMock.mockRejectedValue(new Error('Network error'))

      await expect(searchShows('test')).rejects.toThrow('Network error')
    })

    it('URL encodes search query', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue([]),
      }

      fetchMock.mockResolvedValue(mockResponse)

      await searchShows('test query with spaces')

      expect(fetch).toHaveBeenCalledWith(
        'https://api.tvmaze.com/search/shows?q=test%20query%20with%20spaces',
      )
    })
  })

  describe('Error Handling', () => {
    it('handles different HTTP status codes', async () => {
      const statusCodes = [400, 401, 403, 404, 500, 502, 503]

      for (const statusCode of statusCodes) {
        const mockResponse = {
          ok: false,
          status: statusCode,
          statusText: 'Error',
        }

        fetchMock.mockResolvedValue(mockResponse)

        if (statusCode === 404) {
          await expect(getShowById(1)).rejects.toThrow('HTTP error! status: 404')
        } else {
          await expect(getAllShows()).rejects.toThrow(`HTTP error! status: ${statusCode}`)
        }
      }
    })

    it('handles malformed JSON response', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
      }

      fetchMock.mockResolvedValue(mockResponse)

      await expect(getAllShows()).rejects.toThrow('Unexpected token')
    })
  })
})
