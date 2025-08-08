<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useShowsStore } from '@/stores/shows'
import { computed, onMounted } from 'vue'

defineOptions({
  name: 'ShowDetailsView',
})

const route = useRoute()
const showsStore = useShowsStore()

const showId = computed(() => Number(route.params.id))
const show = computed(() => showsStore.shows.find((s) => s.id === showId.value))

onMounted(() => {
  if (showsStore.shows.length === 0) {
    showsStore.fetchAllShows()
  }
})
</script>

<template>
  <div class="show-details">
    <div class="container">
      <div v-if="show" class="show-content">
        <h1 class="show-title">{{ show.name }}</h1>
        <div class="show-info">
          <img v-if="show.image" :src="show.image" :alt="show.name" />
          <div class="details">
            <p v-if="show.rating">Rating: {{ show.rating.toFixed(1) }}</p>
            <p>Status: {{ show.status }}</p>
            <p v-if="show.premiered">Year: {{ new Date(show.premiered).getFullYear() }}</p>
            <p>Genres: {{ show.genres.join(', ') }}</p>
          </div>
        </div>
      </div>
      <div v-else>Loading...</div>
    </div>
  </div>
</template>

<style scoped>
.show-title {
  font-size: 24px;
  font-weight: 600;
}

.show-details {
  padding: 24px 0;
}

.show-info {
  display: flex;
  gap: 24px;
  margin-top: 24px;
}

.show-info img {
  width: 300px;
  height: auto;
}

.details {
  flex: 1;
}

.details p {
  margin: 8px 0;
}
</style>
