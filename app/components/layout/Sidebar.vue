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
          <li>
            <NuxtLink
              to="/clients"
              class="menu-item flex items-center space-x-3 p-3 rounded transition-all duration-200"
              :class="{
                'justify-center': !isExpanded,
                'hover:bg-surface-hover': isExpanded
              }"
            >
              <i class="pi pi-users text-primary text-lg" />
              <span v-if="isExpanded" class="text-surface-700 dark:text-surface-200">Клиенты</span>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/calendar"
              class="menu-item flex items-center space-x-3 p-3 rounded transition-all duration-200"
              :class="{
                'justify-center': !isExpanded,
                'hover:bg-surface-hover': isExpanded
              }"
            >
              <i class="pi pi-calendar text-primary text-lg" />
              <span v-if="isExpanded" class="text-surface-700 dark:text-surface-200">Календарь</span>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/reports"
              class="menu-item flex items-center space-x-3 p-3 rounded transition-all duration-200"
              :class="{
                'justify-center': !isExpanded,
                'hover:bg-surface-hover': isExpanded
              }"
            >
              <i class="pi pi-chart-bar text-primary text-lg" />
              <span v-if="isExpanded" class="text-surface-700 dark:text-surface-200">Отчеты</span>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/services"
              class="menu-item flex items-center space-x-3 p-3 rounded transition-all duration-200"
              :class="{
                'justify-center': !isExpanded,
                'hover:bg-surface-hover': isExpanded
              }"
            >
              <i class="pi pi-cog text-primary text-lg" />
              <span v-if="isExpanded" class="text-surface-700 dark:text-surface-200">Услуги</span>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/finance"
              class="menu-item flex items-center space-x-3 p-3 rounded transition-all duration-200"
              :class="{
                'justify-center': !isExpanded,
                'hover:bg-surface-hover': isExpanded
              }"
            >
              <i class="pi pi-dollar text-primary text-lg" />
              <span v-if="isExpanded" class="text-surface-700 dark:text-surface-200">Финансы</span>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/directory"
              class="menu-item flex items-center space-x-3 p-3 rounded transition-all duration-200"
              :class="{
                'justify-center': !isExpanded,
                'hover:bg-surface-hover': isExpanded
              }"
            >
              <i class="pi pi-book text-primary text-lg" />
              <span v-if="isExpanded" class="text-surface-700 dark:text-surface-200">Справочники</span>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/settings"
              class="menu-item flex items-center space-x-3 p-3 rounded transition-all duration-200"
              :class="{
                'justify-center': !isExpanded,
                'hover:bg-surface-hover': isExpanded
              }"
            >
              <i class="pi pi-sliders-h text-primary text-lg" />
              <span v-if="isExpanded" class="text-surface-700 dark:text-surface-200">Настройки</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebarStore } from '../../stores/sidebar'
import { watch } from 'vue'

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
