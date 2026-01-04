<!-- app/components/ApiTest.vue -->
<template>
  <Card class="mb-6">
    <template #title>🔌 Тест API подключения</template>
    <template #content>
      <div class="space-y-4">
        <!-- Статус подключения -->
        <div class="flex items-center space-x-3">
          <div
            :class="[
              'w-3 h-3 rounded-full animate-pulse',
              connectionStatus === 'connected' ? 'bg-success' :
              connectionStatus === 'error' ? 'bg-danger' : 'bg-warning'
            ]"
          ></div>
          <span class="font-medium">
            {{ statusMessages[connectionStatus] }}
          </span>
        </div>

        <!-- Кнопки тестов -->
        <div class="flex flex-wrap gap-2">
          <Button 
            label="Проверить соединение" 
            :loading="loading"
            @click="testConnection"
            severity="secondary"
          />
          <Button 
            label="Получить клиентов" 
            :loading="loadingClients"
            @click="fetchClients"
          />
          <Button 
            label="Создать тестового клиента" 
            severity="success"
            @click="createTestClient"
          />
        </div>

        <!-- Результаты -->
        <div v-if="clients.length > 0" class="mt-4">
          <h4 class="font-semibold mb-2">Клиенты ({{ clients.length }})</h4>
          <div class="bg-surface rounded p-3 max-h-60 overflow-y-auto">
            <div v-for="client in clients" :key="client.id" class="py-2 border-b last:border-b-0">
              <div class="font-medium">{{ client.short_name }}</div>
              <div class="text-sm text-muted">
                ИНН: {{ client.inn }} | Статус: {{ client.status }}
              </div>
            </div>
          </div>
        </div>

        <!-- Ошибки -->
        <div v-if="error" class="p-3 bg-danger bg-opacity-10 border border-danger border-opacity-20 rounded">
          <div class="font-medium text-danger">Ошибка:</div>
          <div class="text-danger text-sm">{{ error }}</div>
        </div>

        <!-- Информация о API -->
        <div class="text-sm text-muted pt-2 border-t">
          <div>Base URL: {{ apiBaseUrl }}</div>
          <div v-if="lastResponse">Последний ответ: {{ lastResponse }}</div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useClientsApi } from '~/composables/api/useClientsApi'
import { useApi } from '~/composables/api/useApi'

const { getClients, createClient } = useClientsApi()
const config = useRuntimeConfig()

const connectionStatus = ref<'idle' | 'connecting' | 'connected' | 'error'>('idle')
const loading = ref(false)
const loadingClients = ref(false)
const clients = ref<any[]>([])
const error = ref<string | null>(null)
const lastResponse = ref<string>('')

const apiBaseUrl = config.public.apiBaseUrl || 'http://localhost:8000/api'

const statusMessages = {
  idle: 'Не подключено',
  connecting: 'Проверка подключения...',
  connected: 'Подключено к API',
  error: 'Ошибка подключения'
}

// Тест соединения с API
const testConnection = async () => {
  console.log('testConnection');
  loading.value = true
  connectionStatus.value = 'connecting'
  error.value = null
  
  try {
    // Простой запрос для проверки соединения
    const api = useApi()
    const authResult = await api.post('/auth/login', {
      email: 'admin@example.com',
      password: 'password',
    })
    connectionStatus.value = 'connected'
    lastResponse.value = new Date().toLocaleTimeString()
  } catch (err: any) {
    console.error('test error', err)
    connectionStatus.value = 'error'
    error.value = err.message || 'Не удалось подключиться к API'
  } finally {
    loading.value = false
  }
}

// Получить список клиентов
const fetchClients = async () => {
  loadingClients.value = true
  error.value = null
  
  try {
    const response = await getClients({ per_page: 5 })
    clients.value = response.data
    lastResponse.value = `Получено ${response.data.length} клиентов`
  } catch (err: any) {
    error.value = err.message || 'Ошибка при получении клиентов'
  } finally {
    loadingClients.value = false
  }
}

// Создать тестового клиента
const createTestClient = async () => {
  const testData = {
    type: 'OOO' as const,
    full_name: 'Тестовая компания ООО',
    short_name: 'Тест ООО',
    inn: '1234567890',
    address_legal: 'Тестовый адрес',
    contact_phone: '+79990001122',
    contact_email: 'test@example.com',
    employee_count: 5,
    monthly_fee: 15000
  }
  
  try {
    const client = await createClient(testData)
    clients.value = [client, ...clients.value]
    lastResponse.value = `Создан клиент: ${client.short_name}`
  } catch (err: any) {
    error.value = err.message || 'Ошибка при создании клиента'
  }
}
</script>
