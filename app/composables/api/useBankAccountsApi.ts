// app/composables/api/useBankAccountsApi.ts
import { useApi } from './useApi'
import type {
  PaginatedResponse,
  QueryParams
} from '~/types/api/common'

// Банковский счет (в соответствии с Laravel моделью BankAccount)
export interface BankAccount {
  id: number
  account_number: string
  bank_name: string
  bik: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateBankAccountDto {
  account_number: string
  bank_name: string
  bik: string
  is_active?: boolean
}

export interface UpdateBankAccountDto extends Partial<CreateBankAccountDto> {}

export const useBankAccountsApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список банковских счетов с пагинацией и фильтрацией
    getBankAccounts: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<BankAccount>>(`/bank-accounts${query}`)
    },

    // Получить банковский счет по ID
    getBankAccount: (id: number) => {
      return get<BankAccount>(`/bank-accounts/${id}`)
    },

    // Создать новый банковский счет
    createBankAccount: (data: CreateBankAccountDto) => {
      return post<BankAccount>('/bank-accounts', data)
    },

    // Обновить банковский счет
    updateBankAccount: (id: number, data: UpdateBankAccountDto) => {
      return put<BankAccount>(`/bank-accounts/${id}`, data)
    },

    // Частичное обновление банковского счета
    patchBankAccount: (id: number, data: Partial<UpdateBankAccountDto>) => {
      return patch<BankAccount>(`/bank-accounts/${id}`, data)
    },

    // Удалить банковский счет
    deleteBankAccount: (id: number) => {
      return del<{ success: boolean }>(`/bank-accounts/${id}`)
    },

    // Получить платежи для банковского счета
    getBankAccountPayments: (bankAccountId: number) => {
      return Promise.reject(new Error('Backend route /bank-accounts/{id}/payments does not exist'))
    },

    // Поиск банковских счетов
    searchBankAccounts: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<BankAccount>>(`/bank-accounts${queryString}`)
    }
  }
}
