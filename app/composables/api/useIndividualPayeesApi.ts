// app/composables/api/useIndividualPayeesApi.ts
import { useApi } from './useApi'
import type {
  PaginatedResponse,
  QueryParams
} from '~/types/api/common'

// Физическое лицо получатель (в соответствии с Laravel моделью IndividualPayee)
export interface IndividualPayee {
  id: number
  full_name: string
  account_number: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateIndividualPayeeDto {
  full_name: string
  account_number: string
  is_active?: boolean
}

export interface UpdateIndividualPayeeDto extends Partial<CreateIndividualPayeeDto> {}

export const useIndividualPayeesApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список физических лиц получателей с пагинацией и фильтрацией
    getIndividualPayees: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<IndividualPayee>>(`/individual-payees${query}`)
    },

    // Получить физическое лицо получателя по ID
    getIndividualPayee: (id: number) => {
      return get<IndividualPayee>(`/individual-payees/${id}`)
    },

    // Создать нового физического лица получателя
    createIndividualPayee: (data: CreateIndividualPayeeDto) => {
      return post<IndividualPayee>('/individual-payees', data)
    },

    // Обновить физическое лицо получателя
    updateIndividualPayee: (id: number, data: UpdateIndividualPayeeDto) => {
      return put<IndividualPayee>(`/individual-payees/${id}`, data)
    },

    // Частичное обновление физического лица получателя
    patchIndividualPayee: (id: number, data: Partial<UpdateIndividualPayeeDto>) => {
      return patch<IndividualPayee>(`/individual-payees/${id}`, data)
    },

    // Удалить физическое лицо получателя
    deleteIndividualPayee: (id: number) => {
      return del<{ success: boolean }>(`/individual-payees/${id}`)
    },

    // Получить платежи для физического лица получателя
    getIndividualPayeePayments: (individualPayeeId: number) => {
      return get<any[]>(`/individual-payees/${individualPayeeId}/payments`)
    },

    // Поиск физических лиц получателей
    searchIndividualPayees: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<IndividualPayee>>(`/individual-payees/search${queryString}`)
    }
  }
}
