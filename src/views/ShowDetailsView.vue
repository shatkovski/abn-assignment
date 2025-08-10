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

// Display medium image first if it's cached, otherwise display original image
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
        <!-- Main Layout -->
        <div class="main-layout">
          <!-- Poster Side -->
          <div class="poster-side">
            <img
              v-if="show.image"
              :src="showMediumImage ? show.image.medium : show.image.original"
              :alt="show.name"
              @load="showMediumImage = false"
              class="show-poster"
            />
          </div>

          <!-- Content Side -->
          <div class="content-side">
            <!-- Header Info -->
            <div class="show-header">
              <h1 class="show-title">
                {{ show.name
                }}<span v-if="show.premiered" class="year-text">
                  ({{ new Date(show.premiered).getFullYear() }})</span
                >
              </h1>
              <div class="show-meta">
                <div v-if="show.rating?.average" class="rating-badge">
                  <span class="rating-value">{{ show.rating.average.toFixed(1) }}</span>
                  <span class="rating-star">★</span>
                </div>
                <div class="status-badge" :class="show.status.toLowerCase()">
                  {{ show.status }}
                </div>
              </div>
              <div class="genres-list">
                <span v-for="genre in show.genres" :key="genre" class="genre-tag">
                  {{ genre }}
                </span>
              </div>
            </div>

            <!-- Summary -->
            <div v-if="show.summary" class="summary-section">
              <h2 class="section-title">Summary</h2>
              <div class="summary-content" v-html="show.summary"></div>
            </div>

            <!-- Show Info Grid -->
            <div class="info-grid">
              <div class="info-card">
                <h3 class="card-title">Show Information</h3>
                <div class="info-list">
                  <div v-if="show.type" class="info-item">
                    <span class="info-label">Type</span>
                    <span class="info-value">{{ show.type }}</span>
                  </div>
                  <div v-if="show.language" class="info-item">
                    <span class="info-label">Language</span>
                    <span class="info-value">{{ show.language }}</span>
                  </div>
                  <div v-if="show.runtime" class="info-item">
                    <span class="info-label">Runtime</span>
                    <span class="info-value">{{ show.runtime }} min</span>
                  </div>
                  <div v-if="show.premiered" class="info-item">
                    <span class="info-label">Premiered</span>
                    <span class="info-value">{{ new Date(show.premiered).getFullYear() }}</span>
                  </div>
                  <div v-if="show.ended" class="info-item">
                    <span class="info-label">Ended</span>
                    <span class="info-value">{{ new Date(show.ended).getFullYear() }}</span>
                  </div>
                </div>
              </div>

              <div class="info-card">
                <h3 class="card-title">Links</h3>
                <div class="links-list">
                  <a
                    v-if="show.officialSite"
                    :href="show.officialSite"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="link-item"
                  >
                    Official Website
                  </a>
                  <a
                    v-if="show.url"
                    :href="show.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="link-item"
                  >
                    View on TVMaze
                  </a>
                  <a
                    v-if="show.externals?.imdb"
                    :href="`https://www.imdb.com/title/${show.externals.imdb}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="link-item"
                  >
                    IMDB
                  </a>
                </div>
              </div>

              <div
                v-if="(show.network || show.webChannel) && show.status === 'Running'"
                class="info-card"
              >
                <h3 class="card-title">Network</h3>
                <div v-if="show.network" class="network-info">
                  <h4 class="network-name">{{ show.network.name }}</h4>
                  <p v-if="show.network.country" class="network-country">
                    {{ show.network.country.name }}
                  </p>
                  <a
                    v-if="show.network.officialSite"
                    :href="show.network.officialSite"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="network-link"
                  >
                    Visit Website
                  </a>
                </div>
                <div v-if="show.webChannel" class="network-info">
                  <h4 class="network-name">{{ show.webChannel.name }} (Web)</h4>
                  <p v-if="show.webChannel.country" class="network-country">
                    {{ show.webChannel.country.name }}
                  </p>
                  <a
                    v-if="show.webChannel.officialSite"
                    :href="show.webChannel.officialSite"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="network-link"
                  >
                    Visit Website
                  </a>
                </div>
              </div>

              <div v-if="show.schedule && show.status === 'Running'" class="info-card">
                <h3 class="card-title">Schedule</h3>
                <div class="schedule-info">
                  <div v-if="show.schedule.time" class="schedule-item">
                    <span class="schedule-label">Time</span>
                    <span class="schedule-value">{{ show.schedule.time }}</span>
                  </div>
                  <div v-if="show.schedule.days.length" class="schedule-item">
                    <span class="schedule-label">Days</span>
                    <span class="schedule-value">{{ show.schedule.days.join(', ') }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Episodes -->
            <div v-if="episodes.length > 0" class="episodes-section">
              <h2 class="section-title">
                {{ episodes[episodes.length - 1].season }} Season{{
                  episodes[episodes.length - 1].season > 1 ? 's' : ''
                }}
                • {{ episodes.length }} Episode{{ episodes.length > 1 ? 's' : '' }}
              </h2>
              <LoadingSpinner v-if="loading" />
              <div v-else-if="episodes.length > 0" class="episodes-list">
                <div
                  v-for="episode in episodes.slice(-5).reverse()"
                  :key="episode.id"
                  class="episode-card"
                >
                  <div class="episode-content">
                    <span class="episode-number">S{{ episode.season }}E{{ episode.number }}</span>
                    <h3 class="episode-title">{{ episode.name }}</h3>
                    <span v-if="episode.airdate" class="episode-date">
                      {{ new Date(episode.airdate).toLocaleDateString() }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.show-details {
  min-height: 100vh;
  padding: 40px 0 60px 0;
}

.show-content {
  padding: 0;
}

/* Main Layout */
.main-layout {
  display: flex;
  gap: 40px;
  margin-top: 0;
}

.poster-side {
  flex: 0 0 400px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: var(--color-bg-secondary);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  height: fit-content;
  overflow: hidden;
  position: sticky;
  top: 108px;
  border: 1px solid var(--color-border-light);
}

.show-poster {
  width: 100%;
  height: auto;
  display: block;
}

.content-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Show Header */
.show-header {
  margin-bottom: 20px;
}

.show-title {
  font-size: 42px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 20px 0;
  line-height: 1.2;
}

.year-text {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.show-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.rating-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 16px;
}

.rating-star {
  color: var(--color-rating);
  font-size: 18px;
}

.status-badge {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  padding: 6px 12px;
  border-radius: 16px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  border: 1px solid var(--color-border-light);

  &.running {
    background: rgba(34, 197, 94, 0.1);
    color: #16a34a;
    border-color: rgba(34, 197, 94, 0.3);
  }

  &.ended {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border-color: rgba(239, 68, 68, 0.3);
  }
}

.year-badge {
  color: var(--color-text-primary);
  font-weight: 600;
}

.genres-list {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  font-size: 15px;
  color: var(--color-text-secondary);
}

.genre-tag {
  color: var(--color-text-primary);
  font-weight: 500;
  position: relative;

  &:not(:last-child)::after {
    content: '•';
    margin-left: 8px;
    color: var(--color-text-muted);
    font-weight: 300;
  }
}

/* Summary Section */
.summary-section {
  background: var(--color-bg-secondary);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--color-border-light);
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 20px 0;
  color: var(--color-text-primary);
}

.summary-content {
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-text-secondary);

  :deep(p) {
    margin: 0 0 16px 0;
  }

  :deep(strong) {
    color: var(--color-text-primary);
  }
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.info-card {
  background: var(--color-bg-secondary);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--color-border-light);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--color-text-primary);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border-light);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.info-label {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.info-value {
  font-weight: 600;
  color: var(--color-text-primary);
}

/* Network Info */
.network-info {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.network-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--color-text-primary);
}

