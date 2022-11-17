import { getApiBaseUrl } from '../lib/helpers'
import http from '../lib/http'

const MailerService = {
  send(data: any) {
    return http.post(`${getApiBaseUrl()}/mail`, data)
  },
}

export default MailerService
