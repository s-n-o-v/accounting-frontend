// app/composables/api/useClientReportsApi.ts
import { useApi } from './useApi'
import type {
  PaginatedResponse,
  QueryParams
} from '~/types/api/common'

// Отчетность клиента (в соответствии с Laravel моделью ClientReport)
export interface ClientReport {
  id: number
  client_id: number
  report_type_id: number
  deadline_day_override?: number
  month_offset_override?: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateClientReportDto {
  client_id: number
  report_type_id: number
  deadline_day_override?: number
  month_offset_override?: number
  is_active?: boolean
}

export interface UpdateClientReportDto extends Partial<CreateClientReportDto> {}

export const useClientReportsApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список отчетностей клиентов с пагинацией и фильтрацией
    getClientReports: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<ClientReport>>(`/client-reports${query}`)
    },

    // Получить отчетность клиента по ID
    getClientReport: (id: number) => {
      return get<ClientReport>(`/client-reports/${id}`)
    },

    // Создать новую отчетность клиента
    createClientReport: (data: CreateClientReportDto) => {
      return post<ClientReport>('/client-reports', data)
    },

    // Обновить отчетность клиента
    updateClientReport: (id: number, data: UpdateClientReportDto) => {
      return put<ClientReport>(`/client-reports/${id}`, data)
    },

    // Частичное обновление отчетности клиента
    patchClientReport: (id: number, data: Partial<UpdateClientReportDto>) => {
      return patch<ClientReport>(`/client-reports/${id}`, data)
    },

    // Удалить отчетность клиента
    deleteClientReport: (id: number) => {
      return del<{ success: boolean }>(`/client-reports/${id}`)
    },

    // Получить отчетности для конкретного клиента
    getClientReportsByClient: (clientId: number) => {
      return get<ClientReport[]>(`/clients/${clientId}/reports`)
    },

    // Получить отчетности для конкретного типа отчетности
    getClientReportsByReportType: (reportTypeId: number) => {
      return get<ClientReport[]>(`/report-types/${reportTypeId}/client-reports`)
    },

    // Поиск отчетностей клиентов
    searchClientReports: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<ClientReport>>(`/client-reports/search${queryString}`)
    }
  }
}
