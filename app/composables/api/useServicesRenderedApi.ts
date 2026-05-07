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
      return get<PaginatedResponse<ServiceRendered>>(`/services${query}`)
    },

    // Получить оказанную услугу по ID
    getServiceRendered: (id: number) => {
      return get<ServiceRendered>(`/services/${id}`)
    },

    // Создать новую оказанную услугу
    createServiceRendered: (data: CreateServiceRenderedDto) => {
      return post<ServiceRendered>('/services', data)
    },

    // Обновить оказанную услугу
    updateServiceRendered: (id: number, data: UpdateServiceRenderedDto) => {
      return put<ServiceRendered>(`/services/${id}`, data)
    },

    // Частичное обновление оказанной услуги
    patchServiceRendered: (id: number, data: Partial<UpdateServiceRenderedDto>) => {
      return patch<ServiceRendered>(`/services/${id}`, data)
    },

    // Удалить оказанную услугу
    deleteServiceRendered: (id: number) => {
      return del<{ success: boolean }>(`/services/${id}`)
    },

    // Получить оказанные услуги для конкретного клиента
    getServicesRenderedByClient: (clientId: number) => {
      return Promise.reject(new Error('Backend route /clients/{id}/services-rendered does not exist'))
    },

    // Получить оказанные услуги для конкретного типа услуги
    getServicesRenderedByServiceType: (serviceTypeId: number) => {
      return Promise.reject(new Error('Backend route /service-types/{id}/services-rendered does not exist'))
    },

    // Получить позиции счетов для оказанной услуги
    getServiceRenderedInvoiceItems: (serviceRenderedId: number) => {
      return Promise.reject(new Error('Backend route /services/{id}/invoice-items does not exist'))
    },

    // Поиск оказанных услуг
    searchServicesRendered: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<ServiceRendered>>(`/services${queryString}`)
    }
  }
}