.network-country {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0 0 12px 0;
}

.network-link {
  color: var(--color-text-accent);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
}

/* Schedule */
.schedule-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.schedule-label {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.schedule-value {
  font-weight: 600;
  color: var(--color-text-primary);
}

/* Links */
.links-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link-item {
  color: var(--color-text-accent);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-light);

  &:hover {
    text-decoration: underline;
  }

  &:last-child {
    border-bottom: none;
  }
}

/* Episodes */
.episodes-section {
  background: var(--color-bg-secondary);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--color-border-light);
}

.episodes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.episode-card {
  background: var(--color-bg-secondary);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--color-border-light);
}

.episode-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.episode-number {
  background: var(--color-text-accent);
  color: white;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.episode-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
  line-height: 1.4;
}

.episode-date {
  font-size: 13px;
  color: var(--color-text-secondary);
}

/* Responsive */
@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
    gap: 32px;
  }

  .poster-side {
    flex: none;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  .content-side {
    gap: 24px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .show-details {
    padding: 24px 0 40px 0;
  }

  .show-title {
    font-size: 32px;
  }

  .year-text {
    font-size: 24px;
  }

  .show-meta {
    gap: 8px;
  }

  .section-title {
    font-size: 20px;
  }

  .card-title {
    font-size: 16px;
  }
}
</style>
