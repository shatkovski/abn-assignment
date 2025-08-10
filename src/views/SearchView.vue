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
    color: var(--color-text-secondary);
    margin-bottom: 24px;
  }
}

.error {
  text-align: center;
  padding: 24px;
  color: var(--color-error);
  background: var(--color-error-bg);
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
  color: var(--color-text-secondary);
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-view {
    padding: 20px 0;

    h1 {
      font-size: 28px;
      margin-bottom: 12px;
    }

    p {
      font-size: 16px;
      margin-bottom: 20px;
    }
  }

  .shows-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }

  .error {
    padding: 20px;
    margin: 12px 0;
  }

  .no-results {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .search-view {
    padding: 16px 0;

    h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }

    p {
      font-size: 15px;
      margin-bottom: 16px;
    }
  }

  .shows-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
  }

  .error {
    padding: 16px;
    margin: 10px 0;
  }

  .no-results {
    padding: 16px;
  }
}
</style>
