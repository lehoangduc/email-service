import { notification } from 'antd'

export const getApiBaseUrl = () => {
  return process.env.API_BASE_URL
}

export const showSuccess = (message: string, title?: string) => {
  notification.open({
    type: 'success',
    message: title || 'Info',
    description: message,
  })
}

export const showError = (message: string, title?: string) => {
  notification.open({
    type: 'error',
    message: title || 'Error',
    description: message,
  })
}
