<script setup lang="ts">
import { RouterLink } from 'vue-router'

const searchQuery = defineModel<string>()

const resetSearch = () => {
  searchQuery.value = ''
}
</script>

<template>
  <header class="header">
    <div class="header-content container">
      <RouterLink to="/" class="title" @click="resetSearch">TV Shows</RouterLink>
      <div class="search-container">
        <svg
          class="search-icon"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          id="search"
          name="search"
          placeholder="Search shows..."
          class="search-input"
        />
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-bg-primary);
  padding: 16px 0;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  white-space: nowrap;
  text-decoration: none;
  color: inherit;
  transition: color 0.2s ease;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0;
  color: var(--color-text-muted);
  pointer-events: none;
}

.search-input {
  width: 220px;
  padding: 7px 18px 7px 32px;
  border: none;
  font-size: 20px;
  line-height: 22px;
  outline: none;
  background: transparent;
  font-weight: 500;
  color: var(--color-text-primary);

  &::placeholder {
    color: var(--color-text-muted);
    font-weight: 500;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .header {
    padding: 12px 0;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .title {
    font-size: 24px;
    text-align: center;
  }

  .search-container {
    justify-content: center;
  }

  .search-input {
    width: 100%;
    max-width: 300px;
    font-size: 18px;
    padding: 8px 18px 8px 32px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 20px;
  }

  .search-input {
    font-size: 16px;
    padding: 6px 18px 6px 32px;
  }
}
</style>
