<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAgenciesApi } from '~/composables/api/useAgenciesApi'
import { AGENCY_TYPES } from '~/utils/constants/agencyTypes'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const agenciesApi = useAgenciesApi()
const router = useRouter()

// Состояние формы
const formData = ref({
  name: '',
  code: '',
  type: '' // будет хранить значение выбранного типа
})

// Определение доступных типов агентств
const agencyTypes = ref(AGENCY_TYPES)

// Состояние валидации
const validationErrors = ref<Record<string, string>>({})

const loading = ref(false)
const submitting = ref(false)
const error = ref<string | null>(null)

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
  
  if (!formData.value.type) {
    errors.type = 'Тип обязателен для заполнения'
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
    await agenciesApi.createAgency(formData.value)
    // Перенаправляем на страницу списка после успешного создания
    await router.push('/directory/agencies')
  } catch (err: any) {
    error.value = 'Не удалось создать агентство. Пожалуйста, проверьте данные и попробуйте снова.'
  } finally {
    submitting.value = false
  }
}

// Обработчик отмены
const handleCancel = () => {
  router.push('/directory/agencies')
}
</script>

<template>
  <div class="card bg-header bg-surface-card rounded-lg p-4">
    <h2 class="text-xl font-bold mb-6">Новое агентство</h2>
    
    <form @submit.prevent="handleSubmit" class="p-fluid">
      <div class="field mb-4">
        <label for="name" class="block text-sm font-medium mb-2">Наименование *</label>
        <InputText 
          id="name" 
          v-model="formData.name" 
          placeholder="Введите наименование агентства"
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
          placeholder="Введите код агентства"
          :class="{ 'p-invalid': validationErrors.code }"
          class="w-full"
        />
        <small v-if="validationErrors.code" class="block mt-1 text-red-500">{{ validationErrors.code }}</small>
      </div>
      
      <div class="field mb-4">
        <label for="type" class="block text-sm font-medium mb-2">Тип *</label>
        <Dropdown
          id="type"
          v-model="formData.type"
          :options="agencyTypes"
          optionLabel="value"
          optionValue="name"
          placeholder="Выберите тип агентства"
          :class="{ 'p-invalid': validationErrors.type }"
          class="w-full"
        />
        <small v-if="validationErrors.type" class="block mt-1 text-red-500">{{ validationErrors.type }}</small>
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