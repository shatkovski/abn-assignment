<script setup lang="ts">
import { useShowsStore } from '@/stores/shows'
import { onMounted } from 'vue'
import HorizontalScroller from '@/components/HorizontalScroller.vue'

// Component name for linting
defineOptions({
  name: 'DashboardView',
})

const showsStore = useShowsStore()

onMounted(() => {
  showsStore.fetchAllShows()
})
</script>

<template>
  <div class="dashboard">
    <!-- Main Content -->
    <main class="dashboard-content">
      <!-- Loading State -->
      <div v-if="showsStore.loading">Loading...</div>

      <!-- Error State -->
      <div v-else-if="showsStore.error" class="error-container">
        <h3 class="error-title">Oops! Something went wrong</h3>
        <p class="error-message">{{ showsStore.error }}</p>
        <button class="retry-button" @click="showsStore.fetchAllShows">Try Again</button>
      </div>

      <!-- Content State -->
      <div v-else class="genres-container">
        <HorizontalScroller
          v-for="genre in showsStore.allGenres"
          :key="genre"
          :title="genre"
          :shows="showsStore.showsByGenre[genre]"
        />
      </div>
    </main>
  </div>
</template>

<style scoped></style>
