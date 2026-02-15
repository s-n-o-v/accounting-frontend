import { proxyRequest } from '../../utils/proxy'

export default defineEventHandler(async (event) => {
  // Extract the ID from the route parameters
  const id = getRouterParam(event, 'id')
  
  // Use the proxy utility to forward the request
  return proxyRequest(event, `/references/service-types/${id}`, 'DELETE')
})