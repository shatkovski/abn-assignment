<script setup lang="ts"></script>

<template>
  <div class="loading-spinner">
    <div class="spinner"></div>
    <p class="loading-text">Loading...</p>
  </div>
</template>

<style lang="scss" scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 16px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid var(--color-text-accent);
  border-right: 4px solid var(--color-text-accent);
  border-radius: 50%;
  animation: spin 0.8s ease-in-out infinite;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.loading-text {
  margin: 0;
  font-size: 16px;
  color: var(--color-text-secondary);
  font-weight: 500;
  letter-spacing: 0.5px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .loading-spinner {
    padding: 32px 16px;
    gap: 12px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border-width: 3px;
  }

  .loading-text {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .loading-spinner {
    padding: 24px 12px;
    gap: 10px;
  }

  .spinner {
    width: 36px;
    height: 36px;
    border-width: 3px;
  }

  .loading-text {
    font-size: 14px;
  }
}
</style>
