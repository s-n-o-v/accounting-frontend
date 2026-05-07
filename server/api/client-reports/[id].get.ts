import { proxyApiRequest } from '~~/server/utils/proxy'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  return proxyApiRequest(event, '/client-reports/' + id, 'GET')
})
