<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
</script>

<template>
  <header class="header">
    <div class="header-content container">
      <h1 class="title">TV Shows</h1>
      <input
        v-model="searchQuery"
        type="text"
        id="search"
        name="search"
        placeholder="Search shows..."
        class="search-input"
      />
    </div>
  </header>

  <RouterView />
</template>

<style>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  white-space: nowrap;
}

.search-input {
  width: 300px;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}
</style>
