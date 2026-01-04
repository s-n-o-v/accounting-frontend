import { defineNuxtRouteMiddleware, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  // Check if the user is trying to access a protected route
  const protectedRoutes = ['/'] // Add more protected routes as needed

  if (protectedRoutes.includes(to.path)) {
    // Check for access_token cookie - works on both server and client
    const hasAuthToken = checkAuthToken()

    if (!hasAuthToken) {
      // Redirect to login page if not authenticated
      return navigateTo('/login')
    }
  }
})

function checkAuthToken(): boolean {
  // Try server-side cookie check first (for SSR)
  if (import.meta.env.SSR) {
    const cookies = useRequestHeaders(['cookie'])
    const cookieHeader = cookies?.cookie || ''
    return checkForAuthToken(cookieHeader)
  }

  // Client-side cookie check
  if (!import.meta.env.SSR) {
    // Check document.cookie on client side
    return checkForAuthToken(document.cookie)
  }

  return false
}

function checkForAuthToken(cookieString: string): boolean {
  if (!cookieString) return false

  // Simple cookie parsing to check for access_token
  const cookies = cookieString.split(';').map(c => c.trim())
  const authCookie = cookies.find(c => c.startsWith('access_token='))

  return !!authCookie
}
