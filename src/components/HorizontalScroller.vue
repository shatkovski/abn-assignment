<script setup lang="ts">
import type { TVShow } from '@/types/store'
import ShowCard from './ShowCard.vue'

defineProps<{
  shows: TVShow[]
  title: string
}>()
</script>

<template>
  <div class="horizontal-scroller">
    <div class="scroller-header">
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

<style scoped>
.shows-list {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 16px 0;
}
</style>
