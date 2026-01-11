// app/composables/api/useServicesRenderedApi.ts
import { useApi } from './useApi'
import type {
  PaginatedResponse,
  QueryParams
} from '~/types/api/common'

// Оказанная услуга (в соответствии с Laravel моделью ServiceRendered)
export interface ServiceRendered {
  id: number
  client_id: number
  service_type_id: number
  description: string
  price_estimated: string | number
  price_final: string | number
  rendered_at?: string
  created_at?: string
  updated_at?: string
}

export interface CreateServiceRenderedDto {
  client_id: number
  service_type_id: number
  description: string
  price_estimated: string | number
  price_final: string | number
  rendered_at?: string
}

export interface UpdateServiceRenderedDto extends Partial<CreateServiceRenderedDto> {}

export const useServicesRenderedApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список оказанных услуг с пагинацией и фильтрацией
    getServicesRendered: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<ServiceRendered>>(`/services-rendered${query}`)
    },

    // Получить оказанную услугу по ID
    getServiceRendered: (id: number) => {
      return get<ServiceRendered>(`/services-rendered/${id}`)
    },

    // Создать новую оказанную услугу
    createServiceRendered: (data: CreateServiceRenderedDto) => {
      return post<ServiceRendered>('/services-rendered', data)
    },

    // Обновить оказанную услугу
    updateServiceRendered: (id: number, data: UpdateServiceRenderedDto) => {
      return put<ServiceRendered>(`/services-rendered/${id}`, data)
    },

    // Частичное обновление оказанной услуги
    patchServiceRendered: (id: number, data: Partial<UpdateServiceRenderedDto>) => {
      return patch<ServiceRendered>(`/services-rendered/${id}`, data)
    },

    // Удалить оказанную услугу
    deleteServiceRendered: (id: number) => {
      return del<{ success: boolean }>(`/services-rendered/${id}`)
    },

    // Получить оказанные услуги для конкретного клиента
    getServicesRenderedByClient: (clientId: number) => {
      return get<ServiceRendered[]>(`/clients/${clientId}/services-rendered`)
    },

    // Получить оказанные услуги для конкретного типа услуги
    getServicesRenderedByServiceType: (serviceTypeId: number) => {
      return get<ServiceRendered[]>(`/service-types/${serviceTypeId}/services-rendered`)
    },

    // Получить позиции счетов для оказанной услуги
    getServiceRenderedInvoiceItems: (serviceRenderedId: number) => {
      return get<any[]>(`/services-rendered/${serviceRenderedId}/invoice-items`)
    },

    // Поиск оказанных услуг
    searchServicesRendered: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<ServiceRendered>>(`/services-rendered/search${queryString}`)
    }
  }
}
