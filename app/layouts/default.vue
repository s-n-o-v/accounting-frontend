<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header with theme toggle -->
    <header class="bg-surface border-b border-surface-border p-4 flex justify-end">
      <ThemeToggle />
    </header>

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
import ThemeToggle from '../components/ui/ThemeToggle.vue'
</script>
