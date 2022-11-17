import Head from 'next/head'
import { Button, Card, Form, Input, Layout } from 'antd'

import styles from '../styles/Home.module.css'
import useEmail from '../hooks/useEmail'

const { Content } = Layout
const { Item: FormItem } = Form
const { TextArea } = Input

export default function Home() {
  const { form, isLoading, onSubmit } = useEmail()

  return (
    <div className={styles.container}>
      <Head>
        <title>Email service</title>
        <meta name="description" content="Email service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Content>
          <Card title="Send email with below information" className={styles.card}>
            <Form
              form={form}
              layout="vertical"
              scrollToFirstError
              autoComplete="off"
              onFinish={onSubmit}
            >
              <FormItem
                name="subject"
                label="Subject"
                rules={[
                  {
                    required: true,
                    message: 'Please input email subject',
                  },
                  {
                    max: 255,
                  },
                ]}
              >
                <Input placeholder="Email subject" />
              </FormItem>
              <FormItem
                name="to"
                label="To"
                rules={[
                  {
                    type: 'email',
                    message: 'Please input a valid email',
                  },
                  {
                    required: true,
                    message: 'Please input email to send',
                  },
                ]}
              >
                <Input placeholder="Email to send" />
              </FormItem>
              <FormItem
                name="html"
                label="HTML content"
                rules={[
                  {
                    required: true,
                    message: 'Please input html content',
                  },
                ]}
              >
                <TextArea rows={8} placeholder="HTML content" />
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Send
                </Button>
              </FormItem>
            </Form>
          </Card>
        </Content>
      </Layout>
    </div>
  )
}
