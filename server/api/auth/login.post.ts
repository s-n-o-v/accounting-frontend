import { defineEventHandler, readBody } from 'h3'
import { createError } from 'h3'
import { proxyRequest } from '../../utils/proxy'

export default defineEventHandler(async (event) => {
  // Get request body with email and password
  const body = await readBody(event)

  // Validate required fields
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required',
      data: { message: 'Email and password are required' }
    })
  }

  // Use the proxy utility to forward the login request
  const response = await proxyRequest(event, '/auth/login', 'POST') as any

  // If we have an access_token in the response, set it as a cookie
  if (response?.access_token) {
    const cookieOptions = {
      name: 'access_token',
      value: response.access_token,
      httpOnly: true,
      secure: false, // For development, set to false. In production, use HTTPS and set to true
      sameSite: 'lax',
      path: '/',
      maxAge: response.expires_in || 3600 // Use expires_in from response or default to 1 hour
    }

    // Set the cookie header
    const cookieHeader = `${cookieOptions.name}=${cookieOptions.value}; ` +
                       `Path=${cookieOptions.path}; ` +
                       `HttpOnly; ` +
                       `SameSite=${cookieOptions.sameSite}; ` +
                       `Max-Age=${cookieOptions.maxAge}`

    if (cookieOptions.secure) {
      event.node.res.setHeader('Set-Cookie', cookieHeader + '; Secure')
    } else {
      event.node.res.setHeader('Set-Cookie', cookieHeader)
    }
  }

  return response
})

function handleAuthError(error: any) {
  if (error.response) {
    const status = error.response.status
    const data = error.response._data || { message: 'Authentication failed' }

    // Handle specific auth errors
    if (status === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        data: data
      })
    } else if (status === 422) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Validation error',
        data: data
      })
    } else {
      throw createError({
        statusCode: status,
        statusMessage: data.message || 'Authentication error',
        data
      })
    }
  } else if (error.request) {
    throw createError({
      statusCode: 504,
      statusMessage: 'Authentication service unavailable',
      data: { message: 'Authentication service unavailable' }
    })
  } else {
    throw createError({
      statusCode: 500,
      statusMessage: 'Authentication proxy error',
      data: { message: error.message || 'Authentication proxy error' }
    })
  }
}
