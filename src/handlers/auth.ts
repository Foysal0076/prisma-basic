import Boom from '@hapi/boom'
import Hapi from '@hapi/hapi'
import { TokenType } from '@prisma/client'
import { add } from 'date-fns'
import { generateAuthToken, generateEmailToken } from '../utils'

const AUTHENTICATION_TOKEN_EXPIRATION_HOURS = 24 //HOURS

interface LoginInput {
  email: string
}
interface AuthenticateInput {
  email: string
  emailToken: string
}

const EMAIL_TOKEN_EXPIRES_IN = 10 //minutes

export const loginHandler = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { prisma, sendEmailToken } = request.server.app
  const { email } = request.payload as LoginInput
  const emailToken = generateEmailToken(email)

  const tokenExpiration = add(new Date(), { minutes: EMAIL_TOKEN_EXPIRES_IN })

  try {
    const createdToken = await prisma.token.create({
      data: {
        emailToken,
        type: TokenType.EMAIL,
        expiration: tokenExpiration,
        user: {
          connectOrCreate: {
            create: {
              email,
            },
            where: {
              email,
            },
          },
        },
      },
    })
    await sendEmailToken(email, emailToken)
    return h.response({ token: createdToken }).code(200)
  } catch (error: any) {
    console.log('Errrror', error.response.body)
    return Boom.badImplementation()
  }
}

export const authenticateHandler = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { prisma } = request.server.app
  const { email, emailToken } = request.payload as AuthenticateInput

  try {
    const fetchedEmailToken = await prisma.token.findUnique({
      where: {
        emailToken: emailToken,
      },
      include: {
        user: true,
      },
    })
    if (!fetchedEmailToken?.valid) {
      return Boom.unauthorized()
    }
    if (fetchedEmailToken.expiration < new Date()) {
      return Boom.unauthorized('Token expired')
    }

    if (fetchedEmailToken?.user.email === email) {
      const tokenExpiration = add(new Date(), {
        hours: AUTHENTICATION_TOKEN_EXPIRATION_HOURS,
      })
      const createdToken = await prisma.token.create({
        data: {
          type: TokenType.API,
          expiration: tokenExpiration,
          user: {
            connect: {
              email: email,
            },
          },
        },
      })

      //Invalidate the email token after it's been used
      await prisma.token.update({
        where: {
          id: fetchedEmailToken.id,
        },
        data: {
          valid: false,
        },
      })

      const authToken = generateAuthToken(createdToken.id)
      return h.response().code(200).header('Authorization', authToken)
    } else {
      return Boom.unauthorized()
    }
  } catch (error: any) {
    console.log('error:', error)
    return Boom.badImplementation(error.message)
  }
}
