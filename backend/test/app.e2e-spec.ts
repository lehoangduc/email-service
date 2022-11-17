import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'

import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/mail (POST)', () => {
    return request(app.getHttpServer())
      .post('/mail')
      .send({
        subject: process.env.TEST_MAIL_SUBJECT,
        to: process.env.TEST_MAIL_TO,
        html: process.env.TEST_MAIL_HTML,
      })
      .expect(204)
      .expect({})
  })
})
