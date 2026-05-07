import { proxyApiRequest } from '../../../utils/proxy'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  return proxyApiRequest(event, `/clients/${id}/employees`, 'GET')
})
