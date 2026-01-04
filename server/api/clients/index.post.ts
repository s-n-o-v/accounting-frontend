import { proxyRequest } from '../../utils/proxy'

export default defineEventHandler(async (event) => {
  // Use the proxy utility to forward the request
  return proxyRequest(event, '/clients', 'POST')
})
