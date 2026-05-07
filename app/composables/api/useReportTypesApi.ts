// app/composables/api/useReportTypesApi.ts
import { useApi } from './useApi'
import type {
  PaginatedResponse,
  QueryParams
} from '~/types/api/common'

// Тип отчетности (в соответствии с Laravel моделью ReportType)
export interface ReportType {
  id: number
  name: string
  code: string
  periodicity: string
  deadline_day: number
  month_offset: number
  agency_id: number
  created_at?: string
  updated_at?: string
}

export interface CreateReportTypeDto {
  name: string
  code: string
  periodicity: string
  deadline_day: number
  month_offset: number
  agency_id: number
}

export interface UpdateReportTypeDto extends Partial<CreateReportTypeDto> {}

export const useReportTypesApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список типов отчетности с пагинацией и фильтрацией
    getReportTypes: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<ReportType>>(`/references/report-types${query}`)
    },

    // Получить тип отчетности по ID
    getReportType: (id: number) => {
      return get<ReportType>(`/references/report-types/${id}`)
    },

    // Создать новый тип отчетности
    createReportType: (data: CreateReportTypeDto) => {
      return post<ReportType>('/references/report-types', data)
    },

    // Обновить тип отчетности
    updateReportType: (id: number, data: UpdateReportTypeDto) => {
      return put<ReportType>(`/references/report-types/${id}`, data)
    },

    // Частичное обновление типа отчетности
    patchReportType: (id: number, data: Partial<UpdateReportTypeDto>) => {
      return patch<ReportType>(`/references/report-types/${id}`, data)
    },

    // Удалить тип отчетности
    deleteReportType: (id: number) => {
      return del<{ success: boolean }>(`/references/report-types/${id}`)
    },

    // Получить отчеты клиентов для данного типа отчетности
    getReportTypeClientReports: (reportTypeId: number) => {
      return Promise.reject(new Error('Backend route /report-types/{id}/client-reports does not exist'))
    },

    // Получить дедлайны для данного типа отчетности
    getReportTypeDeadlines: (reportTypeId: number) => {
      return Promise.reject(new Error('Backend route /report-types/{id}/deadlines does not exist'))
    },

    // Поиск типов отчетности
    searchReportTypes: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<ReportType>>(`/references/report-types${queryString}`)
    }
  }
}
