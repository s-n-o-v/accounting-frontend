<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useServiceTypesApi, type ServiceType } from '~/composables/api/useServiceTypesApi'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const serviceTypesApi = useServiceTypesApi()
const router = useRouter()
const route = useRoute()

// Состояние для хранения данных типа услуги
const serviceType = ref<ServiceType | null>(null)

const loading = ref(false)
const error = ref<string | null>(null)

// Загружаем данные типа услуги при монтировании
onMounted(async () => {
  await loadServiceType()
})

const loadServiceType = async () => {
  const serviceTypeId = Number(route.params.id)
  
  if (isNaN(serviceTypeId)) {
    error.value = 'Неверный ID типа услуги'
    return
  }

  try {
    loading.value = true
    const response = await serviceTypesApi.getServiceType(serviceTypeId)
    serviceType.value = response.data
  } catch (err: any) {
    error.value = 'Не удалось загрузить данные типа услуги'
  } finally {
    loading.value = false
  }
}

const handleBackToList = () => {
  router.push('/directory/service-types')
}
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center h-64">
    <ProgressSpinner />
  </div>
  
  <div v-else-if="error" class="card bg-header bg-surface-card rounded-lg p-4">
    <Message severity="error">{{ error }}</Message>
    <div class="mt-4">
      <Button 
        label="Назад к списку" 
        severity="secondary" 
        @click="handleBackToList"
      />
    </div>
  </div>
  
  <div v-else-if="serviceType" class="card bg-header bg-surface-card rounded-lg p-4">
    <div class="flex justify-between items-start mb-6">
      <h2 class="text-xl font-bold">Просмотр типа услуги</h2>
      <Button 
        label="Назад к списку" 
        severity="secondary" 
        @click="handleBackToList"
      />
    </div>
    
    <div class="p-fluid form">
      <div class="field">
        <label class="block text-sm font-medium mb-2">Наименование</label>
        <div class="bg-gray-50 border border-gray-300 rounded px-3 py-2 w-full text-gray-800">
          {{ serviceType.name }}
        </div>
      </div>
      
      <div class="field">
        <label class="block text-sm font-medium mb-2">Код</label>
        <div class="bg-gray-50 border border-gray-300 rounded px-3 py-2 w-full text-gray-800">
          {{ serviceType.code }}
        </div>
      </div>
      
      <div class="field">
        <label class="block text-sm font-medium mb-2">Базовая цена</label>
        <div class="bg-gray-50 border border-gray-300 rounded px-3 py-2 w-full text-gray-800">
          {{ serviceType.default_price }}
        </div>
      </div>
      
      <div class="field">
        <label class="block text-sm font-medium mb-2">Дата создания</label>
        <div class="bg-gray-50 border border-gray-300 rounded px-3 py-2 w-full text-gray-800">
          {{ serviceType.created_at ? new Date(serviceType.created_at).toLocaleDateString('ru-RU') : 'Не указана' }}
        </div>
      </div>
      
      <div class="field">
        <label class="block text-sm font-medium mb-2">Дата обновления</label>
        <div class="bg-gray-50 border border-gray-300 rounded px-3 py-2 w-full text-gray-800">
          {{ serviceType.updated_at ? new Date(serviceType.updated_at).toLocaleDateString('ru-RU') : 'Не указана' }}
        </div>
      </div>
    </div>
    
    <div class="flex justify-end space-x-3 mt-6">
      <Button 
        label="Редактировать" 
        severity="info"
        @click="router.push(`/directory/service-types/${serviceType.id}/edit`)"
      />
      <Button 
        label="Назад к списку" 
        severity="secondary" 
        @click="handleBackToList"
      />
    </div>
  </div>
  
  <div v-else class="card bg-header bg-surface-card rounded-lg p-4">
    <Message severity="warn">Тип услуги не найден</Message>
    <div class="mt-4">
      <Button 
        label="Назад к списку" 
        severity="secondary" 
        @click="handleBackToList"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>