<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAgenciesApi, type Agency } from '~/composables/api/useAgenciesApi'
import { getAgencyTypeDisplayValue } from '~/utils/constants/agencyTypes'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const agenciesApi = useAgenciesApi()
const router = useRouter()
const route = useRoute()

// Состояние для хранения данных агентства
const agency = ref<Agency | null>(null)

const loading = ref(false)
const error = ref<string | null>(null)

// Загружаем данные агентства при монтировании
onMounted(async () => {
  await loadAgency()
})

const loadAgency = async () => {
  const agencyId = Number(route.params.id)
  
  if (isNaN(agencyId)) {
    error.value = 'Неверный ID агентства'
    return
  }

  try {
    loading.value = true
    const _agency = await agenciesApi.getAgency(agencyId)
    agency.value = _agency ? _agency.data : null
  } catch (err: any) {
    error.value = 'Не удалось загрузить данные агентства'
  } finally {
    loading.value = false
  }
}

// Обработчик возврата к списку
const handleBack = () => {
  router.push('/directory/agencies')
}
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center h-64">
    <ProgressSpinner />
  </div>
  
  <div v-else-if="error" class="card bg-header bg-surface-card rounded-lg p-4">
    <h2 class="text-xl font-bold mb-6">Ошибка</h2>
    <Message severity="error">{{ error }}</Message>
    <div class="mt-4">
      <Button 
        label="Назад к списку" 
        severity="secondary" 
        @click="handleBack"
      />
    </div>
  </div>
  
  <div v-else-if="agency" class="card bg-header bg-surface-card rounded-lg p-4">
    <div class="flex justify-between items-start mb-6">
      <h2 class="text-xl font-bold">Просмотр агентства: {{ agency.name }}</h2>
      <Button 
        label="Назад к списку" 
        severity="secondary" 
        @click="handleBack"
      />
    </div>
    
    <div class="p-fluid">
      <div class="field mb-4">
        <label class="block text-sm font-medium mb-2">Наименование</label>
        <div class="text-lg">{{ agency.name }}</div>
      </div>
      
      <div class="field mb-4">
        <label class="block text-sm font-medium mb-2">Код</label>
        <div class="text-lg">{{ agency.code }}</div>
      </div>
      
      <div class="field mb-4">
        <label class="block text-sm font-medium mb-2">Тип</label>
        <div class="text-lg">{{ getAgencyTypeDisplayValue(agency.type) }}</div>
      </div>
      
      <div class="field mb-4">
        <label class="block text-sm font-medium mb-2">Дата создания</label>
        <div class="text-lg">{{ agency.created_at ? new Date(agency.created_at).toLocaleDateString() : '-' }}</div>
      </div>
      
      <div class="field mb-4">
        <label class="block text-sm font-medium mb-2">Дата обновления</label>
        <div class="text-lg">{{ agency.updated_at ? new Date(agency.updated_at).toLocaleDateString() : '-' }}</div>
      </div>
    </div>
    
    <!-- Кнопки управления -->
    <div class="flex justify-end space-x-3 mt-6">
      <Button 
        label="Назад к списку" 
        severity="secondary" 
        @click="handleBack"
      />
      <NuxtLink :to="`/directory/agencies/${agency.id}/edit`">
        <Button 
          label="Редактировать"
        />
      </NuxtLink>
    </div>
  </div>
  
  <div v-else class="card bg-header bg-surface-card rounded-lg p-4">
    <h2 class="text-xl font-bold mb-6">Агентство не найдено</h2>
    <Message severity="warn">Запрашиваемое агентство не найдено в системе</Message>
    <div class="mt-4">
      <Button 
        label="Назад к списку" 
        severity="secondary" 
        @click="handleBack"
      />
    </div>
  </div>
</template>