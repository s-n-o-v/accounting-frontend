// app/composables/api/useReportDeadlinesApi.ts
import { useApi } from './useApi'
import type {
  PaginatedResponse,
  QueryParams
} from '~/types/api/common'

// Дедлайн отчетности (в соответствии с Laravel моделью ReportDeadline)
export interface ReportDeadline {
  id: number
  client_id: number
  report_type_id: number
  deadline_date?: string
  period_start?: string
  period_end?: string
  status: string
  submitted_at?: string
  created_at?: string
  updated_at?: string
}

export interface CreateReportDeadlineDto {
  client_id: number
  report_type_id: number
  deadline_date?: string
  period_start?: string
  period_end?: string
  status: string
  submitted_at?: string
}

export interface UpdateReportDeadlineDto extends Partial<CreateReportDeadlineDto> {}

export const useReportDeadlinesApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список дедлайнов отчетности с пагинацией и фильтрацией
    getReportDeadlines: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<ReportDeadline>>(`/report-deadlines${query}`)
    },

    // Получить дедлайн отчетности по ID
    getReportDeadline: (id: number) => {
      return get<ReportDeadline>(`/report-deadlines/${id}`)
    },

    // Создать новый дедлайн отчетности
    createReportDeadline: (data: CreateReportDeadlineDto) => {
      return post<ReportDeadline>('/report-deadlines', data)
    },

    // Обновить дедлайн отчетности
    updateReportDeadline: (id: number, data: UpdateReportDeadlineDto) => {
      return put<ReportDeadline>(`/report-deadlines/${id}`, data)
    },

    // Частичное обновление дедлайна отчетности
    patchReportDeadline: (id: number, data: Partial<UpdateReportDeadlineDto>) => {
      return patch<ReportDeadline>(`/report-deadlines/${id}`, data)
    },

    // Удалить дедлайн отчетности
    deleteReportDeadline: (id: number) => {
      return del<{ success: boolean }>(`/report-deadlines/${id}`)
    },

    // Получить дедлайны для конкретного клиента
    getReportDeadlinesByClient: (clientId: number) => {
      return get<ReportDeadline[]>(`/clients/${clientId}/report-deadlines`)
    },

    // Получить дедлайны для конкретного типа отчетности
    getReportDeadlinesByReportType: (reportTypeId: number) => {
      return get<ReportDeadline[]>(`/report-types/${reportTypeId}/deadlines`)
    },

    // Поиск дедлайнов отчетности
    searchReportDeadlines: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<ReportDeadline>>(`/report-deadlines/search${queryString}`)
    }
  }
}
