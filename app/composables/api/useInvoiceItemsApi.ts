// app/composables/api/useInvoiceItemsApi.ts
import { useApi } from './useApi'
import type {
  PaginatedResponse,
  QueryParams
} from '~/types/api/common'

// Позиция счета (в соответствии с Laravel моделью InvoiceItem)
export interface InvoiceItem {
  id: number
  invoice_id: number
  service_rendered_id?: number
  description: string
  quantity: number
  unit_price: string | number
  total_price: string | number
  created_at?: string
  updated_at?: string
}

export interface CreateInvoiceItemDto {
  invoice_id: number
  service_rendered_id?: number
  description: string
  quantity: number
  unit_price: string | number
  total_price: string | number
}

export interface UpdateInvoiceItemDto extends Partial<CreateInvoiceItemDto> {}

export const useInvoiceItemsApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список позиций счетов с пагинацией и фильтрацией
    getInvoiceItems: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<InvoiceItem>>(`/invoice-items${query}`)
    },

    // Получить позицию счета по ID
    getInvoiceItem: (id: number) => {
      return get<InvoiceItem>(`/invoice-items/${id}`)
    },

    // Создать новую позицию счета
    createInvoiceItem: (data: CreateInvoiceItemDto) => {
      return post<InvoiceItem>('/invoice-items', data)
    },

    // Обновить позицию счета
    updateInvoiceItem: (id: number, data: UpdateInvoiceItemDto) => {
      return put<InvoiceItem>(`/invoice-items/${id}`, data)
    },

    // Частичное обновление позиции счета
    patchInvoiceItem: (id: number, data: Partial<UpdateInvoiceItemDto>) => {
      return patch<InvoiceItem>(`/invoice-items/${id}`, data)
    },

    // Удалить позицию счета
    deleteInvoiceItem: (id: number) => {
      return del<{ success: boolean }>(`/invoice-items/${id}`)
    },

    // Получить позиции для конкретного счета
    getInvoiceItemsByInvoice: (invoiceId: number) => {
      return get<InvoiceItem[]>(`/invoices/${invoiceId}/items`)
    },

    // Получить позиции для конкретной оказанной услуги
    getInvoiceItemsByServiceRendered: (serviceRenderedId: number) => {
      return get<InvoiceItem[]>(`/service-rendered/${serviceRenderedId}/invoice-items`)
    },

    // Поиск позиций счетов
    searchInvoiceItems: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<InvoiceItem>>(`/invoice-items/search${queryString}`)
    }
  }
}
