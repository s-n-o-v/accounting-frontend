// app/composables/api/useClientEmployeesApi.ts
import { useApi } from './useApi'
import type {
  PaginatedResponse,
  QueryParams
} from '~/types/api/common'

// Сотрудник клиента (в соответствии с Laravel моделью ClientEmployee)
export interface ClientEmployee {
  id: number
  client_id: number
  full_name: string
  citizenship: string
  employment_type: string
  position?: string
  hired_at?: string
  fired_at?: string
  created_at?: string
  updated_at?: string
}

export interface CreateClientEmployeeDto {
  client_id: number
  full_name: string
  citizenship: string
  employment_type: string
  position?: string
  hired_at?: string
  fired_at?: string
}

export interface UpdateClientEmployeeDto extends Partial<CreateClientEmployeeDto> {}

export const useClientEmployeesApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список сотрудников клиентов с пагинацией и фильтрацией
    getClientEmployees: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<ClientEmployee>>(`/client-employees${query}`)
    },

    // Получить сотрудника клиента по ID
    getClientEmployee: (id: number) => {
      return get<ClientEmployee>(`/client-employees/${id}`)
    },

    // Создать нового сотрудника клиента
    createClientEmployee: (data: CreateClientEmployeeDto) => {
      return post<ClientEmployee>('/client-employees', data)
    },

    // Обновить сотрудника клиента
    updateClientEmployee: (id: number, data: UpdateClientEmployeeDto) => {
      return put<ClientEmployee>(`/client-employees/${id}`, data)
    },

    // Частичное обновление сотрудника клиента
    patchClientEmployee: (id: number, data: Partial<UpdateClientEmployeeDto>) => {
      return patch<ClientEmployee>(`/client-employees/${id}`, data)
    },

    // Удалить сотрудника клиента
    deleteClientEmployee: (id: number) => {
      return del<{ success: boolean }>(`/client-employees/${id}`)
    },

    // Получить сотрудников для конкретного клиента
    getClientEmployeesByClient: (clientId: number) => {
      return get<ClientEmployee[]>(`/clients/${clientId}/employees`)
    },

    // Поиск сотрудников клиентов
    searchClientEmployees: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<ClientEmployee>>(`/client-employees${queryString}`)
    }
  }
}
