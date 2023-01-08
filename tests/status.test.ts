import { createServer } from '../src/server'

import Hapi from '@hapi/hapi'

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

  test('status endpoint returns 200', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    })

    expect(response.statusCode).toEqual(200)
    const responsePayload = JSON.parse(response.payload)
    expect(responsePayload.up).toEqual(true)
  })
})
