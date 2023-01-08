import Hapi from '@hapi/hapi'
import Joi from 'joi'
import {
  deleteUserHandler,
  getUserHandler,
  registerUserHandler,
  updateUserHandler,
} from '../handlers/user'
import { createUserValidator, updateUserValidator } from '../validators/users'

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
      }),
      server.route({
        method: 'DELETE',
        path: '/users/{id}',
        handler: deleteUserHandler,
        options: {
          validate: {
            params: Joi.object({
              id: Joi.number().integer(),
            }),
          },
        },
      }),
      server.route({
        method: 'PUT',
        path: '/users/{id}',
        handler: updateUserHandler,
        options: {
          validate: {
            params: Joi.object({
              id: Joi.number().integer(),
            }),
            payload: updateUserValidator,
            failAction: (request, h, err) => {
              throw err
            },
          },
        },
      })
  },
}

export default userPlugin
