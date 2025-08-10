<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useShowsStore } from '@/stores/shows'
import { computed, ref, watchEffect } from 'vue'
import { getShowById, getShowEpisodes } from '@/services/tvMazeApi'
import type { TVMazeEpisode, TVMazeShow } from '@/types/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const showsStore = useShowsStore()

const showId = computed(() => Number(route.params.id))
const show = ref<TVMazeShow | undefined>(showsStore.shows.find((s) => s.id === showId.value))
const episodes = ref<TVMazeEpisode[]>([])
const loading = ref(false)

// Display medium image if it's cached, otherwise display original image
const showMediumImage = ref(false)
if (show.value?.image) {
  const { image } = show.value
  const cachedEntries = performance.getEntriesByType('resource')
  const isOriginalCached = cachedEntries.some((entry) => entry.name === image.original)
  const isMediumCached = cachedEntries.some((entry) => entry.name === image.medium)
  if (!isOriginalCached && isMediumCached) {
    showMediumImage.value = true
  }
}

watchEffect(async () => {
  if (!showId.value) return
  try {
    loading.value = true
    if (show.value) {
      // Show exists in store, only fetch episodes
      episodes.value = await getShowEpisodes(showId.value)
    } else {
      // Fetch both show details and episodes concurrently
      const [showDetails, episodesData] = await Promise.all([
        getShowById(showId.value),
        getShowEpisodes(showId.value),
      ])
      show.value = showDetails
      episodes.value = episodesData
    }
  } catch (error) {
    console.error('Failed to fetch show data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="show-details">
    <div class="container">
      <div v-if="show" class="show-content">
        <div class="show-info">
          <img
            v-if="show.image"
            :src="showMediumImage ? show.image.medium : show.image.original"
            :alt="show.name"
            @load="showMediumImage = false"
            class="show-image"
          />
          <div class="details">
            <h1 class="show-title">{{ show.name }}</h1>
            <div class="basic-info">
              <p v-if="show.rating?.average" class="rating">
                Rating: {{ show.rating.average.toFixed(1) }}
              </p>
              <p class="status">Status: {{ show.status }}</p>
              <p v-if="show.premiered">Premiered: {{ new Date(show.premiered).getFullYear() }}</p>
              <p v-if="show.ended">Ended: {{ new Date(show.ended).getFullYear() }}</p>
              <p>Type: {{ show.type }}</p>
              <p>Language: {{ show.language }}</p>
              <p v-if="show.runtime">Runtime: {{ show.runtime }} minutes</p>
              <p class="genres">Genres: {{ show.genres.join(', ') }}</p>
            </div>

            <div v-if="show.summary" class="summary-section">
              <h3>Summary</h3>
              <div v-html="show.summary"></div>
            </div>

            <div v-if="show.network || show.webChannel" class="network-section">
              <h3>Network</h3>
              <div v-if="show.network">
                <p>
                  <strong>{{ show.network.name }}</strong>
                </p>
                <p v-if="show.network.country">{{ show.network.country.name }}</p>
                <p v-if="show.network.country">Country: {{ show.network.country.code }}</p>
                <p v-if="show.network.country">Timezone: {{ show.network.country.timezone }}</p>
                <p v-if="show.network.officialSite">
                  <a :href="show.network.officialSite" target="_blank" rel="noopener noreferrer">
                    Network Website
                  </a>
                </p>
              </div>
              <div v-if="show.webChannel">
                <p>
                  <strong>{{ show.webChannel.name }}</strong> (Web)
                </p>
                <p v-if="show.webChannel.country">
                  {{ show.webChannel.country.name }}
                </p>
                <p v-if="show.webChannel.country">Country: {{ show.webChannel.country.code }}</p>
                <p v-if="show.webChannel.country">
                  Timezone: {{ show.webChannel.country.timezone }}
                </p>
                <p v-if="show.webChannel.officialSite">
                  <a :href="show.webChannel.officialSite" target="_blank" rel="noopener noreferrer">
                    Channel Website
                  </a>
                </p>
              </div>
            </div>

            <div v-if="show.schedule" class="schedule-section">
              <h3>Schedule</h3>
              <p v-if="show.schedule.time">Time: {{ show.schedule.time }}</p>
              <p v-if="show.schedule.days.length">Days: {{ show.schedule.days.join(', ') }}</p>
            </div>

            <div v-if="show.officialSite" class="official-site">
              <h3>Official Site</h3>
              <a :href="show.officialSite" target="_blank" rel="noopener noreferrer">
                Visit Official Website
              </a>
            </div>

            <div v-if="show.url" class="tvmaze-link">
              <h3>TVMaze</h3>
              <a :href="show.url" target="_blank" rel="noopener noreferrer"> View on TVMaze </a>
            </div>

            <div v-if="show.externals" class="external-ids">
              <h3>External IDs</h3>
              <div v-if="show.externals.imdb">
                <a
                  :href="`https://www.imdb.com/title/${show.externals.imdb}`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IMDB: {{ show.externals.imdb }}
                </a>
              </div>
              <div v-if="show.externals.thetvdb">
                <a
                  :href="`https://thetvdb.com/series/${show.externals.thetvdb}`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TheTVDB: {{ show.externals.thetvdb }}
                </a>
              </div>
              <div v-if="show.externals.tvrage">
                <span>TVRage: {{ show.externals.tvrage }}</span>
              </div>
            </div>

            <div v-if="show.dvdCountry" class="dvd-info">
              <h3>DVD Release</h3>
              <p>Country: {{ show.dvdCountry.name }} ({{ show.dvdCountry.code }})</p>
              <p>Timezone: {{ show.dvdCountry.timezone }}</p>
            </div>
          </div>
        </div>

        <div v-if="episodes.length > 0" class="episodes-section">
          <h2>
            {{ episodes[episodes.length - 1].season }} Season{{
              episodes[episodes.length - 1].season > 1 ? 's' : ''
            }}; {{ episodes.length }} Episode{{ episodes.length > 1 ? 's' : '' }}
          </h2>
          <LoadingSpinner v-if="loading" />
          <div v-else-if="episodes.length > 0" class="episodes-list">
            <div
              v-for="episode in episodes.slice(-10).reverse()"
              :key="episode.id"
              class="episode-item"
            >
              <div class="episode-number">S{{ episode.season }}E{{ episode.number }}</div>
              <div class="episode-info">
                <h3>{{ episode.name }}</h3>
                <p v-if="episode.airdate">{{ new Date(episode.airdate).toLocaleDateString() }}</p>
              </div>
            </div>
          </div>
          <div v-else class="no-episodes">No episodes available</div>
        </div>
      </div>
      <LoadingSpinner v-else />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.show-title {
  font-size: 24px;
  font-weight: 600;
}

.show-details {
  padding: 24px 0;
}

.show-info {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-top: 24px;

  img {
    width: 400px;
  }

  a {
    color: var(--color-text-accent);
    text-decoration: none;
    font-weight: 500;
  }

  a:hover {
    text-decoration: underline;
  }
}

.details {
  flex: 1;

  p {
    margin: 8px 0;
  }
}

.basic-info {
  margin-bottom: 24px;
}

.rating {
  font-size: 18px;
  font-weight: 600;
}

.summary-section,
.network-section,
.schedule-section,
.official-site {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-light);

  h3 {
    margin: 0 0 12px 0;
    font-size: 18px;
  }
}

.network-section,
.schedule-section {
  p {
    margin: 4px 0;
  }
}

.tvmaze-link,
.external-ids,
.dvd-info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-light);

  h3 {
    margin: 0 0 12px 0;
    font-size: 18px;
  }
}

.external-ids {
  div {
    margin: 4px 0;
  }

  a {
    color: var(--color-text-accent);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}

.dvd-info {
  p {
    margin: 4px 0;
  }
}

.episodes-section {
  margin-top: 32px;

  h2 {
    margin-bottom: 16px;
  }
}

.episodes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.episode-item {
  display: flex;
  gap: 16px;
  padding: 12px;
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
}

.episode-number {
  font-weight: bold;
  color: var(--color-text-secondary);
  min-width: 60px;
}

.episode-info {
  h3 {
    margin: 0 0 4px 0;
    font-size: 16px;
  }

  p {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 14px;
  }
}

.no-episodes {
  text-align: center;
  padding: 24px;
  color: var(--color-text-secondary);
  font-style: italic;
}
</style>
