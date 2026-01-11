// app/composables/api/useClientSubscriptionPricesApi.ts
import { useApi } from './useApi'
import type {
  PaginatedResponse,
  QueryParams
} from '~/types/api/common'

// Цена абонентского обслуживания клиента (в соответствии с Laravel моделью ClientSubscriptionPrice)
export interface ClientSubscriptionPrice {
  id: number
  client_id: number
  monthly_fee: string | number
  valid_from?: string
  valid_until?: string
  created_at?: string
  updated_at?: string
}

export interface CreateClientSubscriptionPriceDto {
  client_id: number
  monthly_fee: string | number
  valid_from?: string
  valid_until?: string
}

export interface UpdateClientSubscriptionPriceDto extends Partial<CreateClientSubscriptionPriceDto> {}

export const useClientSubscriptionPricesApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список цен абонентского обслуживания для клиентов с пагинацией и фильтрацией
    getClientSubscriptionPrices: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<ClientSubscriptionPrice>>(`/client-subscription-prices${query}`)
    },

    // Получить цену абонентского обслуживания для клиента по ID
    getClientSubscriptionPrice: (id: number) => {
      return get<ClientSubscriptionPrice>(`/client-subscription-prices/${id}`)
    },

    // Создать новую цену абонентского обслуживания для клиента
    createClientSubscriptionPrice: (data: CreateClientSubscriptionPriceDto) => {
      return post<ClientSubscriptionPrice>('/client-subscription-prices', data)
    },

    // Обновить цену абонентского обслуживания для клиента
    updateClientSubscriptionPrice: (id: number, data: UpdateClientSubscriptionPriceDto) => {
      return put<ClientSubscriptionPrice>(`/client-subscription-prices/${id}`, data)
    },

    // Частичное обновление цены абонентского обслуживания для клиента
    patchClientSubscriptionPrice: (id: number, data: Partial<UpdateClientSubscriptionPriceDto>) => {
      return patch<ClientSubscriptionPrice>(`/client-subscription-prices/${id}`, data)
    },

    // Удалить цену абонентского обслуживания для клиента
    deleteClientSubscriptionPrice: (id: number) => {
      return del<{ success: boolean }>(`/client-subscription-prices/${id}`)
    },

    // Получить цены абонентского обслуживания для конкретного клиента
    getClientSubscriptionPricesByClient: (clientId: number) => {
      return get<ClientSubscriptionPrice[]>(`/clients/${clientId}/subscription-prices`)
    },

    // Поиск цен абонентского обслуживания для клиентов
    searchClientSubscriptionPrices: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<ClientSubscriptionPrice>>(`/client-subscription-prices/search${queryString}`)
    }
  }
}
