<!-- Sidebar.vue - Левое боковое меню с плавной анимацией -->
<template>
  <div
    class="sidebar-container transition-all duration-300 ease-in-out p-4"
    :class="{
      'w-64': isExpanded,
      'w-24': !isExpanded,
      'opacity-100': isExpanded,
      'opacity-90': !isExpanded
    }"
  >
    <div class="h-full bg-header bg-surface-card rounded-lg flex flex-col overflow-hidden p-4">
      <!-- Элементы меню -->
      <nav class="flex-1 overflow-y-auto">
        <ul class="space-y-1">
          <!-- Динамическое меню из конфигурации -->
          <template v-for="menuGroup in sidebarMenu" :key="menuGroup.id">
            <!-- Заголовок группы или разделитель -->
            <li class="menu-group-header">
              <div v-if="isExpanded" class="flex items-center space-x-3 p-3">
                <span class="text-surface-500 dark:text-surface-300 font-medium text-sm">
                  {{ menuGroup.label }}
                </span>
              </div>
              <div v-else class="menu-group-divider"></div>
            </li>

            <!-- Элементы группы -->
            <li v-for="item in menuGroup.items" :key="item.id">
              <NuxtLink
                :to="item.to"
                class="menu-item flex items-center space-x-3 p-3 rounded transition-all duration-200"
                :class="{
                  'justify-center': !isExpanded,
                  'hover:bg-surface-hover': isExpanded,
                  '!pl-3': isExpanded,
                  '!py-[4px]': !isExpanded,
                }"
              >
                <i :class="item.icon + ' text-primary text-lg'" />
                <span v-if="isExpanded" class="text-surface-700 dark:text-surface-200">{{ item.label }}</span>
              </NuxtLink>
            </li>
          </template>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebarStore } from '../../stores/sidebar'
import { watch, ref } from 'vue'
import { sidebarMenu } from '../../config/sidebarMenu'

const sidebarStore = useSidebarStore()
const isExpanded = ref(sidebarStore.isExpanded)

watch(() => sidebarStore.isExpanded, (newVal) => {
  isExpanded.value = newVal
})
</script>

<style scoped>
.sidebar-container {
  height: calc(100vh - 64px); /* Высота экрана минус высота верхнего меню */
  position: relative;
  z-index: 10;
}

.menu-item {
  transition: all 0.2s ease;
  padding: 0;
  min-height: 36px;
}

.menu-item:hover {
  background-color: rgba(var(--primary-color-rgb), 0.1);
}

.menu-item:hover i {
  transform: scale(1.1);
}

.menu-item:hover span {
  color: var(--primary-color);
}

.menu-item span {
  font-size: 14px !important;
}

.menu-group-header {
  /* padding: 0 12px; */
  margin: 8px 0 4px 0;
}

.menu-group-header span {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-secondary);
  transition: opacity 0.2s ease;
}

.menu-group-divider {
  height: 1px;
  background-color: var(--surface-border);
  margin: 12px 8px;
  opacity: 0.5;
}

.toggle-button {
  transition: transform 0.3s ease;
}

.toggle-button:hover {
  transform: scale(1.1);
}

/* Анимация для плавного появления/исчезновения текста */
.sidebar-container :deep(span) {
  transition: opacity 0.2s ease;
}
</style>
