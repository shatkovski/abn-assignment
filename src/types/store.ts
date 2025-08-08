// Simplified show type for store - only essential data
export interface TVShow {
  id: number
  name: string
  genres: string[]
  rating: number | null
  image: string | null
  status: string
  premiered: string
}

// Store state types
export interface ShowsState {
  shows: TVShow[]
  loading: boolean
  error: string | null
}

// Store computed types
export interface ShowsComputed {
  allGenres: string[]
  showsByGenre: Record<string, TVShow[]>
}

// Store actions types
export interface ShowsActions {
  fetchAllShows: () => Promise<void>
}

// Combined store type
export type ShowsStore = ShowsState & ShowsComputed & ShowsActions
