import type { TVMazeShow } from './api'

// Store state types
export interface ShowsState {
  shows: TVMazeShow[]
  loading: boolean
  error: string | null
}

// Store computed types
export interface ShowsComputed {
  allGenres: string[]
  showsByGenre: Record<string, TVMazeShow[]>
}

// Store actions types
export interface ShowsActions {
  fetchAllShows: () => Promise<void>
}

// Combined store type
export type ShowsStore = ShowsState & ShowsComputed & ShowsActions
