<!-- pages/index.vue -->
<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Дашборд бухгалтерского учёта</h1>
    <p class="text-gray-600">Здесь будет ваша панель управления с виджетами</p>
    
    <!-- Пока просто кнопки для навигации -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <NuxtLink to="/" class="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
        <h2 class="text-lg font-semibold">Клиенты</h2>
        <p class="text-gray-500">Управление клиентами и договорами</p>
        <Button label="Verify" />
      </NuxtLink>
      
      <NuxtLink to="/" class="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
        <h2 class="text-lg font-semibold">Календарь отчётности</h2>
        <p class="text-gray-500">Сроки сдачи отчётов</p>
      </NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
// Dashboard page - main authenticated page
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})
onBeforeMount(() => console.log('onBeforeMount'))
onMounted(() => console.log('Page / loaded'))

</script>
