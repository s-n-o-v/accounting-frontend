// app/composables/api/useClientServicePricesApi.ts
import { useApi } from './useApi'
import type {
  PaginatedResponse,
  QueryParams
} from '~/types/api/common'

// Цена услуги для клиента (в соответствии с Laravel моделью ClientServicePrice)
export interface ClientServicePrice {
  id: number
  client_id: number
  service_type_id: number
  price: string | number
  valid_from?: string
  valid_until?: string
  created_at?: string
  updated_at?: string
}

export interface CreateClientServicePriceDto {
  client_id: number
  service_type_id: number
  price: string | number
  valid_from?: string
  valid_until?: string
}

export interface UpdateClientServicePriceDto extends Partial<CreateClientServicePriceDto> {}

export const useClientServicePricesApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список цен услуг для клиентов с пагинацией и фильтрацией
    getClientServicePrices: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<ClientServicePrice>>(`/client-service-prices${query}`)
    },

    // Получить цену услуги для клиента по ID
    getClientServicePrice: (id: number) => {
      return get<ClientServicePrice>(`/client-service-prices/${id}`)
    },

    // Создать новую цену услуги для клиента
    createClientServicePrice: (data: CreateClientServicePriceDto) => {
      return post<ClientServicePrice>('/client-service-prices', data)
    },

    // Обновить цену услуги для клиента
    updateClientServicePrice: (id: number, data: UpdateClientServicePriceDto) => {
      return put<ClientServicePrice>(`/client-service-prices/${id}`, data)
    },

    // Частичное обновление цены услуги для клиента
    patchClientServicePrice: (id: number, data: Partial<UpdateClientServicePriceDto>) => {
      return patch<ClientServicePrice>(`/client-service-prices/${id}`, data)
    },

    // Удалить цену услуги для клиента
    deleteClientServicePrice: (id: number) => {
      return del<{ success: boolean }>(`/client-service-prices/${id}`)
    },

    // Получить цены услуг для конкретного клиента
    getClientServicePricesByClient: (clientId: number) => {
      return get<ClientServicePrice[]>(`/clients/${clientId}/service-prices`)
    },

    // Получить цены услуг для конкретного типа услуги
    getClientServicePricesByServiceType: (serviceTypeId: number) => {
      return get<ClientServicePrice[]>(`/service-types/${serviceTypeId}/client-prices`)
    },

    // Поиск цен услуг для клиентов
    searchClientServicePrices: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<ClientServicePrice>>(`/client-service-prices/search${queryString}`)
    }
  }
}
