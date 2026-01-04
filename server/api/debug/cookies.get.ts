import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // Get cookies from the request
  const cookies = event.node.req.headers.cookie || ''

  return {
    success: true,
    cookies: cookies,
    message: 'Current cookies from request',
    timestamp: new Date().toISOString()
  }
})
