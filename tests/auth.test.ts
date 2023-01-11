import { createServer } from '../src/server'
import Hapi from '@hapi/hapi'
import { Prisma } from '@prisma/client'

describe('Auth test suite', () => {
  let server: Hapi.Server
  beforeAll(async () => {
    server = await createServer()
  })

  afterAll(async () => {
    await server.stop()
  })

  // test('send user sendgrid email', async () => {
  //   const response = await server.inject({
  //     method: 'POST',
  //     url: '/login',
  //     payload: {
  //       email: 'foysalxahmed@gmail.com',
  //     },
  //   })

  //   expect(response.statusCode).toEqual(200)

  // })
})
