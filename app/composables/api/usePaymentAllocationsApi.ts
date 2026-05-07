// app/composables/api/usePaymentAllocationsApi.ts
import { useApi } from './useApi'
import type {
  PaginatedResponse,
  QueryParams
} from '~/types/api/common'

// Распределение платежа (в соответствии с Laravel моделью PaymentAllocation)
export interface PaymentAllocation {
  id: number
  payment_id: number
  invoice_id: number
  amount: string | number
  created_at?: string
  updated_at?: string
}

export interface CreatePaymentAllocationDto {
  payment_id: number
  invoice_id: number
  amount: string | number
}

export interface UpdatePaymentAllocationDto extends Partial<CreatePaymentAllocationDto> {}

export const usePaymentAllocationsApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список распределений платежей с пагинацией и фильтрацией
    getPaymentAllocations: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<PaymentAllocation>>(`/payment-allocations${query}`)
    },

    // Получить распределение платежа по ID
    getPaymentAllocation: (id: number) => {
      return get<PaymentAllocation>(`/payment-allocations/${id}`)
    },

    // Создать новое распределение платежа
    createPaymentAllocation: (data: CreatePaymentAllocationDto) => {
      return post<PaymentAllocation>('/payment-allocations', data)
    },

    // Обновить распределение платежа
    updatePaymentAllocation: (id: number, data: UpdatePaymentAllocationDto) => {
      return put<PaymentAllocation>(`/payment-allocations/${id}`, data)
    },

    // Частичное обновление распределения платежа
    patchPaymentAllocation: (id: number, data: Partial<UpdatePaymentAllocationDto>) => {
      return patch<PaymentAllocation>(`/payment-allocations/${id}`, data)
    },

    // Удалить распределение платежа
    deletePaymentAllocation: (id: number) => {
      return del<{ success: boolean }>(`/payment-allocations/${id}`)
    },

    // Получить распределения для конкретного платежа
    getPaymentAllocationsByPayment: (paymentId: number) => {
      return get<PaymentAllocation[]>(`/payments/${paymentId}/allocations`)
    },

    // Получить распределения для конкретного счета
    getPaymentAllocationsByInvoice: (invoiceId: number) => {
      return get<PaymentAllocation[]>(`/invoices/${invoiceId}/payment-allocations`)
    },

    // Поиск распределений платежей
    searchPaymentAllocations: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<PaymentAllocation>>(`/payment-allocations${queryString}`)
    }
  }
}
