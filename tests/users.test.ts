import { createServer } from '../src/server'
import Hapi from '@hapi/hapi'
import { Prisma } from '@prisma/client'

describe('Status plugin', () => {
  let server: Hapi.Server

  //setup function
  beforeAll(async () => {
    server = await createServer()
  })

  //teardown function
  afterAll(async () => {
    await server.stop()
  })

  const testUser: Prisma.UserCreateInput = {
    email: `email-${Date.now()}@test.com`,
    firstName: 'test',
    lastName: 'user',
    social: {
      facebook: 'test.facebook.com',
      twitter: 'test.twitter.com',
      instagram: 'test.instagram.com',
    },
  }

  test('create user', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: testUser,
    })

    expect(response.statusCode).toEqual(201)
    const userId = JSON.parse(response.payload)?.id
    expect(typeof userId === 'number').toBeTruthy()
  })
})
