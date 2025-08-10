<script setup lang="ts">
import type { TVMazeShow } from '@/types/api'

defineProps<{
  show: TVMazeShow
}>()
</script>

<template>
  <RouterLink :to="`/show/${show.id}`" class="show-card">
    <div class="show-image">
      <img v-if="show.image" :src="show.image.medium" :alt="show.name" loading="lazy" />

      <div v-if="show.rating?.average" class="show-rating">
        <span class="rating-value">{{ show.rating.average.toFixed(1) }}</span>
        <span class="rating-stars">★</span>
      </div>
    </div>

    <div class="show-content">
      <h3 class="show-title">{{ show.name }}</h3>

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
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);

    .show-image {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
  }
}

.show-title {
  font-weight: 600;
}

.show-image {
  width: 100%;
  height: 280px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.2s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.show-content {
  padding-top: 12px;
}

.show-year {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin-top: 4px;
}

.show-rating {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 10px;
  border-radius: 12px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.rating-value {
  color: var(--color-rating);
}

.rating-stars {
  color: var(--color-rating);
}

/* Responsive Design */
@media (max-width: 768px) {
  .show-card {
    width: 160px;
  }

  .show-image {
    height: 220px;
  }

  .show-title {
    font-size: 14px;
  }

  .show-year {
    font-size: 12px;
  }

  .show-rating {
    padding: 4px 8px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .show-card {
    width: 140px;
  }

  .show-image {
    height: 180px;
  }

  .show-title {
    font-size: 13px;
  }

  .show-year {
    font-size: 11px;
  }

  .show-rating {
    padding: 3px 6px;
    font-size: 11px;
    bottom: 8px;
    right: 8px;
  }
}
</style>
