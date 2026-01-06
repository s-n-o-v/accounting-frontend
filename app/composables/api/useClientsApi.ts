// app/composables/api/useClientsApi.ts
import { useApi } from './useApi'
import type { 
  PaginatedResponse, 
  QueryParams, 
  StatusInterface
} from '~/types/api/common'

// Тип клиента (пока базовая версия, позже расширим)
export interface Client {
  id: number
  type: 'OOO' | 'IP' | 'AO' | 'NKO'
  name: string
  inn: string
  state?: StatusInterface
  kpp?: string
  status: 'active' | 'suspended' | 'closed'
  employee_count: number
  monthly_fee: number
  created_at: string
  updated_at: string
}

export interface CreateClientDto {
  type: 'OOO' | 'IP' | 'AO' | 'NKO'
  name: string
  inn: string
  kpp?: string
  address_legal: string
  contact_phone: string
  contact_email: string
  employee_count?: number
  monthly_fee?: number
}

export interface UpdateClientDto extends Partial<CreateClientDto> {
  status?: 'active' | 'suspended' | 'closed'
}

export const useClientsApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список клиентов с пагинацией и фильтрацией
    getClients: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<Client>>(`/clients${query}`)
    },

    // Получить клиента по ID
    getClient: (id: number) => {
      return get<Client>(`/clients/${id}`)
    },

    // Создать нового клиента
    createClient: (data: CreateClientDto) => {
      return post<Client>('/clients', data)
    },

    // Обновить клиента
    updateClient: (id: number, data: UpdateClientDto) => {
      return put<Client>(`/clients/${id}`, data)
    },

    // Частичное обновление клиента
    patchClient: (id: number, data: Partial<UpdateClientDto>) => {
      return patch<Client>(`/clients/${id}`, data)
    },

    // Удалить клиента
    deleteClient: (id: number) => {
      return del<{ success: boolean }>(`/clients/${id}`)
    },

    // Получить сотрудников клиента
    getClientEmployees: (clientId: number) => {
      return get<any[]>(`/clients/${clientId}/employees`)
    },

    // Получить отчетность клиента
    getClientReports: (clientId: number) => {
      return get<any[]>(`/clients/${clientId}/reports`)
    },

    // Поиск клиентов
    searchClients: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<Client>>(`/clients/search${queryString}`)
    }
  }
}