<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useServiceTypesApi, type ServiceType } from '~/composables/api/useServiceTypesApi'
import type { PaginatedResponse } from '~/types/api/common'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// Тип для действий
interface Action {
  type: 'view' | 'edit' | 'delete'
  label: string
  icon: string
  color: string
  handler: (item: ServiceType) => void
}

const serviceTypesApi = useServiceTypesApi()
const { getServiceTypes } = useServiceTypesApi()

const loading = ref<boolean>(false)
const error = ref()
const response = ref<PaginatedResponse<ServiceType>>()

// Определяем колонки для таблицы типов отчетности
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
    key: 'code',
    label: 'Код',
    sortable: true,
    exportable: true,
    width: '120px',
    align: 'left' as const
  },
  {
    key: 'default_price',
    label: 'Базовая цена',
    sortable: false,
    exportable: true,
    width: '120px',
    align: 'right' as const
  }
]

// Определяем действия для таблицы
const actions: Action[] = [
  {
    type: 'view',
    label: 'Просмотр',
    icon: 'pi pi-eye',
    color: 'btn-info',
    handler: (type: ServiceType) => {
      router.push(`/directory/service-types/${type.id}`)
    }
  },
  {
    type: 'edit',
    label: 'Редактировать',
    icon: 'pi pi-pencil',
    color: 'btn-warning',
    handler: (type: ServiceType) => {
      router.push(`/directory/service-types/${type.id}/edit`)
    }
  },
  {
    type: 'delete',
    label: 'Удалить',
    icon: 'pi pi-trash',
    color: 'btn-danger',
    handler: async (type: ServiceType) => {
      if (confirm(`Вы уверены, что хотите удалить тип услуги ${type.name}?`)) {
        try {
          await serviceTypesApi.deleteServiceType(Number(type.id))
          // Обновляем список после удаления
          await fetchServiceTypes()
        } catch (error) {
          console.error('Ошибка при удалении типа отчетности:', error)
        }
      }
    }
  }
]

const fetchServiceTypes = async () => {
  loading.value = true
  error.value = null
 
  try {
    const apiResponse = await getServiceTypes({ per_page: 5 })
    response.value = apiResponse
  } catch (err: any) {
    error.value = err.message || 'Ошибка при получении типов услуг'
  } finally {
    loading.value = false
  }
}

// Вычисляемое свойство для форматированных данных типов услуг
const formattedTypes = computed(() => {
  if (!response.value?.data) return []

  return response.value.data.map(type => ({
    ...type,
  }))
})

onMounted(async () => {
  await fetchServiceTypes()
})

const router = useRouter()

const onView = (id: string | number) => {
  router.push(`/directory/service-types/${id}`)
}

const onEdit = (id: string | number) => {
  router.push(`/directory/service-types/${id}/edit`)
}

const onDelete = async (id: string | number) => {
  if (confirm('Вы уверены, что хотите удалить этот тип услуги?')) {
    try {
      await serviceTypesApi.deleteServiceType(Number(id))
      // Обновляем список после удаления
      await fetchServiceTypes()
    } catch (error) {
      console.error('Ошибка при удалении типа услуги:', error)
    }
  }
}

const onCreate = () => {
  router.push('/directory/service-types/new')
}

</script>

<template>
  <CommonEnitiesList
    title="Справочник: Типы услуг"
    :loading="loading"
    :actions="actions"
    :has-create="true"
    :columns="columns"
    :entities="{...response, data: formattedTypes}"
    @create="onCreate"
    @view="onView"
    @edit="onEdit"
    @delete="onDelete"
  />
</template>