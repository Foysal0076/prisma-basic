import Hapi from '@hapi/hapi'
import Joi from 'joi'
import { loginHandler } from '../handlers/auth'

const authPlugin: Hapi.Plugin<null> = {
  name: 'app/auth',
  dependencies: ['prisma', 'hapi-auth-jwt2', 'app/email'],
  register: async (server: Hapi.Server) => {
    server.route({
      method: 'POST',
      path: '/login',
      handler: loginHandler,
      options: {
        auth: false,
        validate: {
          failAction: (request, h, err) => {
            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
            throw err
          },
          payload: Joi.object({
            email: Joi.string().email().required(),
          }),
        },
      },
    })
  },
}

export default authPlugin
