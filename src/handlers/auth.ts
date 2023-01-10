import Boom from '@hapi/boom'
import Hapi from '@hapi/hapi'
import { TokenType } from '@prisma/client'
import { add } from 'date-fns'
import { generateEmailToken } from '../utils'

interface LoginInput {
  email: string
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
  console.log('tokenExpiration', tokenExpiration, email)
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
