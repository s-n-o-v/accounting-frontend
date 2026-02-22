import { proxyRequest } from '../../utils/proxy'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  return proxyRequest(event, `/clients/${id}`, 'GET')
})
