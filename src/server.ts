import Hapi from '@hapi/hapi'
import statusPlugin from './plugins/status'

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
})

export const createServer = async (): Promise<Hapi.Server> => {
  await server.register([statusPlugin])
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
