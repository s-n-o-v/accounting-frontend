<!-- ThemeToggle.vue -->
<template>
  <div class="flex items-center">
    <!-- Theme toggle button -->
    <Button
      :icon="isDark ? 'pi pi-moon' : 'pi pi-sun'"
      :severity="isDark ? 'secondary' : 'secondary'"
      @click="toggleTheme"
      aria-label="Toggle theme"
      size="small"
      class="theme-toggle-button"
    />
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '~/composables/ui/useTheme'

const { toggleTheme, isDark } = useTheme()
</script>

<style scoped>
.theme-toggle-button {
  transition: all 0.3s ease;
}
</style>
