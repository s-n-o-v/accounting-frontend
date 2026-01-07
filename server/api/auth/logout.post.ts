import { proxyRequest } from '../../utils/proxy'

export default defineEventHandler(async (event) => {
  try {
    // First, try to call the backend logout endpoint if it exists
    try {
      await proxyRequest(event, '/auth/logout', 'POST')
    } catch (error) {
      // If backend logout fails, that's okay - we'll still clear our cookie
      console.log('Backend logout failed, but continuing with cookie cleanup:', error)
    }

    // Clear the access_token cookie by setting it to expire immediately
    const cookieOptions = {
      name: 'access_token',
      value: '',
      httpOnly: true,
      secure: false, // For development, set to false. In production, use HTTPS and set to true
      sameSite: 'lax',
      path: '/',
      maxAge: 0 // Expire immediately
    }

    // Set the cookie header to clear the cookie
    const cookieHeader = `${cookieOptions.name}=; ` +
                       `Path=${cookieOptions.path}; ` +
                       `HttpOnly; ` +
                       `SameSite=${cookieOptions.sameSite}; ` +
                       `Max-Age=0; ` +
                       `Expires=Thu, 01 Jan 1970 00:00:00 GMT`

    if (cookieOptions.secure) {
      event.node.res.setHeader('Set-Cookie', cookieHeader + '; Secure')
    } else {
      event.node.res.setHeader('Set-Cookie', cookieHeader)
    }

    return {
      success: true,
      message: 'Successfully logged out'
    }

  } catch (error) {
    console.error('Logout error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Logout failed',
      data: { message: 'Failed to logout' }
    })
  }
})
