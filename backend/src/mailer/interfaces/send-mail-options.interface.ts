export interface Address {
  name: string
  address: string
}

export interface SendMailOptions {
  transporterName?: string;
  subject: string
  to: string | Address | Array<string | Address>
  cc?: string | Address | Array<string | Address>
  bcc?: string | Address | Array<string | Address>
  from?: string | Address
  text?: string | Buffer
  html?: string | Buffer
}
