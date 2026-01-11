<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useClientsApi, type CreateClientDto } from '~/composables/api/useClientsApi'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const router = useRouter()
const clientsApi = useClientsApi()

// Форма для создания клиента
const form = ref<CreateClientDto>({
  name: '',
  inn: '',
  ogrn: '',
  legal_address: '',
  actual_address: '',
  digital_signature_expires_at: '',
  employee_count: 0,
  foreign_employee_count: 0,
  monthly_fee: 0,
  status: 'active'
})

// Состояние загрузки
const loading = ref(false)
const error = ref<string | null>(null)

// Валидация формы
const validateForm = () => {
  if (!form.value.name.trim()) {
    error.value = 'Пожалуйста, укажите название'
    return false
  }

  if (!form.value.inn.trim() || !/^\d{10,12}$/.test(form.value.inn.trim())) {
    error.value = 'Пожалуйста, укажите корректный ИНН (10 или 12 цифр)'
    return false
  }

  if (!form.value.legal_address?.trim()) {
    error.value = 'Пожалуйста, укажите юридический адрес'
    return false
  }

  error.value = null
  return true
}

// Создание клиента
const createClient = async () => {
  if (!validateForm()) return

  try {
    loading.value = true
    error.value = null

    const response = await clientsApi.createClient(form.value)

    // Перенаправляем на страницу клиента
    router.push(`/clients/${response.id}`)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Не удалось создать клиента'
    console.error('Ошибка при создании клиента:', err)
  } finally {
    loading.value = false
  }
}

// Отмена и возврат к списку
const cancel = () => {
  router.push('/clients')
}
</script>

<template>
  <div class="create-client-page">
    <div class="page-header">
      <h2>Создание нового клиента</h2>
      <button @click="cancel" class="btn btn-secondary">
        ← Вернуться к списку
      </button>
    </div>

    <form @submit.prevent="createClient" class="client-form">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="name">Название</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="form-control"
            placeholder="Название организации"
          >
        </div>

        <div class="form-group">
          <label for="inn">ИНН</label>
          <input
            id="inn"
            v-model="form.inn"
            type="text"
            class="form-control"
            placeholder="ИНН"
          >
        </div>

        <div class="form-group">
          <label for="ogrn">ОГРН</label>
          <input
            id="ogrn"
            v-model="form.ogrn"
            type="text"
            class="form-control"
            placeholder="ОГРН"
          >
        </div>

        <div class="form-group">
          <label for="legal_address">Юридический адрес</label>
          <textarea
            id="legal_address"
            v-model="form.legal_address"
            class="form-control"
            placeholder="Юридический адрес"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="actual_address">Фактический адрес</label>
          <textarea
            id="actual_address"
            v-model="form.actual_address"
            class="form-control"
            placeholder="Фактический адрес"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="digital_signature_expires_at">Срок действия ЭЦП</label>
          <input
            id="digital_signature_expires_at"
            v-model="form.digital_signature_expires_at"
            type="date"
            class="form-control"
          >
        </div>

        <div class="form-group">
          <label for="employee_count">Количество сотрудников</label>
          <input
            id="employee_count"
            v-model.number="form.employee_count"
            type="number"
            class="form-control"
            placeholder="Количество сотрудников"
            min="0"
          >
        </div>

        <div class="form-group">
          <label for="foreign_employee_count">Количество иностранных сотрудников</label>
          <input
            id="foreign_employee_count"
            v-model.number="form.foreign_employee_count"
            type="number"
            class="form-control"
            placeholder="Количество иностранных сотрудников"
            min="0"
          >
        </div>

        <div class="form-group">
          <label for="monthly_fee">Ежемесячный платеж (₽)</label>
          <input
            id="monthly_fee"
            v-model.number="form.monthly_fee"
            type="number"
            class="form-control"
            placeholder="Ежемесячный платеж"
            min="0"
          >
        </div>

        <div class="form-group">
          <label for="status">Статус</label>
          <select id="status" v-model="form.status" class="form-control">
            <option value="active">Активный</option>
            <option value="suspended">Приостановлен</option>
            <option value="closed">Закрыт</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading"
        >
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Создание...' : 'Создать клиента' }}
        </button>
        <button
          type="button"
          @click="cancel"
          class="btn btn-secondary"
          :disabled="loading"
        >
          Отмена
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.create-client-page {
  padding: 1rem;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h2 {
  margin: 0;
  color: var(--text-color);
}

.client-form {
  background: var(--background);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9rem;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--input-background);
  color: var(--text-color);
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border: 1px solid #ef9a9a;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
