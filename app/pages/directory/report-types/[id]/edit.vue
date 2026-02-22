<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useReportTypesApi, type ReportType } from '~/composables/api/useReportTypesApi'
import { useAgenciesApi, type Agency } from '~/composables/api/useAgenciesApi'
import { periodicityOptions } from '../common'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const reportTypesApi = useReportTypesApi()
const agenciesApi = useAgenciesApi()
const router = useRouter()
const route = useRoute()

// Состояние формы
const formData = ref<Partial<ReportType>>({
  name: '',
  code: '',
  periodicity: '',
  deadline_day: 0,
  month_offset: 0,
  agency_id: 0
})

// Состояние валидации
const validationErrors = ref<Record<string, string>>({})

const agencies = ref<Agency[]>([])
const loading = ref(false)
const submitting = ref(false)
const error = ref<string | null>(null)
// periodicityOptions импортируются из common.ts

// Загружаем данные типа отчетности при монтировании
onMounted(async () => {
  await loadAgencies()
  await loadReportType()
})

const loadAgencies = async () => {
  loading.value = true
  try {
    const response = await agenciesApi.getAgencies({ per_page: 100 }) // Получаем все агентства
    agencies.value = response.data
  } catch (err: any) {
    error.value = 'Не удалось загрузить данные. Пожалуйста, попробуйте позже.'
  } finally {
    loading.value = false
  }
}

const loadReportType = async () => {
  const reportTypeId = Number(route.params.id)
  
  if (isNaN(reportTypeId)) {
    error.value = 'Неверный ID типа отчетности'
    return
  }

  try {
    loading.value = true
    const reportType = await reportTypesApi.getReportType(reportTypeId)
    
    // Заполняем форму данными из полученного типа отчетности
    formData.value = {
      name: reportType.data?.name,
      code: reportType.data?.code,
      periodicity: reportType.data?.periodicity,
      deadline_day: reportType.data?.deadline_day || 0,
      month_offset: reportType.data?.month_offset || 0,
      agency_id: reportType.data?.agency_id
    }
  } catch (err: any) {
    error.value = 'Не удалось загрузить данные типа отчетности'
  } finally {
    loading.value = false
  }
}

// Функция валидации формы
const validateForm = (): boolean => {
  const errors: Record<string, string> = {}
  
  // Проверяем обязательные поля
  if (!formData.value.name?.trim()) {
    errors.name = 'Наименование обязательно для заполнения'
  }
  
  if (!formData.value.code?.trim()) {
    errors.code = 'Код обязателен для заполнения'
  }
  
  if (!formData.value.periodicity) {
    errors.periodicity = 'Периодичность обязательна для заполнения'
  }
  
  if (!formData.value.agency_id) {
    errors.agency_id = 'Агентство обязательно для выбора'
  }
  
  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

// Обработчик отправки формы
const handleSubmit = async () => {
  // Сначала выполняем валидацию
  if (!validateForm()) {
    return
  }
  
  const reportTypeId = Number(route.params.id)
  
  if (isNaN(reportTypeId)) {
    error.value = 'Неверный ID типа отчетности'
    return
  }

  submitting.value = true
  error.value = null
  
  try {
    await reportTypesApi.updateReportType(reportTypeId, formData.value)
    // Перенаправляем на страницу списка после успешного обновления
    await router.push('/directory/report-types')
  } catch (err: any) {
    error.value = 'Не удалось обновить тип отчетности. Пожалуйста, проверьте данные и попробуйте снова.'
  } finally {
    submitting.value = false
  }
}

// Обработчик отмены
const handleCancel = () => {
  router.push('/directory/report-types')
}
</script>

<template>
  <div v-if="loading" class="flex justify-center items-center h-64">
    <ProgressSpinner />
  </div>
  
  <div v-else class="card bg-header bg-surface-card rounded-lg p-4">
    <h2 class="text-xl font-bold mb-6">Редактирование типа отчетности</h2>
    
    <form @submit.prevent="handleSubmit" class="p-fluid form">
      <div class="field">
        <label for="name" class="block text-sm font-medium mb-2">Наименование *</label>
        <InputText
          id="name"
          v-model="formData.name" 
          placeholder="Введите наименование типа отчетности"
          :class="{ 'p-invalid': validationErrors.name }"
          class="w-full"
        />
        <small v-if="validationErrors.name" class="block mt-1 text-red-500">{{ validationErrors.name }}</small>
      </div>
      
      <div class="row">
        <div class="w-1/2">
          <label for="code" class="block text-sm font-medium mb-2">Код *</label>
          <InputText
            id="code"
            v-model="formData.code" 
            placeholder="Введите код типа отчетности"
            :class="{ 'p-invalid': validationErrors.code }"
            class="w-full"
          />
          <small v-if="validationErrors.code" class="block mt-1 text-red-500">{{ validationErrors.code }}</small>
        </div>
        <div class="w-1/2">
          <label for="periodicity" class="block text-sm font-medium mb-2">Периодичность *</label>

          <Select
            v-model="formData.periodicity"
            :options="periodicityOptions"
            optionLabel="label"
            placeholder="Укажите периодичность"
            fluid
            :class="{ 'p-invalid': validationErrors.periodicity }"
            class="w-full"
          />
          <small v-if="validationErrors.periodicity" class="block mt-1 text-red-500">{{ validationErrors.periodicity }}</small>
        </div>
      </div>
     
      <div class="row">
        <div class="w-1/2">
          <label for="deadline_day" class="block text-sm font-medium mb-2">День дедлайна</label>
          <InputNumber
            id="deadline_day"
            v-model="formData.deadline_day"
            placeholder="Введите день дедлайна"
            class="w-full"
            :min="1"
            :max="31"
          />
        </div>
        <div class="w-1/2">
          <label for="month_offset" class="block text-sm font-medium mb-2">Смещение месяца</label>
          <InputNumber
            id="month_offset"
            v-model="formData.month_offset"
            placeholder="Введите смещение месяца"
            class="w-full"
            :min="0"
          />
        </div>
      </div>
      
      <div class="field">
        <label for="agency_id" class="block text-sm font-medium mb-2">Орган власти *</label>
        <Dropdown
          id="agency_id"
          v-model="formData.agency_id"
          :options="agencies"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите орган власти"
          :class="{ 'p-invalid': validationErrors.agency_id }"
          class="w-full"
        />
        <small v-if="validationErrors.agency_id" class="block mt-1 text-red-500">{{ validationErrors.agency_id }}</small>
      </div>
      
      <!-- Сообщение об ошибке -->
      <div v-if="error" class="field">
        <Message severity="error">{{ error }}</Message>
      </div>
      
      <!-- Кнопки управления -->
      <div class="flex justify-end space-x-3 mt-6">
        <Button 
          label="Отмена" 
          severity="secondary" 
          type="button" 
          @click="handleCancel"
          :disabled="submitting"
        />
        <Button
          label="Сохранить"
          type="submit"
          :loading="submitting"
        />
      </div>
    </form>
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