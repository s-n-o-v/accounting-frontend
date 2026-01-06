// app/types/api/common.ts
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface StatusInterface {
  name: string
  id: number
}

export interface ApiRequestOptions {
  params?: Record<string, any>
  body?: any
  headers?: Record<string, string>
  responseType?: 'json' | 'blob' | 'text'
}

// Типы для пагинации и фильтрации
export interface PaginationParams {
  page?: number
  per_page?: number
}

export interface SortParams {
  sort_by?: string
  sort_dir?: 'asc' | 'desc'
}

export interface FilterParams {
  [key: string]: any
}

export type QueryParams = PaginationParams & SortParams & FilterParams