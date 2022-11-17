import axios from 'axios'

const HTTP_TIMEOUT = 60000
const defaultHeaders = {
  Accept: 'application/json',
}

const client = {
  post(url: string, data: any, customHeaders?: any): any {
    const headers = { ...defaultHeaders, ...(customHeaders || {}) }
    return axios.post(url, data, { timeout: HTTP_TIMEOUT, headers }).then((res) => res.data)
  },
}

export default client
