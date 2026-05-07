// app/composables/api/useClientServicePricesApi.ts
import type {
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
  const unsupported = () => Promise.reject(new Error('Backend routes for client-service-prices are not defined in api.php'))

  return {
    // Получить список цен услуг для клиентов с пагинацией и фильтрацией
    getClientServicePrices: (params?: QueryParams) => {
      return unsupported()
    },

    // Получить цену услуги для клиента по ID
    getClientServicePrice: (id: number) => {
      return unsupported()
    },

    // Создать новую цену услуги для клиента
    createClientServicePrice: (data: CreateClientServicePriceDto) => {
      return unsupported()
    },

    // Обновить цену услуги для клиента
    updateClientServicePrice: (id: number, data: UpdateClientServicePriceDto) => {
      return unsupported()
    },

    // Частичное обновление цены услуги для клиента
    patchClientServicePrice: (id: number, data: Partial<UpdateClientServicePriceDto>) => {
      return unsupported()
    },

    // Удалить цену услуги для клиента
    deleteClientServicePrice: (id: number) => {
      return unsupported()
    },

    // Получить цены услуг для конкретного клиента
    getClientServicePricesByClient: (clientId: number) => {
      return unsupported()
    },

    // Получить цены услуг для конкретного типа услуги
    getClientServicePricesByServiceType: (serviceTypeId: number) => {
      return unsupported()
    },

    // Поиск цен услуг для клиентов
    searchClientServicePrices: (query: string, params?: QueryParams) => {
      return unsupported()
    }
  }
}
