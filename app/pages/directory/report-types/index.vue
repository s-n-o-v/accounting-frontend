<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useReportTypesApi, type ReportType } from '~/composables/api/useReportTypesApi'
import type { PaginatedResponse } from '~/types/api/common'
import { reportPeriod } from '~/utils/directory/report-types'

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
  handler: (item: ReportType) => void
}

const reportTypesApi = useReportTypesApi()
const { getReportTypes } = useReportTypesApi()

const loading = ref<boolean>(false)
const error = ref()
const response = ref<PaginatedResponse<ReportType>>()

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
    key: 'periodicity',
    label: 'Периодичность',
    sortable: true,
    exportable: true,
    width: '150px',
    align: 'left' as const
  },
  {
    key: 'deadline_day',
    label: 'День дедлайна',
    sortable: true,
    exportable: true,
    width: '120px',
    align: 'right' as const
  },
  {
    key: 'month_offset',
    label: 'Смещение месяца',
    sortable: true,
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
    handler: (reportType: ReportType) => {
      router.push(`/directory/report-types/${reportType.id}`)
    }
  },
  {
    type: 'edit',
    label: 'Редактировать',
    icon: 'pi pi-pencil',
    color: 'btn-warning',
    handler: (reportType: ReportType) => {
      router.push(`/directory/report-types/${reportType.id}/edit`)
    }
  },
  {
    type: 'delete',
    label: 'Удалить',
    icon: 'pi pi-trash',
    color: 'btn-danger',
    handler: async (reportType: ReportType) => {
      if (confirm(`Вы уверены, что хотите удалить тип отчетности ${reportType.name}?`)) {
        try {
          await reportTypesApi.deleteReportType(Number(reportType.id))
          // Обновляем список после удаления
          await fetchReportTypes()
        } catch (error) {
          console.error('Ошибка при удалении типа отчетности:', error)
        }
      }
    }
  }
]

const fetchReportTypes = async () => {
  loading.value = true
  error.value = null
 
  try {
    const apiResponse = await getReportTypes({ per_page: 5 })
    response.value = apiResponse
  } catch (err: any) {
    error.value = err.message || 'Ошибка при получении типов отчетности'
  } finally {
    loading.value = false
  }
}

// Вычисляемое свойство для форматированных данных типов отчетности
const formattedReportTypes = computed(() => {
  if (!response.value?.data) return []

  return response.value.data.map(reportType => ({
    ...reportType,
    periodicity: reportPeriod[reportType.periodicity],
  }))
})

onMounted(async () => {
  await fetchReportTypes()
})

const router = useRouter()

const onView = (id: string | number) => {
  router.push(`/directory/report-types/${id}`)
}

const onEdit = (id: string | number) => {
  router.push(`/directory/report-types/${id}/edit`)
}

const onDelete = async (id: string | number) => {
  if (confirm('Вы уверены, что хотите удалить этот тип отчетности?')) {
    try {
      await reportTypesApi.deleteReportType(Number(id))
      // Обновляем список после удаления
      await fetchReportTypes()
    } catch (error) {
      console.error('Ошибка при удалении типа отчетности:', error)
    }
  }
}

const onCreate = () => {
  router.push('/directory/report-types/new')
}

</script>

<template>
  <CommonEnitiesList
    title="Справочник: Типы отчетности"
    :loading="loading"
    :actions="actions"
    :has-create="true"
    :columns="columns"
    :entities="{...response, data: formattedReportTypes}"
    @create="onCreate"
    @view="onView"
    @edit="onEdit"
    @delete="onDelete"
  />
</template>