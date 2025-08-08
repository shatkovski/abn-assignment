<script setup lang="ts">
import { ref, watch } from 'vue'
import { searchShows } from '@/services/tvMazeApi'
import type { TVMazeShow } from '@/types/api'
import ShowCard from '@/components/ShowCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const props = defineProps<{
  searchQuery: string
}>()

const searchResults = ref<TVMazeShow[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.searchQuery,
  (newQuery) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    if (!newQuery) {
      searchResults.value = []
      loading.value = false
      return
    }
    loading.value = true
    error.value = null
    debounceTimer = setTimeout(async () => {
      try {
        const results = await searchShows(newQuery)
        searchResults.value = results
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to search shows'
        searchResults.value = []
      }
      loading.value = false
    }, 300)
  },
  { immediate: true },
)
</script>

<template>
  <div class="search-view">
    <div class="container">
      <h1>Search Results for "{{ searchQuery }}"</h1>
      <LoadingSpinner v-if="loading" />
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="searchResults.length > 0" class="results">
        <div class="shows-grid">
          <ShowCard v-for="show in searchResults" :key="show.id" :show="show" />
        </div>
      </div>
      <div v-else class="no-results">No shows found</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-view {
  padding: 24px 0;

  h1 {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  p {
    font-size: 18px;
    color: #666;
    margin-bottom: 24px;
  }
}

.error {
  text-align: center;
  padding: 24px;
  color: #e74c3c;
  background: #fdf2f2;
  border-radius: 8px;
  margin: 16px 0;
}

.results {
  margin-top: 24px;
}

.shows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.no-results {
  text-align: center;
  padding: 24px;
  color: #666;
  font-style: italic;
}
</style>
