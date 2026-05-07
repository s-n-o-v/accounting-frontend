import { proxyApiRequest } from '../../utils/proxy'

export default defineEventHandler(async (event) => {
  // Use the proxy utility to forward the request
  return proxyApiRequest(event, '/references/agencies', 'POST')
})