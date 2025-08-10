<script setup lang="ts">
import type { TVMazeShow } from '@/types/api'
import ShowCard from '@/components/ShowCard.vue'

defineProps<{
  shows: TVMazeShow[]
  title: string
}>()
</script>

<template>
  <div class="horizontal-scroller">
    <div class="scroller-header container">
      <h2 class="scroller-title">{{ title }}</h2>
      <span class="show-count">{{ shows.length }} shows</span>
    </div>

    <div class="horizontal-scroller-container">
      <div class="shows-list">
        <ShowCard v-for="show in shows" :key="show.id" :show="show" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.horizontal-scroller {
  padding: 32px 0 0;
}

.horizontal-scroller-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.horizontal-scroller-container {
  position: relative;
}

/* Left fade shadow */
.horizontal-scroller-container::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.4), transparent);
  pointer-events: none;
  z-index: 2;
}

/* Right fade shadow */
.horizontal-scroller-container::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.4), transparent);
  pointer-events: none;
  z-index: 2;
}

.scroller-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.show-count {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.shows-list {
  display: flex;
  gap: 16px;
  padding: 16px max(calc(50% - 700px), 16px) 24px;
  overflow-x: scroll;
}

.shows-list::-webkit-scrollbar {
  height: 8px;
}

.shows-list::-webkit-scrollbar-track {
  background: var(--color-bg-muted);
  border-radius: 4px;
}

.shows-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.shows-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .horizontal-scroller {
    padding: 24px 0 0;
  }

  .scroller-header {
    margin-bottom: 12px;
  }

  .scroller-title {
    font-size: 20px;
  }

  .show-count {
    font-size: 12px;
  }

  .shows-list {
    gap: 12px;
    padding: 12px max(calc(50% - 350px), 12px) 20px;
  }
}

@media (max-width: 480px) {
  .horizontal-scroller {
    padding: 20px 0 0;
  }

  .scroller-title {
    font-size: 18px;
  }

  .show-count {
    font-size: 11px;
  }

  .shows-list {
    gap: 10px;
    padding: 10px max(calc(50% - 280px), 10px) 16px;
  }
}
</style>
