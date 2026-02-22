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

// Состояние формы
const formData = ref<Partial<ServiceType>>({
  name: '',
  code: '',
  default_price: 0
})

// Состояние валидации
const validationErrors = ref<Record<string, string>>({})

const loading = ref(false)
const submitting = ref(false)
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
    const serviceType = await serviceTypesApi.getServiceType(serviceTypeId)
    
    // Заполняем форму данными из полученного типа услуги
    formData.value = {
      name: serviceType.data?.name,
      code: serviceType.data?.code,
      default_price: serviceType.data?.default_price || 0
    }
  } catch (err: any) {
    error.value = 'Не удалось загрузить данные типа услуги'
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
  
  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

// Обработчик отправки формы
const handleSubmit = async () => {
  // Сначала выполняем валидацию
  if (!validateForm()) {
    return
  }
  
  const serviceTypeId = Number(route.params.id)
  
  if (isNaN(serviceTypeId)) {
    error.value = 'Неверный ID типа услуги'
    return
  }

  submitting.value = true
  error.value = null
  
  try {
    await serviceTypesApi.updateServiceType(serviceTypeId, formData.value)
    // Перенаправляем на страницу списка после успешного обновления
    await router.push('/directory/service-types')
  } catch (err: any) {
    error.value = 'Не удалось обновить тип услуги. Пожалуйста, проверьте данные и попробуйте снова.'
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
  <div v-if="loading" class="flex justify-center items-center h-64">
    <ProgressSpinner />
  </div>
  
  <div v-else class="card bg-header bg-surface-card rounded-lg p-4">
    <h2 class="text-xl font-bold mb-6">Редактирование типа услуги</h2>
    
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
      
      <div class="field">
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
      
      <div class="field">
        <label for="default_price" class="block text-sm font-medium mb-2">Базовая цена</label>
        <InputNumber
          id="default_price"
          v-model="formData.default_price"
          placeholder="Введите базовую цену"
          class="w-full"
        />
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
</style>