<!-- TopMenu.vue - Верхнее меню с логотипом, названием проекта, переключателем темы и меню пользователя -->
<template>
  <!-- <header class="bg-header border-b border-surface-border px-4 py-3 flex items-center justify-between"> -->
  <header class="bg-header border-surface-border px-4 py-3 flex items-center justify-between">
    <!-- Левая часть: Кнопка меню, логотип и название проекта -->
    <div class="flex items-center space-x-3">
      <!-- Кнопка управления боковым меню -->
      <Button
        icon="pi pi-bars"
        severity="secondary"
        size="small"
        class="menu-toggle-button"
        @click="toggleSidebar"
        aria-label="Переключить боковое меню"
      />

      <!-- Логотип -->
      <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center dark:bg-primary-400">
        <i class="pi pi-chart-line text-white text-xl dark:text-surface-900" />
      </div>
      <div>
        <h1 class="text-xl font-semibold text-primary">Бухгалтерский Ассистент</h1>
      </div>
    </div>

    <!-- Правая часть: Переключатель темы и меню пользователя -->
    <div class="flex items-center space-x-4">
      <!-- Переключатель темы -->
      <ThemeToggle />

      <!-- Меню пользователя -->
      <UserMenu />
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from '../ui/ThemeToggle.vue'
import UserMenu from './UserMenu.vue'
import { useSidebarStore } from '../../stores/sidebar'

const sidebarStore = useSidebarStore()
const { toggleSidebar } = sidebarStore
</script>

<style scoped>
/* Дополнительные стили для верхнего меню */
header {
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark header {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
</style>
