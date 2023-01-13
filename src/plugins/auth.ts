import Hapi from '@hapi/hapi'
import { UserRole } from '@prisma/client'
import Joi, { number } from 'joi'
import { authenticateHandler, loginHandler } from '../handlers/auth'
import { JWT_SECRET, JWT_ALGORITHM } from '../utils'

export const API_AUTH_STRATEGY = 'API'

const authPlugin: Hapi.Plugin<null> = {
  name: 'app/auth',
  dependencies: ['prisma', 'hapi-auth-jwt2', 'app/email'],
  register: async (server: Hapi.Server) => {
    if (!process.env.JWT_SECRET) {
      server.log(
        'warn',
        'The JWT_SECRET env var is not set. This is unsafe! If running in production, set it.'
      )
    }
    server.auth.strategy(API_AUTH_STRATEGY, 'jwt', {
      key: JWT_SECRET,
      verifyOptions: { algorithms: { JWT_ALGORITHM } },
      validate: validateAPIToken,
    })

    server.route([
      {
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
      },
      {
        method: 'POST',
        path: '/authenticate',
        handler: authenticateHandler,
        options: {
          validate: {
            payload: Joi.object({
              email: Joi.string().email().required(),
              emailToken: Joi.string().required(),
            }),
            failAction: (request, h, err) => {
              throw err
            },
          },
        },
      },
    ])
  },
}

export default authPlugin

//Validate token logic

const apiTokenSchema = Joi.object({
  tokenId: Joi.number().integer().required(),
})

interface APITokenPayload {
  tokenId: number
}

const validateAPIToken = async (
  decoded: APITokenPayload,
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): Promise<ApiValidateResponse> => {
  const { prisma } = request.server.app
  const { tokenId } = decoded
  const { error } = apiTokenSchema.validate(decoded)

  if (error) {
    request.log(['error', 'auth'], `API token error:${error.message}`)
    return { isValid: false, errorMessage: `API token error:${error.message}` }
  }

  try {
    //fetch the token fro the database to see if it is valid
    const fetchedToken = await prisma.token.findUnique({
      where: {
        id: tokenId,
      },
      include: {
        user: true,
      },
    })

    // Check if token could be found in database and is valid
    if (!fetchedToken || !fetchedToken?.valid) {
      return { isValid: false, errorMessage: 'Invalid token' }
    }

    // Check token expiration
    if (fetchedToken.expiration < new Date()) {
      return { isValid: false, errorMessage: 'Token expired' }
    }

    //fetch courses where this user is an instructor

    const teacherOf = await prisma.courseEnrollment.findMany({
      where: {
        userId: fetchedToken.id,
        role: UserRole.TEACHER,
      },
    })

    return {
      isValid: true,
      credentials: {
        tokenId,
        userId: fetchedToken.id,
        isAdmin: fetchedToken.user.isAdmin,
        teacherOf: teacherOf.map(({ courseId }) => courseId),
      },
      errorMessage: '',
    }
  } catch (error: any) {
    request.log(['error', 'auth', 'db'], error)
    return { isValid: false, errorMessage: 'DB Error' }
  }
}

export type ApiValidateResponse = {
  isValid: boolean
  credentials?: Credentials
  errorMessage: string
}
export type Credentials = {
  tokenId: number
  userId: number
  isAdmin: boolean
  teacherOf: Number[]
}
