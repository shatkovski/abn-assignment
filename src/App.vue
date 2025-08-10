<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SearchView from '@/views/SearchView.vue'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()
const searchQuery = ref('')

// Scroll to top on route change
watch(
  () => route.path,
  () => {
    window.scrollTo({ top: 0 })
  },
)
</script>

<template>
  <div class="app">
    <AppHeader v-model="searchQuery" />

    <SearchView v-if="searchQuery" :search-query="searchQuery" />
    <RouterView v-else />
  </div>
</template>

<style lang="scss">
.app {
  font-family: sans-serif;
  color: var(--color-text-primary);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
}
</style>
