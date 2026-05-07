// app/composables/api/useDashboardWidgetsApi.ts
import { useApi } from './useApi'
import type {
  PaginatedResponse,
  QueryParams
} from '~/types/api/common'

// Виджет дашборда (в соответствии с Laravel моделью DashboardWidget)
export interface DashboardWidget {
  id: number
  key: string
  name: string
  description?: string
  config?: any
  created_at?: string
  updated_at?: string
}

export interface CreateDashboardWidgetDto {
  key: string
  name: string
  description?: string
  config?: any
}

export interface UpdateDashboardWidgetDto extends Partial<CreateDashboardWidgetDto> {}

export const useDashboardWidgetsApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список виджетов дашборда с пагинацией и фильтрацией
    getDashboardWidgets: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<DashboardWidget>>(`/dashboard-widgets${query}`)
    },

    // Получить виджет дашборда по ID
    getDashboardWidget: (id: number) => {
      return get<DashboardWidget>(`/dashboard-widgets/${id}`)
    },

    // Создать новый виджет дашборда
    createDashboardWidget: (data: CreateDashboardWidgetDto) => {
      return post<DashboardWidget>('/dashboard-widgets', data)
    },

    // Обновить виджет дашборда
    updateDashboardWidget: (id: number, data: UpdateDashboardWidgetDto) => {
      return put<DashboardWidget>(`/dashboard-widgets/${id}`, data)
    },

    // Частичное обновление виджета дашборда
    patchDashboardWidget: (id: number, data: Partial<UpdateDashboardWidgetDto>) => {
      return patch<DashboardWidget>(`/dashboard-widgets/${id}`, data)
    },

    // Удалить виджет дашборда
    deleteDashboardWidget: (id: number) => {
      return del<{ success: boolean }>(`/dashboard-widgets/${id}`)
    },

    // Получить пользовательские дашборды для виджета
    getDashboardWidgetUserDashboards: (widgetId: number) => {
      return get<any[]>(`/dashboard-widgets/${widgetId}/user-dashboards`)
    },

    // Поиск виджетов дашборда
    searchDashboardWidgets: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<DashboardWidget>>(`/dashboard-widgets${queryString}`)
    }
  }
}
