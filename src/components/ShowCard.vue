<script setup lang="ts">
import type { TVShow } from '@/types/store'

defineProps<{
  show: TVShow
}>()

defineOptions({
  name: 'ShowCard',
})
</script>

<template>
  <RouterLink :to="`/show/${show.id}`" class="show-card">
    <div class="show-image">
      <img
        v-if="show.image"
        :src="show.image"
        :alt="show.name"
        @error="
          (event) => {
            const target = event.target as HTMLImageElement
            target.style.display = 'none'
          }
        "
      />
    </div>

    <div class="show-content">
      <h3 class="show-title">{{ show.name }}</h3>

      <div class="show-meta">
        <div class="rating" v-if="show.rating">
          <span class="rating-value">{{ show.rating.toFixed(1) }}</span>
          <span class="rating-stars">★</span>
        </div>
        <div class="status" :class="show.status.toLowerCase()">
          {{ show.status }}
        </div>
      </div>

      <div class="show-year" v-if="show.premiered">
        {{ new Date(show.premiered).getFullYear() }}
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.show-card {
  width: 200px;
  flex-shrink: 0;
  text-decoration: none;
  color: inherit;
}

.show-title {
  font-weight: 600;
}

.show-image {
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.show-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.show-genres {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.genre-tag {
  font-size: 0.7rem;
  color: #666;
}
</style>
