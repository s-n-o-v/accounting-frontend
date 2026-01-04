<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top menu with logo, project name, theme toggle and user menu -->
    <TopMenu />

    <div class="flex flex-1">
      <!-- Sidebar будет здесь -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import TopMenu from '../components/layout/TopMenu.vue'
</script>
