import { PrismaClient } from '@prisma/client'
import Hapi from '@hapi/hapi'

// Module augmentation to add shared application state
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33809#issuecomment-472103564
declare module '@hapi/hapi' {
  interface ServerApplicationState {
    prisma: PrismaClient
  }
}

//instantiate prisma client
const prismaPlugin: Hapi.Plugin<null> = {
  name: 'prisma',
  register: async (server: Hapi.Server) => {
    const prisma = new PrismaClient({
      errorFormat: 'pretty',
    })
    server.app.prisma = prisma
    // Close DB connection after the server's connection listeners are stopped
    // Related issue: https://github.com/hapijs/hapi/issues/2839

    server.ext({
      type: 'onPostStop',
      method: async (server: Hapi.Server) => {
        await server.app.prisma.$disconnect()
      },
    })
  },
}

export default prismaPlugin
