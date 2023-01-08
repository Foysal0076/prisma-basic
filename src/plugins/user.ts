import Hapi from '@hapi/hapi'
import Joi from 'joi'
import { getUserHandler, registerUserHandler } from '../handlers/user'
import { createUserValidator } from '../validators/users'

const userPlugin: Hapi.Plugin<null> = {
  name: 'app/user',
  register: async (server: Hapi.Server) => {
    server.route({
      method: 'POST',
      path: '/users',
      handler: registerUserHandler,
      options: {
        validate: {
          payload: createUserValidator,
          failAction: (request, h, err) => {
            throw err
          },
        },
      },
    }),
      server.route({
        method: 'GET',
        path: '/users/{id}',
        handler: getUserHandler,
        options: {
          validate: {
            params: Joi.object({
              id: Joi.number().integer(),
            }),
          },
        },
      })
  },
}

export default userPlugin
