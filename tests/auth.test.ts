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

  test('set Authorization header failed because of expired email token', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/authenticate',
      payload: {
        email: 'foysalxahmed@gmail.com',
        emailToken: '83186556',
      },
    })

    expect(response.statusCode).toEqual(401)
  })

  test('set Authorization header failed because of invalid email token', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/authenticate',
      payload: {
        email: 'foysalxahmed@gmail.com',
        emailToken: '831860000',
      },
    })
    expect(response.statusCode).toEqual(401)
  })
})
