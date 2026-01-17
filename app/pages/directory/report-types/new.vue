<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useReportTypesApi } from '~/composables/api/useReportTypesApi'
import { useAgenciesApi, type Agency } from '~/composables/api/useAgenciesApi'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const reportTypesApi = useReportTypesApi()
const agenciesApi = useAgenciesApi()
const router = useRouter()

// Состояние формы
const formData = ref({
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

// Загрузка агентств для выбора
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

// Функция валидации формы
const validateForm = (): boolean => {
  const errors: Record<string, string> = {}
  
  // Проверяем обязательные поля
  if (!formData.value.name.trim()) {
    errors.name = 'Наименование обязательно для заполнения'
  }
  
  if (!formData.value.code.trim()) {
    errors.code = 'Код обязателен для заполнения'
  }
  
  if (!formData.value.periodicity.trim()) {
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
  
  submitting.value = true
  error.value = null
  
  try {
    await reportTypesApi.createReportType(formData.value)
    // Перенаправляем на страницу списка после успешного создания
    await router.push('/directory/report-types')
  } catch (err: any) {
    error.value = 'Не удалось создать тип отчетности. Пожалуйста, проверьте данные и попробуйте снова.'
  } finally {
    submitting.value = false
  }
}

// Обработчик отмены
const handleCancel = () => {
  router.push('/directory/report-types')
}

// Загружаем агентства при монтировании
onMounted(() => {
  loadAgencies()
})
</script>

<template>
  <div class="card bg-header bg-surface-card rounded-lg p-4">
    <h2 class="text-xl font-bold mb-6">Новый тип отчетности</h2>
    
    <form @submit.prevent="handleSubmit" class="p-fluid">
      <div class="field mb-4">
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
      
      <div class="field mb-4">
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
      
      <div class="field mb-4">
        <label for="periodicity" class="block text-sm font-medium mb-2">Периодичность *</label>
        <InputText
          id="periodicity"
          v-model="formData.periodicity"
          placeholder="Введите периодичность (например, ежемесячно, ежеквартально)"
          :class="{ 'p-invalid': validationErrors.periodicity }"
          class="w-full"
        />
        <small v-if="validationErrors.periodicity" class="block mt-1 text-red-500">{{ validationErrors.periodicity }}</small>
      </div>
      
      <div class="field mb-4">
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
      
      <div class="field mb-4">
        <label for="month_offset" class="block text-sm font-medium mb-2">Смещение месяца</label>
        <InputNumber
          id="month_offset"
          v-model="formData.month_offset"
          placeholder="Введите смещение месяца"
          class="w-full"
          :min="0"
        />
      </div>
      
      <div class="field mb-4">
        <label for="agency_id" class="block text-sm font-medium mb-2">Агентство *</label>
        <Dropdown
          id="agency_id"
          v-model="formData.agency_id"
          :options="agencies"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите агентство"
          :class="{ 'p-invalid': validationErrors.agency_id }"
          class="w-full"
        />
        <small v-if="validationErrors.agency_id" class="block mt-1 text-red-500">{{ validationErrors.agency_id }}</small>
      </div>
      
      <!-- Сообщение об ошибке -->
      <div v-if="error" class="field mb-4">
        <Message severity="error">Не удалось загрузить данные. Пожалуйста, попробуйте позже.</Message>
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