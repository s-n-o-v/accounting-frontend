import { proxyApiRequest } from '~~/server/utils/proxy'

export default defineEventHandler(async (event) => {
  return proxyApiRequest(event, '/invoice-items', 'POST')
})
