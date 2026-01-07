import { defineNuxtRouteMiddleware, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  // ONLY RUN ON SERVER-SIDE to prevent client-side flash/redirect issues
  // If we're on the client side, the user is already authenticated (got past SSR middleware)
  if (!import.meta.env.SSR) {
    return // Skip client-side execution entirely
  }

  // Use whitelist approach - only these routes are public, everything else requires auth
  const publicRoutes = [
    '/login',
    '/register',      // Future registration page
    '/forgot-password', // Future password recovery
    '/reset-password', // Future password reset
    '/api/auth/login' // API login endpoint
  ]

  // Check if the current route is NOT in the public routes list
  if (!publicRoutes.includes(to.path)) {
    // Check for access_token cookie on server side only
    const hasAuthToken = checkAuthToken()

    if (!hasAuthToken) {
      // Redirect to login page if not authenticated
      return navigateTo('/login')
    }
  }
})

function checkAuthToken(): boolean {
  // Only server-side execution now, so we can simplify
  const cookies = useRequestHeaders(['cookie'])
  const cookieHeader = cookies?.cookie || ''

  if (!cookieHeader) return false

  // Simple cookie parsing to check for access_token
  const cookiesArray = cookieHeader.split(';').map(c => c.trim())
  const authCookie = cookiesArray.find(c => c.startsWith('access_token='))

  return !!authCookie
}
