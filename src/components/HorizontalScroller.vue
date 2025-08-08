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

    <div class="scroller-container">
      <div class="shows-list">
        <ShowCard v-for="show in shows" :key="show.id" :show="show" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.horizontal-scroller {
  padding: 12px 0;
}

.horizontal-scroller-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.horizontal-scroller-container {
  overflow-x: auto;
}

.scroller-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.show-count {
  color: #666;
  font-size: 14px;
}

.shows-list {
  display: flex;
  gap: 16px;
  padding: 16px calc(50% - 700px);
  overflow-x: auto;
}

.shows-list::-webkit-scrollbar {
  height: 8px;
}

.shows-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.shows-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.shows-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
