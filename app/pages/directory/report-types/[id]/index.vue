<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useReportTypesApi, type ReportType } from '~/composables/api/useReportTypesApi'
import { useAgenciesApi, type Agency } from '~/composables/api/useAgenciesApi'
import { reportPeriod } from '../common'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const reportTypesApi = useReportTypesApi()
const agenciesApi = useAgenciesApi()
const router = useRouter()
const route = useRoute()

// Состояние для хранения данных типа отчета
const reportType = ref<ReportType | null>(null)
const agency = ref<Agency | null>(null)

const loading = ref(false)
const error = ref<string | null>(null)

// Загружаем данные типа отчета при монтировании
onMounted(async () => {
  await loadReportType()
})

const loadReportType = async () => {
  const reportTypeId = Number(route.params.id)
  
  if (isNaN(reportTypeId)) {
    error.value = 'Неверный ID типа отчетности'
    return
  }

  try {
    loading.value = true
    const response = await reportTypesApi.getReportType(reportTypeId)
    reportType.value = response.data
    
    // Загружаем информацию об агентстве
    if (reportType.value?.agency_id) {
      const agencyResponse = await agenciesApi.getAgency(reportType.value.agency_id)
      agency.value = agencyResponse.data
    }
  } catch (err: any) {
    error.value = 'Не удалось загрузить данные типа отчетности'
  } finally {
    loading.value = false
  }
}

const handleBackToList = () => {
  router.push('/directory/report-types')
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
  
  <div v-else-if="reportType" class="card bg-header bg-surface-card rounded-lg p-4">
    <div class="flex justify-between items-start mb-6">
      <h2 class="text-xl font-bold">Просмотр типа отчетности</h2>
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
          {{ reportType.name }}
        </div>
      </div>
      
      <div class="row">
        <div class="w-1/2">
          <label class="block text-sm font-medium mb-2">Код</label>
          <div class="bg-gray-50 border border-gray-300 rounded px-3 py-2 w-full text-gray-800">
            {{ reportType.code }}
          </div>
        </div>
        <div class="w-1/2">
          <label class="block text-sm font-medium mb-2">Периодичность</label>
          <div class="bg-gray-50 border border-gray-300 rounded px-3 py-2 w-full text-gray-800">
            {{ reportPeriod[reportType.periodicity] }}
          </div>
        </div>
      </div>
     
      <div class="row">
        <div class="w-1/2">
          <label class="block text-sm font-medium mb-2">День дедлайна</label>
          <div class="bg-gray-50 border border-gray-300 rounded px-3 py-2 w-full text-gray-800">
            {{ reportType.deadline_day }}
          </div>
        </div>
        <div class="w-1/2">
          <label class="block text-sm font-medium mb-2">Смещение месяца</label>
          <div class="bg-gray-50 border border-gray-300 rounded px-3 py-2 w-full text-gray-800">
            {{ reportType.month_offset }}
          </div>
        </div>
      </div>
      
      <div class="field">
        <label class="block text-sm font-medium mb-2">Орган власти</label>
        <div class="bg-gray-50 border border-gray-300 rounded px-3 py-2 w-full text-gray-800">
          {{ agency?.name || 'Не указан' }}
        </div>
      </div>
      
      <div class="field">
        <label class="block text-sm font-medium mb-2">Дата создания</label>
        <div class="bg-gray-50 border border-gray-300 rounded px-3 py-2 w-full text-gray-800">
          {{ reportType.created_at ? new Date(reportType.created_at).toLocaleDateString('ru-RU') : 'Не указана' }}
        </div>
      </div>
      
      <div class="field">
        <label class="block text-sm font-medium mb-2">Дата обновления</label>
        <div class="bg-gray-50 border border-gray-300 rounded px-3 py-2 w-full text-gray-800">
          {{ reportType.updated_at ? new Date(reportType.updated_at).toLocaleDateString('ru-RU') : 'Не указана' }}
        </div>
      </div>
    </div>
    
    <div class="flex justify-end space-x-3 mt-6">
      <Button 
        label="Редактировать" 
        severity="info"
        @click="router.push(`/directory/report-types/${reportType.id}/edit`)"
      />
      <Button 
        label="Назад к списку" 
        severity="secondary" 
        @click="handleBackToList"
      />
    </div>
  </div>
  
  <div v-else class="card bg-header bg-surface-card rounded-lg p-4">
    <Message severity="warn">Тип отчетности не найден</Message>
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
  .row {
    display: flex;
    flex-direction: row;
    gap: 16px;
  }
</style>