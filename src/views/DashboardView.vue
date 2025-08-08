<script setup lang="ts">
import { useShowsStore } from '@/stores/shows'
import { onMounted } from 'vue'

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
    <h1>Dashboard</h1>
    <div v-if="showsStore.loading">Loading...</div>
    <div v-else-if="showsStore.error">Error: {{ showsStore.error }}</div>
    <div v-else>
      <div v-for="genre in showsStore.allGenres" :key="genre">
        <h2>{{ genre }}</h2>
        <ul v-for="show in showsStore.showsByGenre[genre]" :key="show.id">
          <li>{{ show.name }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
