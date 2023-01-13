import Hapi from '@hapi/hapi'
import userPlugin from './plugins/user'
import prismaPlugin from './plugins/prisma'
import statusPlugin from './plugins/status'
import emailPlugin from './plugins/email'
import authPlugin from './plugins/auth'
import hapiAuthJwt2 from 'hapi-auth-jwt2'
import coursesPlugin from './plugins/courses'

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  routes: {
    payload: {
      multipart: {
        output: 'stream',
      },
    },
  },
})

export const createServer = async (): Promise<Hapi.Server> => {
  await server.register([
    statusPlugin,
    prismaPlugin,
    userPlugin,
    emailPlugin,
    hapiAuthJwt2,
    authPlugin,
    coursesPlugin,
  ])
  await server.initialize()
  return server
}

export const startServer = async (): Promise<Hapi.Server> => {
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
  return server
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})
