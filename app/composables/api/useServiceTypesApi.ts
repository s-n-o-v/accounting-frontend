// app/composables/api/useServiceTypesApi.ts
import { useApi } from './useApi'
import type {
  PaginatedResponse,
  QueryParams
} from '~/types/api/common'

// Тип услуги (в соответствии с Laravel моделью ServiceType)
export interface ServiceType {
  id: number
  name: string
  code: string
  default_price: string | number
  created_at?: string
  updated_at?: string
}

export interface CreateServiceTypeDto {
  name: string
  code: string
  default_price: string | number
}

export interface UpdateServiceTypeDto extends Partial<CreateServiceTypeDto> {}

export const useServiceTypesApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список типов услуг с пагинацией и фильтрацией
    getServiceTypes: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<ServiceType>>(`/references/service-types${query}`)
    },

    // Получить тип услуги по ID
    getServiceType: (id: number) => {
      return get<ServiceType>(`/references/service-types/${id}`)
    },

    // Создать новый тип услуги
    createServiceType: (data: CreateServiceTypeDto) => {
      return post<ServiceType>('/references/service-types', data)
    },

    // Обновить тип услуги
    updateServiceType: (id: number, data: UpdateServiceTypeDto) => {
      return put<ServiceType>(`/references/service-types/${id}`, data)
    },

    // Частичное обновление типа услуги
    patchServiceType: (id: number, data: Partial<UpdateServiceTypeDto>) => {
      return patch<ServiceType>(`/references/service-types/${id}`, data)
    },

    // Удалить тип услуги
    deleteServiceType: (id: number) => {
      return del<{ success: boolean }>(`/references/service-types/${id}`)
    },

    // Поиск типов услуг
    searchServiceTypes: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<ServiceType>>(`/references/service-types${queryString}`)
    }
  }
}
