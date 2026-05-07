// app/composables/api/useApi.ts
import type { ApiError, ApiRequestOptions } from '~/types/api/common'

export const useApi = () => {
  const config = useRuntimeConfig()

  // Всегда идем через Nuxt server API proxy, чтобы dev/prod использовали одинаковые маршруты.
  const baseURL = '/api'

  // Создаём экземпляр $fetch с настройками
  const $api = $fetch.create({
    baseURL,
    credentials: 'include', // Для работы с httpOnly cookies
    mode: 'cors', // Явное указание CORS режима
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    onRequest({ request, options }) {
      // Авторизация обрабатывается через httpOnly cookies
      // Токен хранится в куках, поэтому не нужно добавлять Authorization header
      console.log(`[API Request] ${options.method || 'GET'} ${request}`)
    },
    onRequestError({ error }) {
      console.error('[API Request Error]', error)
    },
    onResponse({ response }) {
      // Успешный ответ
      console.log(`[API Response] ${response.status} ${response.url}`)
    },
    onResponseError: async ({ response }) => {
      const error = response._data as ApiError

      // Обработка специфичных ошибок
      switch (response.status) {
        case 401: // Unauthorized
          // Редирект на логин или обновление токена
          console.warn('[API] 401 Unauthorized')
          // navigateTo('/login')
          break

        case 403: // Forbidden
          console.warn('[API] 403 Forbidden')
          break

        case 422: // Validation error
          console.warn('[API] 422 Validation Error', error.errors)
          break

        case 500: // Server error
          console.error('[API] 500 Server Error', error.message)
          break
      }

      // Показываем уведомление пользователю (если есть toast)
      try {
        const { useToast } = await import('primevue/usetoast')
        const toast = useToast()
        if (toast && error.message) {
          toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: error.message,
            life: 5000
          })
        }
      } catch (toastError) {
        console.warn('Toast service not available:', toastError)
      }

      // Пробрасываем ошибку дальше для обработки в компонентах
      throw error
    }
  })

  // Базовые методы
  const get = async <T>(url: string, options?: ApiRequestOptions): Promise<T> => {
    return $api<T>(url, {
      method: 'GET',
      ...options
    })
  }

  const post = async <T>(url: string, data?: any, options?: ApiRequestOptions): Promise<T> => {
    return $api<T>(url, {
      method: 'POST',
      body: data,
      ...options
    })
  }

  const put = async <T>(url: string, data?: any, options?: ApiRequestOptions): Promise<T> => {
    return $api<T>(url, {
      method: 'PUT',
      body: data,
      ...options
    })
  }

  const patch = async <T>(url: string, data?: any, options?: ApiRequestOptions): Promise<T> => {
    return $api<T>(url, {
      method: 'PATCH',
      body: data,
      ...options
    })
  }

  const del = async <T>(url: string, options?: ApiRequestOptions): Promise<T> => {
    return $api<T>(url, {
      method: 'DELETE',
      ...options
    })
  }

  return {
    // Экземпляр $fetch для кастомных запросов
    $api,
    
    // Упрощённые методы
    get,
    post,
    put,
    patch,
    delete: del,
    
    // Вспомогательные методы
    buildQuery: (params: Record<string, any>): string => {
      const searchParams = new URLSearchParams()
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(`${key}[]`, v))
          } else {
            searchParams.append(key, String(value))
          }
        }
      })
      
      const query = searchParams.toString()
      return query ? `?${query}` : ''
    }
  }
}
