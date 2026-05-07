// app/composables/api/useInvoicesApi.ts
import { useApi } from './useApi'
import type {
  PaginatedResponse,
  QueryParams
} from '~/types/api/common'

// Счет (в соответствии с Laravel моделью Invoice)
export interface Invoice {
  id: number
  client_id: number
  number: string
  type: string
  status: string
  issue_date?: string
  due_date?: string
  total_amount: string | number
  paid_amount: string | number
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface CreateInvoiceDto {
  client_id: number
  number: string
  type: string
  status: string
  issue_date?: string
  due_date?: string
  total_amount: string | number
  paid_amount: string | number
  notes?: string
}

export interface UpdateInvoiceDto extends Partial<CreateInvoiceDto> {}

export const useInvoicesApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список счетов с пагинацией и фильтрацией
    getInvoices: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<Invoice>>(`/invoices${query}`)
    },

    // Получить счет по ID
    getInvoice: (id: number) => {
      return get<Invoice>(`/invoices/${id}`)
    },

    // Создать новый счет
    createInvoice: (data: CreateInvoiceDto) => {
      return post<Invoice>('/invoices', data)
    },

    // Обновить счет
    updateInvoice: (id: number, data: UpdateInvoiceDto) => {
      return put<Invoice>(`/invoices/${id}`, data)
    },

    // Частичное обновление счета
    patchInvoice: (id: number, data: Partial<UpdateInvoiceDto>) => {
      return patch<Invoice>(`/invoices/${id}`, data)
    },

    // Удалить счет
    deleteInvoice: (id: number) => {
      return del<{ success: boolean }>(`/invoices/${id}`)
    },

    // Получить счета для конкретного клиента
    getInvoicesByClient: (clientId: number) => {
      return Promise.reject(new Error('Backend route /clients/{id}/invoices does not exist'))
    },

    // Получить позиции счета
    getInvoiceItems: (invoiceId: number) => {
      return Promise.reject(new Error('Backend route /invoices/{id}/items does not exist'))
    },

    // Получить распределения платежей для счета
    getInvoicePaymentAllocations: (invoiceId: number) => {
      return Promise.reject(new Error('Backend route /invoices/{id}/payment-allocations does not exist'))
    },

    // Поиск счетов
    searchInvoices: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<Invoice>>(`/invoices${queryString}`)
    }
  }
}
