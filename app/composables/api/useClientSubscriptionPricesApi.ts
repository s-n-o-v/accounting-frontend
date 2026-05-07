// app/composables/api/useClientSubscriptionPricesApi.ts
import type {
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
  const unsupported = () => Promise.reject(new Error('Backend routes for client-subscription-prices are not defined in api.php'))

  return {
    // Получить список цен абонентского обслуживания для клиентов с пагинацией и фильтрацией
    getClientSubscriptionPrices: (params?: QueryParams) => {
      return unsupported()
    },

    // Получить цену абонентского обслуживания для клиента по ID
    getClientSubscriptionPrice: (id: number) => {
      return unsupported()
    },

    // Создать новую цену абонентского обслуживания для клиента
    createClientSubscriptionPrice: (data: CreateClientSubscriptionPriceDto) => {
      return unsupported()
    },

    // Обновить цену абонентского обслуживания для клиента
    updateClientSubscriptionPrice: (id: number, data: UpdateClientSubscriptionPriceDto) => {
      return unsupported()
    },

    // Частичное обновление цены абонентского обслуживания для клиента
    patchClientSubscriptionPrice: (id: number, data: Partial<UpdateClientSubscriptionPriceDto>) => {
      return unsupported()
    },

    // Удалить цену абонентского обслуживания для клиента
    deleteClientSubscriptionPrice: (id: number) => {
      return unsupported()
    },

    // Получить цены абонентского обслуживания для конкретного клиента
    getClientSubscriptionPricesByClient: (clientId: number) => {
      return unsupported()
    },

    // Поиск цен абонентского обслуживания для клиентов
    searchClientSubscriptionPrices: (query: string, params?: QueryParams) => {
      return unsupported()
    }
  }
}
