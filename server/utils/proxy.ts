export async function proxyApiRequest(event: any, targetPath: string, method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' = 'GET') {
  // Get the target URL from runtime config
  const config = useRuntimeConfig()
  const backendUrl = config.public.apiBaseUrl || 'http://localhost:8000/api'

  // Build the target URL
  const targetUrl = new URL(targetPath, backendUrl)

  // Ensure the URL includes the /api prefix
  // If backendUrl ends with /api and targetPath starts with /, we need to combine them properly
  if (!targetUrl.pathname.startsWith('/api')) {
    targetUrl.pathname = '/api' + targetUrl.pathname
  }
  
  // Get query parameters for GET requests
  const query = method === 'GET' ? getQuery(event) : {}

  // Add query parameters to URL
  if (Object.keys(query).length > 0) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => targetUrl.searchParams.append(key, v))
        } else {
          targetUrl.searchParams.append(key, String(value))
        }
      }
    })
  }

  // Get request body for non-GET requests
  const body = method !== 'GET' && method !== 'HEAD' ? await readBody(event) : undefined

    try {
    // Extract token from cookies and add to Authorization header if present
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Forward cookies if present
      ...(event.node.req.headers.cookie ? { 'Cookie': event.node.req.headers.cookie } : {})
    }

    // Check for access_token in cookies and add to Authorization header
    const incomingCookies = event.node.req.headers.cookie
    if (incomingCookies) {
      const cookies = parseCookies(incomingCookies)
      if (cookies.access_token) {
        requestHeaders['Authorization'] = `Bearer ${cookies.access_token}`
      }
    }

    // Forward the request to the backend service
    const response = await $fetch.raw(targetUrl.toString(), {
      method,
      headers: requestHeaders,
      body,
      credentials: 'include'
    })

    // Forward the response data
    const data = response._data

    // Forward Set-Cookie headers from backend to browser
    const setCookieHeader = response.headers.get('set-cookie')
    if (setCookieHeader) {
      if (Array.isArray(setCookieHeader)) {
        setCookieHeader.forEach(cookie => {
          event.node.res.setHeader('Set-Cookie', cookie)
        })
      } else {
        event.node.res.setHeader('Set-Cookie', setCookieHeader)
      }
    }

    return data
  } catch (error: any) {
    handleProxyError(error)
  }
}

function parseCookies(cookieString: string): Record<string, string> {
  const cookies: Record<string, string> = {}
  if (!cookieString) return cookies

  cookieString.split(';').forEach(cookie => {
    const [name, value] = cookie.split('=').map(c => c.trim())
    if (name && value) {
      cookies[name] = value
    }
  })

  return cookies
}

function handleProxyError(error: any) {
  if (error.response) {
    const status = error.response.status
    const data = error.response._data || { message: 'Backend error' }
    throw createError({
      statusCode: status,
      statusMessage: data.message || 'Backend error',
      data
    })
  } else if (error.request) {
    throw createError({
      statusCode: 504,
      statusMessage: 'Backend service unavailable',
      data: { message: 'Backend service unavailable' }
    })
  } else {
    throw createError({
      statusCode: 500,
      statusMessage: 'Proxy error',
      data: { message: error.message || 'Proxy error' }
    })
  }
}
