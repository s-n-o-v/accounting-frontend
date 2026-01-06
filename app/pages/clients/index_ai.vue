<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientsApi, type Client } from '~/composables/api/useClientsApi'
import { useDataTable } from '~/composables/table/useDataTable'
import DataTable from '~/components/common/DataTable.vue'

const router = useRouter()
const clientsApi = useClientsApi()

// Определяем колонки для таблицы клиентов
const columns = [
  {
    key: 'full_name',
    label: 'Полное название',
    sortable: true,
    width: '250px',
    align: 'left' as const
  },
  {
    key: 'short_name',
    label: 'Краткое название',
    sortable: true,
    width: '150px',
    align: 'left' as const
  },
  {
    key: 'inn',
    label: 'ИНН',
    sortable: true,
    width: '120px',
    align: 'left' as const
  },
  {
    key: 'type',
    label: 'Тип',
    sortable: true,
    width: '100px',
    align: 'center' as const
  },
  {
    key: 'status',
    label: 'Статус',
    sortable: true,
    width: '120px',
    align: 'center' as const
  },
  {
    key: 'employee_count',
    label: 'Сотрудников',
    sortable: true,
    width: '120px',
    align: 'right' as const
  },
  {
    key: 'monthly_fee',
    label: 'Ежемесячный платеж',
    sortable: true,
    width: '150px',
    align: 'right' as const
  },
  {
    key: 'created_at',
    label: 'Дата создания',
    sortable: true,
    width: '150px',
    align: 'left' as const
  }
]

// Определяем действия для таблицы
const actions = [
  {
    label: 'Просмотр',
    icon: '👁️',
    color: 'btn-info',
    handler: (client: Client) => {
      router.push(`/clients/${client.id}`)
    }
  },
  {
    label: 'Редактировать',
    icon: '✏️',
    color: 'btn-warning',
    handler: (client: Client) => {
      router.push(`/clients/${client.id}/edit`)
    }
  },
  {
    label: 'Удалить',
    icon: '🗑️',
    color: 'btn-danger',
    handler: async (client: Client) => {
      if (confirm(`Вы уверены, что хотите удалить клиента ${client.full_name}?`)) {
        try {
          await clientsApi.deleteClient(client.id)
          table.removeItem(client.id)
          // Показать уведомление об успехе
          alert('Клиент успешно удален')
        } catch (error) {
          console.error('Ошибка при удалении клиента:', error)
          alert('Не удалось удалить клиента')
        }
      }
    }
  }
]

// Создаем таблицу с использованием composable
const table = useDataTable<Client>({
  fetchData: async (params) => {
    // Преобразуем параметры сортировки в формат API
    const queryParams: Record<string, any> = {
      page: params.page,
      per_page: params.perPage
    }

    if (params.sort?.key) {
      queryParams.sort_by = params.sort.key
      queryParams.sort_dir = params.sort.direction
    }

    if (params.filters) {
      Object.assign(queryParams, params.filters)
    }

    // Получаем данные через API
    const response = await clientsApi.getClients(queryParams)

    return {
      data: response.data,
      meta: {
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        per_page: response.meta.per_page,
        total: response.meta.total,
        from: response.meta.from,
        to: response.meta.to
      }
    }
  },
  columns,
  actions,
  initialPerPage: 10,
  showColumnToggle: true
})

// Функция для создания нового клиента
const handleCreateClient = () => {
  router.push('/clients/new')
}

// Инициализация таблицы
onMounted(() => {
  table.init()
})

// Форматирование даты
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Форматирование статуса
const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'Активен',
    suspended: 'Приостановлен',
    closed: 'Закрыт'
  }
  return statusMap[status] || status
}

// Форматирование типа клиента
const formatClientType = (type: string) => {
  const typeMap: Record<string, string> = {
    OOO: 'ООО',
    IP: 'ИП',
    AO: 'АО',
    NKO: 'НКО'
  }
  return typeMap[type] || type
}

// Форматирование денежных сумм
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}
</script>

<template>
  <div class="clients-page">
    <DataTable
      :items="table.items.value"
      :columns="table.visibleColumns.value"
      :actions="actions"
      :loading="table.loading.value"
      :pagination="table.pagination.value"
      show-column-toggle
      @create="handleCreateClient"
      @sort="table.setSort"
      @page-change="table.setPage"
    >
      <template #title>
        Клиенты
      </template>

      <!-- Кастомные ячейки для форматирования данных -->
      <template #cell-type="{ item }">
        <span class="badge" :class="`badge-${item.type.toLowerCase()}`">
          {{ formatClientType(item.type) }}
        </span>
      </template>

      <template #cell-status="{ item }">
        <span class="badge" :class="`status-${item.status}`">
          {{ formatStatus(item.status) }}
        </span>
      </template>

      <template #cell-created_at="{ item }">
        {{ formatDate(item.created_at) }}
      </template>

      <template #cell-monthly_fee="{ item }">
        {{ formatCurrency(item.monthly_fee) }}
      </template>
    </DataTable>
  </div>
</template>

<style scoped>
.clients-page {
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Стили для бейджей типов клиентов */
.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.badge-ooo {
  background-color: #e3f2fd;
  color: #1976d2;
}

.badge-ip {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.badge-ao {
  background-color: #e8f5e9;
  color: #388e3c;
}

.badge-nko {
  background-color: #fff3e0;
  color: #f57c00;
}

/* Стили для бейджей статусов */
.status-active {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-suspended {
  background-color: #fff8e1;
  color: #ff8f00;
}

.status-closed {
  background-color: #ffebee;
  color: #c62828;
}
</style>
