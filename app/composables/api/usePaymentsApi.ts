// app/composables/api/usePaymentsApi.ts
import { useApi } from './useApi'
import type {
  PaginatedResponse,
  QueryParams
} from '~/types/api/common'

// Платеж (в соответствии с Laravel моделью Payment)
export interface Payment {
  id: number
  client_id: number
  amount: string | number
  payment_date?: string
  recipient_type: string
  bank_account_id?: number
  individual_payee_id?: number
  description?: string
  created_at?: string
  updated_at?: string
}

export interface CreatePaymentDto {
  client_id: number
  amount: string | number
  payment_date?: string
  recipient_type: string
  bank_account_id?: number
  individual_payee_id?: number
  description?: string
}

export interface UpdatePaymentDto extends Partial<CreatePaymentDto> {}

export const usePaymentsApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список платежей с пагинацией и фильтрацией
    getPayments: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<Payment>>(`/payments${query}`)
    },

    // Получить платеж по ID
    getPayment: (id: number) => {
      return get<Payment>(`/payments/${id}`)
    },

    // Создать новый платеж
    createPayment: (data: CreatePaymentDto) => {
      return post<Payment>('/payments', data)
    },

    // Обновить платеж
    updatePayment: (id: number, data: UpdatePaymentDto) => {
      return put<Payment>(`/payments/${id}`, data)
    },

    // Частичное обновление платежа
    patchPayment: (id: number, data: Partial<UpdatePaymentDto>) => {
      return patch<Payment>(`/payments/${id}`, data)
    },

    // Удалить платеж
    deletePayment: (id: number) => {
      return del<{ success: boolean }>(`/payments/${id}`)
    },

    // Получить платежи для конкретного клиента
    getPaymentsByClient: (clientId: number) => {
      return get<Payment[]>(`/clients/${clientId}/payments`)
    },

    // Получить платежи для конкретного банковского счета
    getPaymentsByBankAccount: (bankAccountId: number) => {
      return get<Payment[]>(`/bank-accounts/${bankAccountId}/payments`)
    },

    // Получить платежи для конкретного физического лица получателя
    getPaymentsByIndividualPayee: (individualPayeeId: number) => {
      return get<Payment[]>(`/individual-payees/${individualPayeeId}/payments`)
    },

    // Получить распределения платежей
    getPaymentAllocations: (paymentId: number) => {
      return get<any[]>(`/payments/${paymentId}/allocations`)
    },

    // Поиск платежей
    searchPayments: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<Payment>>(`/payments/search${queryString}`)
    }
  }
}
