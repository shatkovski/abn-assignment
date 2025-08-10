<script setup lang="ts">
import { useShowsStore } from '@/stores/shows'
import HorizontalScroller from '@/components/HorizontalScroller.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const showsStore = useShowsStore()
if (!showsStore.shows.length) {
  showsStore.fetchAllShows()
}
</script>

<template>
  <div class="dashboard">
    <!-- Main Content -->
    <main class="dashboard-content">
      <!-- Loading State -->
      <LoadingSpinner v-if="showsStore.loading" />

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

<style lang="scss" scoped>
.dashboard {
  min-height: 100vh;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  max-width: 500px;
  margin: 0 auto;
}

.error-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--color-text-primary);
}

.error-message {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin: 0 0 32px 0;
  line-height: 1.5;
}

.retry-button {
  background: var(--color-text-accent);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
}
</style>
