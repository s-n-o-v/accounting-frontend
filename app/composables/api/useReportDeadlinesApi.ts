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
  const { get, post, put, buildQuery } = useApi()

  return {
    // Получить список дедлайнов отчетности с пагинацией и фильтрацией
    getReportDeadlines: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<ReportDeadline>>(`/deadlines${query}`)
    },

    // Получить дедлайн отчетности по ID
    getReportDeadline: (id: number) => {
      return Promise.reject(new Error('Backend route GET /deadlines/{id} does not exist'))
    },

    // Создать новый дедлайн отчетности
    createReportDeadline: (data: CreateReportDeadlineDto) => {
      return post<ReportDeadline>('/deadlines/generate', data)
    },

    // Обновить дедлайн отчетности
    updateReportDeadline: (id: number, data: UpdateReportDeadlineDto) => {
      return put<ReportDeadline>(`/deadlines/${id}`, data)
    },

    // Частичное обновление дедлайна отчетности
    patchReportDeadline: (id: number, data: Partial<UpdateReportDeadlineDto>) => {
      return Promise.reject(new Error('Backend route PATCH /deadlines/{id} does not exist'))
    },

    // Удалить дедлайн отчетности
    deleteReportDeadline: (id: number) => {
      return Promise.reject(new Error('Backend route DELETE /deadlines/{id} does not exist'))
    },

    // Получить дедлайны для конкретного клиента
    getReportDeadlinesByClient: (clientId: number) => {
      return Promise.reject(new Error('Backend route /clients/{id}/report-deadlines does not exist'))
    },

    // Получить дедлайны для конкретного типа отчетности
    getReportDeadlinesByReportType: (reportTypeId: number) => {
      return Promise.reject(new Error('Backend route /report-types/{id}/deadlines does not exist'))
    },

    // Поиск дедлайнов отчетности
    searchReportDeadlines: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<ReportDeadline>>(`/deadlines${queryString}`)
    }
  }
}
