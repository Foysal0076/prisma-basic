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
  let userId: number
  test('create user', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: testUser,
    })

    expect(response.statusCode).toEqual(201)
    userId = JSON.parse(response.payload)?.id
    expect(typeof userId === 'number').toBeTruthy()
  })

  test('get user returns 404 for non existent user', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/users/9999',
    })

    expect(response.statusCode).toEqual(404)
  })

  test('get user returns user', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/users/${userId}`,
    })

    expect(response.statusCode).toEqual(200)
    const user = JSON.parse(response.payload)
    expect(user.id).toEqual(userId)
  })

  test('update user fails with invalid id', async () => {
    const response = await server.inject({
      method: 'PUT',
      url: '/users/df32',
      payload: testUser,
    })

    expect(response.statusCode).toEqual(400)
  })

  test('update user', async () => {
    const response = await server.inject({
      method: 'PUT',
      url: `/users/${userId}`,
      payload: {
        firstName: 'Updated',
        lastName: 'User',
      },
    })

    expect(response.statusCode).toEqual(200)
    const user = JSON.parse(response.payload)
    expect(user.firstName).toEqual('Updated')
    expect(user.lastName).toEqual('User')
  })

  test('delete user fails with invalid user id parameter', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: '/users/df32',
    })

    expect(response.statusCode).toEqual(400)
  })

  test('delete user', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/users/${userId}`,
    })

    expect(response.statusCode).toEqual(204) //Request has been fulfilled, but there is no content to send back
  })
})
