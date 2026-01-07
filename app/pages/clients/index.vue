<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientsApi, type Client } from '~/composables/api/useClientsApi'
import type { PaginatedResponse } from '~/types/api/common'
import { formatClientType, formatCurrency, formatDate, formatStatus, statusNum } from '~/utils/helpers/misc'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const clientsApi = useClientsApi()
const { getClients } = useClientsApi()

const loading = ref<boolean>(false)
const error = ref()
const response = ref<PaginatedResponse<Client>>()
// Определяем колонки для таблицы клиентов
const columns = [
  {
    key: 'name',
    label: 'Наименование',
    sortable: true,
    exportable: true,
    width: '250px',
    align: 'left' as const
  },
  {
    key: 'inn',
    label: 'ИНН',
    sortable: true,
    exportable: true,
    width: '120px',
    align: 'left' as const
  },
  {
    key: 'status',
    label: 'Статус',
    sortable: true,
    exportable: true,
    type: 'badge',
    width: '120px',
    align: 'center' as const
  },
  {
    key: 'employee_count',
    label: 'Сотрудников',
    sortable: true,
    exportable: true,
    width: '120px',
    align: 'right' as const
  },
  {
    key: 'monthly_fee',
    label: 'Ежемесячный платеж',
    sortable: true,
    exportable: true,
    width: '150px',
    align: 'right' as const
  },
  {
    key: 'created_at',
    label: 'Дата создания',
    sortable: true,
    exportable: true,
    width: '150px',
    align: 'left' as const
  }
]

// Определяем действия для таблицы
const actions = [
  {
    type: 'view',
    label: 'Просмотр',
    icon: 'pi pi-eye',
    color: 'btn-info',
    handler: (client: Client) => {
      router.push(`/clients/${client.id}`)
    }
  },
  {
    type: 'edit',
    label: 'Редактировать',
    icon: 'pi pi-pencil',
    color: 'btn-warning',
    handler: (client: Client) => {
      router.push(`/clients/${client.id}/edit`)
    }
  },
  {
    type: 'delete',
    label: 'Удалить',
    icon: 'pi pi-trash',
    color: 'btn-danger',
    handler: async (client: Client) => {
      if (confirm(`Вы уверены, что хотите удалить клиента ${client.name}?`)) {
        try {
          await clientsApi.deleteClient(Number(client.id))
          // Обновляем список после удаления
          await fetchClients()
          alert('Клиент успешно удален')
        } catch (error) {
          console.error('Ошибка при удалении клиента:', error)
          alert('Не удалось удалить клиента')
        }
      }
    }
  }
]

const fetchClients = async () => {
  loading.value = true
  error.value = null
 
  try {
    const apiResponse = await getClients({ per_page: 5 })
    response.value = apiResponse
    response.value.data.forEach((row: Client) => {
      row.created_at = formatDate(row.created_at)
      row.monthly_fee = formatCurrency(row.monthly_fee)
      row.state = {
        id: statusNum(row.status),
        name: formatStatus(row.status)
      }
    })
  } catch (err: any) {
    error.value = err.message || 'Ошибка при получении клиентов'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchClients()
})

const router = useRouter()

const onView = (id: string | number) => {
  router.push(`/clients/${id}`)
}

const onEdit = (id: string | number) => {
  router.push(`/clients/${id}/edit`)
}

const onDelete = async (id: string | number) => {
  if (confirm('Вы уверены, что хотите удалить этого клиента?')) {
    try {
      await clientsApi.deleteClient(Number(id))
      // Обновляем список после удаления
      await fetchClients()
      alert('Клиент успешно удален')
    } catch (error) {
      console.error('Ошибка при удалении клиента:', error)
      alert('Не удалось удалить клиента')
    }
  }
}

const onCreate = () => {
  router.push('/clients/new')
}

</script>

<template>
  <CommonEnitiesList
    title="Список клиентов"
    :loading="loading"
    :actions="actions"
    :has-create="true"
    :columns="columns"
    :entities="response"
    @create="onCreate"
    @view="onView"
    @edit="onEdit"
    @delete="onDelete"
  />
</template>
