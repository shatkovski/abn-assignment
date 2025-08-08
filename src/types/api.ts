export interface TVMazeShow {
  id: number
  url: string
  name: string
  type: string
  language: string
  genres: string[]
  status: string
  runtime: number
  averageRuntime: number
  premiered: string
  ended: string | null
  officialSite: string | null
  schedule: {
    time: string
    days: string[]
  }
  rating: {
    average: number | null
  }
  weight: number
  network: {
    id: number
    name: string
    country: {
      name: string
      code: string
      timezone: string
    }
    officialSite: string | null
  } | null
  webChannel: {
    id: number
    name: string
    country: {
      name: string
      code: string
      timezone: string
    } | null
    officialSite: string | null
  } | null
  dvdCountry: {
    name: string
    code: string
    timezone: string
  } | null
  externals: {
    tvrage: number | null
    thetvdb: number | null
    imdb: string | null
  }
  image: {
    medium: string
    original: string
  } | null
  summary: string | null
  updated: number
  _links: {
    self: {
      href: string
    }
    previousepisode: {
      href: string
      name: string
    } | null
  }
}

export interface TVMazeEpisode {
  id: number
  url: string
  name: string
  season: number
  number: number
  type: string
  airdate: string
  airtime: string
  airstamp: string
  runtime: number
  rating: {
    average: number | null
  }
  image: {
    medium: string
    original: string
  }
  summary: string
  _links: {
    self: {
      href: string
    }
    show: {
      href: string
      name: string
    }
  }
}

export interface TVMazeShowDetail extends TVMazeShow {
  episodes: TVMazeEpisode[]
}
