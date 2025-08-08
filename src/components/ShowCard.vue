<script setup lang="ts">
import type { TVMazeShow } from '@/types/api'

defineProps<{
  show: TVMazeShow
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
        :src="show.image.medium"
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
        <div class="rating" v-if="show.rating?.average">
          <span class="rating-value">{{ show.rating.average.toFixed(1) }}</span>
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

<style lang="scss" scoped>
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

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.show-content {
  padding: 12px;
}

.show-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}

.show-year {
  color: #666;
  font-size: 14px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-value {
  font-weight: 600;
  color: #f39c12;
}

.rating-stars {
  color: #f39c12;
}

.status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 500;

  &.ended {
    background: #e74c3c;
    color: white;
  }

  &.running {
    background: #27ae60;
    color: white;
  }

  &.in-development {
    background: #f39c12;
    color: white;
  }
}
</style>
