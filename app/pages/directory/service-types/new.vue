<script setup lang="ts">
import { useServiceTypesApi, type CreateServiceTypeDto } from '~/composables/api/useServiceTypesApi'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const typesApi = useServiceTypesApi()
const router = useRouter()

// Состояние формы
const formData = ref<CreateServiceTypeDto>({
  name: '',
  code: '',
  default_price: 1000,
})

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
    await typesApi.createServiceType(formData.value)
    // Перенаправляем на страницу списка после успешного создания
    await router.push('/directory/service-types')
  } catch (err: any) {
    error.value = 'Не удалось создать тип услуги. Пожалуйста, проверьте данные и попробуйте снова.'
  } finally {
    submitting.value = false
  }
}

// Обработчик отмены
const handleCancel = () => {
  router.push('/directory/service-types')
}
</script>

<template>
  <div class="card bg-header bg-surface-card rounded-lg p-4">
    <h2 class="text-xl font-bold mb-6">Новый тип услуги</h2>
    
    <form @submit.prevent="handleSubmit" class="p-fluid form">
      <div class="field">
        <label for="name" class="block text-sm font-medium mb-2">Наименование *</label>
        <InputText
          id="name"
          v-model="formData.name"
          placeholder="Введите наименование типа услуги"
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
            placeholder="Введите код типа услуги"
            :class="{ 'p-invalid': validationErrors.code }"
            class="w-full"
          />
          <small v-if="validationErrors.code" class="block mt-1 text-red-500">{{ validationErrors.code }}</small>
        </div>
        <div class="w-1/2">
          <label for="default_price" class="block text-sm font-medium mb-2">Периодичность *</label>
          <InputNumber
            id="default_price"
            v-model="formData.default_price"
            :min="100"
            placeholder="Укажите базовую цену"
            :class="{ 'p-invalid': validationErrors.default_price }"
            class="w-full"
          />
          <small v-if="validationErrors.periodicity" class="block mt-1 text-red-500">{{ validationErrors.periodicity }}</small>
        </div>
      </div>
     
      <!-- Сообщение об ошибке -->
      <div v-if="error" class="field">
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