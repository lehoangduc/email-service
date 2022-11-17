import { IsOptional, IsNotEmpty, IsEmail, IsString, ValidateNested } from 'class-validator'

export class SendMailDto {
  @IsNotEmpty()
  @IsString()
  subject: string

  @IsNotEmpty()
  @IsString()
  to: string

  @IsOptional()
  @IsEmail({}, { each: true })
  cc?: string[]

  @IsOptional()
  @IsEmail({}, { each: true })
  bcc?: string[]

  @IsNotEmpty()
  @IsString()
  html: string
}
