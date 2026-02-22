<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useClientsApi, type CreateClientDto } from '~/composables/api/useClientsApi'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const clientsApi = useClientsApi()
const router = useRouter()

// Варианты статуса клиента
const statusOptions = [
  { value: 'Активен', code: 'active' },
  { value: 'Приостановлен', code: 'suspended' },
  { value: 'Закрыт', code: 'closed' }
]

// Состояние формы
const formData = ref<CreateClientDto & { status: string }>({
  name: '',
  inn: '',
  ogrn: '',
  legal_address: '',
  actual_address: '',
  digital_signature_expires_at: null as string | null,
  employee_count: undefined,
  foreign_employee_count: undefined,
  monthly_fee: undefined,
  status: 'active'
})

// Состояние валидации
const validationErrors = ref<Record<string, string>>({})

const submitting = ref(false)
const error = ref<string | null>(null)

// Валидация ИНН (10 или 12 цифр)
const validateInn = (inn: string): boolean => {
  const cleaned = inn.replace(/\D/g, '')
  return cleaned.length === 10 || cleaned.length === 12
}

// Функция валидации формы
const validateForm = (): boolean => {
  const errors: Record<string, string> = {}

  if (!formData.value.name?.trim()) {
    errors.name = 'Наименование обязательно для заполнения'
  }

  if (!formData.value.inn?.trim()) {
    errors.inn = 'ИНН обязателен для заполнения'
  } else if (!validateInn(formData.value.inn)) {
    errors.inn = 'ИНН должен содержать 10 или 12 цифр'
  }

  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

// Подготовка данных для отправки (удаляем пустые поля)
const preparePayload = (): CreateClientDto => {
  const payload: CreateClientDto = {
    name: formData.value.name!.trim(),
    inn: formData.value.inn!.trim()
  }

  if (formData.value.ogrn?.trim()) payload.ogrn = formData.value.ogrn.trim()
  if (formData.value.legal_address?.trim()) payload.legal_address = formData.value.legal_address.trim()
  if (formData.value.actual_address?.trim()) payload.actual_address = formData.value.actual_address.trim()
  if (formData.value.digital_signature_expires_at?.trim()) {
    payload.digital_signature_expires_at = String(formData.value.digital_signature_expires_at).trim()
  }
  if (formData.value.employee_count !== undefined && formData.value.employee_count !== null) {
    payload.employee_count = Number(formData.value.employee_count)
  }
  if (formData.value.foreign_employee_count !== undefined && formData.value.foreign_employee_count !== null) {
    payload.foreign_employee_count = Number(formData.value.foreign_employee_count)
  }
  if (formData.value.monthly_fee !== undefined && formData.value.monthly_fee !== null) {
    payload.monthly_fee = Number(formData.value.monthly_fee)
  }
  if (formData.value.status) payload.status = formData.value.status as CreateClientDto['status']

  return payload
}

// Обработчик отправки формы
const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  error.value = null

  try {
    await clientsApi.createClient(preparePayload())
    await router.push('/clients')
  } catch (err: unknown) {
    error.value = 'Не удалось создать клиента. Пожалуйста, проверьте данные и попробуйте снова.'
  } finally {
    submitting.value = false
  }
}

// Обработчик отмены
const handleCancel = () => {
  router.push('/clients')
}
</script>

<template>
  <div class="card bg-header bg-surface-card rounded-lg p-4">
    <h2 class="text-xl font-bold mb-6">Новый клиент</h2>

    <form @submit.prevent="handleSubmit" class="p-fluid">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="field mb-4 md:col-span-2">
          <label for="name" class="block text-sm font-medium mb-2">Наименование *</label>
          <InputText
            id="name"
            v-model="formData.name"
            placeholder="Введите наименование организации"
            :class="{ 'p-invalid': validationErrors.name }"
            class="w-full"
          />
          <small v-if="validationErrors.name" class="block mt-1 text-red-500">{{ validationErrors.name }}</small>
        </div>

        <div class="field mb-4">
          <label for="inn" class="block text-sm font-medium mb-2">ИНН *</label>
          <InputText
            id="inn"
            v-model="formData.inn"
            placeholder="10 или 12 цифр"
            :class="{ 'p-invalid': validationErrors.inn }"
            class="w-full"
          />
          <small v-if="validationErrors.inn" class="block mt-1 text-red-500">{{ validationErrors.inn }}</small>
        </div>

        <div class="field mb-4">
          <label for="ogrn" class="block text-sm font-medium mb-2">ОГРН</label>
          <InputText
            id="ogrn"
            v-model="formData.ogrn"
            placeholder="ОГРН (опционально)"
            class="w-full"
          />
        </div>

        <div class="field mb-4 md:col-span-2">
          <label for="legal_address" class="block text-sm font-medium mb-2">Юридический адрес</label>
          <InputText
            id="legal_address"
            v-model="formData.legal_address"
            placeholder="Введите юридический адрес"
            class="w-full"
          />
        </div>

        <div class="field mb-4 md:col-span-2">
          <label for="actual_address" class="block text-sm font-medium mb-2">Фактический адрес</label>
          <InputText
            id="actual_address"
            v-model="formData.actual_address"
            placeholder="Введите фактический адрес"
            class="w-full"
          />
        </div>

        <div class="field mb-4">
          <label for="status" class="block text-sm font-medium mb-2">Статус</label>
          <Dropdown
            id="status"
            v-model="formData.status"
            :options="statusOptions"
            option-label="value"
            option-value="code"
            placeholder="Выберите статус"
            class="w-full"
          />
        </div>

        <div class="field mb-4">
          <label for="employee_count" class="block text-sm font-medium mb-2">Количество сотрудников</label>
          <InputNumber
            id="employee_count"
            v-model="formData.employee_count"
            :min="0"
            placeholder="0"
            class="w-full"
          />
        </div>

        <div class="field mb-4">
          <label for="foreign_employee_count" class="block text-sm font-medium mb-2">Иностранных сотрудников</label>
          <InputNumber
            id="foreign_employee_count"
            v-model="formData.foreign_employee_count"
            :min="0"
            placeholder="0"
            class="w-full"
          />
        </div>

        <div class="field mb-4">
          <label for="monthly_fee" class="block text-sm font-medium mb-2">Ежемесячный платёж (₽)</label>
          <InputNumber
            id="monthly_fee"
            v-model="formData.monthly_fee"
            :min="0"
            mode="currency"
            currency="RUB"
            locale="ru-RU"
            placeholder="0"
            class="w-full"
          />
        </div>

        <div class="field mb-4">
          <label for="digital_signature_expires_at" class="block text-sm font-medium mb-2">Дата окончания ЭЦП</label>
          <DatePicker
            id="digital_signature_expires_at"
            v-model="formData.digital_signature_expires_at"
            date-format="yy-mm-dd"
            update-model-type="string"
            show-icon
            fluid
            placeholder="Выберите дату"
            class="w-full"
          />
        </div>
      </div>

      <div v-if="error" class="field mb-4">
        <Message severity="error">{{ error }}</Message>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <Button
          label="Отмена"
          severity="secondary"
          type="button"
          :disabled="submitting"
          @click="handleCancel"
        />
        <Button
          label="Создать клиента"
          type="submit"
          :loading="submitting"
        />
      </div>
    </form>
  </div>
</template>
