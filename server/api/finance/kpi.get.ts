import { proxyApiRequest } from '~~/server/utils/proxy'

export default defineEventHandler(async (event) => {
  return proxyApiRequest(event, '/finance/kpi', 'GET')
})
