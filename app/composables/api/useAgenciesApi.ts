// app/composables/api/useAgenciesApi.ts
import { useApi } from './useApi'
import type {
  PaginatedResponse,
  QueryParams
} from '~/types/api/common'

// Агентство (в соответствии с Laravel моделью Agency)
export interface Agency {
  id: number
  name: string
  code: string
  type: string
  created_at?: string
  updated_at?: string
}

export interface CreateAgencyDto {
  name: string
  code: string
  type: string
}

export interface UpdateAgencyDto extends Partial<CreateAgencyDto> {}

export const useAgenciesApi = () => {
  const { get, post, put, patch, delete: del, buildQuery } = useApi()

  return {
    // Получить список агентств с пагинацией и фильтрацией
    getAgencies: (params?: QueryParams) => {
      const query = buildQuery(params || {})
      return get<PaginatedResponse<Agency>>(`/references/agencies${query}`)
    },

    // Получить агентство по ID
    getAgency: (id: number) => {
      return get<Agency>(`/references/agencies/${id}`)
    },

    // Создать новое агентство
    createAgency: (data: CreateAgencyDto) => {
      return post<Agency>('/references/agencies', data)
    },

    // Обновить агентство
    updateAgency: (id: number, data: UpdateAgencyDto) => {
      return put<Agency>(`/references/agencies/${id}`, data)
    },

    // Частичное обновление агентства
    patchAgency: (id: number, data: Partial<UpdateAgencyDto>) => {
      return patch<Agency>(`/references/agencies/${id}`, data)
    },

    // Удалить агентство
    deleteAgency: (id: number) => {
      return del<{ success: boolean }>(`/references/agencies/${id}`)
    },

    // Получить клиентов агентства
    getAgencyClients: (agencyId: number) => {
      return Promise.reject(new Error('Backend route /agencies/{id}/clients does not exist'))
    },

    // Поиск агентств
    searchAgencies: (query: string, params?: QueryParams) => {
      const searchParams = { search: query, ...params }
      const queryString = buildQuery(searchParams)
      return get<PaginatedResponse<Agency>>(`/references/agencies${queryString}`)
    }
  }
}
