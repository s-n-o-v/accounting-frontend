import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  // Set CORS headers for all responses
  event.node.res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000') // Allow frontend origin
  event.node.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  event.node.res.setHeader('Access-Control-Allow-Credentials', 'true')

  // Handle preflight requests
  if (event.node.req.method === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.end()
    return
  }
})
