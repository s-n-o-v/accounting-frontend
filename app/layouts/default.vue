<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top menu with logo, project name, theme toggle and user menu -->
    <TopMenu />

    <div class="flex flex-1">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main content -->
      <main class="flex-1 py-4 pr-4 overflow-auto">
        <slot />
      </main>
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import TopMenu from '../components/layout/TopMenu.vue'
import Sidebar from '../components/layout/Sidebar.vue'
</script>
