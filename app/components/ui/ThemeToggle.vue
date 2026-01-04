<!-- ThemeToggle.vue -->
<template>
  <div class="flex items-center space-x-2">
    <!-- Theme toggle button -->
    <Button
      :icon="isDark ? 'pi pi-moon' : 'pi pi-sun'"
      :severity="isDark ? 'secondary' : 'secondary'"
      @click="toggleTheme"
      aria-label="Toggle theme"
      size="small"
      class="theme-toggle-button"
    />

    <!-- Theme selection dropdown -->
    <Dropdown
      v-model="selectedTheme"
      :options="themeOptions"
      optionLabel="label"
      optionValue="value"
      class="w-32"
      size="small"
      @change="onThemeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '~/composables/ui/useTheme'

const { currentTheme, toggleTheme, setTheme, isDark } = useTheme()

const themeOptions = [
  { label: 'Системная', value: 'system' },
  { label: 'Светлая', value: 'light' },
  { label: 'Темная', value: 'dark' }
]

const selectedTheme = ref<Theme>('system')

// Initialize with current theme
onMounted(() => {
  selectedTheme.value = useTheme().theme.value
})

const onThemeChange = (newTheme: Theme) => {
  setTheme(newTheme)
}
</script>

<style scoped>
.theme-toggle-button {
  transition: all 0.3s ease;
}

:deep(.p-dropdown) {
  background-color: var(--surface-card);
  border-color: var(--surface-border);
}

:deep(.p-dropdown .p-dropdown-label) {
  color: var(--text-primary);
}
</style>
