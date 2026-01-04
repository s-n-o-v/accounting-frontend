<template>
  <div>
    <!-- Убираем NuxtWelcome и создаём свою структуру -->
    <AppLayout>
      <NuxtPage />
    </AppLayout>
    <NuxtRouteAnnouncer />
  </div>
</template>

<script setup lang="ts">
// Импортируем наш layout
import AppLayout from '~/layouts/default.vue'
</script>
