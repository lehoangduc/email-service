import { useMutation, useQuery } from 'react-query'
import { Form } from 'antd'

import { showError, showSuccess } from '../lib/helpers'
import MailerService from '../services/Mailer'

export default function useEmail() {
  const [form] = Form.useForm()

  const sendMail = async (values: any) => {
    await MailerService.send(values)
  }

  const { isLoading, mutate: onSubmit } = useMutation(sendMail, {
    onSuccess: (data) => {
      showSuccess('Email has been sent successfully')
    },
    onError: (err) => {
      showError('An unexpected error has occurred')
    },
  })

  return {
    form,
    isLoading,
    onSubmit,
  }
}
