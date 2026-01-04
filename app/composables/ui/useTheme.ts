/**
 * Theme utility composable for system theme detection and switching
 * Uses PrimeVue Aura preset color constants and supports system preference
 */
import { usePreferredDark, useStorage } from '@vueuse/core'
import { computed, ref, watchEffect } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

export const useTheme = () => {
  // Detect system preference
  const prefersDark = usePreferredDark()

  // Theme storage with localStorage persistence
  const theme = useStorage<Theme>('app-theme', 'system')

  // Current effective theme (resolves 'system' to actual light/dark)
  const currentTheme = computed<Theme>(() => {
    if (theme.value === 'system') {
      return prefersDark.value ? 'dark' : 'light'
    }
    return theme.value
  })

  // CSS class for dark mode
  const darkClass = computed(() => currentTheme.value === 'dark' ? 'dark' : 'light')

  // Set theme and update HTML class
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  // Toggle between light and dark (ignoring system)
  const toggleTheme = () => {
    if (currentTheme.value === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  // Initialize - set HTML class based on current theme (client-side only)
  watchEffect(() => {
    if (process.client) {
      // Use toggle for simpler dark mode switching
      document.documentElement.classList.toggle('dark', currentTheme.value === 'dark')
    }
  })

  return {
    theme,
    currentTheme,
    darkClass,
    prefersDark,
    setTheme,
    toggleTheme,
    isDark: computed(() => currentTheme.value === 'dark'),
    isLight: computed(() => currentTheme.value === 'light'),
    isSystem: computed(() => theme.value === 'system')
  }
}

// Helper function to get PrimeVue Aura theme variables
export const getThemeColor = (colorName: string, shade?: number) => {
  const theme = useTheme()
  const shadeSuffix = shade ? `-${shade}` : ''
  return `var(--px-${colorName}${shadeSuffix})`
}
