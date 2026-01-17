<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAgenciesApi, type Agency } from '~/composables/api/useAgenciesApi'
import type { PaginatedResponse } from '~/types/api/common'
import { getAgencyTypeDisplayValue } from '~/utils/constants/agencyTypes'

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
 handler: (item: Agency) => void
}

const agenciesApi = useAgenciesApi()
const { getAgencies } = useAgenciesApi()

const loading = ref<boolean>(false)
const error = ref()
const response = ref<PaginatedResponse<Agency>>()

// Определяем колонки для таблицы агентств
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
    key: 'type',
    label: 'Тип',
    sortable: true,
    exportable: true,
    width: '150px',
    align: 'left' as const
  }
]

// Определяем действия для таблицы
const actions: Action[] = [
  {
    type: 'view',
    label: 'Просмотр',
    icon: 'pi pi-eye',
    color: 'btn-info',
    handler: (agency: Agency) => {
      router.push(`/directory/agencies/${agency.id}`)
    }
  },
  {
    type: 'edit',
    label: 'Редактировать',
    icon: 'pi pi-pencil',
    color: 'btn-warning',
    handler: (agency: Agency) => {
      router.push(`/directory/agencies/${agency.id}/edit`)
    }
  },
  {
    type: 'delete',
    label: 'Удалить',
    icon: 'pi pi-trash',
    color: 'btn-danger',
    handler: async (agency: Agency) => {
      if (confirm(`Вы уверены, что хотите удалить агентство ${agency.name}?`)) {
        try {
          await agenciesApi.deleteAgency(Number(agency.id))
          // Обновляем список после удаления
          await fetchAgencies()
        } catch (error) {
          console.error('Ошибка при удалении агентства:', error)
        }
      }
    }
  }
]

const fetchAgencies = async () => {
  loading.value = true
  error.value = null
 
  try {
    const apiResponse = await getAgencies({ per_page: 5 })
    response.value = apiResponse
  } catch (err: any) {
    error.value = err.message || 'Ошибка при получении агентств'
  } finally {
    loading.value = false
  }
}

// Вычисляемое свойство для форматированных данных агентств
const formattedAgencies = computed(() => {
  if (!response.value?.data) return []
  
  return response.value.data.map(agency => ({
    ...agency,
    type: getAgencyTypeDisplayValue(agency.type)
 }))
})

onMounted(async () => {
  await fetchAgencies()
})

const router = useRouter()

const onView = (id: string | number) => {
  router.push(`/directory/agencies/${id}`)
}

const onEdit = (id: string | number) => {
  router.push(`/directory/agencies/${id}/edit`)
}

const onDelete = async (id: string | number) => {
  if (confirm('Вы уверены, что хотите удалить это агентство?')) {
    try {
      await agenciesApi.deleteAgency(Number(id))
      // Обновляем список после удаления
      await fetchAgencies()
    } catch (error) {
      console.error('Ошибка при удалении агентства:', error)
    }
  }
}

const onCreate = () => {
  router.push('/directory/agencies/new')
}

</script>

<template>
  <CommonEnitiesList
    title="Справочник: Органы власти"
    :loading="loading"
    :actions="actions"
    :has-create="true"
    :columns="columns"
    :entities="{...response, data: formattedAgencies}"
    @create="onCreate"
    @view="onView"
    @edit="onEdit"
    @delete="onDelete"
  />
</template>