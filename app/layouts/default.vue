<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen">
    <!-- Header будет здесь -->
    <div class="flex">
      <!-- Sidebar будет здесь -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
  <Toast />
</template>

<script setup lang="ts">
// Базовый layout
</script>