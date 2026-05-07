import { proxyApiRequest } from '../../utils/proxy'

export default defineEventHandler(async (event) => {
  return proxyApiRequest(event, '/client-employees', 'POST')
})
